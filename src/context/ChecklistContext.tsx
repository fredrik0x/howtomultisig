
import React, { createContext, useContext, useState, useEffect } from 'react';
import { checklistItems } from '@/lib/checklistData';
import { createReport, getReportById, saveUserChecklist, getUserChecklist, isSupabaseConfigured } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';

export type Priority = 'essential' | 'recommended' | 'critical';

export interface ChecklistItem {
  id: string;
  section: string;
  text: string;
  description?: string;
  priority: Priority;
  minimumProfile?: 'small' | 'medium' | 'large';
  whyImportant?: string;
  howToImplement?: string;
}

export type ThreatProfile = 'small' | 'medium' | 'large' | 'signer';

const profileLabels: Record<ThreatProfile, string> = {
  'small': '< $1M',
  'medium': '$1M+',
  'large': '$10M+',
  'signer': 'Signer',
};

interface ReportDetails {
  multisigName?: string;
  reviewer?: string;
  transactionHash?: string;
}

interface ChecklistContextType {
  completedItems: string[];
  toggleItem: (id: string) => void;
  isCompleted: (id: string) => boolean;
  getProgress: (section: string) => { completed: number; total: number; percentage: number };
  getTotalProgress: () => { completed: number; total: number; percentage: number };
  getCriticalProgress: () => { completed: number; total: number; percentage: number };
  selectedProfile: ThreatProfile;
  setSelectedProfile: (profile: ThreatProfile) => void;
  profileLabels: Record<ThreatProfile, string>;
  getFilteredItems: (section?: string) => ChecklistItem[];
  isReadOnly: boolean;
  setReadOnly: (value: boolean) => void;
  multisigName: string;
  setMultisigName: (value: string) => void;
  reportDetails: ReportDetails | null;
  setReportDetails: (details: ReportDetails) => void;
}

const ChecklistContext = createContext<ChecklistContextType | undefined>(undefined);

export const useChecklist = () => {
  const context = useContext(ChecklistContext);
  if (!context) {
    throw new Error('useChecklist must be used within a ChecklistProvider');
  }
  return context;
};

export const ChecklistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Get initial state from localStorage
  const getLocalStorageItems = () => {
    const saved = localStorage.getItem('multisig-completed-items');
    return saved ? JSON.parse(saved) : [];
  };

  const getLocalStorageProfile = () => {
    const saved = localStorage.getItem('multisig-threat-profile');
    return (saved as ThreatProfile) || 'large';
  };

  const [completedItems, setCompletedItems] = useState<string[]>(getLocalStorageItems);
  const [selectedProfile, setSelectedProfile] = useState<ThreatProfile>(getLocalStorageProfile);
  
  // Store the local state (before user auth) to restore when signing out
  const [localCompletedItems, setLocalCompletedItems] = useState<string[]>(getLocalStorageItems);
  const [localSelectedProfile, setLocalSelectedProfile] = useState<ThreatProfile>(getLocalStorageProfile);
  
  const [isReadOnly, setReadOnly] = useState<boolean>(false);
  const [multisigName, setMultisigName] = useState<string>('');
  const [reportDetails, setReportDetails] = useState<ReportDetails | null>(null);
  const [isLoadingUserData, setIsLoadingUserData] = useState<boolean>(false);

  const { toast } = useToast();
  const { user, isAuthenticated } = useAuth();

  // Keep track of whether we've already loaded data for the current user
  const [hasLoadedUserData, setHasLoadedUserData] = useState(false);
  const [prevAuthState, setPrevAuthState] = useState<boolean>(isAuthenticated);

  
  // Handle auth state changes - save user state and restore local state
  useEffect(() => {
    const handleAuthChange = async () => {
      
      // User just signed in
      if (isAuthenticated && !prevAuthState) {
        // Save current local state to restore on logout
        setLocalCompletedItems([...completedItems]);
        setLocalSelectedProfile(selectedProfile);
      }
      
      // User just signed out
      if (!isAuthenticated && prevAuthState) {
        
        // Restore the local state that was saved when the user signed in
        setCompletedItems([...localCompletedItems]);
        setSelectedProfile(localSelectedProfile);
        
        // Also update localStorage to match
        localStorage.setItem('multisig-completed-items', JSON.stringify(localCompletedItems));
        localStorage.setItem('multisig-threat-profile', localSelectedProfile);
        
        // Reset the loaded flag so we fetch from the database on next login
        setHasLoadedUserData(false);
      }
      
      // Update the previous auth state
      setPrevAuthState(isAuthenticated);
    };
    
    handleAuthChange();
  }, [isAuthenticated]);
  
  // Load user's checklist data from supabase when they authenticate
  useEffect(() => {
    const loadUserChecklist = async () => {
      // Don't load if we're in read-only mode (viewing a shared report)
      // Or if we've already loaded data for this user
      if (isReadOnly || !isAuthenticated || !user || isLoadingUserData || hasLoadedUserData) {
        return;
      }
      
      try {
        setIsLoadingUserData(true);
        const userData = await getUserChecklist(user.id);
        
        if (userData) {
          // Only update if we have data to avoid resetting progress
          if (userData.completedItems && userData.completedItems.length > 0) {
            setCompletedItems(userData.completedItems);
            toast({
              title: "Progress loaded",
              description: "Your checklist progress has been restored from your account.",
            });
          } else {
            // If the user has no saved items, save their current local progress
            await saveUserChecklist(user.id, completedItems, selectedProfile);
            toast({
              title: "Progress saved",
              description: "Your current progress has been saved to your account.",
            });
          }
          
          if (userData.profile) {
            setSelectedProfile(userData.profile as ThreatProfile);
          }
        } else {
          // New user - save their current local progress
          await saveUserChecklist(user.id, completedItems, selectedProfile);
          toast({
            title: "Progress saved",
            description: "Your checklist progress has been saved to your account.",
          });
        }
        
        // Mark that we've loaded data for this user
        setHasLoadedUserData(true);
      } catch (error) {
        console.error('Error managing user checklist:', error);
        toast({
          title: "Error with checklist data",
          description: "There was an error managing your progress data.",
          variant: "destructive"
        });
      } finally {
        setIsLoadingUserData(false);
      }
    };
    
    loadUserChecklist();
    
    // Reset the flag when user changes
    return () => {
      if (user) {
        setHasLoadedUserData(false);
      }
    };
  }, [isAuthenticated, user?.id]);
  
  // Save user's checklist data to supabase when it changes
  useEffect(() => {
    const saveUserProgress = async () => {
      // Don't save if we're in read-only mode or not authenticated
      if (isReadOnly || !isAuthenticated || !user || isLoadingUserData) {
        return;
      }
      
      try {
        await saveUserChecklist(user.id, completedItems, selectedProfile);
      } catch (error) {
        console.error('Error saving user checklist:', error);
        // Don't show an error toast here to avoid spamming the user
        // This runs on every state change
      }
    };
    
    // Add a small delay to avoid saving too frequently
    const debounceTimer = setTimeout(() => {
      saveUserProgress();
    }, 1000);
    
    return () => clearTimeout(debounceTimer);
  }, [completedItems, selectedProfile, isAuthenticated, user, isReadOnly]);
  
  // Check for a report parameter in the URL and load from supabase
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const reportId = params.get('report');
    
    if (reportId) {
      const fetchReport = async () => {
        try {
          const report = await getReportById(reportId);
          
          if (report) {
            // If we have a valid report from supabase
            if (report.name) setMultisigName(report.name);
            // The database field is "completeditems" (lowercase) not "completedItems" (camelCase)
            if (Array.isArray(report.completeditems)) setCompletedItems(report.completeditems);
            if (report.profile) setSelectedProfile((report.profile as ThreatProfile) || 'small');
            
            setReadOnly(true);
            
            // Set report details for display
            setReportDetails({ 
              multisigName: report.name,
              reviewer: report.reviewer,
              transactionHash: report.transaction_hash
            });
          } else {
            // Fallback to localStorage for backward compatibility
            const reportData = localStorage.getItem(`multisig-report-${reportId}`);
            
            if (reportData) {
              try {
                const { name, completedItems: savedItems, profile } = JSON.parse(reportData);
                
                if (name) setMultisigName(name);
                if (Array.isArray(savedItems)) setCompletedItems(savedItems);
                if (profile) setSelectedProfile((profile as ThreatProfile) || 'small');
                
                setReadOnly(true);
                setReportDetails({ multisigName: name });
              } catch (error) {
                console.error('Failed to parse report data:', error);
                toast({
                  title: "Error loading report",
                  description: "The report data could not be loaded properly.",
                  variant: "destructive"
                });
              }
            } else {
              toast({
                title: "Report not found",
                description: "The requested report could not be found.",
                variant: "destructive"
              });
            }
          }
        } catch (error) {
          console.error('Error fetching report:', error);
          toast({
            title: "Error loading report",
            description: "There was an error loading the report from the database.",
            variant: "destructive"
          });
        }
      };
      
      fetchReport();
    }
  }, [toast]);

  useEffect(() => {
    if (!isReadOnly) {
      localStorage.setItem('multisig-completed-items', JSON.stringify(completedItems));
    }
  }, [completedItems, isReadOnly]);

  useEffect(() => {
    if (!isReadOnly) {
      localStorage.setItem('multisig-threat-profile', selectedProfile);
    }
  }, [selectedProfile, isReadOnly]);

  const getFilteredItems = (section?: string) => {
    // Define threshold item IDs for conditional display
    const thresholdItems = ['threshold-2-of-3', 'threshold-3-of-5', 'threshold-4-of-7'];
    
    const profileOrder: ThreatProfile[] = ['small', 'medium', 'large'];
    const selectedProfileIndex = profileOrder.indexOf(selectedProfile);

    // Special handling for signer profile
    if (selectedProfile === 'signer') {
      return checklistItems.filter(item => {
        // If a section is specified, filter by section
        if (section && item.section !== section) {
          return false;
        }
        
        // For signer profile, exclude these sections unless specifically requested
        if (!section && (
          item.section === 'safe-multisig' || 
          item.section === 'monitoring'
        )) {
          return false;
        }
        
        // Include specific signer-relevant items
        const signerRelevantItems = [
          // Signer security items - individual responsibilities
          'discreet-signer',
          'secure-seed-phrase',
          'secure-hardware-wallet', 
          'unique-address',
          'dedicated-address',
          'os-security-updates',
          'secure-communication',
          'security-awareness',
          'high-value-tx-procedure',
          'availability-48',
          'notify-unavailability',
          'separate-os',
          'use-safe-word',
          
          // Transaction verification items - all relevant for signers
          'check-transaction-intent',
          'verify-transaction-origin',
          'decode-verify-calldata',
          'verify-to-address',
          'verify-value',
          'verify-call-type',
          'check-delegatecall-trusted',
          'generate-safe-hashes',
          'verify-safe-tx-hash',
          'no-blind-signing',
          'simulate-transaction',
          'verify-ui-details',
          'verify-nonce',
          'verify-gas-params',
          'verify-hashes-on-hardware',
          'use-eip712-hardware-wallet',
          
          // Emergency items - only individual signer responsibilities
          'notify-key-compromise',
          'availability-24-emergency'
        ];
        
        return signerRelevantItems.includes(item.id);
      });
    }

    // Standard profile filtering for non-signer profiles
    return checklistItems.filter(item => {
      // If a section is specified, filter by section
      if (section && item.section !== section) {
        return false;
      }

      // Special handling for threshold items - only show the one matching the current profile
      if (thresholdItems.includes(item.id)) {
        if (item.id === 'threshold-2-of-3' && selectedProfile === 'small') return true;
        if (item.id === 'threshold-3-of-5' && selectedProfile === 'medium') return true;
        if (item.id === 'threshold-4-of-7' && selectedProfile === 'large') return true;
        return false;
      }
      
      // Special handling for separate-os - only show when small is selected, not when medium or large is selected
      if (item.id === 'separate-os' && (selectedProfile === 'medium' || selectedProfile === 'large')) {
        return false;
      }

      // For all other items, apply standard profile filtering
      
      // If the item doesn't have a minimum profile, include it for all profiles
      if (!item.minimumProfile) {
        return true;
      }
      
      // Get the index of the item's minimum profile
      const itemProfileIndex = profileOrder.indexOf(item.minimumProfile as ThreatProfile);
      
      // Include the item if its minimum profile is less than or equal to the selected profile
      return itemProfileIndex <= selectedProfileIndex;
    });
  };

  const toggleItem = (id: string) => {
    if (isReadOnly) return;
    
    setCompletedItems((prev) => {
      if (prev.includes(id)) {
        return prev.filter((item) => item !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  const isCompleted = (id: string) => completedItems.includes(id);

  const getProgress = (section: string) => {
    const sectionItems = getFilteredItems(section);
    const completed = sectionItems.filter((item) => isCompleted(item.id)).length;
    const total = sectionItems.length;
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
    
    return { completed, total, percentage };
  };

  const getTotalProgress = () => {
    const filteredItems = getFilteredItems();
    const completed = filteredItems.filter((item) => isCompleted(item.id)).length;
    const total = filteredItems.length;
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
    
    return { completed, total, percentage };
  };
  
  const getCriticalProgress = () => {
    const criticalItems = getFilteredItems().filter(item => item.priority === 'critical');
    const completed = criticalItems.filter((item) => isCompleted(item.id)).length;
    const total = criticalItems.length;
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
    
    return { completed, total, percentage };
  };

  return (
    <ChecklistContext.Provider
      value={{
        completedItems,
        toggleItem,
        isCompleted,
        getProgress,
        getTotalProgress,
        getCriticalProgress,
        selectedProfile,
        setSelectedProfile,
        profileLabels,
        getFilteredItems,
        isReadOnly,
        setReadOnly,
        multisigName,
        setMultisigName,
        reportDetails,
        setReportDetails,
      }}
    >
      {children}
    </ChecklistContext.Provider>
  );
};

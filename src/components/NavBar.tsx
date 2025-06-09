import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Github, AlertTriangle, Printer, Link, EyeOff, Loader2, LogIn, LogOut, Mail, Info } from 'lucide-react';
import { currentVersion } from '@/lib/checklistData';
import { Button } from '@/components/ui/button';
import { sections } from '@/lib/checklistData';
import { useChecklist } from '@/context/ChecklistContext';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/components/ThemeProvider';
import { Sun, Moon, Monitor } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';
import { ThemeToggle } from '@/components/ThemeToggle';
import Progress from '@/components/Progress';
import UserAuth from '@/components/UserAuth';
import { createReport, signInWithOAuth, signOut, OAuthProvider } from '@/lib/supabase';

const NavBar: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [multisigName, setMultisigName] = useState('');
  const [printMultisigName, setPrintMultisigName] = useState('');
  const [printReviewer, setPrintReviewer] = useState('');
  const [printTransactionHash, setPrintTransactionHash] = useState('');
  const [printDialogOpen, setPrintDialogOpen] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [shareReviewer, setShareReviewer] = useState('');
  const [shareTransactionHash, setShareTransactionHash] = useState('');
  const { getCriticalProgress, isReadOnly, setReadOnly, setReportDetails, multisigName: reportMultisigName, getTotalProgress, selectedProfile } = useChecklist();
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();
  const { theme, setTheme } = useTheme();
  const criticalProgress = getCriticalProgress();
  const totalProgress = getTotalProgress();
  
  // Check if supabase credentials are configured
  const isSupabaseConfigured = useMemo(() => {
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
    return !!(supabaseUrl && supabaseAnonKey && supabaseUrl !== '' && supabaseAnonKey !== '');
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [scrolled]);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setMobileMenuOpen(false);
  };

  const handlePrintDialogSubmit = () => {
    setReportDetails({
      multisigName: printMultisigName,
      reviewer: printReviewer,
      transactionHash: printTransactionHash
    });
    
    setPrintDialogOpen(false);
    
    setTimeout(() => {
      window.print();
      
      setPrintMultisigName('');
      setPrintReviewer('');
      setPrintTransactionHash('');
    }, 500);
  };

  const shareReport = async () => {
    if (!multisigName.trim()) {
      toast({
        title: "Name required",
        description: "Please enter a name for this multisig report",
        variant: "destructive",
      });
      return;
    }
    
    setIsSharing(true);
    
    try {
      // Save report details for display on the shared report
      setReportDetails({
        multisigName,
        reviewer: shareReviewer,
        transactionHash: shareTransactionHash
      });
      
      // Get data from localStorage
      const completedItemsData = localStorage.getItem('multisig-completed-items');
      const profileData = localStorage.getItem('multisig-threat-profile');
      
      // Create a report in supabase (including version information)
      const reportId = await createReport({
        name: multisigName,
        completedItems: completedItemsData ? JSON.parse(completedItemsData) : [],
        profile: profileData || 'small',
        reviewer: shareReviewer,
        transactionHash: shareTransactionHash,
        version: currentVersion.version
      });
      
      // Generate the shareable URL
      const url = `${window.location.origin}?report=${reportId}`;
      
      // Copy to clipboard
      await navigator.clipboard.writeText(url);
      
      // Show success toast
      toast({
        title: "Link generated and copied",
        description: "Share this link to provide access to this report",
      });
      
      // Reset the form
      setMultisigName('');
      setShareReviewer('');
      setShareTransactionHash('');
      setShareDialogOpen(false);
    } catch (error) {
      console.error('Error generating link:', error);
      toast({
        title: "Error generating link",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
    } finally {
      setIsSharing(false);
    }
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? 'bg-multisig-bg/80 dark:bg-multisig-bg/10 backdrop-blur-sm shadow-lg dark:shadow-gray-900/30' : 'bg-transparent'
        } print:hidden`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center h-16 relative">
            {/* Main centered navigation */}
            <nav className="hidden md:flex items-center justify-center space-x-2 lg:space-x-4 absolute left-1/2 transform -translate-x-1/2">
              {/* 1. Print Report */}
              {isReadOnly ? (
                <Button
                  variant="nav"
                  size="sm"
                  className="text-slate-900 dark:text-white whitespace-nowrap"
                  onClick={() => window.print()}
                >
                  <Printer className="h-4 w-4 mr-1 flex-shrink-0" />
                  <span className="hidden lg:inline">Print Report</span>
                  <span className="lg:hidden">Print</span>
                </Button>
              ) : (
                <Dialog open={printDialogOpen} onOpenChange={setPrintDialogOpen}>
                  <DialogTrigger asChild>
                    <Button
                      variant="nav"
                      size="sm"
                      className="text-slate-900 dark:text-white whitespace-nowrap"
                    >
                      <Printer className="h-4 w-4 mr-1 flex-shrink-0" />
                      <span className="hidden lg:inline">Print Report</span>
                      <span className="lg:hidden">Print</span>
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle>Print Report Details</DialogTitle>
                      <DialogDescription>
                        Add information that will appear in the printed report header.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="py-4 space-y-4">
                      <div>
                        <label className="text-sm font-medium mb-2 block">Multisig Name</label>
                        <Input 
                          placeholder="e.g., Treasury multisig" 
                          value={printMultisigName}
                          onChange={(e) => setPrintMultisigName(e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-2 block">Person Reviewing</label>
                        <Input 
                          placeholder="e.g., John Smith" 
                          value={printReviewer}
                          onChange={(e) => setPrintReviewer(e.target.value)}
                        />
                      </div>
                      {selectedProfile === 'signer' && (
                        <div>
                          <label className="text-sm font-medium mb-2 block">Transaction Hash (optional)</label>
                          <Input 
                            placeholder="e.g., 0x1234..." 
                            value={printTransactionHash}
                            onChange={(e) => setPrintTransactionHash(e.target.value)}
                          />
                        </div>
                      )}
                    </div>
                    <DialogFooter>
                      <Button onClick={handlePrintDialogSubmit}>Print</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              )}
              
              {/* 2. Share Report */}
              {!isReadOnly && isSupabaseConfigured && (
                <Dialog open={shareDialogOpen} onOpenChange={setShareDialogOpen}>
                  <DialogTrigger asChild>
                    <Button
                      variant="nav"
                      size="sm"
                      className="text-slate-900 dark:text-white whitespace-nowrap"
                    >
                      <Link className="h-4 w-4 mr-1 flex-shrink-0" />
                      <span className="hidden lg:inline">Share Report</span>
                      <span className="lg:hidden">Share</span>
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    {!isAuthenticated ? (
                      <>
                        <DialogHeader className="text-center">
                          <DialogTitle className="text-center">Authentication Required</DialogTitle>
                          <DialogDescription className="text-center">
                            Please sign in to share your report.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="py-4 flex justify-center gap-2">
                          <Button onClick={() => signInWithOAuth('google')}>
                            <Mail className="h-4 w-4 mr-2" />
                            Google
                          </Button>
                          <Button onClick={() => signInWithOAuth('github')}>
                            <Github className="h-4 w-4 mr-2" />
                            GitHub
                          </Button>
                        </div>
                      </>
                    ) : (
                      <>
                        <DialogHeader>
                          <DialogTitle>Generate Public Link</DialogTitle>
                          <DialogDescription>
                            Create a shareable link to this multisig report that anyone can access.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="py-4 space-y-4">
                          <div>
                            <label className="text-sm font-medium mb-2 block">Multisig Name</label>
                            <Input 
                              placeholder="e.g., Treasury multisig" 
                              value={multisigName}
                              onChange={(e) => setMultisigName(e.target.value)}
                              disabled={isSharing}
                            />
                          </div>
                          <div>
                            <label className="text-sm font-medium mb-2 block">Person Reviewing</label>
                            <Input 
                              placeholder="e.g., John Smith" 
                              value={shareReviewer}
                              onChange={(e) => setShareReviewer(e.target.value)}
                              disabled={isSharing}
                            />
                          </div>
                          {selectedProfile === 'signer' && (
                            <div>
                              <label className="text-sm font-medium mb-2 block">Transaction Hash (optional)</label>
                              <Input 
                                placeholder="e.g., 0x1234..." 
                                value={shareTransactionHash}
                                onChange={(e) => setShareTransactionHash(e.target.value)}
                                disabled={isSharing}
                              />
                            </div>
                          )}
                        </div>
                        <DialogFooter>
                          <Button 
                            onClick={shareReport}
                            disabled={isSharing}
                          >
                            {isSharing ? (
                              <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Generating...
                              </>
                            ) : (
                              'Generate Link'
                            )}
                          </Button>
                        </DialogFooter>
                      </>
                    )}
                  </DialogContent>
                </Dialog>
              )}
              
              {/* 3. Progress bar */}
              {!isReadOnly && (
                <div className="w-56">
                  <Progress 
                    showPercentage={true} 
                    showFraction={true} 
                    isScrolled={scrolled}
                    isMobile={false}
                  />
                </div>
              )}
              
              {/* 4. Sign in (UserAuth) */}
              {!isReadOnly && isSupabaseConfigured && (
                <UserAuth />
              )}
              
              {/* 5. Theme selector */}
              <ThemeToggle />
              
              {/* 6. Contribute */}
              <Button
                variant="nav"
                size="sm"
                asChild
                className="text-slate-900 dark:text-white"
              >
                <a 
                  href="https://github.com/fredrik0x/howtomultisig/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center"
                >
                  <Github className="mr-2 h-4 w-4" />
                  Contribute
                </a>
              </Button>
              
              {/* Read-only mode exit button */}
              {isReadOnly && (
                <Button
                  variant="nav"
                  size="sm"
                  onClick={() => setReadOnly(false)}
                  className="text-slate-900 dark:text-white whitespace-nowrap"
                >
                  <EyeOff className="h-4 w-4 mr-1 flex-shrink-0" />
                  <span className="hidden lg:inline">Exit Read-only Mode</span>
                  <span className="lg:hidden">Exit</span>
                </Button>
              )}
            </nav>
            
            {/* Mobile menu button */}
            <div className="md:hidden absolute right-0">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="transition-colors text-slate-900 dark:text-white hover:text-multisig-purple"
              >
                {mobileMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="fixed top-16 left-0 right-0 z-40 bg-multisig-card/95 backdrop-blur-md border-b border-multisig-purple/10 shadow-lg md:hidden print:hidden"
          >
            <div className="px-4 py-4 space-y-2">
              {!isReadOnly && (
                <div className="mb-4">
                  <Progress 
                    showPercentage={true} 
                    showFraction={true}
                    isScrolled={false}
                    isMobile={true}
                  />
                </div>
              )}
              
              {!isReadOnly && sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => scrollToSection(section.id)}
                  className="block w-full text-left px-3 py-2 rounded-md text-multisig-text hover:bg-multisig-purple/10 transition-colors"
                >
                  {section.title}
                </button>
              ))}
              
              {/* Mobile Print Button */}
              {isReadOnly ? (
                <button
                  onClick={() => window.print()}
                  className="block w-full text-left px-3 py-2 rounded-md text-multisig-text hover:bg-multisig-purple/10 transition-colors"
                >
                  <div className="flex items-center">
                    <Printer className="h-4 w-4 mr-2" />
                    Print Report
                  </div>
                </button>
              ) : (
                <Dialog open={printDialogOpen} onOpenChange={setPrintDialogOpen}>
                  <DialogTrigger asChild>
                    <button
                      className="block w-full text-left px-3 py-2 rounded-md text-multisig-text hover:bg-multisig-purple/10 transition-colors"
                    >
                      <div className="flex items-center">
                        <Printer className="h-4 w-4 mr-2" />
                        Print Report
                      </div>
                    </button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle>Print Report Details</DialogTitle>
                      <DialogDescription>
                        Add information that will appear in the printed report header.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="py-4 space-y-4">
                      <div>
                        <label className="text-sm font-medium mb-2 block">Multisig Name</label>
                        <Input 
                          placeholder="e.g., Treasury multisig" 
                          value={printMultisigName}
                          onChange={(e) => setPrintMultisigName(e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-2 block">Person Reviewing</label>
                        <Input 
                          placeholder="e.g., John Smith" 
                          value={printReviewer}
                          onChange={(e) => setPrintReviewer(e.target.value)}
                        />
                      </div>
                      {selectedProfile === 'signer' && (
                        <div>
                          <label className="text-sm font-medium mb-2 block">Transaction Hash (optional)</label>
                          <Input 
                            placeholder="e.g., 0x1234..." 
                            value={printTransactionHash}
                            onChange={(e) => setPrintTransactionHash(e.target.value)}
                          />
                        </div>
                      )}
                    </div>
                    <DialogFooter>
                      <Button onClick={handlePrintDialogSubmit}>Print</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              )}
              
              {/* Mobile Share Button */}
              {!isReadOnly && isSupabaseConfigured && (
                <Dialog open={shareDialogOpen} onOpenChange={setShareDialogOpen}>
                  <DialogTrigger asChild>
                    <button
                      className="block w-full text-left px-3 py-2 rounded-md text-multisig-text hover:bg-multisig-purple/10 transition-colors"
                    >
                      <div className="flex items-center">
                        <Link className="h-4 w-4 mr-2" />
                        Share Report
                      </div>
                    </button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    {!isAuthenticated ? (
                      <>
                        <DialogHeader className="text-center">
                          <DialogTitle className="text-center">Authentication Required</DialogTitle>
                          <DialogDescription className="text-center">
                            Please sign in to share your report.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="py-4 flex justify-center gap-2">
                          <Button onClick={() => signInWithOAuth('google')}>
                            <Mail className="h-4 w-4 mr-2" />
                            Google
                          </Button>
                          <Button onClick={() => signInWithOAuth('github')}>
                            <Github className="h-4 w-4 mr-2" />
                            GitHub
                          </Button>
                        </div>
                      </>
                    ) : (
                      <>
                        <DialogHeader>
                          <DialogTitle>Generate Public Link</DialogTitle>
                          <DialogDescription>
                            Create a shareable read-only link to this multisig report that anyone with the link can access.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="py-4 space-y-4">
                          <div>
                            <label className="text-sm font-medium mb-2 block">Multisig Name</label>
                            <Input 
                              placeholder="e.g., Treasury multisig" 
                              value={multisigName}
                              onChange={(e) => setMultisigName(e.target.value)}
                              disabled={isSharing}
                            />
                          </div>
                          <div>
                            <label className="text-sm font-medium mb-2 block">Person Reviewing</label>
                            <Input 
                              placeholder="e.g., John Smith" 
                              value={shareReviewer}
                              onChange={(e) => setShareReviewer(e.target.value)}
                              disabled={isSharing}
                            />
                          </div>
                          {selectedProfile === 'signer' && (
                            <div>
                              <label className="text-sm font-medium mb-2 block">Transaction Hash (optional)</label>
                              <Input 
                                placeholder="e.g., 0x1234..." 
                                value={shareTransactionHash}
                                onChange={(e) => setShareTransactionHash(e.target.value)}
                                disabled={isSharing}
                              />
                            </div>
                          )}
                        </div>
                        <DialogFooter>
                          <Button 
                            onClick={shareReport}
                            disabled={isSharing}
                          >
                            {isSharing ? (
                              <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Generating...
                              </>
                            ) : (
                              'Generate Link'
                            )}
                          </Button>
                        </DialogFooter>
                      </>
                    )}
                  </DialogContent>
                </Dialog>
              )}
              
              {/* Exit Read-only Mode Button */}
              {isReadOnly && (
                <button
                  onClick={() => setReadOnly(false)}
                  className="block w-full text-left px-3 py-2 rounded-md text-multisig-text hover:bg-multisig-purple/10 transition-colors"
                >
                  <div className="flex items-center">
                    <EyeOff className="h-4 w-4 mr-2 text-amber-500" />
                    Exit Read-only Mode
                  </div>
                </button>
              )}
              
              {/* Theme selector */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    className="block w-full text-left px-3 py-2 rounded-md text-multisig-text hover:bg-multisig-purple/10 transition-colors"
                  >
                    <div className="flex items-center">
                      {theme === "light" && <Sun className="h-4 w-4 mr-2 text-amber-500" />}
                      {theme === "dark" && <Moon className="h-4 w-4 mr-2 text-primary" />}
                      {theme === "system" && <Monitor className="h-4 w-4 mr-2" />}
                      <span>Theme</span>
                    </div>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="bg-card border-accent/30">
                  <DropdownMenuItem onClick={() => setTheme("light")} className="cursor-pointer hover:bg-accent/10">
                    <Sun className="mr-2 h-4 w-4 text-amber-500" />
                    <span>Light</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setTheme("dark")} className="cursor-pointer hover:bg-accent/10">
                    <Moon className="mr-2 h-4 w-4 text-primary" />
                    <span>Dark</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setTheme("system")} className="cursor-pointer hover:bg-accent/10">
                    <Monitor className="mr-2 h-4 w-4" />
                    <span>System</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              
              {/* Sign in button */}
              {isSupabaseConfigured && !isAuthenticated && (
                <Dialog>
                  <DialogTrigger asChild>
                    <button
                      className="block w-full text-left px-3 py-2 rounded-md text-multisig-text hover:bg-multisig-purple/10 transition-colors"
                    >
                      <div className="flex items-center">
                        <LogIn className="h-4 w-4 mr-2" />
                        <span>Sign in</span>
                      </div>
                    </button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader className="text-center">
                      <DialogTitle className="text-center">Sign In</DialogTitle>
                      <DialogDescription className="text-center">
                        Choose a provider to sign in with.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="py-4 flex justify-center gap-2">
                      <Button onClick={() => signInWithOAuth('google')}>
                        <Mail className="h-4 w-4 mr-2" />
                        Google
                      </Button>
                      <Button onClick={() => signInWithOAuth('github')}>
                        <Github className="h-4 w-4 mr-2" />
                        GitHub
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              )}
              
              {/* Sign out button */}
              {isSupabaseConfigured && isAuthenticated && (
                <button
                  onClick={() => signOut()}
                  className="block w-full text-left px-3 py-2 rounded-md text-multisig-text hover:bg-multisig-purple/10 transition-colors"
                >
                  <div className="flex items-center">
                    <LogOut className="h-4 w-4 mr-2" />
                    <span>Sign out</span>
                  </div>
                </button>
              )}
              
              {/* Contribute button */}
              <a
                href="https://github.com/fredrik0x/howtomultisig/"
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full text-left px-3 py-2 rounded-md text-multisig-text hover:bg-multisig-purple/10 transition-colors"
              >
                <div className="flex items-center">
                  <Github className="h-4 w-4 mr-2" />
                  Contribute
                </div>
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default NavBar;

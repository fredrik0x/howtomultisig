
import React from 'react';
import { BookOpen, ExternalLink, AlertTriangle, User, Wallet, Link, Tag } from 'lucide-react';
import { ChecklistProvider } from '@/context/ChecklistContext';
import { sections, resources, currentVersion } from '@/lib/checklistData';
import Hero from '@/components/Hero';
import NavBar from '@/components/NavBar';
import Progress from '@/components/Progress';
import ChecklistSection from '@/components/ChecklistSection';
import ThreatProfileSelector from '@/components/ThreatProfileSelector';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useChecklist } from '@/context/ChecklistContext';

// Create a separate component for the main content to use context
const MainContent = () => {
  const { isReadOnly, multisigName, getCriticalProgress, reportDetails, getProgress, selectedProfile } = useChecklist();
  const criticalProgress = getCriticalProgress();
  
  return (
    <div className="min-h-screen bg-background text-foreground">
      <NavBar />
      {!isReadOnly && <Hero />}
      
      {isReadOnly && (
        <div className="pt-20 pb-6 bg-background/90 print:hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="glass-card p-6 mb-4">
              <h1 className="text-2xl font-bold mb-3">Multisig Security Audit Report</h1>
              <div className="flex flex-col gap-4">
                <div className="flex flex-col space-y-2">
                  {multisigName && (
                    <div className="flex items-center">
                      <Wallet className="w-5 h-5 mr-2 text-primary" />
                      <div>
                        <span className="font-semibold">Multisig: </span>
                        <span>{multisigName}</span>
                      </div>
                    </div>
                  )}
                  
                  {reportDetails?.reviewer && (
                    <div className="flex items-center">
                      <User className="w-5 h-5 mr-2 text-primary" />
                      <div>
                        <span className="font-semibold">Person reviewing: </span>
                        <span>{reportDetails.reviewer}</span>
                      </div>
                    </div>
                  )}
                  
                  {selectedProfile === 'signer' && reportDetails?.transactionHash && (
                    <div className="flex items-center">
                      <Link className="w-5 h-5 mr-2 text-primary" />
                      <div>
                        <span className="font-semibold">Transaction hash: </span>
                        <span>{reportDetails.transactionHash}</span>
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="flex items-center gap-2 px-3 py-2 bg-card shadow-sm rounded-md border border-accent/30">
                  <AlertTriangle className={`h-5 w-5 ${criticalProgress.completed < criticalProgress.total ? 'text-destructive' : 'text-green-500'}`} />
                  <span className="text-foreground">
                    <span className="font-semibold">Critical security items: </span>
                    {criticalProgress.completed}/{criticalProgress.total} completed
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Print Report Header - Only visible when printed */}
      {reportDetails && (reportDetails.multisigName || reportDetails.reviewer || reportDetails.transactionHash) && (
        <div className="hidden print:block print:mb-8">
          <h1 className="text-3xl font-bold mb-6 text-center">Multisig Security Audit Report</h1>
          
          <div className="flex flex-col space-y-4 mb-8 border-b border-gray-300 pb-6">
            {reportDetails.multisigName && (
              <div className="flex items-center">
                <Wallet className="w-5 h-5 mr-2" />
                <div>
                  <span className="font-semibold">Multisig: </span>
                  <span>{reportDetails.multisigName}</span>
                </div>
              </div>
            )}
            
            {reportDetails.reviewer && (
              <div className="flex items-center">
                <User className="w-5 h-5 mr-2" />
                <div>
                  <span className="font-semibold">Person reviewing: </span>
                  <span>{reportDetails.reviewer}</span>
                </div>
              </div>
            )}
            
            {selectedProfile === 'signer' && reportDetails.transactionHash && (
              <div className="flex items-center">
                <Link className="w-5 h-5 mr-2" />
                <div>
                  <span className="font-semibold">Transaction hash: </span>
                  <span>{reportDetails.transactionHash}</span>
                </div>
              </div>
            )}
            
            <div className="flex items-center">
              <AlertTriangle className={`w-5 h-5 mr-2 ${criticalProgress.completed < criticalProgress.total ? 'text-red-500' : 'text-green-500'}`} />
              <div>
                <span className="font-semibold">Critical security items: </span>
                <span>{criticalProgress.completed}/{criticalProgress.total} completed</span>
              </div>
            </div>

            <div className="flex items-center">
              <Tag className="w-5 h-5 mr-2" />
              <div>
                <span className="font-semibold">Checklist version: </span>
                <span>{currentVersion.version}</span>
              </div>
            </div>
          </div>
        </div>
      )}
      
      <main className="section-container pt-10 print:pt-0">
        {!isReadOnly && <ThreatProfileSelector />}
        
        <div className="mb-16 print:mb-8">
          <div className="flex items-center justify-between mb-8 print:mb-4">
            <h2 className="text-2xl font-bold">Security Checklist Progress</h2>
          </div>
          
          <div className="glass-card p-6">
            <Progress showFraction showPercentage showCritical className="mb-8" />
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 print:hidden">
              {sections.map((section) => {
                // Get progress for this section
                const progress = getProgress(section.id);
                
                // Skip rendering sections with no items
                if (progress.total === 0) {
                  return null;
                }
                
                return (
                  <div key={section.id} className="glass-card p-4 border border-accent/20">
                    <h3 className="font-medium mb-2 flex items-center gap-2 text-foreground">
                      {section.title}
                    </h3>
                    <Progress section={section.id} />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        
        {sections.map((section) => (
          <ChecklistSection
            key={section.id}
            id={section.id}
            title={section.title}
            description={section.description}
            icon={section.icon}
          />
        ))}
        
        <div className="mb-16 print:hidden">
          <div className="glass-card p-6">
            <div className="flex items-center gap-3 mb-4">
              <BookOpen className="w-6 h-6 text-multisig-purple" />
              <h2 className="text-2xl font-semibold">Additional Resources</h2>
            </div>
            
            <div className="space-y-4">
              {resources.map((resource, index) => (
                <a
                  key={index}
                  href={resource.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="glass-card p-4 flex items-center justify-between hover:border-primary/30 transition-all duration-300 group"
                >
                  <span className="font-medium">{resource.title}</span>
                  <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </main>
      
      <footer className="border-t border-primary/10 py-8 print:mt-8 print:pt-8 print:border-t print:border-gray-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <div className="flex items-center text-sm text-muted-foreground">
                <Tag className="w-4 h-4 mr-2" />
                <span>Version {currentVersion.version}</span>
                <span className="mx-2 text-muted-foreground/50">|</span>
                <span>{currentVersion.releaseDate}</span>
              </div>
            </div>
            <div className="text-sm text-muted-foreground">
              <a href="https://github.com/fredrik0x/howtomultisig" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
                Contribute to the Multisig Security Checklist
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

const Index: React.FC = () => {
  return (
    <ChecklistProvider>
      <MainContent />
    </ChecklistProvider>
  );
};

export default Index;

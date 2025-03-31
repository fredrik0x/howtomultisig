
import React from 'react';
import { Shield, Users, CheckSquare, Bell, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';
import { useChecklist } from '@/context/ChecklistContext';

const SecureCardGrid: React.FC = () => {
  const { getProgress, selectedProfile } = useChecklist();
  
  // Define features with their corresponding section IDs
  const features = [
    {
      icon: <Shield className="h-6 w-6 text-primary dark:text-nord-8" />,
      title: 'Contract Security',
      description: 'Verify multisig contracts to ensure they are legitimate with no shadow signers.',
      sectionId: 'safe-multisig'
    },
    {
      icon: <Users className="h-6 w-6 text-primary dark:text-nord-8" />,
      title: 'Signer Best Practices',
      description: 'Comprehensive guidelines for secure hardware, communication, and key management.',
      sectionId: 'signers'
    },
    {
      icon: <CheckSquare className="h-6 w-6 text-primary dark:text-nord-8" />,
      title: 'Verification Process',
      description: 'Step-by-step verification to ensure transactions are properly validated before signing.',
      sectionId: 'verification'
    },
    {
      icon: <Bell className="h-6 w-6 text-primary dark:text-nord-8" />,
      title: 'Robust Monitoring',
      description: 'Set up alerts for configuration changes, proposals, and transaction executions.',
      sectionId: 'monitoring'
    },
    {
      icon: <AlertTriangle className="h-6 w-6 text-primary dark:text-nord-8" />,
      title: 'Emergency Procedures',
      description: 'Planning and procedures for handling compromised keys or other urgent situations.',
      sectionId: 'emergency'
    }
  ];
  
  // Filter features to only show those with items for the current profile
  const visibleFeatures = features.filter(feature => {
    const progress = getProgress(feature.sectionId);
    return progress.total > 0; // Only show sections with at least one item
  });

  // Dynamically adjust grid columns based on the number of visible features
  const getGridClasses = () => {
    const count = visibleFeatures.length;
    switch (count) {
      case 1: return "grid grid-cols-1 gap-6 max-w-md mx-auto";
      case 2: return "grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto";
      case 3: return "grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto";
      default: return "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6";
    }
  };

  return (
    <div className={getGridClasses()}>
      {visibleFeatures.map((feature, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          className="glass-card p-6 hover:border-primary/30 transition-all duration-300 dark:bg-nord-1 dark:border-nord-3"
        >
          <div className="p-2 rounded-lg bg-primary/10 dark:bg-nord-2/80 w-fit mb-4">
            {feature.icon}
          </div>
          <h3 className="text-lg font-semibold mb-2 dark:text-white">{feature.title}</h3>
          <p className="text-muted-foreground dark:text-nord-4">{feature.description}</p>
        </motion.div>
      ))}
    </div>
  );
};

export default SecureCardGrid;

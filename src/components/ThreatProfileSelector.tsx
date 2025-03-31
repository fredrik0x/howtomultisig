
import React from 'react';
import { Tent, Home, Building, User } from 'lucide-react';
import { useChecklist, ThreatProfile } from '@/context/ChecklistContext';
import { motion } from 'framer-motion';

interface ProfileButtonProps {
  value: ThreatProfile;
  label: string;
  description: string;
  icon: React.ReactNode;
  isSelected: boolean;
  onSelect: (value: ThreatProfile) => void;
}

const ProfileButton: React.FC<ProfileButtonProps> = ({
  value, 
  label, 
  description, 
  icon, 
  isSelected, 
  onSelect
}) => {
  const getProfileColor = (profile: ThreatProfile, isSelected: boolean) => {
    const baseClass = "flex flex-col items-center justify-center gap-2 p-4 rounded-lg transition-all duration-200";
    
    if (isSelected) {
      switch(profile) {
        case 'small': return `${baseClass} bg-green-500/30 border-2 border-green-500 text-white dark:text-white`;
        case 'medium': return `${baseClass} bg-blue-500/30 border-2 border-blue-500 text-white dark:text-white`;
        case 'large': return `${baseClass} bg-red-500/30 border-2 border-red-500 text-white dark:text-white`;
        case 'signer': return `${baseClass} bg-purple-500/30 border-2 border-purple-500 text-white dark:text-white`;
        default: return `${baseClass} bg-green-500/30 border-2 border-green-500 text-white dark:text-white`;
      }
    } else {
      return `${baseClass} bg-card dark:bg-nord-1 border border-border hover:bg-primary/10 dark:text-white`;
    }
  };

  return (
    <button
      onClick={() => onSelect(value)}
      className={getProfileColor(value, isSelected)}
    >
      <div className="text-foreground dark:text-white mb-1">{icon}</div>
      <div className="font-medium text-sm text-foreground dark:text-white">{label}</div>
      <div className="text-xs text-muted-foreground dark:text-nord-4">{description}</div>
    </button>
  );
};

const ThreatProfileSelector: React.FC = () => {
  const { selectedProfile, setSelectedProfile } = useChecklist();

  const profiles = [
    { 
      value: 'signer', 
      label: 'Signer', 
      icon: <User className="w-5 h-5" />,
      description: 'Essential security for signers'
    },
    { 
      value: 'small', 
      label: '< $1M', 
      icon: <Tent className="w-5 h-5" />,
      description: 'Essential security for treasuries'
    },
    { 
      value: 'medium', 
      label: '$1M+', 
      icon: <Home className="w-5 h-5" />,
      description: 'Increased security for treasuries'
    },
    { 
      value: 'large', 
      label: '$10M+',
      icon: <Building className="w-5 h-5" />,
      description: 'Highest security for treasuries'
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="glass-card p-6 mb-8 dark:bg-nord-1 dark:border-nord-3"
    >
      <h2 className="text-xl font-bold mb-3 dark:text-white">Select Threat Profile</h2>
      <p className="text-muted-foreground dark:text-nord-4 mb-6">
        Choose your security focus based on your specific needs and threat model
      </p>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {profiles.map((profile) => (
          <ProfileButton
            key={profile.value}
            value={profile.value as ThreatProfile}
            label={profile.label}
            description={profile.description}
            icon={profile.icon}
            isSelected={selectedProfile === profile.value}
            onSelect={setSelectedProfile}
          />
        ))}
      </div>
    </motion.div>
  );
};

export default ThreatProfileSelector;

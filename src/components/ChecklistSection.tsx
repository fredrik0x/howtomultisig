
import React from 'react';
import { Shield, UsersRound, CheckSquare, Bell } from 'lucide-react';
import ChecklistItem from '@/components/ChecklistItem';
import Progress from '@/components/Progress';
import { useChecklist } from '@/context/ChecklistContext';

interface ChecklistSectionProps {
  id: string;
  title: string;
  description: string;
  icon: string;
}

const ChecklistSection: React.FC<ChecklistSectionProps> = ({
  id,
  title,
  description,
  icon,
}) => {
  const { getProgress, getFilteredItems } = useChecklist();
  const sectionItems = getFilteredItems(id);
  const progress = getProgress(id);
  
  const renderIcon = () => {
    switch (icon) {
      case 'Shield':
        return <Shield className="w-6 h-6 text-primary dark:text-nord-8" />;
      case 'UsersRound':
        return <UsersRound className="w-6 h-6 text-primary dark:text-nord-8" />;
      case 'CheckSquare':
        return <CheckSquare className="w-6 h-6 text-primary dark:text-nord-8" />;
      case 'Bell':
        return <Bell className="w-6 h-6 text-primary dark:text-nord-8" />;
      default:
        return <Shield className="w-6 h-6 text-primary dark:text-nord-8" />;
    }
  };

  // Don't render the section if there are no items for the selected profile
  if (sectionItems.length === 0) {
    return null;
  }

  return (
    <section id={id} className="mb-16 animate-fade-up">
      <div className="mb-6 flex items-center gap-3">
        <div className="p-2 rounded-lg bg-primary/10 dark:bg-nord-2/80 backdrop-blur-sm">
          {renderIcon()}
        </div>
        <div>
          <h2 className="text-2xl font-semibold text-foreground dark:text-white">{title}</h2>
          <p className="text-muted-foreground dark:text-nord-4">{description}</p>
        </div>
      </div>
      
      <Progress section={id} className="mb-6" />
      
      <div className="space-y-4">
        {sectionItems.map((item) => (
          <ChecklistItem
            key={item.id}
            id={item.id}
            text={item.text}
            description={item.description}
            priority={item.priority}
            whyImportant={item.whyImportant}
            howToImplement={item.howToImplement}
          />
        ))}
      </div>
    </section>
  );
};

export default ChecklistSection;

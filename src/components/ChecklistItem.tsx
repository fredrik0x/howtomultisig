
import React, { useState } from 'react';
import { CheckSquare, Square, Info } from 'lucide-react';
import { useChecklist, Priority } from '@/context/ChecklistContext';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import ChecklistItemModal from './ChecklistItemModal';

interface ChecklistItemProps {
  id: string;
  text: string;
  description?: string;
  priority: Priority;
  whyImportant?: string;
  howToImplement?: string;
}

const ChecklistItem: React.FC<ChecklistItemProps> = ({
  id,
  text,
  description,
  priority,
  whyImportant,
  howToImplement,
}) => {
  const { toggleItem, isCompleted } = useChecklist();
  const completed = isCompleted(id);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const getPriorityTag = (priority: Priority) => {
    switch (priority) {
      case 'critical':
        return <span className="tag-critical">Critical</span>;
      case 'essential':
        return <span className="tag-essential">Essential</span>;
      case 'recommended':
        return <span className="tag-recommended">Recommended</span>;
    }
  };

  // Create a short version of the description for the checklist view
  const shortDescription = description && description.length > 100 
    ? `${description.slice(0, 100).trim()}...` 
    : description;

  // Determine if we should show the info button based on additional content availability
  const hasAdditionalInfo = whyImportant || howToImplement || (description && description.length > 100);

  return (
    <>
      <div 
        className={`glass-card p-4 transition-all duration-300 ${
          completed ? 'border-l-4 border-l-multisig-purple' : ''
        }`}
      >
        <div className="flex items-start gap-3">
          <button
            onClick={() => toggleItem(id)}
            className={`flex-shrink-0 mt-0.5 transition-all duration-200 ${
              completed ? 'text-multisig-purple' : 'text-multisig-text-muted hover:text-multisig-purple'
            }`}
            aria-label={completed ? "Mark as incomplete" : "Mark as complete"}
          >
            {completed ? (
              <CheckSquare className="w-5 h-5 animate-scale-in" />
            ) : (
              <Square className="w-5 h-5" />
            )}
          </button>
          
          <div className="flex-1">
            <div className="flex items-center justify-between mb-1">
              <span className={`font-medium ${completed ? 'text-multisig-text-muted line-through' : ''}`}>
                {text}
              </span>
              <div className="flex items-center gap-2">
                {getPriorityTag(priority)}
              </div>
            </div>
            
            {shortDescription && (
              <p className={`text-sm text-slate-900 dark:text-nord-4 ${completed ? 'line-through' : ''}`}>
                {shortDescription}
              </p>
            )}
          </div>
          
          {hasAdditionalInfo && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button 
                    className="flex-shrink-0 mt-0.5 text-slate-900 dark:text-nord-4 hover:text-multisig-purple transition-colors"
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsModalOpen(true);
                    }}
                  >
                    <Info className="w-4 h-4" />
                  </button>
                </TooltipTrigger>
                <TooltipContent className="max-w-sm bg-multisig-card text-multisig-text border-multisig-purple/20">
                  <p>Click for more information</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
      </div>

      <ChecklistItemModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={text}
        description={description}
        priority={priority}
        whyImportant={whyImportant}
        howToImplement={howToImplement}
      />
    </>
  );
};

export default ChecklistItem;

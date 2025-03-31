
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { CheckSquare, AlertTriangle, ArrowRight, X } from 'lucide-react';
import { Priority } from '@/context/ChecklistContext';
import { Button } from '@/components/ui/button';

interface ChecklistItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  priority: Priority;
  whyImportant?: string;
  howToImplement?: string;
}

const ChecklistItemModal: React.FC<ChecklistItemModalProps> = ({
  isOpen,
  onClose,
  title,
  description,
  priority,
  whyImportant,
  howToImplement,
}) => {
  const getPriorityColor = (priority: Priority) => {
    switch (priority) {
      case 'critical':
        return 'text-red-500';
      case 'essential':
        return 'text-blue-500';
      case 'recommended':
        return 'text-green-500';
      default:
        return 'text-primary';
    }
  };

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

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl bg-background border-primary/10 max-h-[85vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <div className="flex items-center justify-between pr-12 mb-2">
            <DialogTitle className="text-xl">{title}</DialogTitle>
            {getPriorityTag(priority)}
          </div>
          {description && (
            <DialogDescription className="text-base text-foreground/80">
              {description}
            </DialogDescription>
          )}
        </DialogHeader>

        <div className="space-y-6 overflow-y-auto pr-2">
          {whyImportant && (
            <div className="space-y-2">
              <h3 className="flex items-center gap-2 font-semibold text-lg">
                <AlertTriangle className={`h-5 w-5 ${getPriorityColor(priority)}`} />
                Why it's important
              </h3>
              <div className="pl-7 text-foreground/80">{whyImportant}</div>
            </div>
          )}

          {howToImplement && (
            <div className="space-y-2">
              <h3 className="flex items-center gap-2 font-semibold text-lg">
                <CheckSquare className={`h-5 w-5 ${getPriorityColor(priority)}`} />
                How to implement
              </h3>
              <div className="pl-7 space-y-2">
                {howToImplement.split('\n').map((item, index) => {
                  if (item.trim() === '') return null;
                  
                  if (item.startsWith('- ')) {
                    return (
                      <div key={index} className="flex gap-2 text-foreground/80">
                        <ArrowRight className="h-4 w-4 flex-shrink-0 mt-1" />
                        <div>{item.substring(2)}</div>
                      </div>
                    );
                  }
                  
                  return (
                    <div key={index} className="text-foreground/80">
                      {item}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ChecklistItemModal;

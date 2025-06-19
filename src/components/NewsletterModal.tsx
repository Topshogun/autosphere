import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { X, Sparkles } from 'lucide-react';
import { SubscriptionForm } from './SubscriptionForm';

interface NewsletterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function NewsletterModal({ isOpen, onClose }: NewsletterModalProps) {
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setShowModal(true);
    }
  }, [isOpen]);

  const handleClose = () => {
    setShowModal(false);
    onClose();
  };

  return (
    <Dialog open={showModal} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-teal-500 rounded-lg flex items-center justify-center">
                <Sparkles className="h-4 w-4 text-white" />
              </div>
              <DialogTitle className="text-xl font-bold">
                Stay Ahead of Tomorrow
              </DialogTitle>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleClose}
              className="h-6 w-6 rounded-full"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <DialogDescription className="text-left">
            Get the latest insights in AI, Design, and Construction delivered to your inbox. 
            Join thousands of forward-thinking professionals who trust AutoSphere.
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4">
          <SubscriptionForm 
            source="modal" 
            showPreferences={true}
          />
        </div>

        <div className="mt-4 text-center">
          <p className="text-xs text-muted-foreground">
            No spam, ever. Unsubscribe with one click.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
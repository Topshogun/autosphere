import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Sparkles } from 'lucide-react';
import { SubscriptionForm } from './SubscriptionForm';

interface NewsletterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function NewsletterModal({ isOpen, onClose }: NewsletterModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-teal-500 rounded-lg flex items-center justify-center">
              <Sparkles className="h-4 w-4 text-white" />
            </div>
            <DialogTitle className="text-xl font-bold">
              Stay Ahead of Tomorrow
            </DialogTitle>
          </div>
          <DialogDescription className="text-left">
            Get the latest insights in AI, Finance, Marketing, Branding, Operations, Sales, and E-commerce delivered to your inbox. 
            Join thousands of forward-thinking professionals who trust The Apex Index.
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
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { X, Twitter, Facebook, Linkedin, Link, Check } from 'lucide-react';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  url: string;
  description?: string;
}

export function ShareModal({ isOpen, onClose, title, url, description }: ShareModalProps) {
  const [copied, setCopied] = useState(false);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy link:', err);
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = url;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const shareToTwitter = () => {
    const text = `${title} ${url}`;
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
    window.open(twitterUrl, '_blank', 'width=600,height=400');
  };

  const shareToFacebook = () => {
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(title)}`;
    window.open(facebookUrl, '_blank', 'width=600,height=400');
  };

  const shareToLinkedIn = () => {
    const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}&summary=${encodeURIComponent(description || '')}`;
    window.open(linkedInUrl, '_blank', 'width=600,height=400');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-bold">
              Share Article
            </DialogTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="h-6 w-6 rounded-full"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <DialogDescription className="text-left">
            Share this article with your network
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4 space-y-4">
          {/* Social Media Buttons */}
          <div className="grid grid-cols-2 gap-3">
            <Button
              variant="outline"
              onClick={shareToTwitter}
              className="flex items-center space-x-2 h-12 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-600 dark:hover:bg-blue-900/20 dark:hover:border-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              <Twitter className="h-5 w-5" />
              <span>Twitter</span>
            </Button>

            <Button
              variant="outline"
              onClick={shareToFacebook}
              className="flex items-center space-x-2 h-12 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-600 dark:hover:bg-blue-900/20 dark:hover:border-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              <Facebook className="h-5 w-5" />
              <span>Facebook</span>
            </Button>

            <Button
              variant="outline"
              onClick={shareToLinkedIn}
              className="flex items-center space-x-2 h-12 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-600 dark:hover:bg-blue-900/20 dark:hover:border-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              <Linkedin className="h-5 w-5" />
              <span>LinkedIn</span>
            </Button>

            <Button
              variant="outline"
              onClick={handleCopyLink}
              className={`flex items-center space-x-2 h-12 transition-all duration-200 ${
                copied 
                  ? 'bg-green-50 border-green-300 text-green-600 dark:bg-green-900/20 dark:border-green-600 dark:text-green-400' 
                  : 'hover:bg-gray-50 hover:border-gray-300 dark:hover:bg-gray-900/20 dark:hover:border-gray-600'
              }`}
            >
              {copied ? (
                <>
                  <Check className="h-5 w-5" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Link className="h-5 w-5" />
                  <span>Copy Link</span>
                </>
              )}
            </Button>
          </div>

          {/* URL Display */}
          <div className="mt-6 p-3 bg-muted/50 rounded-lg border">
            <p className="text-sm text-muted-foreground mb-1">Article URL:</p>
            <p className="text-sm font-mono break-all text-foreground">{url}</p>
          </div>
        </div>

        <div className="mt-6 text-center">
          <p className="text-xs text-muted-foreground">
            Help others discover great content by sharing this article
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { X, Mail, Sparkles } from 'lucide-react';
import { NewsletterModal } from './NewsletterModal';

export function NewsletterBanner() {
  const [isVisible, setIsVisible] = useState(false);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    // Show banner after 30 seconds if user hasn't dismissed it
    const timer = setTimeout(() => {
      const dismissed = localStorage.getItem('newsletter-banner-dismissed');
      if (!dismissed) {
        setIsVisible(true);
      }
    }, 30000);

    return () => clearTimeout(timer);
  }, []);

  const handleDismiss = () => {
    setIsVisible(false);
    localStorage.setItem('newsletter-banner-dismissed', 'true');
  };

  const handleSubscribe = () => {
    setShowModal(true);
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <>
      <div className="fixed bottom-4 left-4 right-4 z-50 md:left-auto md:right-4 md:max-w-sm">
        <div className="bg-gradient-to-r from-blue-500 to-teal-500 text-white rounded-lg shadow-lg p-4 relative">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleDismiss}
            className="absolute top-2 right-2 h-6 w-6 text-white hover:bg-white/20"
          >
            <X className="h-4 w-4" />
          </Button>
          
          <div className="flex items-start space-x-3 pr-8">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                <Sparkles className="h-4 w-4" />
              </div>
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-sm mb-1">
                Don't Miss Tomorrow's Tech
              </h4>
              <p className="text-xs opacity-90 mb-3">
                Join 12.5K+ readers getting daily insights in AI, Design & Construction
              </p>
              <Button
                onClick={handleSubscribe}
                size="sm"
                variant="secondary"
                className="w-full bg-white text-blue-600 hover:bg-gray-100"
              >
                <Mail className="h-3 w-3 mr-2" />
                Subscribe Free
              </Button>
            </div>
          </div>
        </div>
      </div>

      <NewsletterModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
      />
    </>
  );
}
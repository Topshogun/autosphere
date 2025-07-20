import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { X, Mail, Sparkles } from 'lucide-react';

export function NewsletterBanner() {
  const [isVisible, setIsVisible] = useState(false);

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
    window.open('mailto:subscribe@theapexindex.com?subject=Newsletter Subscription', '_blank');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <>
      <div className="fixed bottom-4 left-4 right-4 z-50 md:left-auto md:right-4 md:max-w-sm">
        <div className="bg-gradient-to-r from-blue-500 to-teal-500 text-white rounded-lg shadow-lg p-4 relative">
          <button
            onClick={handleDismiss}
            className="absolute top-2 right-2 w-6 h-6 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 flex items-center justify-center transition-all duration-200 hover:scale-110 group"
            aria-label="Close banner"
          >
            <X className="h-3 w-3 text-white/80 group-hover:text-white transition-colors" />
          </button>
          
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

    </>
  );
}
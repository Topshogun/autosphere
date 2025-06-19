import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Mail, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { useSubscription } from '../hooks/useSubscription';

interface SubscriptionFormProps {
  source?: string;
  showPreferences?: boolean;
  className?: string;
}

export function SubscriptionForm({ 
  source = 'website', 
  showPreferences = false,
  className = '' 
}: SubscriptionFormProps) {
  const [email, setEmail] = useState('');
  const [preferences, setPreferences] = useState({
    ai: true,
    design: true,
    construction: true,
    weekly_digest: true,
    breaking_news: true,
  });
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const { subscribe, loading, error, success, clearMessages } = useSubscription();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim()) {
      return;
    }

    if (!agreedToTerms) {
      return;
    }

    const subscriptionData = {
      email: email.trim(),
      source,
      preferences: showPreferences ? preferences : undefined,
    };

    const result = await subscribe(subscriptionData);
    
    if (result?.success) {
      setEmail('');
      setAgreedToTerms(false);
    }
  };

  const handlePreferenceChange = (key: string, checked: boolean) => {
    setPreferences(prev => ({
      ...prev,
      [key]: checked,
    }));
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email" className="text-sm font-medium">
            Email Address
          </Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="email"
              type="email"
              placeholder="Enter your email address"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (error || success) clearMessages();
              }}
              className="pl-10"
              required
              disabled={loading}
            />
          </div>
        </div>

        {showPreferences && (
          <div className="space-y-3">
            <Label className="text-sm font-medium">Subscription Preferences</Label>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="ai"
                  checked={preferences.ai}
                  onChange={(e) => handlePreferenceChange('ai', e.target.checked)}
                />
                <Label htmlFor="ai" className="text-sm">AI & Technology News</Label>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="design"
                  checked={preferences.design}
                  onChange={(e) => handlePreferenceChange('design', e.target.checked)}
                />
                <Label htmlFor="design" className="text-sm">Design & Innovation</Label>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="construction"
                  checked={preferences.construction}
                  onChange={(e) => handlePreferenceChange('construction', e.target.checked)}
                />
                <Label htmlFor="construction" className="text-sm">Construction & Engineering</Label>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="weekly_digest"
                  checked={preferences.weekly_digest}
                  onChange={(e) => handlePreferenceChange('weekly_digest', e.target.checked)}
                />
                <Label htmlFor="weekly_digest" className="text-sm">Weekly Digest</Label>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="breaking_news"
                  checked={preferences.breaking_news}
                  onChange={(e) => handlePreferenceChange('breaking_news', e.target.checked)}
                />
                <Label htmlFor="breaking_news" className="text-sm">Breaking News Alerts</Label>
              </div>
            </div>
          </div>
        )}

        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="terms"
            checked={agreedToTerms}
            onChange={(e) => setAgreedToTerms(e.target.checked)}
            required
          />
          <Label htmlFor="terms" className="text-xs text-muted-foreground">
            I agree to receive newsletters and can unsubscribe at any time
          </Label>
        </div>

        <Button
          type="submit"
          disabled={loading || !email.trim() || !agreedToTerms}
          className="w-full bg-gradient-to-r from-blue-500 to-teal-500 hover:from-blue-600 hover:to-teal-600"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Subscribing...
            </>
          ) : (
            <>
              <Mail className="h-4 w-4 mr-2" />
              Subscribe to Newsletter
            </>
          )}
        </Button>
      </form>

      {/* Success/Error Messages */}
      {success && (
        <Alert className="border-green-200 bg-green-50 dark:bg-green-900/20">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800 dark:text-green-200">
            {success}
          </AlertDescription>
        </Alert>
      )}

      {error && (
        <Alert className="border-red-200 bg-red-50 dark:bg-red-900/20">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800 dark:text-red-200">
            {error}
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
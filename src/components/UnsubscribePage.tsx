import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Header } from './Header';
import { Footer } from './Footer';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, AlertCircle, Home, Mail } from 'lucide-react';
import { useSubscription } from '../hooks/useSubscription';

interface UnsubscribePageProps {
  darkMode: boolean;
  toggleDarkMode: () => void;
}

export function UnsubscribePage({ darkMode, toggleDarkMode }: UnsubscribePageProps) {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const [hasAttemptedUnsubscribe, setHasAttemptedUnsubscribe] = useState(false);
  
  const { unsubscribe, loading, error, success } = useSubscription();

  useEffect(() => {
    if (token && !hasAttemptedUnsubscribe) {
      setHasAttemptedUnsubscribe(true);
      unsubscribe(token);
    }
  }, [token, hasAttemptedUnsubscribe, unsubscribe]);

  const handleManualUnsubscribe = () => {
    if (token) {
      unsubscribe(token);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
      
      <main className="pt-16">
        <div className="w-full px-4 sm:px-6 lg:px-8 py-24">
          <div className="max-w-[600px] mx-auto text-center">
            <div className="mb-8">
              <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-r from-blue-500 to-teal-500 rounded-full flex items-center justify-center">
                <Mail className="h-8 w-8 text-white" />
              </div>
              
              <h1 className="text-3xl md:text-4xl font-bold mb-4">
                Newsletter Unsubscribe
              </h1>
              
              {!token ? (
                <div className="space-y-4">
                  <p className="text-lg text-muted-foreground">
                    Invalid unsubscribe link. Please check your email for the correct link.
                  </p>
                  <Alert className="border-yellow-200 bg-yellow-50 dark:bg-yellow-900/20">
                    <AlertCircle className="h-4 w-4 text-yellow-600" />
                    <AlertDescription className="text-yellow-800 dark:text-yellow-200">
                      If you continue to receive emails, please contact our support team.
                    </AlertDescription>
                  </Alert>
                </div>
              ) : loading ? (
                <div className="space-y-4">
                  <p className="text-lg text-muted-foreground">
                    Processing your unsubscribe request...
                  </p>
                  <div className="animate-pulse">
                    <div className="h-4 bg-muted rounded w-3/4 mx-auto"></div>
                  </div>
                </div>
              ) : success ? (
                <div className="space-y-6">
                  <Alert className="border-green-200 bg-green-50 dark:bg-green-900/20">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <AlertDescription className="text-green-800 dark:text-green-200">
                      {success}
                    </AlertDescription>
                  </Alert>
                  
                  <div className="space-y-4">
                    <p className="text-muted-foreground">
                      You've been successfully removed from our mailing list. 
                      You will no longer receive newsletters from AutoSphere.
                    </p>
                    
                    <div className="bg-muted/50 rounded-lg p-4">
                      <h3 className="font-semibold mb-2">We're sorry to see you go!</h3>
                      <p className="text-sm text-muted-foreground">
                        If you change your mind, you can always resubscribe by visiting our website 
                        and signing up again.
                      </p>
                    </div>
                  </div>
                </div>
              ) : error ? (
                <div className="space-y-6">
                  <Alert className="border-red-200 bg-red-50 dark:bg-red-900/20">
                    <AlertCircle className="h-4 w-4 text-red-600" />
                    <AlertDescription className="text-red-800 dark:text-red-200">
                      {error}
                    </AlertDescription>
                  </Alert>
                  
                  <div className="space-y-4">
                    <p className="text-muted-foreground">
                      There was an issue processing your unsubscribe request. 
                      This might happen if the link has expired or has already been used.
                    </p>
                    
                    <Button
                      onClick={handleManualUnsubscribe}
                      variant="outline"
                      disabled={loading}
                    >
                      Try Again
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <p className="text-lg text-muted-foreground">
                    Click the button below to confirm your unsubscription.
                  </p>
                  
                  <Button
                    onClick={handleManualUnsubscribe}
                    variant="destructive"
                    disabled={loading}
                  >
                    Confirm Unsubscribe
                  </Button>
                </div>
              )}
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8">
              <Link to="/">
                <Button variant="outline" className="inline-flex items-center space-x-2">
                  <Home className="h-4 w-4" />
                  <span>Back to Home</span>
                </Button>
              </Link>
              
              {success && (
                <Link to="/">
                  <Button className="inline-flex items-center space-x-2">
                    <span>Continue Reading</span>
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
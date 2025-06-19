import { useState } from 'react';
import { supabase } from '../lib/supabase';

interface SubscriptionData {
  email: string;
  source?: string;
  preferences?: Record<string, any>;
}

interface SubscriptionResponse {
  success: boolean;
  message: string;
  alreadySubscribed?: boolean;
  reactivated?: boolean;
  subscription?: {
    id: string;
    email: string;
    subscribed_at: string;
  };
}

export function useSubscription() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const subscribe = async (data: SubscriptionData): Promise<SubscriptionResponse | null> => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const response = await fetch(`${supabaseUrl}/functions/v1/subscriptions/subscribe`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify(data),
      });

      const result: SubscriptionResponse = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Subscription failed');
      }

      setSuccess(result.message);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to subscribe';
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const unsubscribe = async (token: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const response = await fetch(`${supabaseUrl}/functions/v1/subscriptions/unsubscribe`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({ token }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Unsubscribe failed');
      }

      setSuccess(result.message);
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to unsubscribe';
      setError(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const clearMessages = () => {
    setError(null);
    setSuccess(null);
  };

  return {
    subscribe,
    unsubscribe,
    loading,
    error,
    success,
    clearMessages,
  };
}
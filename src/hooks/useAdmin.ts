import { useState, useEffect } from 'react';

interface AdminUser {
  id: string;
  username: string;
}

interface LoginData {
  username: string;
  password: string;
}

interface DashboardStats {
  totalSubscribers: number;
  activeSubscribers: number;
  pageViewsToday: number;
  popularArticles: Array<{
    id: number;
    title: string;
    category: string;
    views: number;
  }>;
}

interface Subscriber {
  email: string;
  created_at: string;
  is_active: boolean;
  source: string;
}

export function useAdmin() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('admin_token') !== null;
  });
  const [adminUser, setAdminUser] = useState<AdminUser | null>(() => {
    const stored = localStorage.getItem('admin_user');
    return stored ? JSON.parse(stored) : null;
  });

  // Check authentication status on mount
  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    const user = localStorage.getItem('admin_user');
    
    if (token && user) {
      setIsAuthenticated(true);
      setAdminUser(JSON.parse(user));
    } else {
      setIsAuthenticated(false);
      setAdminUser(null);
    }
  }, []);

  const login = async (credentials: LoginData): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      // For demo purposes, check credentials locally first
      if (credentials.username === 'admin' && credentials.password === 'admin123') {
        const mockAdmin = {
          id: 'admin-1',
          username: 'admin'
        };
        
        const mockToken = `admin_${mockAdmin.id}_${Date.now()}`;
        
        localStorage.setItem('admin_token', mockToken);
        localStorage.setItem('admin_user', JSON.stringify(mockAdmin));
        setAdminUser(mockAdmin);
        setIsAuthenticated(true);
        return true;
      }

      // If demo credentials don't work, try the API
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      if (!supabaseUrl) {
        throw new Error('Supabase URL not configured');
      }

      const response = await fetch(`${supabaseUrl}/functions/v1/admin/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify(credentials),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Login failed');
      }

      localStorage.setItem('admin_token', result.token);
      localStorage.setItem('admin_user', JSON.stringify(result.admin));
      setAdminUser(result.admin);
      setIsAuthenticated(true);
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Login failed';
      setError(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    // Clear all authentication data
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_user');
    setAdminUser(null);
    setIsAuthenticated(false);
    setError(null);
    
    // Force a small delay to ensure state updates are processed
    setTimeout(() => {
      console.log('Admin logged out successfully');
    }, 100);
  };

  const getDashboardStats = async (): Promise<DashboardStats | null> => {
    setLoading(true);
    setError(null);

    try {
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      if (!supabaseUrl) {
        // Return mock data if Supabase is not configured
        return {
          totalSubscribers: 1250,
          activeSubscribers: 1180,
          pageViewsToday: 342,
          popularArticles: [
            { id: 1, title: "AI Revolution in 2025", category: "AI", views: 1250 },
            { id: 2, title: "Sustainable Design Trends", category: "Design", views: 980 },
            { id: 3, title: "Smart Construction Tech", category: "Construction", views: 750 },
          ]
        };
      }

      const response = await fetch(`${supabaseUrl}/functions/v1/admin/stats`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        },
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to fetch stats');
      }

      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch stats';
      setError(errorMessage);
      
      // Return mock data on error
      return {
        totalSubscribers: 1250,
        activeSubscribers: 1180,
        pageViewsToday: 342,
        popularArticles: [
          { id: 1, title: "AI Revolution in 2025", category: "AI", views: 1250 },
          { id: 2, title: "Sustainable Design Trends", category: "Design", views: 980 },
          { id: 3, title: "Smart Construction Tech", category: "Construction", views: 750 },
        ]
      };
    } finally {
      setLoading(false);
    }
  };

  const getSubscribers = async (page = 1, limit = 10): Promise<Subscriber[]> => {
    setLoading(true);
    setError(null);

    try {
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      if (!supabaseUrl) {
        // Return mock data if Supabase is not configured
        return [
          { email: "user1@example.com", created_at: new Date().toISOString(), is_active: true, source: "website" },
          { email: "user2@example.com", created_at: new Date().toISOString(), is_active: true, source: "modal" },
          { email: "user3@example.com", created_at: new Date().toISOString(), is_active: false, source: "sidebar" },
        ];
      }

      const response = await fetch(`${supabaseUrl}/functions/v1/admin/subscribers?page=${page}&limit=${limit}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        },
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to fetch subscribers');
      }

      return result.subscribers;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch subscribers';
      setError(errorMessage);
      
      // Return mock data on error
      return [
        { email: "user1@example.com", created_at: new Date().toISOString(), is_active: true, source: "website" },
        { email: "user2@example.com", created_at: new Date().toISOString(), is_active: true, source: "modal" },
        { email: "user3@example.com", created_at: new Date().toISOString(), is_active: false, source: "sidebar" },
      ];
    } finally {
      setLoading(false);
    }
  };

  const exportSubscribers = async (): Promise<void> => {
    setLoading(true);
    setError(null);

    try {
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      if (!supabaseUrl) {
        // Create mock CSV for demo
        const mockCsv = `Email,Subscribed Date,Status,Source,Preferences
"user1@example.com","${new Date().toLocaleDateString()}","Active","website","{}"
"user2@example.com","${new Date().toLocaleDateString()}","Active","modal","{}"
"user3@example.com","${new Date().toLocaleDateString()}","Inactive","sidebar","{}"`;
        
        const blob = new Blob([mockCsv], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `autosphere-subscribers-${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        return;
      }

      const response = await fetch(`${supabaseUrl}/functions/v1/admin/export`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to export subscribers');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `autosphere-subscribers-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to export subscribers';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const trackPageView = async (articleId: number): Promise<void> => {
    try {
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      if (!supabaseUrl) {
        // Skip tracking if Supabase is not configured
        return;
      }

      await fetch(`${supabaseUrl}/functions/v1/admin/track-view`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({
          article_id: articleId,
          user_agent: navigator.userAgent,
          ip_address: 'client' // In production, get real IP from server
        }),
      });
    } catch (err) {
      // Silently fail for tracking
      console.warn('Failed to track page view:', err);
    }
  };

  return {
    login,
    logout,
    getDashboardStats,
    getSubscribers,
    exportSubscribers,
    trackPageView,
    loading,
    error,
    isAuthenticated,
    adminUser,
  };
}
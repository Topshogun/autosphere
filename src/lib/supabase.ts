import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
});

export type Database = {
  public: {
    Tables: {
      articles: {
        Row: {
          id: number;
          title: string;
          content: string;
          summary: string | null;
          author: string;
          category: 'AI' | 'Finance & Accounting' | 'Content Creation & Marketing' | 'Personal Branding & Thought Leadership' | 'Operations & Productivity' | 'Sales & Customer Relations' | 'E-commerce & Retail';
          image_url: string | null;
          slug: string;
          published_date: string;
          created_at: string | null;
          updated_at: string | null;
        };
        Insert: {
          id?: number;
          title: string;
          content: string;
          summary?: string | null;
          author: string;
          category: 'AI' | 'Finance & Accounting' | 'Content Creation & Marketing' | 'Personal Branding & Thought Leadership' | 'Operations & Productivity' | 'Sales & Customer Relations' | 'E-commerce & Retail';
          image_url?: string | null;
          slug?: string;
          published_date: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: number;
          title?: string;
          content?: string;
          summary?: string | null;
          author?: string;
          category?: 'AI' | 'Finance & Accounting' | 'Content Creation & Marketing' | 'Personal Branding & Thought Leadership' | 'Operations & Productivity' | 'Sales & Customer Relations' | 'E-commerce & Retail';
          image_url?: string | null;
          slug?: string;
          published_date?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      profiles: {
        Row: {
          id: string;
          email: string;
          credits: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          credits?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          credits?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      subscriptions: {
        Row: {
          id: string;
          email: string;
          subscribed_at: string | null;
          is_active: boolean | null;
          source: string | null;
          preferences: any | null;
          unsubscribe_token: string | null;
          created_at: string | null;
          updated_at: string | null;
        };
        Insert: {
          id?: string;
          email: string;
          subscribed_at?: string;
          is_active?: boolean;
          source?: string;
          preferences?: any;
          unsubscribe_token?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          subscribed_at?: string;
          is_active?: boolean;
          source?: string;
          preferences?: any;
          unsubscribe_token?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      admin_users: {
        Row: {
          id: string;
          username: string;
          password_hash: string;
          created_at: string | null;
        };
        Insert: {
          id?: string;
          username: string;
          password_hash: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          username?: string;
          password_hash?: string;
          created_at?: string;
        };
      };
      page_views: {
        Row: {
          id: string;
          article_id: number | null;
          user_agent: string | null;
          ip_address: string | null;
          viewed_at: string | null;
        };
        Insert: {
          id?: string;
          article_id?: number;
          user_agent?: string;
          ip_address?: string;
          viewed_at?: string;
        };
        Update: {
          id?: string;
          article_id?: number;
          user_agent?: string;
          ip_address?: string;
          viewed_at?: string;
        };
      };
    };
  };
};
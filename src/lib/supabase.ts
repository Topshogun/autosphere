import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

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
          category: 'AI' | 'Design' | 'Construction';
          image_url: string | null;
          slug: string;
          published_date: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: number;
          title: string;
          content: string;
          summary?: string | null;
          author: string;
          category: 'AI' | 'Design' | 'Construction';
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
          category?: 'AI' | 'Design' | 'Construction';
          image_url?: string | null;
          slug?: string;
          published_date?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
};
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { Database } from '../lib/supabase';

export type Article = Database['public']['Tables']['articles']['Row'] & {
  publishTime?: string;
  image?: string;
};

interface UseArticlesOptions {
  category?: 'AI' | 'Finance & Accounting' | 'Content Creation & Marketing' | 'Personal Branding & Thought Leadership' | 'Operations & Productivity' | 'Sales & Customer Relations' | 'E-commerce & Retail';
  limit?: number;
  realtime?: boolean;
}

export function useArticles(options: UseArticlesOptions = {}) {
  const { category, limit = 9, realtime = true } = options;
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchArticles = async () => {
    try {
      setLoading(true);
      setError(null);

      // Test connection first
      const { data: testData, error: testError } = await supabase
        .from('articles')
        .select('count')
        .limit(1);

      if (testError) {
        console.error('Supabase connection test failed:', testError);
        throw new Error(`Database connection failed: ${testError.message}`);
      }

      let query = supabase
        .from('articles')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(limit);

      if (category) {
        query = query.eq('category', category);
      }

      const { data, error: fetchError } = await query;

      if (fetchError) {
        console.error('Error fetching articles:', fetchError);
        throw new Error(`Failed to fetch articles: ${fetchError.message}`);
      }

      // Transform data to match existing interface
      const transformedArticles: Article[] = (data || []).map(article => ({
        ...article,
        image: article.image_url || getDefaultImageForCategory(article.category),
        publishTime: formatPublishTime(article.created_at || new Date().toISOString()),
      }));

      setArticles(transformedArticles);
    } catch (err) {
      console.error('Error in fetchArticles:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch articles';
      setError(errorMessage);
      
      // Set empty articles array on error to prevent UI issues
      setArticles([]);
    } finally {
      setLoading(false);
    }
  };

  const refreshArticles = () => {
    fetchArticles();
  };

  const addArticle = async (newArticle: Omit<Database['public']['Tables']['articles']['Insert'], 'id'>) => {
    try {
      const { data, error } = await supabase
        .from('articles')
        .insert(newArticle)
        .select()
        .single();

      if (error) {
        throw error;
      }

      // Add to local state
      const transformedArticle: Article = {
        ...data,
        image: data.image_url || getDefaultImageForCategory(data.category),
        publishTime: formatPublishTime(data.created_at || new Date().toISOString()),
      };

      setArticles(prev => [transformedArticle, ...prev.slice(0, limit - 1)]);
      return data;
    } catch (err) {
      console.error('Error adding article:', err);
      throw err;
    }
  };

  const getArticleById = (id: string): Article | undefined => {
    return articles.find(article => article.id.toString() === id);
  };

  const getArticleBySlug = (slug: string): Article | undefined => {
    return articles.find(article => article.slug === slug);
  };

  useEffect(() => {
    fetchArticles();
  }, [category, limit]);

  // Set up real-time subscription
  useEffect(() => {
    if (!realtime) return;

    const channel = supabase
      .channel('articles-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'articles',
          filter: category ? `category=eq.${category}` : undefined,
        },
        (payload) => {
          console.log('New article received:', payload.new);
          const newArticle = payload.new as Database['public']['Tables']['articles']['Row'];
          
          const transformedArticle: Article = {
            ...newArticle,
            image: newArticle.image_url || getDefaultImageForCategory(newArticle.category),
            publishTime: formatPublishTime(newArticle.created_at || new Date().toISOString()),
          };

          setArticles(prev => [transformedArticle, ...prev.slice(0, limit - 1)]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [category, limit, realtime]);

  return {
    articles,
    loading,
    error,
    refreshArticles,
    addArticle,
    getArticleById,
    getArticleBySlug,
  };
}

function getDefaultImageForCategory(category: string): string {
  const imageMap = {
    'AI': 'https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=800',
    'Finance & Accounting': 'https://images.pexels.com/photos/6801648/pexels-photo-6801648.jpeg?auto=compress&cs=tinysrgb&w=800',
    'Content Creation & Marketing': 'https://images.pexels.com/photos/7688336/pexels-photo-7688336.jpeg?auto=compress&cs=tinysrgb&w=800',
    'Personal Branding & Thought Leadership': 'https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=800',
    'Operations & Productivity': 'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=800',
    'Sales & Customer Relations': 'https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg?auto=compress&cs=tinysrgb&w=800',
    'E-commerce & Retail': 'https://images.pexels.com/photos/230544/pexels-photo-230544.jpeg?auto=compress&cs=tinysrgb&w=800',
  };
  return imageMap[category as keyof typeof imageMap] || imageMap['AI'];
}

function formatPublishTime(dateString: string): string {
  try {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      return 'Just now';
    } else if (diffInHours < 24) {
      return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
    }
  } catch {
    return 'Recently';
  }
}
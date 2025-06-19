import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { Database } from '../lib/supabase';

export type Article = Database['public']['Tables']['articles']['Row'] & {
  publishTime?: string;
  image?: string;
};

interface UseArticlesOptions {
  category?: 'AI' | 'Design' | 'Construction';
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
        throw fetchError;
      }

      // Transform data to match existing interface
      const transformedArticles: Article[] = (data || []).map(article => ({
        ...article,
        image: article.image_url || getDefaultImageForCategory(article.category),
        publishTime: formatPublishTime(article.created_at),
      }));

      setArticles(transformedArticles);
    } catch (err) {
      console.error('Error fetching articles:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch articles');
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
        publishTime: formatPublishTime(data.created_at),
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
            publishTime: formatPublishTime(newArticle.created_at),
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
    'Design': 'https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg?auto=compress&cs=tinysrgb&w=800',
    'Construction': 'https://images.pexels.com/photos/416405/pexels-photo-416405.jpeg?auto=compress&cs=tinysrgb&w=800',
  };
  return imageMap[category] || imageMap['AI'];
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
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '../lib/supabase';
import type { Database } from '../lib/supabase';

type Article = Database['public']['Tables']['articles']['Row'];

interface HeroArticle extends Article {
  gradient: string;
}

export function HeroCarousel() {
  const [articles, setArticles] = useState<HeroArticle[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const categoryGradients = {
    AI: 'from-blue-600 to-purple-600',
    'Finance & Accounting': 'from-green-500 to-emerald-600',
    'Content Creation & Marketing': 'from-pink-500 to-rose-600',
    'Personal Branding & Thought Leadership': 'from-purple-500 to-indigo-600',
    'Operations & Productivity': 'from-orange-500 to-amber-600',
    'Sales & Customer Relations': 'from-cyan-500 to-blue-600',
    'E-commerce & Retail': 'from-red-500 to-pink-600'
  };

  // Fetch the 5 most recent articles
  const fetchHeroArticles = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('articles')
        .select('*')
        .order('published_date', { ascending: false })
        .limit(5);

      if (fetchError) {
        throw fetchError;
      }

      // Transform articles with gradients
      const heroArticles: HeroArticle[] = (data || []).map(article => ({
        ...article,
        gradient: categoryGradients[article.category] || categoryGradients.AI
      }));

      setArticles(heroArticles);
      
      // Reset current slide if it's out of bounds
      if (currentSlide >= heroArticles.length) {
        setCurrentSlide(0);
      }
    } catch (err) {
      console.error('Error fetching hero articles:', err);
      setError(err instanceof Error ? err.message : 'Failed to load articles');
    } finally {
      setLoading(false);
    }
  };

  // Auto-rotation effect
  useEffect(() => {
    if (!isAutoPlaying || articles.length === 0) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % articles.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, articles.length]);

  // Fetch articles on component mount
  useEffect(() => {
    fetchHeroArticles();
  }, []);

  // Set up real-time subscription for new articles
  useEffect(() => {
    const channel = supabase
      .channel('hero-articles-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'articles',
        },
        () => {
          // Refresh hero articles when new article is added
          fetchHeroArticles();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // Navigation functions
  const goToSlide = (index: number) => {
    setCurrentSlide(index);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % articles.length);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + articles.length) % articles.length);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowLeft') {
        prevSlide();
      } else if (event.key === 'ArrowRight') {
        nextSlide();
      } else if (event.key >= '1' && event.key <= '5') {
        const slideIndex = parseInt(event.key) - 1;
        if (slideIndex < articles.length) {
          goToSlide(slideIndex);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [articles.length]);

  // Format publish time
  const formatPublishTime = (dateString: string): string => {
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
  };

  // Loading state
  if (loading) {
    return (
      <section className="relative w-full h-[500px] md:h-[600px] overflow-hidden rounded-xl bg-muted flex items-center justify-center">
        <div className="flex items-center space-x-2 text-muted-foreground">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Loading latest articles...</span>
        </div>
      </section>
    );
  }

  // Error state
  if (error) {
    return (
      <section className="relative w-full h-[500px] md:h-[600px] overflow-hidden rounded-xl bg-muted flex items-center justify-center">
        <div className="text-center">
          <p className="text-destructive mb-4">Failed to load articles</p>
          <Button onClick={fetchHeroArticles} variant="outline" size="sm">
            Try Again
          </Button>
        </div>
      </section>
    );
  }

  // No articles state
  if (articles.length === 0) {
    return (
      <section className="relative w-full h-[500px] md:h-[600px] overflow-hidden rounded-xl bg-muted flex items-center justify-center">
        <div className="text-center">
          <h3 className="text-xl font-semibold mb-2">No Articles Available</h3>
          <p className="text-muted-foreground mb-4">Check back soon for the latest updates</p>
          <Button onClick={fetchHeroArticles} variant="outline" size="sm">
            Refresh
          </Button>
        </div>
      </section>
    );
  }

  return (
    <section 
      className="relative w-full h-[500px] md:h-[600px] overflow-hidden rounded-xl"
      role="region"
      aria-label="Featured articles carousel"
      aria-live="polite"
    >
      <div className="absolute inset-0">
        {articles.map((article, index) => (
          <div
            key={article.id}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
            aria-hidden={index !== currentSlide}
          >
            <Link 
              to={`/article/${article.id}/${article.slug}`}
              className="block w-full h-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset"
              aria-label={`Read full article: ${article.title}`}
              tabIndex={index === currentSlide ? 0 : -1}
            >
              {/* Optimized image with loading states */}
              <div className="relative w-full h-full">
                <img
                  src={article.image_url || `https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=1200&h=600&fit=crop`}
                  alt={article.title}
                  className="w-full h-full object-cover"
                  loading={index === 0 ? 'eager' : 'lazy'}
                  decoding="async"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = 'https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=1200&h=600&fit=crop';
                  }}
                />
                
                {/* Gradient overlay */}
                <div className={`absolute inset-0 bg-gradient-to-r ${article.gradient} opacity-60`} />
                <div className="absolute inset-0 bg-black/20" />
                
                {/* Content overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12">
                  <div className="max-w-4xl">
                    <div className="flex items-center space-x-4 mb-4">
                      <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-white text-sm font-medium">
                        {article.category}
                      </span>
                      <span className="text-white/80 text-sm">
                        {formatPublishTime(article.published_date)}
                      </span>
                    </div>
                    
                    <h2 className="text-3xl md:text-5xl font-bold text-white leading-tight hover:text-blue-200 transition-colors duration-200 mb-4">
                      {article.title}
                    </h2>
                    
                    {article.summary && (
                      <p className="text-white/90 text-lg md:text-xl leading-relaxed max-w-3xl line-clamp-2">
                        {article.summary}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      {articles.length > 1 && (
        <>
          <Button
            variant="ghost"
            size="icon"
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white border-white/20 z-10"
            onClick={prevSlide}
            aria-label="Previous slide"
            disabled={loading}
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white border-white/20 z-10"
            onClick={nextSlide}
            aria-label="Next slide"
            disabled={loading}
          >
            <ChevronRight className="h-6 w-6" />
          </Button>
        </>
      )}

      {/* Pagination Dots */}
      {articles.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2 z-10">
          {articles.map((_, index) => (
            <button
              key={index}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentSlide 
                  ? 'bg-white scale-110' 
                  : 'bg-white/50 hover:bg-white/75'
              }`}
              onClick={() => goToSlide(index)}
              aria-label={`Go to slide ${index + 1}`}
              aria-current={index === currentSlide ? 'true' : 'false'}
            />
          ))}
        </div>
      )}

      {/* Screen reader announcements */}
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        {articles.length > 0 && (
          `Showing article ${currentSlide + 1} of ${articles.length}: ${articles[currentSlide]?.title}`
        )}
      </div>
    </section>
  );
}
import React from 'react';
import { NewsCard } from './NewsCard';
import { useArticles } from '../hooks/useArticles';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';

export function NewsGrid() {
  const { articles, loading, error, refreshArticles } = useArticles({ 
    limit: 9,
    realtime: true 
  });

  return (
    <section>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h2 className="text-3xl md:text-4xl font-bold mb-2">Today's Highlights</h2>
          <p className="text-muted-foreground">Curated stories from AI, Finance, Marketing, Branding, Operations, Sales, and E-commerce</p>
        </div>
        
        <Button
          variant="outline"
          size="sm"
          onClick={refreshArticles}
          disabled={loading}
          className="flex items-center space-x-2"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh</span>
        </Button>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
          <p className="text-destructive text-sm">Error loading articles: {error}</p>
          <Button 
            onClick={refreshArticles} 
            variant="outline" 
            size="sm" 
            className="mt-2"
          >
            Try Again
          </Button>
        </div>
      )}
      
      {loading && articles.length === 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 9 }).map((_, index) => (
            <div key={index} className="bg-card rounded-xl overflow-hidden shadow-md border border-border animate-pulse">
              <div className="aspect-video bg-muted"></div>
              <div className="p-4 space-y-3">
                <div className="h-4 bg-muted rounded w-3/4"></div>
                <div className="h-3 bg-muted rounded w-full"></div>
                <div className="h-3 bg-muted rounded w-2/3"></div>
              </div>
            </div>
          ))}
        </div>
      ) : articles.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((article) => (
            <NewsCard
              key={article.id}
              id={article.id}
              title={article.title}
              category={article.category}
              summary={article.summary || ''}
              image={article.image || article.image_url || ''}
              publishTime={article.publishTime || ''}
              slug={article.slug}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-blue-500 to-teal-500 rounded-full flex items-center justify-center opacity-20">
            <span className="text-white font-bold text-xl">AI</span>
          </div>
          <h3 className="text-xl font-semibold mb-2">No Articles Available</h3>
          <p className="text-muted-foreground mb-6">
            Check back soon for the latest updates across all our categories.
          </p>
          <Button onClick={refreshArticles} variant="outline">
            Check for Updates
          </Button>
        </div>
      )}

      {loading && articles.length > 0 && (
        <div className="mt-8 text-center">
          <div className="inline-flex items-center space-x-2 text-muted-foreground">
            <RefreshCw className="h-4 w-4 animate-spin" />
            <span>Loading articles...</span>
          </div>
        </div>
      )}
    </section>
  );
}
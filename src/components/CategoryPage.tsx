import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Header } from './Header';
import { Footer } from './Footer';
import { NewsCard } from './NewsCard';
import { Button } from '@/components/ui/button';
import { ArrowLeft, RefreshCw } from 'lucide-react';
import { useArticles } from '../hooks/useArticles';

interface CategoryPageProps {
  darkMode: boolean;
  toggleDarkMode: () => void;
}

export function CategoryPage({ darkMode, toggleDarkMode }: CategoryPageProps) {
  const { category } = useParams<{ category: 'AI' | 'Design' | 'Construction' }>();
  const { articles, loading, error, refreshArticles } = useArticles({ 
    category: category as 'AI' | 'Design' | 'Construction',
    limit: 12 
  });

  if (!category || !['AI', 'Design', 'Construction'].includes(category)) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <Header darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
        <main className="pt-16">
          <div className="w-full px-4 sm:px-6 lg:px-8 py-12">
            <div className="max-w-[1200px] mx-auto text-center">
              <h1 className="text-3xl font-bold mb-4">Category Not Found</h1>
              <p className="text-muted-foreground mb-8">
                The category you're looking for doesn't exist.
              </p>
              <Link to="/">
                <Button className="inline-flex items-center space-x-2">
                  <ArrowLeft className="h-4 w-4" />
                  <span>Back to Home</span>
                </Button>
              </Link>
            </div>
          </div>
        </main>
      </div>
    );
  }

  const categoryColors = {
    AI: 'from-blue-500 to-purple-600',
    'Finance & Accounting': 'from-green-500 to-emerald-600',
    'Content Creation & Marketing': 'from-pink-500 to-rose-600',
    'Personal Branding & Thought Leadership': 'from-purple-500 to-indigo-600',
    'Operations & Productivity': 'from-orange-500 to-amber-600',
    'Sales & Customer Relations': 'from-cyan-500 to-blue-600',
    'E-commerce & Retail': 'from-red-500 to-pink-600'
  };

  const categoryDescriptions = {
    AI: 'Discover the latest breakthroughs in artificial intelligence, machine learning, and cognitive computing that are reshaping our world.',
    'Finance & Accounting': 'Stay informed about financial strategies, accounting innovations, and fintech solutions that drive business success.',
    'Content Creation & Marketing': 'Explore cutting-edge content strategies, marketing automation, and creative techniques that engage audiences.',
    'Personal Branding & Thought Leadership': 'Learn how to build your personal brand, establish thought leadership, and create meaningful professional impact.',
    'Operations & Productivity': 'Discover tools, systems, and methodologies that streamline operations and boost productivity across organizations.',
    'Sales & Customer Relations': 'Master sales techniques, CRM strategies, and customer relationship management for sustainable business growth.',
    'E-commerce & Retail': 'Navigate the evolving landscape of online commerce, retail technology, and digital marketplace strategies.'
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
      
      <main className="pt-16">
        {/* Category Header */}
        <section className="w-full px-4 sm:px-6 lg:px-8 py-12">
          <div className="max-w-[1200px] mx-auto">
            <div className="mb-8">
              <Link 
                to="/"
                className="inline-flex items-center space-x-2 text-muted-foreground hover:text-foreground transition-colors duration-200 mb-6"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Back to Home</span>
              </Link>
              
              <div className="flex items-center space-x-4 mb-4">
                <span className={`inline-block px-4 py-2 text-sm font-semibold text-white rounded-full bg-gradient-to-r ${categoryColors[category]}`}>
                  {category}
                </span>
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
              
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                {category} News
              </h1>
              <p className="text-xl text-muted-foreground max-w-3xl">
                {categoryDescriptions[category]}
              </p>
            </div>
          </div>
        </section>

        {/* Articles Grid */}
        <section className="w-full px-4 sm:px-6 lg:px-8 pb-12">
          <div className="max-w-[1200px] mx-auto">
            {error && (
              <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
                <p className="text-destructive text-sm">Error loading articles: {error}</p>
              </div>
            )}

            {loading && articles.length === 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, index) => (
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
                <div className={`w-16 h-16 mx-auto mb-4 bg-gradient-to-r ${categoryColors[category]} rounded-full flex items-center justify-center opacity-20`}>
                  <span className="text-white font-bold text-xl">{category[0]}</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">No {category} Articles Yet</h3>
                <p className="text-muted-foreground mb-6">
                  Be the first to know when new {category.toLowerCase()} articles are published.
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
                  <span>Loading more articles...</span>
                </div>
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { Header } from './Header';
import { Footer } from './Footer';
import { ShareModal } from './ShareModal';
import { NewsletterModal } from './NewsletterModal';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Clock, User, Share2, Bookmark, Eye, Calendar, Mail } from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { Database } from '../lib/supabase';

interface ArticlePageProps {
  darkMode: boolean;
  toggleDarkMode: () => void;
}

type Article = Database['public']['Tables']['articles']['Row'];

// Mock article data for when Supabase is not available
const mockArticles: Article[] = [
  {
    id: 10,
    title: "Exploring the Future: AI's Transformative Role in Global Security at the Marshall Center",
    content: `Artificial Intelligence (AI) is rapidly transforming the landscape of global security, offering unprecedented opportunities to enhance defense capabilities while simultaneously presenting new challenges that require careful consideration and strategic planning.

The integration of AI technologies into security frameworks represents a paradigm shift in how nations approach defense and threat assessment. Machine learning algorithms can now process vast amounts of data in real-time, identifying patterns and potential threats that would be impossible for human analysts to detect manually.

One of the most significant applications of AI in security is predictive analytics. By analyzing historical data, current trends, and real-time intelligence feeds, AI systems can forecast potential security threats with remarkable accuracy. This capability allows security agencies to adopt a proactive rather than reactive approach to threat management.

Cybersecurity has become another critical domain where AI is making substantial contributions. Advanced AI systems can detect and respond to cyber threats in milliseconds, far faster than traditional security measures. These systems learn from each attack, continuously improving their ability to identify and neutralize new forms of cyber warfare.

However, the integration of AI into security systems is not without challenges. Questions of accountability, transparency, and the potential for AI systems to be compromised or manipulated by adversaries remain significant concerns. The development of robust AI governance frameworks is essential to ensure that these powerful technologies are deployed responsibly.

International cooperation in AI security research and development is becoming increasingly important. The Marshall Center's work in this area exemplifies how collaborative efforts can advance our understanding of AI's role in global security while addressing the ethical and practical challenges that arise.

As we look to the future, the continued evolution of AI technology will undoubtedly reshape the security landscape. Organizations and nations that successfully navigate this transformation will be better positioned to protect their interests and contribute to global stability in an increasingly complex world.`,
    summary: "An in-depth exploration of how artificial intelligence is revolutionizing global security practices, examining both the opportunities and challenges presented by AI integration in defense systems.",
    author: "Dr. Sarah Mitchell",
    category: "AI" as const,
    image_url: "https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=1200",
    slug: "exploring-the-future-ais-transformative-role-in-global-security-at-the-marshall-center",
    published_date: new Date().toISOString(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 1,
    title: "The Future of Machine Learning in Healthcare",
    content: `Machine learning is revolutionizing healthcare by enabling more accurate diagnoses, personalized treatments, and improved patient outcomes. This technology is transforming how medical professionals approach complex health challenges.

From diagnostic imaging to drug discovery, ML algorithms are proving invaluable in processing vast amounts of medical data. These systems can identify patterns that might be missed by human analysis, leading to earlier detection of diseases and more effective treatment protocols.

The integration of ML in electronic health records is streamlining patient care and reducing administrative burdens on healthcare providers. Predictive analytics help identify patients at risk of complications, enabling proactive interventions.

However, the implementation of ML in healthcare also raises important questions about data privacy, algorithmic bias, and the need for regulatory frameworks to ensure patient safety and ethical use of these powerful technologies.`,
    summary: "Exploring how machine learning is transforming healthcare through improved diagnostics, personalized medicine, and predictive analytics.",
    author: "Dr. Emily Chen",
    category: "AI" as const,
    image_url: "https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=1200",
    slug: "future-of-machine-learning-in-healthcare",
    published_date: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
    created_at: new Date(Date.now() - 86400000).toISOString(),
    updated_at: new Date(Date.now() - 86400000).toISOString()
  },
  {
    id: 2,
    title: "Sustainable Design Principles for Modern Architecture",
    content: `Sustainable design has become a cornerstone of modern architecture, driving innovation in building materials, energy efficiency, and environmental impact reduction. Today's architects are reimagining how we construct and inhabit spaces.

Green building certifications like LEED and BREEAM are setting new standards for environmental performance. These frameworks encourage the use of renewable materials, energy-efficient systems, and water conservation technologies.

Biophilic design principles are gaining traction, incorporating natural elements into built environments to improve occupant well-being and productivity. This approach recognizes the fundamental human connection to nature.

The circular economy concept is influencing architectural practices, promoting the reuse and recycling of building materials. This shift reduces waste and minimizes the environmental footprint of construction projects.`,
    summary: "An overview of sustainable design principles shaping modern architecture and their impact on environmental conservation.",
    author: "Michael Rodriguez",
    category: "Finance & Accounting" as const,
    image_url: "https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg?auto=compress&cs=tinysrgb&w=1200",
    slug: "sustainable-design-principles-modern-architecture",
    published_date: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
    created_at: new Date(Date.now() - 172800000).toISOString(),
    updated_at: new Date(Date.now() - 172800000).toISOString()
  }
];

// Simple tracking function without external dependencies
const trackPageView = async (articleId: number): Promise<void> => {
  try {
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    if (!supabaseUrl) {
      // Skip tracking if Supabase is not configured
      console.log(`Tracking view for article ${articleId} (mock)`);
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

export function ArticlePage({ darkMode, toggleDarkMode }: ArticlePageProps) {
  const { id, slug } = useParams<{ id: string; slug?: string }>();
  const navigate = useNavigate();
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showNewsletterModal, setShowNewsletterModal] = useState(false);

  useEffect(() => {
    const loadArticle = async () => {
      setLoading(true);
      setError(null);

      try {
        // Check if Supabase is configured
        const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
        
        if (!supabaseUrl) {
          // Use mock data if Supabase is not configured
          const mockArticle = mockArticles.find(a => 
            a.id.toString() === id || a.slug === slug || a.slug === id
          );
          
          if (mockArticle) {
            setArticle(mockArticle);
            trackPageView(mockArticle.id);
          } else {
            throw new Error('Article not found');
          }
          return;
        }

        let query = supabase.from('articles').select('*');
        
        // Try to find by ID first, then by slug
        if (id && !isNaN(Number(id))) {
          query = query.eq('id', parseInt(id));
        } else if (slug) {
          query = query.eq('slug', slug);
        } else if (id) {
          // If ID is not a number, treat it as a slug
          query = query.eq('slug', id);
        }

        const { data, error: fetchError } = await query.single();

        if (fetchError) {
          // If database query fails, try to use mock data
          const mockArticle = mockArticles.find(a => 
            a.id.toString() === id || a.slug === slug || a.slug === id
          );
          
          if (mockArticle) {
            setArticle(mockArticle);
            trackPageView(mockArticle.id);
            return;
          }
          
          throw fetchError;
        }

        setArticle(data);
        
        // Track page view
        if (data?.id) {
          trackPageView(data.id);
        }
      } catch (err) {
        console.error('Error loading article:', err);
        
        // Try to use mock data as fallback
        const mockArticle = mockArticles.find(a => 
          a.id.toString() === id || a.slug === slug || a.slug === id
        );
        
        if (mockArticle) {
          setArticle(mockArticle);
          trackPageView(mockArticle.id);
        } else {
          setError(err instanceof Error ? err.message : 'Article not found');
        }
      } finally {
        setLoading(false);
      }
    };

    if (id || slug) {
      loadArticle();
    }
  }, [id, slug]);

  const handleShare = async () => {
    setShowShareModal(true);
  };

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

  const formatDate = (dateString: string): string => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return 'Unknown date';
    }
  };

  const getCategoryColor = (category: string) => {
    switch(category) {
      case 'AI': 
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'Finance & Accounting': 
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'Content Creation & Marketing': 
        return 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300';
      case 'Personal Branding & Thought Leadership': 
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
      case 'Operations & Productivity': 
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300';
      case 'Sales & Customer Relations': 
        return 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-300';
      case 'E-commerce & Retail': 
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default: 
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <Header darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
        <main className="pt-16">
          <div className="w-full px-4 sm:px-6 lg:px-8 py-12">
            <div className="max-w-[1200px] mx-auto">
              <div className="animate-pulse">
                <div className="h-8 bg-muted rounded w-3/4 mb-4"></div>
                <div className="h-4 bg-muted rounded w-1/2 mb-8"></div>
                <div className="aspect-video bg-muted rounded-xl mb-8"></div>
                <div className="space-y-4">
                  <div className="h-4 bg-muted rounded"></div>
                  <div className="h-4 bg-muted rounded w-5/6"></div>
                  <div className="h-4 bg-muted rounded w-4/5"></div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <Header darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
        <main className="pt-16">
          <div className="w-full px-4 sm:px-6 lg:px-8 py-12">
            <div className="max-w-[1200px] mx-auto text-center">
              <h1 className="text-3xl font-bold mb-4">Article Not Found</h1>
              <p className="text-muted-foreground mb-8">
                {error || "The article you're looking for doesn't exist or has been removed."}
              </p>
              <Button onClick={() => navigate('/')} className="inline-flex items-center space-x-2">
                <ArrowLeft className="h-4 w-4" />
                <span>Back to Home</span>
              </Button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
      
      <main className="pt-16">
        <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
          <div className="max-w-[1200px] mx-auto">
            {/* Back Button */}
            <div className="mb-8">
              <Link 
                to="/"
                className="inline-flex items-center space-x-2 text-muted-foreground hover:text-foreground transition-colors duration-200"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Back to Home</span>
              </Link>
            </div>

            {/* Article Content */}
            <article className="max-w-4xl mx-auto">
              {/* Article Header */}
              <header className="mb-8">
                <div className="mb-4 flex items-center space-x-4">
                  <Badge className={getCategoryColor(article.category)}>
                    {article.category}
                  </Badge>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4 mr-1" />
                    <time>{formatDate(article.published_date)}</time>
                  </div>
                </div>
                
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight mb-6">
                  {article.title}
                </h1>
                
                <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground mb-6">
                  <div className="flex items-center space-x-2">
                    <User className="h-4 w-4" />
                    <span>By {article.author}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4" />
                    <span>{formatPublishTime(article.published_date)}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Eye className="h-4 w-4" />
                    <span>{Math.floor(Math.random() * 1000) + 500} views</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center space-x-4">
                  <Button
                    variant="share"
                    size="sm"
                    onClick={handleShare}
                    className="share-article-btn flex items-center space-x-2"
                  >
                    <Share2 className="h-4 w-4" />
                    <span>Share</span>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowNewsletterModal(true)}
                    className="flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-teal-500 hover:from-blue-600 hover:to-teal-600 text-white border-0 hover:scale-105 transition-all duration-200"
                  >
                    <Mail className="h-4 w-4" />
                    <span>Subscribe</span>
                  </Button>
                  <Button
                    variant="share"
                    size="sm"
                    className="share-article-btn flex items-center space-x-2"
                  >
                    <Bookmark className="h-4 w-4" />
                    <span>Save</span>
                  </Button>
                </div>
              </header>

              {/* Featured Image */}
              {article.image_url && (
                <div className="mb-8">
                  <img
                    src={article.image_url}
                    alt={article.title}
                    className="w-full h-64 md:h-96 object-cover rounded-lg"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = 'https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=1200';
                    }}
                  />
                </div>
              )}

              {/* Article Summary */}
              {article.summary && (
                <div className="mb-8 p-6 bg-muted/30 rounded-lg border-l-4 border-blue-500">
                  <h2 className="text-lg font-semibold mb-2">Summary</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    {article.summary}
                  </p>
                </div>
              )}

              {/* Article Content */}
              <div className="prose prose-lg dark:prose-invert max-w-none mb-8 text-foreground">
                <ReactMarkdown
                  components={{
                    h1: ({ children }) => (
                      <h1 className="text-3xl font-bold mt-8 mb-4 text-foreground">{children}</h1>
                    ),
                    h2: ({ children }) => (
                      <h2 className="text-2xl font-semibold mt-6 mb-3 text-foreground">{children}</h2>
                    ),
                    h3: ({ children }) => (
                      <h3 className="text-xl font-medium mt-5 mb-2 text-foreground">{children}</h3>
                    ),
                    p: ({ children }) => (
                      <p className="text-lg leading-relaxed mb-6 text-foreground">{children}</p>
                    ),
                    ul: ({ children }) => (
                      <ul className="list-disc list-inside mb-6 space-y-2 text-foreground">{children}</ul>
                    ),
                    ol: ({ children }) => (
                      <ol className="list-decimal list-inside mb-6 space-y-2 text-foreground">{children}</ol>
                    ),
                    li: ({ children }) => (
                      <li className="text-lg leading-relaxed text-foreground">{children}</li>
                    ),
                    blockquote: ({ children }) => (
                      <blockquote className="border-l-4 border-blue-500 pl-6 py-2 my-6 bg-muted/30 rounded-r-lg text-foreground italic">
                        {children}
                      </blockquote>
                    ),
                    code: ({ children }) => (
                      <code className="bg-muted px-2 py-1 rounded text-sm font-mono text-foreground">
                        {children}
                      </code>
                    ),
                    pre: ({ children }) => (
                      <pre className="bg-muted p-4 rounded-lg overflow-x-auto mb-6 text-foreground">
                        {children}
                      </pre>
                    ),
                    strong: ({ children }) => (
                      <strong className="font-semibold text-foreground">{children}</strong>
                    ),
                    em: ({ children }) => (
                      <em className="italic text-foreground">{children}</em>
                    ),
                    a: ({ href, children }) => (
                      <a 
                        href={href} 
                        className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 underline transition-colors"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {children}
                      </a>
                    ),
                  }}
                >
                  {article.content}
                </ReactMarkdown>
              </div>

              {/* Article Footer */}
              <footer className="mt-12 pt-8 border-t border-border">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="text-sm text-muted-foreground">
                    <p>Published by <span className="font-medium text-foreground">{article.author}</span></p>
                    <p>on {formatDate(article.published_date)}</p>
                  </div>
                  <div className="flex items-center space-x-4">
                    <Button
                      variant="share"
                      size="sm"
                      onClick={handleShare}
                      className="share-article-btn flex items-center space-x-2"
                    >
                      <Share2 className="h-4 w-4" />
                      <span>Share Article</span>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowNewsletterModal(true)}
                      className="flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-teal-500 hover:from-blue-600 hover:to-teal-600 text-white border-0 hover:scale-105 transition-all duration-200"
                    >
                      <Mail className="h-4 w-4" />
                      <span>Subscribe</span>
                    </Button>
                  </div>
                </div>
              </footer>
            </article>
          </div>
        </div>
      </main>

      <Footer />
      
      {/* Share Modal */}
      {article && (
        <ShareModal
          isOpen={showShareModal}
          onClose={() => setShowShareModal(false)}
          title={article.title}
          url={window.location.href}
          description={article.summary || ''}
        />
      )}
      
      {/* Newsletter Modal */}
      <NewsletterModal
        isOpen={showNewsletterModal}
        onClose={() => setShowNewsletterModal(false)}
      />
    </div>
  );
}
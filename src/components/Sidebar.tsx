import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { SubscriptionForm } from './SubscriptionForm';
import { NewsletterModal } from './NewsletterModal';

const trendingTags = [
  { name: 'Machine Learning', category: 'AI' },
  { name: 'Sustainable Design', category: 'Design' },
  { name: 'Smart Buildings', category: 'Construction' },
  { name: 'Neural Networks', category: 'AI' },
  { name: 'Green Tech', category: 'Design' },
  { name: 'Automation', category: 'Construction' },
  { name: 'Urban Planning', category: 'Design' },
  { name: 'AI Ethics', category: 'AI' },
  { name: 'BIM Technology', category: 'Construction' },
  { name: 'Future Cities', category: 'Design' }
];

const categories = [
  { name: 'AI', path: '/category/AI', color: 'from-blue-500 to-purple-600' },
  { name: 'Design', path: '/category/Design', color: 'from-green-500 to-teal-500' },
  { name: 'Construction', path: '/category/Construction', color: 'from-orange-500 to-red-500' }
];

export function Sidebar() {
  const [showNewsletterModal, setShowNewsletterModal] = useState(false);

  return (
    <aside className="space-y-8">
      {/* Categories */}
      <div className="bg-card rounded-xl p-6 border border-border">
        <h3 className="text-xl font-semibold mb-4">Categories</h3>
        <div className="space-y-3">
          {categories.map((category) => (
            <Link
              key={category.name}
              to={category.path}
              className="block"
            >
              <Button
                variant="outline"
                className={`w-full justify-start hover:bg-gradient-to-r hover:${category.color} hover:text-white hover:border-transparent transition-all duration-200`}
              >
                {category.name}
              </Button>
            </Link>
          ))}
        </div>
      </div>

      {/* Newsletter Subscription */}
      <div className="bg-card rounded-xl p-6 border border-border">
        <h3 className="text-xl font-semibold mb-4">Stay Updated</h3>
        <p className="text-muted-foreground text-sm leading-relaxed mb-6">
          Your daily source for cutting-edge insights in artificial intelligence, innovative design, 
          and revolutionary construction technologies. We curate and rewrite the most important 
          stories shaping tomorrow's world.
        </p>
        
        <SubscriptionForm source="sidebar" />
        
        <div className="mt-4 text-center">
          <Button
            variant="link"
            size="sm"
            onClick={() => setShowNewsletterModal(true)}
            className="text-xs text-muted-foreground hover:text-foreground"
          >
            More subscription options
          </Button>
        </div>
      </div>

      {/* Trending Tags */}
      <div className="bg-card rounded-xl p-6 border border-border">
        <h3 className="text-xl font-semibold mb-4">Trending Tags</h3>
        <div className="flex flex-wrap gap-2">
          {trendingTags.map((tag) => (
            <Link
              key={tag.name}
              to={`/category/${tag.category}`}
            >
              <Badge 
                variant="secondary" 
                className="cursor-pointer hover:bg-gradient-to-r hover:from-blue-500 hover:to-teal-500 hover:text-white transition-all duration-200"
              >
                {tag.name}
              </Badge>
            </Link>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="bg-card rounded-xl p-6 border border-border">
        <h3 className="text-xl font-semibold mb-4">Daily Impact</h3>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Stories Today</span>
            <span className="font-bold text-lg">9</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Categories</span>
            <span className="font-bold text-lg">3</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Active Readers</span>
            <span className="font-bold text-lg">12.5K</span>
          </div>
        </div>
      </div>

      {/* Newsletter Modal */}
      <NewsletterModal
        isOpen={showNewsletterModal}
        onClose={() => setShowNewsletterModal(false)}
      />
    </aside>
  );
}
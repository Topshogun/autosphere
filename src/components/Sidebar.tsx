import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { SubscriptionForm } from './SubscriptionForm';

const trendingTags = [
  { name: 'Machine Learning', category: 'AI' },
  { name: 'Financial Planning', category: 'Finance & Accounting' },
  { name: 'Content Strategy', category: 'Content Creation & Marketing' },
  { name: 'Personal Brand', category: 'Personal Branding & Thought Leadership' },
  { name: 'Workflow Automation', category: 'Operations & Productivity' },
  { name: 'CRM Systems', category: 'Sales & Customer Relations' },
  { name: 'Online Store', category: 'E-commerce & Retail' },
  { name: 'AI Ethics', category: 'AI' },
  { name: 'Tax Strategy', category: 'Finance & Accounting' },
  { name: 'Social Media', category: 'Content Creation & Marketing' },
  { name: 'Thought Leadership', category: 'Personal Branding & Thought Leadership' },
  { name: 'Process Optimization', category: 'Operations & Productivity' },
  { name: 'Sales Funnel', category: 'Sales & Customer Relations' },
  { name: 'Digital Commerce', category: 'E-commerce & Retail' }
];

const categories = [
  { name: 'AI', path: '/category/AI', color: 'from-blue-500 to-purple-600' },
  { name: 'Finance & Accounting', path: `/category/${encodeURIComponent('Finance & Accounting')}`, color: 'from-green-500 to-emerald-600' },
  { name: 'Content Creation & Marketing', path: `/category/${encodeURIComponent('Content Creation & Marketing')}`, color: 'from-pink-500 to-rose-600' },
  { name: 'Personal Branding & Thought Leadership', path: `/category/${encodeURIComponent('Personal Branding & Thought Leadership')}`, color: 'from-purple-500 to-indigo-600' },
  { name: 'Operations & Productivity', path: `/category/${encodeURIComponent('Operations & Productivity')}`, color: 'from-orange-500 to-amber-600' },
  { name: 'Sales & Customer Relations', path: `/category/${encodeURIComponent('Sales & Customer Relations')}`, color: 'from-cyan-500 to-blue-600' },
  { name: 'E-commerce & Retail', path: `/category/${encodeURIComponent('E-commerce & Retail')}`, color: 'from-red-500 to-pink-600' }
];

export function Sidebar() {

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
          Your daily source for cutting-edge insights in AI, finance, marketing, branding, operations, sales, and e-commerce. We curate and rewrite the most important 
          stories shaping tomorrow's world.
        </p>
        
        <SubscriptionForm source="sidebar" />
        
        <div className="mt-4 text-center">
          <Button
            variant="link"
            size="sm"
            onClick={() => window.open('mailto:subscribe@theapexindex.com?subject=Newsletter Subscription', '_blank')}
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
            <span className="font-bold text-lg">7</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Active Readers</span>
            <span className="font-bold text-lg">12.5K</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
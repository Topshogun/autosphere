import React from 'react';
import { Link } from 'react-router-dom';
import { Clock } from 'lucide-react';

const categoryColors = {
  AI: 'from-blue-500 to-purple-600',
  'Finance & Accounting': 'from-green-500 to-emerald-600',
  'Content Creation & Marketing': 'from-pink-500 to-rose-600',
  'Personal Branding & Thought Leadership': 'from-purple-500 to-indigo-600',
  'Operations & Productivity': 'from-orange-500 to-amber-600',
  'Sales & Customer Relations': 'from-cyan-500 to-blue-600',
  'E-commerce & Retail': 'from-red-500 to-pink-600'
};

interface NewsCardProps {
  id: number | string;
  title: string;
  category: keyof typeof categoryColors;
  summary: string;
  image: string;
  publishTime: string;
  slug?: string;
};

export function NewsCard({ id, title, category, summary, image, publishTime, slug }: NewsCardProps) {
  // Use slug if available, otherwise create one from title
  const articleSlug = slug || title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
  
  const articleUrl = `/article/${id}/${articleSlug}`;

  return (
    <article className="group bg-card rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:scale-[1.02] border border-border">
      <Link 
        to={articleUrl}
        className="block focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-xl"
        aria-label={`Read full article: ${title}`}
      >
        <div className="aspect-video relative overflow-hidden">
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
          <div className="absolute top-3 left-3">
            <span className={`inline-block px-3 py-1 text-xs font-semibold text-white rounded-full bg-gradient-to-r ${categoryColors[category]}`}>
              {category}
            </span>
          </div>
        </div>
        
        <div className="p-4">
          <h3 className="font-semibold text-lg leading-tight mb-2 group-hover:text-blue-600 transition-colors duration-200 cursor-pointer">
            {title}
          </h3>
          <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
            {summary}
          </p>
          
          <div className="flex items-center text-xs text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <Clock className="w-3 h-3 mr-1" />
            <span>{publishTime}</span>
          </div>
        </div>
      </Link>
    </article>
  );
}
import React from 'react';
import { Link } from 'react-router-dom';

export function Footer() {
  return (
    <footer className="bg-muted/30 border-t border-border mt-16">
      <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-[1200px] mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <Link to="/" className="flex items-center space-x-2 mb-4 md:mb-0 hover:opacity-80 transition-opacity">
              <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-teal-500 rounded-md flex items-center justify-center">
                <span className="text-white font-bold text-xs">AI</span>
              </div>
              <span className="font-semibold text-muted-foreground">The Apex Index</span>
            </Link>
            
            <nav className="flex space-x-6 text-sm text-muted-foreground">
              <Link to="/" className="hover:text-foreground transition-colors duration-200">
                Home
              </Link>
              <Link to="/category/AI" className="hover:text-foreground transition-colors duration-200">
                AI
              </Link>
              <Link to={`/category/${encodeURIComponent('Finance & Accounting')}`} className="hover:text-foreground transition-colors duration-200">
                Finance
              </Link>
              <Link to={`/category/${encodeURIComponent('Content Creation & Marketing')}`} className="hover:text-foreground transition-colors duration-200">
                Content
              </Link>
              <Link to={`/category/${encodeURIComponent('E-commerce & Retail')}`} className="hover:text-foreground transition-colors duration-200">
                E-commerce
              </Link>
            </nav>
          </div>
          
          <div className="mt-6 pt-6 border-t border-border text-center text-sm text-muted-foreground">
            <p>&copy; 2025 AutoSphere. Redefining tomorrow's technology news.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
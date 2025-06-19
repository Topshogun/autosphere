import React from 'react';
import { Link } from 'react-router-dom';
import { Header } from './Header';
import { Footer } from './Footer';
import { Button } from '@/components/ui/button';
import { Home, Search } from 'lucide-react';

interface NotFoundProps {
  darkMode: boolean;
  toggleDarkMode: () => void;
}

export function NotFound({ darkMode, toggleDarkMode }: NotFoundProps) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
      
      <main className="pt-16">
        <div className="w-full px-4 sm:px-6 lg:px-8 py-24">
          <div className="max-w-[1200px] mx-auto text-center">
            <div className="mb-8">
              <h1 className="text-6xl md:text-8xl font-bold text-muted-foreground mb-4">404</h1>
              <h2 className="text-2xl md:text-3xl font-bold mb-4">Page Not Found</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                The page you're looking for doesn't exist or has been moved. 
                Let's get you back to exploring the latest in AI, Design, and Construction.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/">
                <Button className="inline-flex items-center space-x-2">
                  <Home className="h-4 w-4" />
                  <span>Back to Home</span>
                </Button>
              </Link>
              <Button variant="outline" className="inline-flex items-center space-x-2">
                <Search className="h-4 w-4" />
                <span>Search Articles</span>
              </Button>
            </div>

            {/* Decorative Element */}
            <div className="mt-16 opacity-20">
              <div className="w-32 h-32 mx-auto bg-gradient-to-r from-blue-500 to-teal-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-2xl">AS</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
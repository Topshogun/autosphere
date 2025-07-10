import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Header } from './components/Header';
import { HeroCarousel } from './components/HeroCarousel';
import { NewsGrid } from './components/NewsGrid';
import { Sidebar } from './components/Sidebar';
import { Footer } from './components/Footer';
import { ArticlePage } from './components/ArticlePage';
import { CategoryPage } from './components/CategoryPage';
import { NotFound } from './components/NotFound';
import { UnsubscribePage } from './components/UnsubscribePage';
import { AboutPage } from './components/AboutPage';
import { NewsletterBanner } from './components/NewsletterBanner';
import { AdminRoute } from './components/admin/AdminRoute';
import { ScrollToTop } from './components/ScrollToTop';
import './App.css';

function HomePage({ darkMode, toggleDarkMode }: { darkMode: boolean; toggleDarkMode: () => void }) {
  return (
    <>
      <Header darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
      
      <main className="pt-16">
        {/* Hero Section */}
        <section className="w-full px-4 sm:px-6 lg:px-8 py-8">
          <div className="max-w-[1200px] mx-auto">
            {/* Hero Heading Section */}
            <div className="text-center mb-12">
              <div className="relative inline-block">
                <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
                  <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-teal-500 bg-clip-text text-transparent animate-gradient-x">
                    The Signal
                  </span>
                  <br />
                  <span className="text-foreground">in the Noise</span>
                </h1>
                
                {/* Decorative elements */}
                <div className="absolute -top-4 -left-4 w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full opacity-20 animate-pulse"></div>
                <div className="absolute -bottom-2 -right-6 w-6 h-6 bg-gradient-to-r from-teal-500 to-blue-500 rounded-full opacity-30 animate-pulse delay-1000"></div>
              </div>
              
              <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed mb-8">
                Uncovering the trends that truly matter for your business.
              </p>
              
              {/* Subtle accent line */}
              <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-teal-500 mx-auto rounded-full mb-8"></div>
              
              {/* Category indicators */}
              <div className="flex flex-wrap justify-center gap-3 mb-8">
                <span className="px-4 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-sm font-medium">
                  AI & Technology
                </span>
                <span className="px-4 py-2 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-full text-sm font-medium">
                  Finance & Strategy
                </span>
                <span className="px-4 py-2 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full text-sm font-medium">
                  Marketing & Growth
                </span>
              </div>
            </div>
            
            <HeroCarousel />
          </div>
        </section>

        {/* Main Content */}
        <div className="w-full px-4 sm:px-6 lg:px-8 pb-12">
          <div className="max-w-[1200px] mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* News Grid */}
              <div className="lg:col-span-8">
                <NewsGrid />
              </div>
              
              {/* Sidebar */}
              <div className="lg:col-span-4">
                <div className="sticky top-24">
                  <Sidebar />
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
      <NewsletterBanner />
    </>
  );
}

function App() {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    // Check for saved theme preference or default to light mode
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
      setDarkMode(true);
    }
  }, []);

  useEffect(() => {
    // Apply theme to document
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <Router>
      <ScrollToTop />
      <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
        <Routes>
          <Route 
            path="/" 
            element={<HomePage darkMode={darkMode} toggleDarkMode={toggleDarkMode} />} 
          />
          <Route 
            path="/category/:category" 
            element={<CategoryPage darkMode={darkMode} toggleDarkMode={toggleDarkMode} />} 
          />
          <Route 
            path="/article/:id" 
            element={<ArticlePage darkMode={darkMode} toggleDarkMode={toggleDarkMode} />} 
          />
          <Route 
            path="/article/:id/:slug" 
            element={<ArticlePage darkMode={darkMode} toggleDarkMode={toggleDarkMode} />} 
          />
          <Route 
            path="/unsubscribe" 
            element={<UnsubscribePage darkMode={darkMode} toggleDarkMode={toggleDarkMode} />} 
          />
          <Route 
            path="/about" 
            element={<AboutPage darkMode={darkMode} toggleDarkMode={toggleDarkMode} />} 
          />
          <Route 
            path="/admin/dashboard" 
            element={<AdminRoute />} 
          />
          <Route 
            path="*" 
            element={<NotFound darkMode={darkMode} toggleDarkMode={toggleDarkMode} />} 
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
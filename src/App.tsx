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
import { NewsletterBanner } from './components/NewsletterBanner';
import { AdminRoute } from './components/admin/AdminRoute';
import './App.css';

function HomePage({ darkMode, toggleDarkMode }: { darkMode: boolean; toggleDarkMode: () => void }) {
  return (
    <>
      <Header darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
      
      <main className="pt-16">
        {/* Hero Section */}
        <section className="w-full px-4 sm:px-6 lg:px-8 py-8">
          <div className="max-w-[1200px] mx-auto">
            <div className="mb-6">
              <h1 className="text-2xl md:text-3xl font-bold mb-2">Top Trends</h1>
              <p className="text-muted-foreground">The biggest stories shaping our future</p>
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
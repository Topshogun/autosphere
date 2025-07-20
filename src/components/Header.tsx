import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Moon, Sun, Menu, X, ChevronDown, Mail } from 'lucide-react';
import { NewsletterModal } from './NewsletterModal';

interface HeaderProps {
  darkMode: boolean;
  toggleDarkMode: () => void;
}

export function Header({ darkMode, toggleDarkMode }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showNewsletterModal, setShowNewsletterModal] = useState(false);
  const location = useLocation();

  const categories = [
    { name: 'AI', path: '/category/AI' },
    { name: 'Finance & Accounting', path: `/category/${encodeURIComponent('Finance & Accounting')}` },
    { name: 'Content Creation & Marketing', path: `/category/${encodeURIComponent('Content Creation & Marketing')}` },
    { name: 'Personal Branding & Thought Leadership', path: `/category/${encodeURIComponent('Personal Branding & Thought Leadership')}` },
    { name: 'Operations & Productivity', path: `/category/${encodeURIComponent('Operations & Productivity')}` },
    { name: 'Sales & Customer Relations', path: `/category/${encodeURIComponent('Sales & Customer Relations')}` },
    { name: 'E-commerce & Retail', path: `/category/${encodeURIComponent('E-commerce & Retail')}` }
  ];

  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  const isCategoryActive = () => {
    return categories.some(category => isActive(category.path));
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="max-w-[1200px] mx-auto">
            <div className="flex items-center justify-between h-16">
              {/* Logo - [AS The Apex Index] */}
              <div className="flex-shrink-0">
                <Link to="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-teal-500 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-sm">AS</span>
                  </div>
                  <span className="text-xl font-bold bg-gradient-to-r from-blue-500 to-teal-500 bg-clip-text text-transparent">
                    The Apex Index
                  </span>
                </Link>
              </div>

              {/* Desktop Navigation - [Categories ▼] [About] */}
              <nav className="hidden md:flex items-center space-x-8">
                {/* Categories Dropdown */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className={`font-medium transition-colors duration-200 px-3 py-2 rounded-md flex items-center space-x-1 border-0 bg-transparent hover:bg-muted/50 ${
                        isCategoryActive()
                          ? 'text-blue-600 bg-blue-50 dark:text-blue-400 dark:bg-blue-900/30'
                          : 'text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      <span>Categories</span>
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="w-64">
                    {categories.map((category) => (
                      <DropdownMenuItem key={category.name} asChild>
                        <Link
                          to={category.path}
                          className={`w-full px-3 py-2 text-sm transition-colors duration-200 ${
                            isActive(category.path)
                              ? 'text-blue-600 bg-blue-50 dark:text-blue-400 dark:bg-blue-900/20'
                              : 'text-foreground hover:bg-muted/50'
                          }`}
                        >
                          {category.name}
                        </Link>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* About */}
                <Link
                  to="/about"
                  className={`font-medium transition-colors duration-200 px-3 py-2 rounded-md hover:bg-muted/50 ${
                    isActive('/about')
                      ? 'text-blue-600 bg-blue-50 dark:text-blue-400 dark:bg-blue-900/30'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  About
                </Link>
              </nav>

              {/* Right Side - [☀️] [Subscribe] */}
              <div className="flex items-center space-x-4">
                {/* Dark Mode Toggle - [☀️] */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={toggleDarkMode}
                  className="relative overflow-hidden transition-all duration-300 hover:scale-105 border-border/50 hover:border-border"
                  aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
                >
                  {darkMode ? (
                    <Sun className="h-4 w-4 text-amber-500 transition-all duration-300" />
                  ) : (
                    <Moon className="h-4 w-4 text-slate-600 dark:text-slate-300 transition-all duration-300" />
                  )}
                </Button>

                {/* Subscribe Button - [Subscribe] */}
                <Button
                  onClick={() => setShowNewsletterModal(true)}
                  className="bg-gradient-to-r from-blue-500 to-teal-500 hover:from-blue-600 hover:to-teal-600 text-white border-0 hover:scale-105 transition-all duration-200 hidden sm:flex items-center space-x-2"
                  size="sm"
                >
                  <Mail className="h-4 w-4" />
                  <span>Subscribe</span>
                </Button>

                {/* Mobile Menu Button */}
                <Button
                  variant="ghost"
                  size="icon"
                  className="md:hidden"
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                >
                  {mobileMenuOpen ? (
                    <X className="h-5 w-5" />
                  ) : (
                    <Menu className="h-5 w-5" />
                  )}
                </Button>
              </div>
            </div>

            {/* Mobile Navigation */}
            {mobileMenuOpen && (
              <div className="md:hidden py-4 border-t border-border">
                <nav className="flex flex-col space-y-2">
                  {/* Categories in Mobile */}
                  <div className="px-3 py-2">
                    <p className="text-sm font-semibold text-muted-foreground mb-2">Categories</p>
                    <div className="space-y-1 ml-2">
                      {categories.map((category) => (
                        <Link
                          key={category.name}
                          to={category.path}
                          className={`block font-medium transition-colors duration-200 px-3 py-2 rounded-md text-sm hover:bg-muted/50 ${
                            isActive(category.path)
                              ? 'text-blue-600 bg-blue-50 dark:text-blue-400 dark:bg-blue-900/30'
                              : 'text-muted-foreground hover:text-foreground'
                          }`}
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          {category.name}
                        </Link>
                      ))}
                    </div>
                  </div>

                  {/* About in Mobile */}
                  <Link
                    to="/about"
                    className={`font-medium transition-colors duration-200 px-3 py-2 rounded-md hover:bg-muted/50 ${
                      isActive('/about')
                        ? 'text-blue-600 bg-blue-50 dark:text-blue-400 dark:bg-blue-900/30'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    About
                  </Link>

                  {/* Subscribe in Mobile */}
                  <div className="px-3 py-2">
                    <Button
                      onClick={() => {
                        setShowNewsletterModal(true);
                        setMobileMenuOpen(false);
                      }}
                      className="w-full bg-gradient-to-r from-blue-500 to-teal-500 hover:from-blue-600 hover:to-teal-600 text-white border-0 flex items-center justify-center space-x-2"
                      size="sm"
                    >
                      <Mail className="h-4 w-4" />
                      <span>Subscribe</span>
                    </Button>
                  </div>
                </nav>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Newsletter Modal */}
      <NewsletterModal
        isOpen={showNewsletterModal}
        onClose={() => setShowNewsletterModal(false)}
      />
    </>
  );
}
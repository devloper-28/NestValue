import React, { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Sun, Moon, Menu, X } from "lucide-react";
import { useTheme } from "./ThemeProvider";

interface NavigationProps {
  currentPage: string;
  onPageChange: (page: string) => void;
}

export function Navigation({ currentPage, onPageChange }: NavigationProps) {
  const { theme, setTheme, actualTheme } = useTheme();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  
  const pages = [
    { id: 'home', label: 'Home' },
    { id: 'input', label: 'Plan Investment' },
    { id: 'results', label: 'Results' },
    { id: 'about', label: 'About' }
  ];

  const toggleTheme = () => {
    setTheme(actualTheme === 'light' ? 'dark' : 'light');
  };

  const handlePageChange = (pageId: string) => {
    onPageChange(pageId);
    setIsMobileMenuOpen(false);
  };

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768); // md breakpoint is 768px
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  return (
    <nav className="bg-background border-b border-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-green-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-semibold text-sm">FI</span>
            </div>
            <span className="font-semibold text-lg text-foreground">FinanceIQ</span>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-2">
            <div className="flex space-x-1">
              {pages.map((page) => (
                <Button
                  key={page.id}
                  variant={currentPage === page.id ? "default" : "ghost"}
                  onClick={() => onPageChange(page.id)}
                  className="px-3 lg:px-4 py-2 text-sm lg:text-base"
                >
                  {page.label}
                </Button>
              ))}
            </div>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleTheme}
              className="ml-2 p-2"
              title={`Switch to ${actualTheme === 'light' ? 'dark' : 'light'} mode`}
            >
              {actualTheme === 'light' ? (
                <Moon className="w-4 h-4" />
              ) : (
                <Sun className="w-4 h-4" />
              )}
            </Button>
          </div>

          {/* Mobile Menu Button and Theme Toggle */}
          {isMobile && (
            <div className="flex items-center space-x-2">
              {/* Theme Toggle Icon */}
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleTheme}
                className="p-2"
                title={`Switch to ${actualTheme === 'light' ? 'dark' : 'light'} mode`}
              >
                {actualTheme === 'light' ? (
                  <Moon className="w-4 h-4" />
                ) : (
                  <Sun className="w-4 h-4" />
                )}
              </Button>
              
              {/* Hamburger Menu Button */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2"
                title="Toggle menu"
              >
                {isMobileMenuOpen ? (
                  <X className="w-5 h-5" />
                ) : (
                  <Menu className="w-5 h-5" />
                )}
              </Button>
            </div>
          )}
        </div>

        {/* Mobile Navigation Menu */}
        {isMobile && isMobileMenuOpen && (
          <div className="border-t border-border bg-background">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {pages.map((page) => (
                <Button
                  key={page.id}
                  variant={currentPage === page.id ? "default" : "ghost"}
                  onClick={() => handlePageChange(page.id)}
                  className="w-full justify-start px-3 py-2 text-base"
                >
                  {page.label}
                </Button>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
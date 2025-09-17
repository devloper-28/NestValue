import React, { useState, useEffect } from 'react';
import { ThemeProvider } from './components/ThemeProvider';
import { Navigation } from './components/Navigation';
import { HomePage } from './components/HomePage';
import { InvestmentInputPage } from './components/InvestmentInputPage';
import { ResultsPage } from './components/ResultsPage';
import { AboutPage } from './components/AboutPage';

interface InvestmentData {
  totalBalance: string;
  amount: string;
  monthlyContribution: string;
  targetYear: string;
  riskProfile: string;
}

export default function App() {
  const [currentPage, setCurrentPage] = useState(() => {
    // Get page from URL path or localStorage
    const path = window.location.pathname.replace('/', '') || 'home';
    return path || localStorage.getItem('currentPage') || 'home';
  });
  const [investmentData, setInvestmentData] = useState<InvestmentData | null>(() => {
    // Restore investment data from localStorage
    const savedData = localStorage.getItem('investmentResultsData');
    if (savedData) {
      try {
        return JSON.parse(savedData);
      } catch (error) {
        console.warn('Failed to parse saved investment data:', error);
      }
    }
    return null;
  });

  const handleStartPlanning = () => {
    setCurrentPage('input');
    localStorage.setItem('currentPage', 'input');
    window.history.pushState({}, '', '/input');
  };

  const handleCalculate = (data: InvestmentData) => {
    setInvestmentData(data);
    setCurrentPage('results');
    localStorage.setItem('currentPage', 'results');
    localStorage.setItem('investmentResultsData', JSON.stringify(data));
    window.history.pushState({}, '', '/results');
  };

  const handlePageChange = (page: string) => {
    setCurrentPage(page);
    localStorage.setItem('currentPage', page);
    window.history.pushState({}, '', `/${page}`);
  };

  // Set initial URL on page load
  useEffect(() => {
    if (window.location.pathname === '/') {
      window.history.replaceState({}, '', '/home');
    }
  }, []);

  // Listen for URL changes (browser back/forward)
  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname.replace('/', '') || 'home';
      if (path !== currentPage) {
        setCurrentPage(path);
        localStorage.setItem('currentPage', path);
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [currentPage]);

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage onStartPlanning={handleStartPlanning} />;
      case 'input':
        return <InvestmentInputPage onCalculate={handleCalculate} />;
      case 'results':
        return <ResultsPage investmentData={investmentData} />;
      case 'about':
        return <AboutPage />;
      default:
        return <HomePage onStartPlanning={handleStartPlanning} />;
    }
  };

  return (
    <ThemeProvider children={
      <div className="min-h-screen bg-background">
        <Navigation currentPage={currentPage} onPageChange={handlePageChange} />
        <main>
          {renderCurrentPage()}
        </main>
      </div>
    } />
  );
}
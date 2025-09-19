import React, { useState, useEffect } from 'react';
import { ThemeProvider } from './components/ThemeProvider';
import { Navigation } from './components/Navigation';
import { HomePage } from './components/HomePage';
import { InvestmentInputPage } from './components/InvestmentInputPage';
import { ResultsPage } from './components/ResultsPage';
import { AboutPage } from './components/AboutPage';
import { PersonalizedInvestmentStrategy } from './components/PersonalizedInvestmentStrategy';
import { EmailAdmin } from './components/EmailAdmin';

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
    const path = window.location.pathname.replace('/', '') || '';
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

  const handleGetExpertAdvice = () => {
    setCurrentPage('expert');
    localStorage.setItem('currentPage', 'expert');
    window.history.pushState({}, '', '/expert');
  };

  const handleBackToResults = () => {
    setCurrentPage('results');
    localStorage.setItem('currentPage', 'results');
    window.history.pushState({}, '', '/results');
  };

  const handlePageChange = (page: string) => {
    setCurrentPage(page);
    localStorage.setItem('currentPage', page);
    if (page === 'home') {
      window.history.pushState({}, '', '/');
    } else {
      window.history.pushState({}, '', `/${page}`);
    }
  };

  // Set initial URL on page load
  useEffect(() => {
    // Don't redirect root to /home, let it stay as /
  }, []);

  // Listen for URL changes (browser back/forward)
  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname.replace('/', '') || '';
      const page = path || 'home';
      if (page !== currentPage) {
        setCurrentPage(page);
        localStorage.setItem('currentPage', page);
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
        return <ResultsPage investmentData={investmentData} onGetExpertAdvice={handleGetExpertAdvice} />;
      case 'expert':
        return <PersonalizedInvestmentStrategy investmentData={investmentData} onBackToResults={handleBackToResults} />;
      case 'about':
        return <AboutPage onPageChange={handlePageChange} />;
      case 'admin':
        return <EmailAdmin />;
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
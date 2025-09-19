import React, { useState, useEffect } from 'react';
import { ThemeProvider } from './components/ThemeProvider';
import { Navigation } from './components/Navigation';
import { HomePage } from './components/HomePage';
import { InvestmentInputPage } from './components/InvestmentInputPage';
import { ResultsPage } from './components/ResultsPage';
import { AboutPage } from './components/AboutPage';
import { PersonalizedInvestmentStrategy } from './components/PersonalizedInvestmentStrategy';
import { EmailAdmin } from './components/EmailAdmin';
import { PrivacyPolicy } from './components/PrivacyPolicy';
import { ContactPage } from './components/ContactPage';
import { TermsOfService } from './components/TermsOfService';
import { Footer } from './components/Footer';

// Function to update meta tags dynamically
const updateMetaTags = (page: string, investmentData?: InvestmentData | null) => {
  const metaTags = {
    home: {
      title: 'Free Investment Calculator USA - Grow Your Money 2025',
      description: 'Plan smarter with NestValue. Compare savings, stocks, crypto, bonds & gold. See how your money grows with compound interest in the USA.',
      keywords: 'investment calculator, compound interest calculator, savings vs investment calculator, stock vs bank returns comparison, how much will 10000 grow in 10 years, best investment options USA 2025, mutual fund vs savings account returns, financial advisor online, best safe investments USA, investment growth calculator USA'
    },
    input: {
      title: 'Savings vs Investment Calculator USA | NestValue',
      description: 'Enter your balance & get forecasts. Compare banks, stocks, bonds, gold & crypto to see which investments grow your money fastest.',
      keywords: 'savings vs investment calculator, mutual fund vs bank returns USA, investment growth calculator USA, best investment options USA 2025, how much will my money grow, compound interest calculator USA'
    },
    results: {
      title: investmentData ? `If I Invest $${parseInt(investmentData.amount).toLocaleString()} in USA, How Much by ${investmentData.targetYear}? | NestValue` : 'Investment Results | NestValue',
      description: investmentData ? `Results for $${parseInt(investmentData.amount).toLocaleString()} by ${investmentData.targetYear}. Compare bank savings vs S&P 500, crypto, bonds & gold. Find the best US investment option for your money.` : 'Compare bank savings vs S&P 500, crypto, bonds & gold. Find the best US investment option for your money.',
      keywords: 'investment results, S&P 500 vs bank savings, crypto vs gold investment, best investment options USA 2025, how much will my money grow, investment growth calculator USA'
    },
    expert: {
      title: 'Personalized Investment Strategy | NestValue',
      description: 'Get expert investment advice tailored to your financial goals. Professional portfolio recommendations, risk assessment, and personalized investment strategy.',
      keywords: 'personalized investment strategy, expert investment advice, portfolio recommendations, risk assessment, financial planning USA, investment consultation'
    },
    about: {
      title: 'About NestValue | Investment Forecast Tool USA',
      description: 'Learn how NestValue uses historical data to forecast savings vs investments. Understand our assumptions, accuracy, and safe investing guidance.',
      keywords: 'about NestValue, investment forecast tool, financial planning USA, investment calculator accuracy, safe investing guidance, investment assumptions'
    },
    contact: {
      title: 'Contact Us | NestValue Investment Calculator',
      description: 'Get in touch with NestValue for investment questions, calculator support, or business inquiries. We\'re here to help with your financial planning.',
      keywords: 'contact NestValue, investment calculator support, financial planning help, investment questions, calculator assistance'
    },
    privacy: {
      title: 'Privacy Policy | NestValue Investment Calculator',
      description: 'NestValue privacy policy. Learn how we protect your personal information and data when using our investment calculator and financial planning tools.',
      keywords: 'privacy policy, data protection, personal information, investment calculator privacy, financial data security'
    },
    terms: {
      title: 'Terms of Service | NestValue Investment Calculator',
      description: 'NestValue terms of service. Read our terms and conditions for using our investment calculator and financial planning tools.',
      keywords: 'terms of service, terms and conditions, investment calculator terms, financial planning terms, user agreement'
    }
  };

  const currentMeta = metaTags[page as keyof typeof metaTags] || metaTags.home;
  
  // Update title
  document.title = currentMeta.title;
  
  // Update meta description
  const metaDescription = document.querySelector('meta[name="description"]');
  if (metaDescription) {
    metaDescription.setAttribute('content', currentMeta.description);
  }
  
  // Update meta keywords
  const metaKeywords = document.querySelector('meta[name="keywords"]');
  if (metaKeywords) {
    metaKeywords.setAttribute('content', currentMeta.keywords);
  }
  
  // Update Open Graph tags
  const ogTitle = document.querySelector('meta[property="og:title"]');
  if (ogTitle) {
    ogTitle.setAttribute('content', currentMeta.title);
  }
  
  const ogDescription = document.querySelector('meta[property="og:description"]');
  if (ogDescription) {
    ogDescription.setAttribute('content', currentMeta.description);
  }
  
  // Update Twitter tags
  const twitterTitle = document.querySelector('meta[property="twitter:title"]');
  if (twitterTitle) {
    twitterTitle.setAttribute('content', currentMeta.title);
  }
  
  const twitterDescription = document.querySelector('meta[property="twitter:description"]');
  if (twitterDescription) {
    twitterDescription.setAttribute('content', currentMeta.description);
  }
};

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

  // Update meta tags when page changes
  useEffect(() => {
    updateMetaTags(currentPage, investmentData);
  }, [currentPage, investmentData]);

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
      case 'privacy':
        return <PrivacyPolicy />;
      case 'contact':
        return <ContactPage />;
      case 'terms':
        return <TermsOfService />;
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
        <Footer onPageChange={handlePageChange} />
      </div>
    } />
  );
}
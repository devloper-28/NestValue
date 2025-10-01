import React, { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { TrendingUp, DollarSign, PiggyBank, Wifi, WifiOff, RefreshCw } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { apiService } from "../services/apiService";
import "./index.css";

interface HomePageProps {
  onStartPlanning: () => void;
}

export function HomePage({ onStartPlanning }: HomePageProps) {
  const [marketData, setMarketData] = useState(null);
  const [hasLiveData, setHasLiveData] = useState(false);
  const [timePeriod, setTimePeriod] = useState('historical');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastRefreshTime, setLastRefreshTime] = useState(null);

  // Get data based on selected time period
  const getMarketDataForPeriod = () => {
    if (!marketData?.data) return null;

    const baseData = marketData.data;
    
    // Mock data for different time periods (in real app, this would come from API)
    const periodData = {
      '1y': {
        savings: { ...baseData.savings, averageAPY: '4.8%', label: '1 Year APY' },
        sp500: { ...baseData.sp500, expectedReturn: '24.2%', label: '1 Year Return' },
        treasury10y: { ...baseData.treasury10y, yield: '4.2%', label: '1 Year Yield' },
        bitcoin: { ...baseData.bitcoin, expectedReturn: '156.3%', label: '1 Year Return' }
      },
      '5y': {
        savings: { ...baseData.savings, averageAPY: '2.1%', label: '5 Year APY' },
        sp500: { ...baseData.sp500, expectedReturn: '12.4%', label: '5 Year Return' },
        treasury10y: { ...baseData.treasury10y, yield: '2.8%', label: '5 Year Yield' },
        bitcoin: { ...baseData.bitcoin, expectedReturn: '1,248%', label: '5 Year Return' }
      },
      '10y': {
        savings: { ...baseData.savings, averageAPY: '1.2%', label: '10 Year APY' },
        sp500: { ...baseData.sp500, expectedReturn: '10.8%', label: '10 Year Return' },
        treasury10y: { ...baseData.treasury10y, yield: '2.1%', label: '10 Year Yield' },
        bitcoin: { ...baseData.bitcoin, expectedReturn: '15,847%', label: '10 Year Return' }
      },
      'historical': {
        savings: { ...baseData.savings, averageAPY: baseData.savings.averageAPY, label: 'Current APY' },
        sp500: { ...baseData.sp500, expectedReturn: baseData.sp500.expectedReturn, label: 'Historical Average' },
        treasury10y: { ...baseData.treasury10y, yield: baseData.treasury10y.yield, label: 'Current Yield' },
        bitcoin: { ...baseData.bitcoin, expectedReturn: '15%', label: 'Historical Average' }
      }
    };

    return periodData[timePeriod as keyof typeof periodData] || periodData.historical;
  };

  const currentPeriodData = getMarketDataForPeriod();

  const fetchMarketData = async (forceRefresh = false) => {
    try {
      console.log(`🔌 Fetching market data... ${forceRefresh ? '(FORCE REFRESH)' : ''}`);
      const response = await apiService.getCurrentMarketData(forceRefresh);
      console.log('📊 Market data response:', response);
      
      if (response && response.data) {
        setMarketData(response);
        // Check if the API call was successful (not fallback data)
        const isLiveData = response.success === true;
        setHasLiveData(isLiveData);
        console.log(`📡 Data source: ${isLiveData ? 'LIVE' : 'HISTORICAL'} (success: ${response.success})`);
        console.log('📅 Last updated:', response.meta?.lastUpdated);
        console.log('📊 Full response structure:', {
          success: response.success,
          hasData: !!response.data,
          hasMeta: !!response.meta,
          lastUpdated: response.meta?.lastUpdated
        });
      } else {
        console.warn('⚠️ Invalid market data response:', response);
        console.log('🔍 Response structure:', {
          hasResponse: !!response,
          hasData: response?.data,
          hasMeta: response?.meta,
          responseKeys: response ? Object.keys(response) : 'No response'
        });
      }
    } catch (error) {
      console.error('❌ Market data fetch failed:', error);
      // Don't set marketData to avoid rendering issues
    }
  };

  const handleRefresh = async () => {
    if (isRefreshing) return; // Prevent multiple simultaneous refreshes
    
    // Add cooldown period to prevent API rate limiting
    if (lastRefreshTime && Date.now() - lastRefreshTime.getTime() < 5000) {
      console.log('⏳ Refresh cooldown active - please wait 5 seconds');
      return;
    }
    
    setIsRefreshing(true);
    setLastRefreshTime(new Date());
    try {
      await fetchMarketData(true); // Force refresh
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchMarketData();
  }, []);

  return (
    <main className="min-h-screen from-blue-50 to-background dark:from-slate-900 dark:to-slate-800">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 pt-4 sm:pt-20 pb-16" aria-labelledby="hero-title">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="space-y-4">
        <h1 id="hero-title" className="text-4xl font-semibold text-foreground leading-tight">
          Free Investment Calculator USA - Grow Your Money 2025
        </h1>
              <p className="text-xl text-muted-foreground leading-relaxed">
              Plan smarter with NestValue. Compare savings, stocks, crypto, bonds & gold. See how your money grows with compound interest in the USA.
              </p>
            </div>
            
            <Button 
              onClick={onStartPlanning}
              className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white px-8 py-6 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all"
            >
              Try Our Free Investment Calculator
            </Button>
          </div>
          
          <div className="flex justify-center">
            <ImageWithFallback
              src="https://images.unsplash.com/photo-1669951584309-492ed24d274f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmaW5hbmNpYWwlMjBncm93dGglMjBjaGFydCUyMGNvaW5zfGVufDF8fHx8MTc1ODAxODY0MXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
              alt="Investment calculator showing financial growth charts, coins, and investment planning tools for S&P 500, crypto, bonds, and gold returns comparison"
              className="rounded-2xl shadow-2xl max-w-md w-full"
            />
          </div>
        </div>
      </section>

      {/* Market Performance Section */}
      {(marketData && marketData.data) ? (
        <section className="max-w-7xl mx-auto px-6 pb-12" aria-labelledby="market-performance">
          <div className="bg-card rounded-2xl shadow-lg p-6 mb-8 border">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between justify-between mb-6">
              <h2 id="market-performance" className="text-2xl font-semibold text-card-foreground mb-3 sm:mb-0">Market Performance</h2>
              <div className="flex items-center space-x-3 mobile_width">
                <select 
                  value={timePeriod}
                  onChange={(e) => setTimePeriod(e.target.value)}
                  className="px-3 py-1 border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-background text-foreground"
                >
                  <option value="1y">1 Year Returns</option>
                  <option value="5y">5 Year Returns</option>
                  <option value="10y">10 Year Returns</option>
                  <option value="historical">Historical Average</option>
                </select>
                <button
                  onClick={handleRefresh}
                  disabled={isRefreshing}
                  className="flex items-center space-x-1 px-3 py-1 text-sm text-muted-foreground hover:text-blue-600 hover:bg-blue-50 dark:hover:text-blue-400 dark:hover:bg-blue-950/30 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Refresh market data"
                >
                  <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                  <span>{isRefreshing ? 'Refreshing...' : 'Refresh'}</span>
                </button>
                <div className="flex items-center space-x-1 text-sm">
                  {hasLiveData ? (
                    <div className="flex items-center space-x-1 text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/30 px-2 py-1 rounded-full">
                      <Wifi className="w-4 h-4" />
                      <span>Live Data</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-1 text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/30 px-2 py-1 rounded-full">
                      <WifiOff className="w-4 h-4" />
                      <span>Historical Data</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="from-blue-50 to-blue-100 dark:from-blue-900 dark:to-blue-800 p-4 rounded-xl border border-blue-200 dark:border-blue-700/50">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-medium text-blue-700 dark:text-blue-300">High-Yield Savings</p>
                  <span className="text-xs text-blue-600 dark:text-blue-400 bg-blue-200 dark:bg-blue-800/50 px-2 py-1 rounded-full">APY</span>
                </div>
                <p className="text-2xl font-bold dark:text-white">{currentPeriodData?.savings?.averageAPY || '4.8%'}</p>
                <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">{currentPeriodData?.savings?.label || 'Current market rate'}</p>
              </div>
              
              <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/30 dark:to-green-800/40 p-4 rounded-xl border border-green-200 dark:border-green-700/50">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-medium text-green-700 dark:text-green-300">S&P 500</p>
                  <span className="text-xs text-green-600 dark:text-green-400 bg-green-200 dark:bg-green-800/50 px-2 py-1 rounded-full">Return</span>
                </div>
                <p className="text-2xl font-bold text-green-900 dark:text-green-100">{currentPeriodData?.sp500?.expectedReturn || '10.0%'}</p>
                <p className="text-xs text-green-600 dark:text-green-400 mt-1">{currentPeriodData?.sp500?.label || 'Historical average'}</p>
              </div>
              
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/30 dark:to-purple-800/40 p-4 rounded-xl border border-purple-200 dark:border-purple-700/50">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-medium text-purple-700 dark:text-purple-300">10-Year Treasury</p>
                  <span className="text-xs text-purple-600 dark:text-purple-400 bg-purple-200 dark:bg-purple-800/50 px-2 py-1 rounded-full">Yield</span>
                </div>
                <p className="text-2xl font-bold text-purple-900 dark:text-purple-100">{currentPeriodData?.treasury10y?.yield || '4.2%'}</p>
                <p className="text-xs text-purple-600 dark:text-purple-400 mt-1">{currentPeriodData?.treasury10y?.label || 'Government bonds'}</p>
              </div>
              
              <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900/30 dark:to-yellow-800/40 p-4 rounded-xl border border-yellow-200 dark:border-yellow-700/50">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-medium text-yellow-700 dark:text-yellow-300">₿ Bitcoin</p>
                  <span className="text-xs text-yellow-600 dark:text-yellow-400 bg-yellow-200 dark:bg-yellow-800/50 px-2 py-1 rounded-full">Return</span>
                </div>
                <p className="text-2xl font-bold text-yellow-900 dark:text-yellow-100">
                  {currentPeriodData?.bitcoin?.expectedReturn || '15%'}
                </p>
                <p className="text-xs text-yellow-600 dark:text-yellow-400 mt-1">
                  {currentPeriodData?.bitcoin?.label || 'Highly volatile'}
                  {timePeriod === 'historical' && (
                    <span className="ml-1" title="Bitcoin is highly volatile - returns can vary dramatically">
                      ⚠️
                    </span>
                  )}
                </p>
              </div>
            </div>
            
            <div className="mt-4 pt-4 border-t border-border">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>Last updated: {marketData?.meta?.lastUpdated ? new Date(marketData.meta.lastUpdated).toLocaleString() : 'Loading...'}</span>
                <span>{marketData?.meta?.cached ? 'Cached data' : 'Live data'}</span>
              </div>
            </div>
          </div>
        </section>
      ) : (
        <section className="max-w-7xl mx-auto px-6 pb-12" aria-labelledby="market-performance-loading">
          <div className="bg-card rounded-2xl shadow-lg p-6 mb-8 border">
            <div className="text-center">
              <h2 id="market-performance-loading" className="text-2xl font-semibold text-card-foreground mb-4">Market Performance</h2>
              <div className="flex items-center justify-center space-x-2 text-muted-foreground">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                <span>Loading market data...</span>
              </div>
              <p className="text-sm text-muted-foreground/70 mt-2">
                {marketData ? 'Processing data...' : 'Connecting to market APIs...'}
              </p>
            </div>
          </div>
        </section>
      )}

      {/* Educational Content Section */}
      <section className="max-w-7xl mx-auto px-6 pb-12" aria-labelledby="education-title">
        <div className="text-center mb-12">
          <h2 id="education-title" className="text-3xl font-bold text-foreground mb-4">
            Complete Investment Education Center
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Learn everything you need to know about investing in the USA. From beginner basics to advanced strategies, 
            we've got you covered with comprehensive, easy-to-understand financial education.
          </p>
        </div>

        {/* Comprehensive Investment Guide */}
        <div className="mb-16">
          <Card className="p-8 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 border-green-200 dark:border-green-800">
            <h3 className="text-3xl font-bold text-green-900 dark:text-green-100 mb-6">The Complete Guide to Building Wealth in 2025</h3>
            <div className="space-y-6 text-green-800 dark:text-green-200">
              <div>
                <h4 className="text-xl font-semibold mb-3">Why Most Americans Struggle with Wealth Building</h4>
                <p className="mb-4">
                  According to recent studies, 64% of Americans live paycheck to paycheck, and only 39% have enough savings 
                  to cover a $1,000 emergency. The primary reason? Most people keep their money in low-yield savings accounts 
                  that barely keep up with inflation, effectively losing purchasing power over time.
                </p>
                <p className="mb-4">
                  The solution isn't working harder or earning more - it's making your money work for you through smart 
                  investments. This comprehensive guide will show you exactly how to transform your financial future.
                </p>
              </div>
              
              <div>
                <h4 className="text-xl font-semibold mb-3">The Power of Compound Interest: Your Secret Weapon</h4>
                <p className="mb-4">
                  Albert Einstein called compound interest "the eighth wonder of the world." Here's why: If you invest 
                  $10,000 at age 25 and earn 7% annually (the historical S&P 500 average), you'll have $149,744 by age 65. 
                  But if you wait until age 35 to start, you'll only have $76,123 - less than half!
                </p>
                <p className="mb-4">
                  The key is starting early and staying consistent. Even small monthly contributions can grow into 
                  substantial wealth over time. Our investment calculator shows you exactly how much your money can grow 
                  with different investment strategies.
                </p>
              </div>

              <div>
                <h4 className="text-xl font-semibold mb-3">Investment Options Explained: From Safe to Aggressive</h4>
                <div className="grid md:grid-cols-2 gap-6 mt-4">
                  <div className="bg-white/50 dark:bg-green-900/20 p-4 rounded-lg">
                    <h5 className="font-semibold text-green-900 dark:text-green-100 mb-2">Conservative Investments</h5>
                    <ul className="text-sm space-y-1">
                      <li>• High-yield savings accounts (4-5% APY)</li>
                      <li>• Money market accounts (4-5% APY)</li>
                      <li>• CDs and Treasury bills (4-5% APY)</li>
                      <li>• Government bonds (4-5% APY)</li>
                    </ul>
                  </div>
                  <div className="bg-white/50 dark:bg-green-900/20 p-4 rounded-lg">
                    <h5 className="font-semibold text-green-900 dark:text-green-100 mb-2">Growth Investments</h5>
                    <ul className="text-sm space-y-1">
                      <li>• S&P 500 index funds (7-10% historical)</li>
                      <li>• Total stock market funds (7-10% historical)</li>
                      <li>• REITs and dividend stocks (6-8% historical)</li>
                      <li>• International index funds (6-9% historical)</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 mb-12" style={{ marginTop: '32px' }}>
          {/* Investment Basics */}
          <Card  className="p-8  from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 border-blue-200 dark:border-blue-800">
            <h3 className="text-2xl font-bold text-blue-900 dark:text-blue-100 mb-6">Investment Basics for Beginners</h3>
            <div className="space-y-4 text-blue-800 dark:text-blue-200">
              <div>
                <h4 className="font-semibold text-lg mb-2">What is Investing?</h4>
                <p className="text-sm mb-3">
                  Investing is putting your money to work to earn more money over time. Instead of keeping cash in a savings account 
                  earning minimal interest, you can invest in assets that historically grow in value.
                </p>
              </div>
              
              <div>
                <h4 className="font-semibold text-lg mb-2">Types of Investments</h4>
                <ul className="text-sm space-y-2">
                  <li>• <strong>Stocks:</strong> Ownership shares in companies (S&P 500, individual stocks)</li>
                  <li>• <strong>Bonds:</strong> Loans to governments or corporations (Treasury bonds, corporate bonds)</li>
                  <li>• <strong>Real Estate:</strong> Physical property or REITs (Real Estate Investment Trusts)</li>
                  <li>• <strong>Commodities:</strong> Gold, silver, oil, agricultural products</li>
                  <li>• <strong>Cryptocurrency:</strong> Digital currencies like Bitcoin and Ethereum</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold text-lg mb-2">Risk vs Return</h4>
                <p className="text-sm">
                  Generally, higher potential returns come with higher risk. Understanding your risk tolerance is crucial 
                  for building a successful investment portfolio that matches your financial goals and timeline.
                </p>
              </div>
            </div>
          </Card>

          {/* Market Performance Guide */}
          <Card className="p-8 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 border-green-200 dark:border-green-800">
            <h3 className="text-2xl font-bold text-green-900 dark:text-green-100 mb-6">Understanding Market Performance</h3>
            <div className="space-y-4 text-green-800 dark:text-green-200">
              <div>
                <h4 className="font-semibold text-lg mb-2">Historical Returns (1926-2023)</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="bg-white/50 dark:bg-gray-800/50 p-3 rounded-lg">
                    <h5 className="font-semibold text-green-700 dark:text-green-300">S&P 500</h5>
                    <p className="text-2xl font-bold">10.2%</p>
                    <p className="text-xs">Annual average return</p>
                  </div>
                  <div className="bg-white/50 dark:bg-gray-800/50 p-3 rounded-lg">
                    <h5 className="font-semibold text-green-700 dark:text-green-300">10-Year Treasury</h5>
                    <p className="text-2xl font-bold">5.2%</p>
                    <p className="text-xs">Annual average return</p>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold text-lg mb-2">Why S&P 500 Outperforms</h4>
                <ul className="text-sm space-y-1">
                  <li>• <strong>Diversification:</strong> 500 largest US companies across all sectors</li>
                  <li>• <strong>Economic Growth:</strong> Benefits from overall US economic expansion</li>
                  <li>• <strong>Reinvestment:</strong> Dividends and capital gains compound over time</li>
                  <li>• <strong>Innovation:</strong> Includes companies driving technological advancement</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold text-lg mb-2">Market Volatility</h4>
                <p className="text-sm">
                  Markets go up and down in the short term, but historically trend upward over long periods. 
                  The key is staying invested through market cycles rather than trying to time the market.
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Investment Strategies */}
        <Card className="p-8 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20 border-purple-200 dark:border-purple-800 mb-12">
          <h3 className="text-2xl font-bold text-purple-900 dark:text-purple-100 mb-6 text-center">Proven Investment Strategies</h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-purple-600">1</span>
              </div>
              <h4 className="font-semibold text-lg mb-2 text-purple-900 dark:text-purple-100">Dollar-Cost Averaging</h4>
              <p className="text-sm text-purple-800 dark:text-purple-200">
                Invest a fixed amount regularly regardless of market conditions. This reduces the impact of market volatility 
                and helps you buy more shares when prices are low.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-purple-600">2</span>
              </div>
              <h4 className="font-semibold text-lg mb-2 text-purple-900 dark:text-purple-100">Asset Allocation</h4>
              <p className="text-sm text-purple-800 dark:text-purple-200">
                Divide your investments among different asset classes (stocks, bonds, cash) based on your age, 
                risk tolerance, and time horizon. Rebalance periodically.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-purple-600">3</span>
              </div>
              <h4 className="font-semibold text-lg mb-2 text-purple-900 dark:text-purple-100">Long-Term Focus</h4>
              <p className="text-sm text-purple-800 dark:text-purple-200">
                Stay invested for the long term. Time in the market beats timing the market. 
                Historical data shows that staying invested through market cycles leads to better returns.
              </p>
            </div>
          </div>
        </Card>

        {/* Features Section */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-foreground mb-4">Our Investment Tools</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Use our advanced calculators and tools to make informed investment decisions based on real market data and proven strategies.
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          <Card className="p-8 text-center space-y-4 bg-card shadow-lg hover:shadow-xl transition-shadow border">
            <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto">
              <TrendingUp className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold text-card-foreground">Investment Growth Calculator USA</h3>
            <p className="text-muted-foreground">
              Advanced compound interest calculator with real US market data. Compare bank savings vs S&P 500 returns and see how much your money will grow over time.
            </p>
          </Card>

          <Card className="p-8 text-center space-y-4 bg-card shadow-lg hover:shadow-xl transition-shadow border">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto">
              <DollarSign className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold text-card-foreground">Best Investment Options USA 2025</h3>
            <p className="text-muted-foreground">
              Compare S&P 500 vs bank savings, mutual funds vs savings account returns, crypto vs bonds. Find the best safe investments in US for your risk profile.
            </p>
          </Card>

          <Card className="p-8 text-center space-y-4 bg-card shadow-lg hover:shadow-xl transition-shadow border">
            <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mx-auto">
              <PiggyBank className="w-8 h-8 text-purple-600" />
            </div>
            <h3 className="text-xl font-semibold text-card-foreground">Financial Advisor Online</h3>
            <p className="text-muted-foreground">
              Get personalized investment advice for Americans. Conservative, moderate, or aggressive strategies. See how risk affects your returns and plan your financial future.
            </p>
          </Card>
        </div>
      </section>

      {/* Blog-Style Articles Section */}
      <section className="max-w-7xl mx-auto px-6 pb-20" aria-labelledby="articles-title">
        <div className="text-center mb-12 mt-4">
          <h2 id="articles-title" className="text-3xl font-bold text-foreground mb-4">
            Latest Investment Insights & Articles
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Stay informed with our comprehensive guides, market analysis, and expert insights to help you make better investment decisions.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          {/* Featured Article */}
          <Card className="lg:col-span-2  from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 border-blue-200 dark:border-blue-800 overflow-hidden">
            <div className="md:flex">
              <div className="md:w-1/3 bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 p-8 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <TrendingUp className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-blue-900 dark:text-blue-100">Featured Article</h3>
                </div>
              </div>
              <div className="md:w-2/3 p-8">
                <h3 className="text-2xl font-bold text-blue-900 dark:text-blue-100 mb-4">
                  How to Build a $1 Million Investment Portfolio: A Step-by-Step Guide for 2025
                </h3>
                <p className="text-blue-800 dark:text-blue-200 mb-4">
                  Discover the proven strategies used by successful investors to build wealth over time. Learn about asset allocation, 
                  dollar-cost averaging, and the power of compound interest in creating long-term wealth.
                </p>
                  <div className="flex items-center space-x-4 text-sm text-blue-600 dark:text-blue-400">
                    <span>📅 January 2025</span>
                    <span>⏱️ 8 min read</span>
                    <span>👁️ 2.3k views</span>
                  </div>
              </div>
            </div>
          </Card>

          {/* Article 1 */}
          <Card className="bg-card shadow-lg hover:shadow-xl transition-shadow border">
            <div className="p-6">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-4 h-4 rounded-full flex-shrink-0 shadow-sm" style={{backgroundColor: '#10b981'}}></div>
                <span className="text-sm text-green-600 font-medium">Market Analysis</span>
              </div>
              <h3 className="text-xl font-bold text-foreground mb-3">
                S&P 500 vs Bank Savings: Which is Better for Your Money in 2025?
              </h3>
              <p className="text-muted-foreground mb-4 text-sm">
                A comprehensive comparison of traditional bank savings versus S&P 500 index funds. 
                We analyze historical returns, risk factors, and when each option makes sense for different investors.
              </p>
              <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                <span>📅 December 2024</span>
                <span>⏱️ 6 min read</span>
              </div>
            </div>
          </Card>

          {/* Article 2 */}
          <Card className="bg-card shadow-lg hover:shadow-xl transition-shadow border">
            <div className="p-6">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-4 h-4 rounded-full flex-shrink-0 shadow-sm" style={{backgroundColor: '#8b5cf6'}}></div>
                <span className="text-sm text-purple-600 font-medium">Investment Strategy</span>
              </div>
              <h3 className="text-xl font-bold text-foreground mb-3">
                The Complete Guide to Dollar-Cost Averaging: Build Wealth Consistently
              </h3>
              <p className="text-muted-foreground mb-4 text-sm">
                Learn how dollar-cost averaging can help you build wealth regardless of market conditions. 
                Discover the psychology behind this strategy and how to implement it effectively.
              </p>
              <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                <span>📅 December 2024</span>
                <span>⏱️ 7 min read</span>
              </div>
            </div>
          </Card>

          {/* Article 3 */}
          <Card className="bg-card shadow-lg hover:shadow-xl transition-shadow border">
            <div className="p-6">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-4 h-4 rounded-full flex-shrink-0 shadow-sm" style={{backgroundColor: '#f97316'}}></div>
                <span className="text-sm text-orange-600 font-medium">Risk Management</span>
              </div>
              <h3 className="text-xl font-bold text-foreground mb-3">
                Understanding Investment Risk: How to Protect Your Portfolio
              </h3>
              <p className="text-muted-foreground mb-4 text-sm">
                Everything you need to know about investment risk, from market volatility to diversification strategies. 
                Learn how to assess your risk tolerance and build a balanced portfolio.
              </p>
              <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                <span>📅 November 2024</span>
                <span>⏱️ 9 min read</span>
              </div>
            </div>
          </Card>

          {/* Article 4 */}
          <Card className="bg-card shadow-lg hover:shadow-xl transition-shadow border">
            <div className="p-6">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-4 h-4 rounded-full flex-shrink-0 shadow-sm" style={{backgroundColor: '#3b82f6'}}></div>
                <span className="text-sm text-blue-600 font-medium">Beginner Guide</span>
              </div>
              <h3 className="text-xl font-bold text-foreground mb-3">
                Investment Calculator: How Much Will $10,000 Grow in 10 Years?
              </h3>
              <p className="text-muted-foreground mb-4 text-sm">
                Use our investment calculator to see how different investment strategies can grow your money over time. 
                Compare bank savings, S&P 500, bonds, and crypto returns with real examples.
              </p>
              <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                <span>📅 November 2024</span>
                <span>⏱️ 5 min read</span>
              </div>
            </div>
          </Card>
        </div>

        {/* Advanced Investment Strategies */}
        <div className="mb-16">
          <Card className="p-8 bg-gradient-to-br from-purple-50 to-violet-50 dark:from-purple-950/20 dark:to-violet-950/20 border-purple-200 dark:border-purple-800">
            <h3 className="text-3xl font-bold text-purple-900 dark:text-purple-100 mb-6">Advanced Investment Strategies for 2025</h3>
            <div className="space-y-6 text-purple-800 dark:text-purple-200">
              <div>
                <h4 className="text-xl font-semibold mb-3">Dollar-Cost Averaging: The Smart Investor's Secret</h4>
                <p className="mb-4">
                  Dollar-cost averaging (DCA) involves investing a fixed amount regularly, regardless of market conditions. 
                  This strategy reduces the impact of market volatility and often results in better average purchase prices 
                  over time. For example, investing $500 monthly in an S&P 500 index fund automatically buys more shares 
                  when prices are low and fewer when prices are high.
                </p>
                <p className="mb-4">
                  Studies show that DCA investors often outperform lump-sum investors because it removes emotion from 
                  investment decisions and ensures consistent participation in market growth.
                </p>
              </div>
              
              <div>
                <h4 className="text-xl font-semibold mb-3">Asset Allocation: The Foundation of Wealth Building</h4>
                <p className="mb-4">
                  The right asset allocation can account for 90% of your investment returns. A common rule is the "100 minus age" 
                  rule: subtract your age from 100 to determine your stock allocation percentage. For example, a 30-year-old 
                  might allocate 70% to stocks and 30% to bonds.
                </p>
                <div className="bg-white/50 dark:bg-purple-900/20 p-4 rounded-lg mt-4">
                  <h5 className="font-semibold text-purple-900 dark:text-purple-100 mb-2">Sample Asset Allocations by Age:</h5>
                  <ul className="text-sm space-y-1">
                    <li>• 20s: 80% stocks, 20% bonds (aggressive growth)</li>
                    <li>• 30s: 70% stocks, 30% bonds (growth-focused)</li>
                    <li>• 40s: 60% stocks, 40% bonds (balanced)</li>
                    <li>• 50s: 50% stocks, 50% bonds (conservative growth)</li>
                    <li>• 60+: 40% stocks, 60% bonds (income-focused)</li>
                  </ul>
                </div>
              </div>

              <div>
                <h4 className="text-xl font-semibold mb-3">Tax-Efficient Investing Strategies</h4>
                <p className="mb-4">
                  Maximizing tax efficiency can significantly boost your long-term returns. Key strategies include:
                </p>
                <ul className="list-disc list-inside space-y-2 text-sm">
                  <li>Maximize 401(k) and IRA contributions (up to $23,000 and $7,000 respectively in 2024)</li>
                  <li>Use Roth accounts for tax-free growth if you expect higher taxes in retirement</li>
                  <li>Hold tax-efficient index funds in taxable accounts</li>
                  <li>Consider municipal bonds for high-income investors</li>
                  <li>Use tax-loss harvesting to offset capital gains</li>
                </ul>
              </div>
            </div>
          </Card>
        </div>

        {/* Market Analysis and Trends */}
        <div className="mb-16">
          <Card className="p-8 bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-950/20 dark:to-red-950/20 border-orange-200 dark:border-orange-800">
            <h3 className="text-3xl font-bold text-orange-900 dark:text-orange-100 mb-6">2025 Market Outlook and Investment Trends</h3>
            <div className="space-y-6 text-orange-800 dark:text-orange-200">
              <div>
                <h4 className="text-xl font-semibold mb-3">Current Market Conditions and What They Mean for Investors</h4>
                <p className="mb-4">
                  As we enter 2025, investors face a complex landscape with both opportunities and challenges. Interest rates 
                  have stabilized after the Federal Reserve's aggressive tightening cycle, creating new opportunities in 
                  fixed-income investments while maintaining attractive yields in high-yield savings accounts.
                </p>
                <p className="mb-4">
                  The stock market continues to show resilience despite economic uncertainties, with the S&P 500 maintaining 
                  its long-term upward trend. However, increased volatility means investors should focus on diversification 
                  and long-term strategies rather than short-term market timing.
                </p>
              </div>
              
              <div>
                <h4 className="text-xl font-semibold mb-3">Emerging Investment Opportunities</h4>
                <div className="grid md:grid-cols-2 gap-6 mt-4">
                  <div className="bg-white/50 dark:bg-orange-900/20 p-4 rounded-lg">
                    <h5 className="font-semibold text-orange-900 dark:text-orange-100 mb-2">Technology and AI</h5>
                    <p className="text-sm mb-2">Artificial intelligence and automation continue to drive innovation across industries.</p>
                    <p className="text-xs text-orange-700 dark:text-orange-300">Consider: Tech ETFs, AI-focused funds, automation stocks</p>
                  </div>
                  <div className="bg-white/50 dark:bg-orange-900/20 p-4 rounded-lg">
                    <h5 className="font-semibold text-orange-900 dark:text-orange-100 mb-2">Sustainable Investing</h5>
                    <p className="text-sm mb-2">ESG (Environmental, Social, Governance) investing is gaining mainstream acceptance.</p>
                    <p className="text-xs text-orange-700 dark:text-orange-300">Consider: ESG ETFs, renewable energy funds, sustainable companies</p>
                  </div>
                  <div className="bg-white/50 dark:bg-orange-900/20 p-4 rounded-lg">
                    <h5 className="font-semibold text-orange-900 dark:text-orange-100 mb-2">Real Estate</h5>
                    <p className="text-sm mb-2">REITs offer exposure to real estate without direct property ownership.</p>
                    <p className="text-xs text-orange-700 dark:text-orange-300">Consider: REIT ETFs, real estate crowdfunding, REIT mutual funds</p>
                  </div>
                  <div className="bg-white/50 dark:bg-orange-900/20 p-4 rounded-lg">
                    <h5 className="font-semibold text-orange-900 dark:text-orange-100 mb-2">International Markets</h5>
                    <p className="text-sm mb-2">Diversification beyond US markets can reduce risk and capture global growth.</p>
                    <p className="text-xs text-orange-700 dark:text-orange-300">Consider: International ETFs, emerging market funds, global index funds</p>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* FAQ Section */}
        <Card className="bg-gradient-to-r from-gray-50 to-blue-50 dark:from-gray-900/20 dark:to-blue-950/20 border-gray-200 dark:border-gray-800">
          <div className="p-8">
            <h3 className="text-2xl font-bold text-foreground mb-6 text-center">Frequently Asked Questions</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-foreground mb-2">How much should I invest vs keep in savings?</h4>
                  <p className="text-sm text-muted-foreground">
                    Keep 3-6 months of expenses in high-yield savings for emergencies, then invest the rest based on your risk tolerance and timeline.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-2">What's the difference between stocks and bonds?</h4>
                  <p className="text-sm text-muted-foreground">
                    Stocks represent ownership in companies (higher risk/reward), while bonds are loans to governments or corporations (lower risk/return).
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-2">Is cryptocurrency a good investment?</h4>
                  <p className="text-sm text-muted-foreground">
                    Crypto is highly volatile and speculative. Only invest what you can afford to lose, and consider it a small portion of a diversified portfolio.
                  </p>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-foreground mb-2">How do I start investing with little money?</h4>
                  <p className="text-sm text-muted-foreground">
                    Start with low-cost index funds or ETFs. Many platforms allow you to start with as little as $25-100 and offer fractional shares.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-2">Should I invest in individual stocks or index funds?</h4>
                  <p className="text-sm text-muted-foreground">
                    For most investors, index funds are better due to diversification and lower costs. Individual stocks require more research and carry higher risk.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-2">When should I rebalance my portfolio?</h4>
                  <p className="text-sm text-muted-foreground">
                    Rebalance annually or when your asset allocation drifts more than 5% from your target. This helps maintain your desired risk level.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </section>

    </main>
  );
}
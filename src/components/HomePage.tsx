import React, { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { TrendingUp, DollarSign, PiggyBank, Wifi, WifiOff, RefreshCw } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { apiService } from "../services/apiService";
import "./homePage.css";

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
                Free Investment Calculator USA — Grow Your Money 2025
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed">
              Free USA investment calculator. Compare savings vs investments. See how S&P 500, bonds, gold & crypto grow your money with compound interest.
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
                  <div className="flex items-center space-x-1">
                    <span className="text-xs text-yellow-600 dark:text-yellow-400 bg-yellow-200 dark:bg-yellow-800/50 px-2 py-1 rounded-full">Return</span>
                    {marketData?.meta?.apiStatus?.bitcoin === 'error' && (
                      <span className="text-xs text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/50 px-2 py-1 rounded-full" title="API temporarily unavailable">
                        ⚠️
                      </span>
                    )}
                  </div>
                </div>
                <p className="text-2xl font-bold text-yellow-900 dark:text-yellow-100">
                  {currentPeriodData?.bitcoin?.expectedReturn || 'Volatile'}
                </p>
                <p className="text-xs text-yellow-600 dark:text-yellow-400 mt-1">
                  {marketData?.meta?.apiStatus?.bitcoin === 'error' 
                    ? 'API temporarily down - using fallback' 
                    : currentPeriodData?.bitcoin?.label || 'Highly volatile'
                  }
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

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-6 pb-20" aria-labelledby="features-title">
        <h2 id="features-title" className="sr-only">Investment Calculator Features</h2>
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
            <h3 className="text-xl font-semibold text-card-foreground">AI Financial Advisor Online</h3>
            <p className="text-muted-foreground">
              Get personalized investment advice for Americans. Conservative, moderate, or aggressive strategies. See how risk affects your returns and plan your financial future.
            </p>
          </Card>
        </div>
      </section>
    </main>
  );
}
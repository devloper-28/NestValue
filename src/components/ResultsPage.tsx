import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Download, TrendingUp, TrendingDown, DollarSign, Loader2, Wifi, WifiOff } from "lucide-react";
import { investmentOptions, generateProjectionData, calculateBestWorstCase, adjustReturnForRisk } from "../utils/calculations";
import { apiService } from "../services/apiService";

interface ResultsPageProps {
  investmentData: {
    totalBalance: string;
    amount: string;
    monthlyContribution: string;
    targetYear: string;
    riskProfile: string;
  } | null;
  onGetExpertAdvice?: () => void;
}

export function ResultsPage({ investmentData, onGetExpertAdvice }: ResultsPageProps) {
  const [backendData, setBackendData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [usingBackend, setUsingBackend] = useState(false);
  
  // Handle case where investmentData is null
  const principal = investmentData ? parseFloat(investmentData.amount) : 0;
  const monthlyContribution = investmentData ? parseFloat(investmentData.monthlyContribution) || 0 : 0;
  const targetYear = investmentData ? parseInt(investmentData.targetYear) : new Date().getFullYear() + 10;
  const currentYear = new Date().getFullYear();
  const years = targetYear - currentYear;

  // Try to get data from backend, fallback to local calculations
  useEffect(() => {
    if (!investmentData) {
      setLoading(false);
      return;
    }

    const fetchBackendData = async () => {
      setLoading(true);
      try {
        console.log('🔌 Attempting to use backend API...');
        const result = await apiService.calculateProjections(investmentData);
        console.log('✅ Backend API success:', result);
        
        if (result && result.data) {
          setBackendData(result);
          setUsingBackend(true);
        } else {
          console.warn('⚠️ Invalid backend response, using local calculations');
          setUsingBackend(false);
        }
      } catch (error) {
        console.warn('❌ Backend API failed, using local calculations:', error);
        setUsingBackend(false);
      } finally {
        setLoading(false);
      }
    };

    fetchBackendData();
  }, [investmentData]);

  // Use backend data if available, otherwise local calculations
  let projectionData = backendData?.data?.yearlyProjections || 
    (investmentData ? generateProjectionData(principal, monthlyContribution, years, investmentData.riskProfile) : []);
  
  // Map backend data to frontend expected format
  if (backendData?.data?.yearlyProjections) {
    projectionData = backendData.data.yearlyProjections.map((item: any) => ({
      year: item.year,
      'Bank': item.bank,
      'Bonds': item.bonds,
      'Stocks (S&P 500)': item.stocks,
      'Gold': item.gold,
      'Crypto': item.crypto,
      'Diversified Portfolio': item.diversified
    }));
  }
  
  // Debug: Log projection data to console
  console.log('📊 Projection Data:', projectionData);
  console.log('📊 Data length:', projectionData?.length);
  console.log('📊 First item:', projectionData?.[0]);
  
  const comparisonData = backendData?.data?.projections ? 
    Object.entries(backendData.data.projections).map(([name, data]: [string, any]) => {
      // Map backend names to frontend names
      const nameMapping: { [key: string]: string } = {
        'bank': 'Bank',
        'bonds': 'Bonds', 
        'stocks': 'Stocks (S&P 500)',
        'gold': 'Gold',
        'crypto': 'Crypto',
        'diversified': 'Diversified Portfolio'
      };
      
      const displayName = nameMapping[name] || name.charAt(0).toUpperCase() + name.slice(1);
      
      return {
        option: displayName,
        projectedValue: data.projectedValue,
        annualReturn: data.expectedReturn,
        bestCase: backendData.data.scenarios[name]?.best || 0,
        worstCase: backendData.data.scenarios[name]?.worst || 0,
        color: investmentOptions.find(opt => opt.name === displayName)?.color || '#8884d8'
      };
    }) :
    (investmentData ? investmentOptions.map(option => {
    const adjustedReturn = adjustReturnForRisk(option.expectedReturn, investmentData.riskProfile);
      const finalValue = projectionData[projectionData.length - 1]?.[option.name] || 0;
    const scenarios = calculateBestWorstCase(principal, monthlyContribution, years, option, investmentData.riskProfile);
    
    return {
      option: option.name,
      projectedValue: finalValue,
      annualReturn: (adjustedReturn * 100).toFixed(1) + '%',
      bestCase: scenarios.best,
      worstCase: scenarios.worst,
      color: option.color
    };
    }) : []);

  const handleExport = (format: 'pdf' | 'csv') => {
    // Mock export functionality
    alert(`Exporting results as ${format.toUpperCase()}... (Feature coming soon!)`);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const totalInvested = principal + (monthlyContribution * 12 * years);
  const bestPerformer = comparisonData.length > 0 ? 
    comparisonData.reduce((prev, current) => 
    prev.projectedValue > current.projectedValue ? prev : current
    ) : 
    { option: 'N/A', projectedValue: 0, annualReturn: '0%', bestCase: 0, worstCase: 0, color: '#8884d8' };
  
  // Debug: Log comparison data
  console.log('📊 Comparison Data:', comparisonData);
  console.log('📊 Best Performer:', bestPerformer);

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-lg text-gray-600">Calculating your investment projections...</p>
          <p className="text-sm text-gray-500 mt-2">Connecting to market data APIs</p>
        </div>
      </div>
    );
  }

  // Show skeleton page if no data
  if (!investmentData) {
    return (
      <div className="min-h-screen bg-background py-12">
        <div className="max-w-7xl mx-auto px-6">
          {/* Header Skeleton - matches real page */}
          <div className="text-center mb-12">
            <h1 className="text-3xl font-semibold text-foreground mb-4">
              Investment Forecast
            </h1>
            <p className="text-xl text-muted-foreground">
              Based on your <span className=" rounded py-1">$0</span> initial investment
              <span className=" rounded px-2 py-1 ">$0 monthly contributions</span>
              {' '}until <span className=" rounded px-2 py-1">2035</span>
            </p>
            <div className="mt-4 inline-flex items-center px-3 py-1 rounded-full text-sm  text-muted-foreground">
              <span className="w-2 h-2 -foreground rounded-full mr-2"></span>
              No data available - please fill out the form
            </div>
            
            {/* Backend Status Indicator Skeleton */}
            <div className="flex items-center justify-center mt-4">
              <div className="flex items-center space-x-2 text-muted-foreground  px-3 py-1 rounded-full">
                <div className="w-4 h-4 -foreground/50 rounded"></div>
                <span className="text-sm font-medium">Loading market data...</span>
              </div>
            </div>
          </div>

          {/* Investment Summary Skeleton - matches real page */}
          <Card className="from-blue-50 to-green-50 dark:from-blue-950/20 dark:to-green-950/20 border-blue-200 dark:border-blue-800 mb-8">
            <CardContent className="p-6">
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground mb-1">Total Available Balance</p>
                  <p className="text-2xl font-bold text-foreground">
                    <span className=" rounded px-3 py-1">$0</span>
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-muted-foreground mb-1">Amount Investing</p>
                  <p className="text-2xl font-bold text-blue-600">
                    <span className=" rounded px-3 py-1">$0</span>
                  </p>
                  <p className="text-xs text-muted-foreground">(0% of balance)</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-muted-foreground mb-1">Remaining Balance</p>
                  <p className="text-2xl font-bold text-foreground">
                    <span className=" rounded px-3 py-1">$0</span>
                  </p>
                  <p className="text-xs text-muted-foreground">Available for other uses</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Key Metrics Skeleton - matches real page */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <Card className="bg-card shadow-lg border">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Total Invested</p>
                    <p className="text-2xl font-semibold text-foreground">
                      <span className=" rounded px-2 py-1">$0</span>
                    </p>
                  </div>
                  <DollarSign className="w-8 h-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>
            <Card className="bg-card shadow-lg border">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Best Projected Return</p>
                    <p className="text-2xl font-semibold text-green-600">
                      <span className=" rounded px-2 py-1">$0</span>
                    </p>
                    <p className="text-sm text-muted-foreground">
                      <span className=" rounded px-2 py-1">N/A</span>
                    </p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-green-600" />
                </div>
              </CardContent>
            </Card>
            <Card className="bg-card shadow-lg border">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Investment Period</p>
                    <p className="text-2xl font-semibold text-foreground">
                      <span className=" rounded px-2 py-1">0 years</span>
                    </p>
                    <p className="text-sm text-muted-foreground">Risk: <span className=" rounded px-1">moderate</span></p>
                  </div>
                  <TrendingDown className="w-8 h-8 text-purple-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Projection Chart Skeleton - matches real page */}
          <Card className="mb-8 shadow-lg border">
            <CardHeader>
              <CardTitle>Projected Growth Over Time</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-96">
                <div className="h-full  rounded-lg flex items-center justify-center">
                  <div className="text-center text-muted-foreground">
                    <div className="w-16 h-16 -foreground/20 rounded-full mx-auto mb-4 flex items-center justify-center">
                      <TrendingUp className="w-8 h-8 text-muted-foreground/50" />
                    </div>
                    <p className="text-lg font-medium">Chart will appear here</p>
                    <p className="text-sm">Complete the form to see your projections</p>
                    <div className="mt-4 text-xs text-muted-foreground/70">
                      <p>Principal: <span className=" rounded px-1">$0</span></p>
                      <p>Years: <span className=" rounded px-1">0</span></p>
                      <p>Risk Profile: <span className=" rounded px-1">moderate</span></p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Comparison Table Skeleton - matches real page */}
          <Card className="mb-8 shadow-lg border">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Investment Options Comparison</CardTitle>
              <div className="flex space-x-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  disabled
                  className="flex items-center space-x-2 opacity-50"
                >
                  <Download className="w-4 h-4" />
                  <span>Export CSV</span>
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  disabled
                  className="flex items-center space-x-2 opacity-50"
                >
                  <Download className="w-4 h-4" />
                  <span>Export PDF</span>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Investment Option</TableHead>
                    <TableHead>Expected Annual Return</TableHead>
                    <TableHead>Projected Value (2035)</TableHead>
                    <TableHead>Best Case</TableHead>
                    <TableHead>Worst Case</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {['Bank', 'Bonds', 'Stocks (S&P 500)', 'Gold', 'Crypto', 'Diversified Portfolio'].map((option, i) => (
                    <TableRow key={option}>
                      <TableCell className="font-medium">{option}</TableCell>
                      <TableCell>
                        <span className=" rounded px-2 py-1">0.0%</span>
                      </TableCell>
                      <TableCell className="font-semibold text-green-600">
                        <span className=" rounded px-2 py-1">$0</span>
                      </TableCell>
                      <TableCell className="text-green-600">
                        <span className=" rounded px-2 py-1">$0</span>
                      </TableCell>
                      <TableCell className="text-red-600">
                        <span className=" rounded px-2 py-1">$0</span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Best/Worst Case Cards Skeleton - matches real page */}
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 shadow-lg">
              <CardHeader>
                <CardTitle className="text-green-800 dark:text-green-200 flex items-center space-x-2">
                  <TrendingUp className="w-5 h-5" />
                  <span>Best Case Scenario</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-green-700 dark:text-green-300 mb-4">
                  If markets perform better than expected, your best-performing investment 
                  (<span className=" rounded px-1">N/A</span>) could reach:
                </p>
                <p className="text-3xl font-semibold text-green-800 dark:text-green-200">
                  <span className=" rounded px-3 py-1">$0</span>
                </p>
                <p className="text-sm text-green-600 dark:text-green-400 mt-2">
                  Potential gain: <span className=" rounded px-1">$0</span>
                </p>
              </CardContent>
            </Card>

            <Card className="bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 shadow-lg">
              <CardHeader>
                <CardTitle className="text-red-800 dark:text-red-200 flex items-center space-x-2">
                  <TrendingDown className="w-5 h-5" />
                  <span>Worst Case Scenario</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-red-700 dark:text-red-300 mb-4">
                  If markets underperform, your investments could face challenges. 
                  Even in worst case, diversification helps:
                </p>
                <p className="text-3xl font-semibold text-red-800 dark:text-red-200">
                  <span className=" rounded px-3 py-1">$0</span>
                </p>
                <p className="text-sm text-red-600 dark:text-red-400 mt-2">
                  This represents the lowest projected outcome
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8 sm:py-12" style={{ paddingBottom: '48px' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-8 sm:mb-12">
          <h1  className="mt-4 text-2xl sm:text-3xl lg:text-4xl font-semibold text-foreground mb-3 sm:mb-4">
            If I Invest {formatCurrency(principal)} in USA, How Much by {targetYear}? | NestValue
          </h1>
          <p className="text-base sm:text-lg lg:text-xl text-muted-foreground">
            Results for {formatCurrency(principal)} by {targetYear}. Compare bank savings vs S&P 500, crypto, bonds & gold. Find the best US investment option for your money.
            {monthlyContribution > 0 && ` Plus ${formatCurrency(monthlyContribution)} monthly contributions.`}
          </p>
          <div className="mt-4 inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200">
            <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
            Data restored from previous session
          </div>
          
          {/* Backend Status Indicator */}
          <div className="flex items-center justify-center mt-4">
            {usingBackend ? (
              <div className="flex items-center space-x-2 text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/30 px-3 py-1 rounded-full">
                <Wifi className="w-4 h-4" />
                <span className="text-sm font-medium">Live Market Data</span>
              </div>
            ) : (
              <div className="flex items-center space-x-2 text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/30 px-3 py-1 rounded-full">
                <WifiOff className="w-4 h-4" />
                <span className="text-sm font-medium">Using Historical Averages</span>
              </div>
            )}
          </div>
        </div>

        {/* Investment Summary */}
        <Card className="from-blue-50 to-green-50 dark:from-blue-950/20 dark:to-green-950/20 border-blue-200 dark:border-blue-800 mb-8">
          <CardContent className="p-6">
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-1">Total Available Balance</p>
                <p className="text-2xl font-bold text-foreground">${parseFloat(investmentData.totalBalance).toLocaleString()}</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-1">Amount Investing</p>
                <p className="text-2xl font-bold text-blue-600">{formatCurrency(principal)}</p>
                <p className="text-xs text-muted-foreground">({((principal / parseFloat(investmentData.totalBalance)) * 100).toFixed(1)}% of balance)</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-1">Remaining Balance</p>
                <p className="text-2xl font-bold text-foreground">${(parseFloat(investmentData.totalBalance) - principal).toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">Available for other uses</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <Card className="bg-card shadow-lg border">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm text-muted-foreground mb-1">Total Invested</p>
                  <p className="text-lg sm:text-xl lg:text-2xl font-semibold text-foreground">{formatCurrency(totalInvested)}</p>
                </div>
                <DollarSign className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card shadow-lg border">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Best Projected Return</p>
                  <p className="text-2xl font-semibold text-green-600">{formatCurrency(bestPerformer.projectedValue)}</p>
                  <p className="text-sm text-muted-foreground">{bestPerformer.option}</p>
                </div>
                <TrendingUp className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card shadow-lg border">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Investment Period</p>
                  <p className="text-2xl font-semibold text-foreground">{years} years</p>
                  <p className="text-sm text-muted-foreground">Risk: {investmentData.riskProfile}</p>
                </div>
                <TrendingDown className="w-8 h-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Projection Chart */}
        <Card className="mb-8 shadow-lg border">
          <CardHeader>
            <CardTitle>Investment Growth Chart - Projected Returns Over Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-96">
              {projectionData && projectionData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={projectionData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="year" />
                  <YAxis tickFormatter={(value) => formatCurrency(value)} />
                  <Tooltip formatter={(value: number) => formatCurrency(value)} />
                  <Legend />
                  {investmentOptions.map(option => (
                    <Line
                      key={option.name}
                      type="monotone"
                      dataKey={option.name}
                      stroke={option.color}
                      strokeWidth={2}
                      dot={false}
                        connectNulls={false}
                    />
                  ))}
                </LineChart>
              </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-full text-muted-foreground">
                  <div className="text-center">
                    <p className="text-lg mb-2">No chart data available</p>
                    <p className="text-sm">Please check your investment parameters</p>
                    <div className="mt-4 text-xs text-muted-foreground/70">
                      <p>Principal: ${principal}</p>
                      <p>Years: {years}</p>
                      <p>Risk Profile: {investmentData.riskProfile}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Comparison Table */}
        <Card className="mb-8 shadow-lg border">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Best Investment Options USA 2025 - S&P 500 vs Bank Savings vs Crypto vs Gold</CardTitle>
            <div className="flex space-x-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => handleExport('csv')}
                className="flex items-center space-x-2"
              >
                <Download className="w-4 h-4" />
                <span>Export CSV</span>
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => handleExport('pdf')}
                className="flex items-center space-x-2"
              >
                <Download className="w-4 h-4" />
                <span>Export PDF</span>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Investment Option</TableHead>
                  <TableHead>Expected Annual Return</TableHead>
                  <TableHead>Projected Value ({targetYear})</TableHead>
                  <TableHead>Best Case</TableHead>
                  <TableHead>Worst Case</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {comparisonData.length > 0 ? (
                  comparisonData.map((item) => (
                  <TableRow key={item.option}>
                    <TableCell className="font-medium">{item.option}</TableCell>
                    <TableCell>{item.annualReturn}</TableCell>
                    <TableCell className="font-semibold text-green-600">
                      {formatCurrency(item.projectedValue)}
                    </TableCell>
                    <TableCell className="text-green-600">
                      {formatCurrency(item.bestCase)}
                    </TableCell>
                    <TableCell className="text-red-600">
                      {formatCurrency(item.worstCase)}
                    </TableCell>
                  </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                      No investment data available. Please complete the form to see projections.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Best/Worst Case Cards */}
        <div className="grid md:grid-cols-2 gap-6">
          <Card className="bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 shadow-lg">
            <CardHeader>
              <CardTitle className="text-green-800 dark:text-green-200 flex items-center space-x-2">
                <TrendingUp className="w-5 h-5" />
                <span>Best Case Scenario</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-green-700 dark:text-green-300 mb-4">
                If markets perform better than expected, your best-performing investment 
                ({bestPerformer.option}) could reach:
              </p>
              <p className="text-3xl font-semibold text-green-800 dark:text-green-200">
                {formatCurrency(bestPerformer.bestCase)}
              </p>
              <p className="text-sm text-green-600 dark:text-green-400 mt-2">
                Potential gain: {formatCurrency(bestPerformer.bestCase - totalInvested)}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 shadow-lg">
            <CardHeader>
              <CardTitle className="text-red-800 dark:text-red-200 flex items-center space-x-2">
                <TrendingDown className="w-5 h-5" />
                <span>Worst Case Scenario</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-red-700 dark:text-red-300 mb-4">
                If markets underperform, your investments could face challenges. 
                Even in worst case, diversification helps:
              </p>
              <p className="text-3xl font-semibold text-red-800 dark:text-red-200">
                {comparisonData.length > 0 ? 
                  formatCurrency(Math.min(...comparisonData.map(item => item.worstCase))) : 
                  formatCurrency(0)
                }
              </p>
              <p className="text-sm text-red-600 dark:text-red-400 mt-2">
                This represents the lowest projected outcome
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Educational Content Section */}
        <div className="mt-12 space-y-8">
          {/* Investment Education */}
          <Card className="shadow-lg border">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-foreground">Understanding Investment Returns: A Complete Guide</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="prose prose-gray dark:prose-invert max-w-none">
                <h3 className="text-xl font-semibold text-foreground mb-4">Why S&P 500 Outperforms Bank Savings</h3>
                <p className="text-muted-foreground mb-4">
                  The S&P 500 has historically averaged 7-10% annual returns over long periods, significantly outperforming 
                  bank savings accounts (typically 0.5-4% APY). This difference compounds dramatically over time due to 
                  the power of compound interest.
                </p>
                
                <h3 className="text-xl font-semibold text-foreground mb-4">Investment Options Explained</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="border-l-4 border-blue-500 pl-4">
                      <h4 className="font-semibold text-foreground">Bank Savings (0.5-4% APY)</h4>
                      <p className="text-sm text-muted-foreground">
                        Safe but low returns. Best for emergency funds and short-term goals. 
                        FDIC insured up to $250,000 per account.
                      </p>
                    </div>
                    <div className="border-l-4 border-green-500 pl-4">
                      <h4 className="font-semibold text-foreground">S&P 500 Index Funds (7-10% historical)</h4>
                      <p className="text-sm text-muted-foreground">
                        Diversified exposure to 500 largest US companies. Lower risk than individual stocks, 
                        higher returns than bonds over long periods.
                      </p>
                    </div>
                    <div className="border-l-4 border-yellow-500 pl-4">
                      <h4 className="font-semibold text-foreground">Government Bonds (3-5% APY)</h4>
                      <p className="text-sm text-muted-foreground">
                        Low-risk fixed income. Good for conservative investors and portfolio diversification. 
                        Backed by US government.
                      </p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="border-l-4 border-purple-500 pl-4">
                      <h4 className="font-semibold text-foreground">Gold (2-4% historical)</h4>
                      <p className="text-sm text-muted-foreground">
                        Hedge against inflation and market volatility. Physical gold or gold ETFs. 
                        Not correlated with stock market.
                      </p>
                    </div>
                    <div className="border-l-4 border-orange-500 pl-4">
                      <h4 className="font-semibold text-foreground">Cryptocurrency (Highly volatile)</h4>
                      <p className="text-sm text-muted-foreground">
                        High risk, high potential reward. Bitcoin and Ethereum are most established. 
                        Only invest what you can afford to lose.
                      </p>
                    </div>
                    <div className="border-l-4 border-indigo-500 pl-4">
                      <h4 className="font-semibold text-foreground">Diversified Portfolio (6-8% balanced)</h4>
                      <p className="text-sm text-muted-foreground">
                        Mix of stocks, bonds, and other assets. Reduces risk through diversification. 
                        Best for most long-term investors.
                      </p>
                    </div>
                  </div>
                </div>

                <h3 className="text-xl font-semibold text-foreground mb-4">Risk Management Strategies</h3>
                <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg">
                  <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-3">The 3-Bucket Strategy</h4>
                  <div className="grid md:grid-cols-3 gap-4 text-sm">
                    <div className="text-center">
                      <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-2">
                        <span className="text-green-600 font-bold">1</span>
                      </div>
                      <h5 className="font-semibold text-foreground mb-1">Emergency Fund</h5>
                      <p className="text-muted-foreground">3-6 months expenses in high-yield savings</p>
                    </div>
                    <div className="text-center">
                      <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-2">
                        <span className="text-blue-600 font-bold">2</span>
                      </div>
                      <h5 className="font-semibold text-foreground mb-1">Stable Growth</h5>
                      <p className="text-muted-foreground">S&P 500 index funds for long-term growth</p>
                    </div>
                    <div className="text-center">
                      <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-2">
                        <span className="text-purple-600 font-bold">3</span>
                      </div>
                      <h5 className="font-semibold text-foreground mb-1">Higher Risk</h5>
                      <p className="text-muted-foreground">Individual stocks, crypto, alternative investments</p>
                    </div>
                  </div>
                </div>

                <h3 className="text-xl font-semibold text-foreground mb-4">Common Investment Mistakes to Avoid</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-red-600 text-sm">✗</span>
                      </div>
                      <div>
                        <h5 className="font-semibold text-foreground">Market Timing</h5>
                        <p className="text-sm text-muted-foreground">Trying to time the market usually leads to lower returns</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-red-600 text-sm">✗</span>
                      </div>
                      <div>
                        <h5 className="font-semibold text-foreground">High Fees</h5>
                        <p className="text-sm text-muted-foreground">Expensive mutual funds can eat into your returns</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-red-600 text-sm">✗</span>
                      </div>
                      <div>
                        <h5 className="font-semibold text-foreground">Emotional Decisions</h5>
                        <p className="text-sm text-muted-foreground">Selling during market downturns locks in losses</p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-green-600 text-sm">✓</span>
                      </div>
                      <div>
                        <h5 className="font-semibold text-foreground">Dollar-Cost Averaging</h5>
                        <p className="text-sm text-muted-foreground">Invest regularly regardless of market conditions</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-green-600 text-sm">✓</span>
                      </div>
                      <div>
                        <h5 className="font-semibold text-foreground">Low-Cost Index Funds</h5>
                        <p className="text-sm text-muted-foreground">ETFs and index funds typically outperform managed funds</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-green-600 text-sm">✓</span>
                      </div>
                      <div>
                        <h5 className="font-semibold text-foreground">Long-Term Perspective</h5>
                        <p className="text-sm text-muted-foreground">Stay invested through market cycles for best results</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Advanced Investment Strategies */}
          <Card className="shadow-lg border">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-foreground">Advanced Investment Strategies for Maximum Returns</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="prose prose-gray dark:prose-invert max-w-none">
                <h3 className="text-xl font-semibold text-foreground mb-4">Tax-Efficient Investing: Keep More of Your Returns</h3>
                <p className="text-muted-foreground mb-4">
                  Smart tax planning can significantly boost your after-tax returns. Here's how to maximize your investment 
                  efficiency while minimizing your tax burden.
                </p>
                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  <div className="bg-blue-50 dark:bg-blue-950/20 p-4 rounded-lg">
                    <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">Tax-Advantaged Accounts</h4>
                    <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                      <li>• 401(k): Up to $23,000 (2024) with employer match</li>
                      <li>• Traditional IRA: Up to $7,000 (2024) with tax deduction</li>
                      <li>• Roth IRA: Up to $7,000 (2024) with tax-free growth</li>
                      <li>• HSA: Up to $4,300 (2024) with triple tax advantage</li>
                    </ul>
                  </div>
                  <div className="bg-green-50 dark:bg-green-950/20 p-4 rounded-lg">
                    <h4 className="font-semibold text-green-900 dark:text-green-100 mb-2">Tax-Efficient Fund Placement</h4>
                    <ul className="text-sm text-green-800 dark:text-green-200 space-y-1">
                      <li>• Taxable accounts: Index funds, ETFs</li>
                      <li>• Tax-advantaged accounts: REITs, bonds</li>
                      <li>• Roth accounts: High-growth stocks</li>
                      <li>• Traditional accounts: Tax-deferred bonds</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="prose prose-gray dark:prose-invert max-w-none">
                <h3 className="text-xl font-semibold text-foreground mb-4">Rebalancing Strategies: Maintaining Your Target Allocation</h3>
                <p className="text-muted-foreground mb-4">
                  Regular rebalancing ensures your portfolio stays aligned with your risk tolerance and investment goals. 
                  Here are the most effective rebalancing strategies:
                </p>
                <div className="space-y-4">
                  <div className="bg-gray-50 dark:bg-gray-900/20 p-4 rounded-lg">
                    <h4 className="font-semibold text-foreground mb-2">Time-Based Rebalancing</h4>
                    <p className="text-sm text-muted-foreground mb-2">Rebalance quarterly, semi-annually, or annually regardless of market conditions.</p>
                    <p className="text-xs text-muted-foreground">Best for: Hands-off investors who prefer systematic approaches</p>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-900/20 p-4 rounded-lg">
                    <h4 className="font-semibold text-foreground mb-2">Threshold-Based Rebalancing</h4>
                    <p className="text-sm text-muted-foreground mb-2">Rebalance when any asset class deviates more than 5% from target allocation.</p>
                    <p className="text-xs text-muted-foreground">Best for: Investors who want to minimize unnecessary trades</p>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-900/20 p-4 rounded-lg">
                    <h4 className="font-semibold text-foreground mb-2">Cash Flow Rebalancing</h4>
                    <p className="text-sm text-muted-foreground mb-2">Use new contributions to rebalance by directing them to underweighted assets.</p>
                    <p className="text-xs text-muted-foreground">Best for: Investors making regular contributions</p>
                  </div>
                </div>
              </div>

              <div className="prose prose-gray dark:prose-invert max-w-none">
                <h3 className="text-xl font-semibold text-foreground mb-4">Market Timing vs Time in Market: The Data Speaks</h3>
                <p className="text-muted-foreground mb-4">
                  Historical data consistently shows that time in the market beats timing the market. Here's what the research reveals:
                </p>
                <div className="bg-yellow-50 dark:bg-yellow-950/20 p-6 rounded-lg">
                  <h4 className="font-semibold text-yellow-900 dark:text-yellow-100 mb-3">Key Statistics from Dalbar Studies:</h4>
                  <ul className="text-sm text-yellow-800 dark:text-yellow-200 space-y-2">
                    <li>• Average investor returns: 5.04% annually (1993-2022)</li>
                    <li>• S&P 500 returns: 9.85% annually (same period)</li>
                    <li>• Performance gap: 4.81% annually due to poor timing decisions</li>
                    <li>• Missing the 10 best days reduces returns by 50%</li>
                    <li>• Missing the 30 best days results in negative returns</li>
                  </ul>
                </div>
                <p className="text-muted-foreground mt-4">
                  The lesson is clear: staying invested through market volatility is crucial for long-term success. 
                  Our calculator shows you the power of consistent, long-term investing.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Expert Advice Section */}
          <div className="text-center">
            <Card className="shadow-lg border  from-blue-50 to-green-50 dark:from-blue-950/20 dark:to-green-950/20">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold text-foreground mb-4">
                  Want Personalized Investment Advice?
                </h3>
                <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                  Get expert recommendations tailored to your specific situation, risk profile, and financial goals. 
                  Our certified financial advisors will help you create a customized investment strategy.
                </p>
                <Button 
                  onClick={() => onGetExpertAdvice && onGetExpertAdvice()}
                  className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white px-8 py-3 text-lg"
                >
                  Get Expert Investment Strategy
                </Button>
                <div className="mt-4 text-sm text-muted-foreground">
                  ✓ Free consultation • ✓ Personalized recommendations • ✓ SEC registered advisors
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
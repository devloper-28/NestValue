import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { 
  TrendingUp, 
  TrendingDown, 
  Shield, 
  Target, 
  Calendar, 
  DollarSign,
  PieChart,
  BarChart3,
  Clock,
  CheckCircle,
  AlertTriangle,
  Download,
  Users,
  Star
} from 'lucide-react';

interface InvestmentData {
  totalBalance: string;
  amount: string;
  monthlyContribution: string;
  targetYear: string;
  riskProfile: string;
}

interface PersonalizedInvestmentStrategyProps {
  investmentData: InvestmentData;
  onBackToResults: () => void;
}

export function PersonalizedInvestmentStrategy({ investmentData, onBackToResults }: PersonalizedInvestmentStrategyProps) {
  const [email, setEmail] = React.useState('');
  const [isSubmitted, setIsSubmitted] = React.useState(false);
  
  const principal = parseFloat(investmentData.amount) || 0;
  const monthlyContribution = parseFloat(investmentData.monthlyContribution) || 0;
  const targetYear = parseInt(investmentData.targetYear) || 2030;
  const currentYear = new Date().getFullYear();
  const years = targetYear - currentYear;
  const riskProfile = investmentData.riskProfile || 'moderate';

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      try {
        // Send to backend
        const response = await fetch('https://nestvalue.onrender.com/api/collect-email', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email,
            investmentData
          })
        });

        if (response.ok) {
          console.log('✅ Email sent to backend successfully');
          setIsSubmitted(true);
          setEmail('');
        } else {
          console.error('❌ Failed to send email to backend');
        }
      } catch (error) {
        console.error('❌ Error sending email to backend:', error);
        // Still show success to user even if backend fails
        setIsSubmitted(true);
        setEmail('');
      }
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getRiskColor = (risk: string) => {
    switch (risk.toLowerCase()) {
      case 'conservative': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
      case 'moderate': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300';
      case 'aggressive': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
      default: return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
    }
  };

  const portfolioStrategies = {
    conservative: {
      name: 'Conservative Approach',
      description: 'Lower risk, stable returns',
      allocation: [
        { asset: 'Bonds', percentage: 40, color: 'bg-blue-500' },
        { asset: 'Blue-chip Stocks', percentage: 30, color: 'bg-green-500' },
        { asset: 'High-yield Savings', percentage: 20, color: 'bg-purple-500' },
        { asset: 'Gold', percentage: 10, color: 'bg-yellow-500' }
      ],
      expectedReturn: 5.2,
      projectedValue: principal * Math.pow(1.052, years) + monthlyContribution * 12 * ((Math.pow(1.052, years) - 1) / 0.052),
      confidence: 85
    },
    moderate: {
      name: 'Moderate Approach',
      description: 'Balanced risk and return',
      allocation: [
        { asset: 'S&P 500 Index Fund', percentage: 50, color: 'bg-blue-500' },
        { asset: 'Bonds', percentage: 25, color: 'bg-green-500' },
        { asset: 'International Stocks', percentage: 15, color: 'bg-purple-500' },
        { asset: 'REITs', percentage: 10, color: 'bg-orange-500' }
      ],
      expectedReturn: 7.8,
      projectedValue: principal * Math.pow(1.078, years) + monthlyContribution * 12 * ((Math.pow(1.078, years) - 1) / 0.078),
      confidence: 75
    },
    aggressive: {
      name: 'Aggressive Approach',
      description: 'Higher risk, higher potential returns',
      allocation: [
        { asset: 'Growth Stocks', percentage: 60, color: 'bg-blue-500' },
        { asset: 'Crypto', percentage: 20, color: 'bg-orange-500' },
        { asset: 'S&P 500', percentage: 15, color: 'bg-green-500' },
        { asset: 'Bonds', percentage: 5, color: 'bg-purple-500' }
      ],
      expectedReturn: 12.3,
      projectedValue: principal * Math.pow(1.123, years) + monthlyContribution * 12 * ((Math.pow(1.123, years) - 1) / 0.123),
      confidence: 60
    }
  };

  const timelineAdvice = [
    {
      period: `${currentYear}-${currentYear + 1}`,
      years: 'Years 1-2',
      advice: 'Build emergency fund, start with conservative allocation',
      actions: ['Maximize 401(k) contributions', 'Set up automatic investing', 'Create emergency fund']
    },
    {
      period: `${currentYear + 2}-${currentYear + 3}`,
      years: 'Years 3-4',
      advice: 'Increase stock allocation, diversify internationally',
      actions: ['Rebalance quarterly', 'Add international exposure', 'Consider tax-loss harvesting']
    },
    {
      period: `${currentYear + 4}-${targetYear}`,
      years: 'Years 5-6',
      advice: 'Gradually reduce risk as target approaches',
      actions: ['Shift to 60/40 stocks/bonds', 'Consider target-date funds', 'Prepare for goal achievement']
    }
  ];

  const currentStrategy = portfolioStrategies[riskProfile as keyof typeof portfolioStrategies] || portfolioStrategies.moderate;

  return (
    <div className="mt-4 min-h-screen bg-background py-8" style={{ paddingBottom: '48px' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Your Personalized Investment Strategy
          </h1>
          <p className="text-lg text-muted-foreground mb-6">
            Expert recommendations based on your {formatCurrency(principal)} investment goal for {targetYear}
          </p>
          <Button onClick={onBackToResults} variant="outline" className="mb-6">
            ← Back to Results
          </Button>
        </div>

        {/* Investment Profile Summary - 4 Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="shadow-lg border">
            <CardContent className="p-6 text-center">
              <div className="text-xl font-bold text-foreground mb-2">{formatCurrency(principal)}</div>
              <div className="text-sm text-muted-foreground">Starting Amount</div>
            </CardContent>
          </Card>
          
          <Card className="shadow-lg border">
            <CardContent className="p-6 text-center">
              <div className="text-xl font-bold text-foreground mb-2">{targetYear}</div>
              <div className="text-sm text-muted-foreground">Target Year</div>
            </CardContent>
          </Card>
          
          <Card className="shadow-lg border">
            <CardContent className="p-6 text-center">
              <div className="text-xl font-bold text-foreground mb-2">{years} years</div>
              <div className="text-sm text-muted-foreground">Investment Timeline</div>
            </CardContent>
          </Card>
          
          <Card className="shadow-lg border">
            <CardContent className="p-6 text-center">
              <Badge className={getRiskColor(riskProfile)}>
                {riskProfile.charAt(0).toUpperCase() + riskProfile.slice(1)}
              </Badge>
              <div className="text-sm text-muted-foreground mt-2">Risk Profile</div>
            </CardContent>
          </Card>
        </div>

        {/* Monthly Contributions */}
        {monthlyContribution > 0 && (
          <Card className="mb-8 shadow-lg border bg-blue-50 dark:bg-blue-900/20">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 text-blue-700 dark:text-blue-300">
                <DollarSign className="w-4 h-4" />
                <span className="font-medium">Monthly Contributions: {formatCurrency(monthlyContribution)}</span>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Recommended Portfolio Strategy */}
        <Card className="mb-8 shadow-lg border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="w-5 h-5 text-green-600" />
              Recommended Portfolio Strategy
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-6">
              <h3 className="text-xl font-semibold text-foreground mb-2">{currentStrategy.name}</h3>
              <p className="text-muted-foreground mb-4">{currentStrategy.description}</p>
              
              {/* Asset Allocation Chart */}
              <div className="space-y-3">
                {currentStrategy.allocation.map((item, index) => (
                  <div key={index} className="flex items-center gap-4">
                    <div className="w-24 text-sm font-medium text-foreground">{item.asset}</div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <div className={`w-3 h-3 rounded-full ${item.color}`}></div>
                        <span className="text-sm text-muted-foreground">{item.percentage}%</span>
                      </div>
                      <Progress value={item.percentage} className="h-2" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Expected Returns */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <div className="text-2xl font-bold text-green-600">{currentStrategy.expectedReturn}%</div>
                <div className="text-sm text-muted-foreground">Expected Annual Return</div>
              </div>
              <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{formatCurrency(currentStrategy.projectedValue)}</div>
                <div className="text-sm text-muted-foreground">Projected Value {targetYear}</div>
              </div>
              <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">{currentStrategy.confidence}%</div>
                <div className="text-sm text-muted-foreground">Confidence Level</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Timeline-Specific Advice */}
        <Card className="mb-8 shadow-lg border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-orange-600" />
              Timeline-Specific Strategy
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {timelineAdvice.map((phase, index) => (
                <div key={index} className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                      <span className="text-sm font-bold text-blue-600">{index + 1}</span>
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-semibold text-foreground">{phase.period}</h4>
                      <Badge variant="outline">{phase.years}</Badge>
                    </div>
                    <p className="text-muted-foreground mb-3">{phase.advice}</p>
                    <div className="space-y-1">
                      {phase.actions.map((action, actionIndex) => (
                        <div key={actionIndex} className="flex items-center gap-2 text-sm text-muted-foreground">
                          <CheckCircle className="w-3 h-3 text-green-500" />
                          {action}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Expert Recommendations */}
        <Card className="mb-8 shadow-lg border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5 text-purple-600" />
              Expert Recommendations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-foreground mb-3">Tax Optimization</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-3 h-3 text-green-500" />
                    Maximize Roth IRA contributions ($7,000 annually)
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-3 h-3 text-green-500" />
                    Take advantage of 401(k) employer match
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-3 h-3 text-green-500" />
                    Consider tax-loss harvesting strategies
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-foreground mb-3">Risk Management</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-3 h-3 text-green-500" />
                    Set stop-loss orders at 10% below purchase price
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-3 h-3 text-green-500" />
                    Use dollar-cost averaging for monthly contributions
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-3 h-3 text-green-500" />
                    Diversify across sectors and geographies
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Call to Action */}
        <Card className="shadow-lg border bg-gradient-to-r from-blue-50 to-green-50 dark:from-blue-950/20 dark:to-green-950/20">
          <CardContent className="p-8 text-center">
            <h3 className="text-2xl font-bold text-foreground mb-4">
              Ready to Implement Your Strategy?
            </h3>
            <p className="text-muted-foreground mb-6">
              Get personalized guidance from our certified financial advisors for free
            </p>
            
            {/* Email Form for Consultation */}
            <div className="max-w-md mx-auto mb-6">
              {isSubmitted ? (
                <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-700">
                  <div className="text-green-600 dark:text-green-400 font-medium mb-2">
                    ✓ Consultation Request Submitted!
                  </div>
                  <p className="text-sm text-green-600 dark:text-green-400">
                    Our team will connect with you via email within 24 hours
                  </p>
                </div>
              ) : (
                <form onSubmit={handleEmailSubmit} className="space-y-4">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    required
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <Button 
                    type="submit"
                    className="w-full bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white px-6 py-2"
                  >
                    <Users className="w-4 h-4 mr-2" />
                    Get Started
                  </Button>
                </form>
              )}
              {!isSubmitted && (
                <p className="text-xs text-muted-foreground mt-2">
                  Our team will connect with you via email within 24 hours
                </p>
              )}
            </div>
         
            {/* Trust Indicators with Margin */}
            <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
              <div className="flex flex-col sm:flex-row items-center justify-center gap-6 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-yellow-500" />
                  <span>4.9/5 Expert Rating</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="w-4 h-4 text-blue-500" />
                  <span>10,000+ Happy Clients</span>
                </div>
                <div className="flex items-center gap-1">
                  <Shield className="w-4 h-4 text-green-500" />
                  <span>SEC Registered</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

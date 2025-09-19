import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "./ui/collapsible";
import { Button } from "./ui/button";
import { Alert, AlertDescription } from "./ui/alert";
import { ChevronDown, BookOpen, AlertTriangle, ExternalLink } from "lucide-react";
import { useState } from "react";

interface AboutPageProps {
  onPageChange: (page: string) => void;
}

export function AboutPage({ onPageChange }: AboutPageProps) {
  const [openFaq, setOpenFaq] = useState<string | null>(null);

  const assumptions = [
    { investment: 'Bank Savings', return: '1.5% APY', description: 'High-yield savings account average' },
    { investment: 'Government Bonds', return: '4.0%', description: '10-year Treasury bond historical average' },
    { investment: 'S&P 500 Stocks', return: '7.0%', description: 'Historical average since 1957 (inflation-adjusted)' },
    { investment: 'Gold', return: '2.5%', description: 'Long-term average after inflation' },
    { investment: 'Cryptocurrency', return: '12.0%', description: 'Bitcoin historical average (highly volatile)' },
    { investment: 'Diversified Portfolio', return: '5.5%', description: 'Mixed allocation: 60% stocks, 30% bonds, 10% alternatives' },
  ];

  const faqs = [
    {
      id: '1',
      question: 'How accurate are these projections?',
      answer: 'These projections are based on historical averages and should be used for educational purposes only. Market performance can vary significantly from historical averages, and past performance does not guarantee future results.'
    },
    {
      id: '2',
      question: 'What does risk profile mean?',
      answer: 'Risk profile affects the projected returns: Conservative reduces expected returns by 30%, Moderate uses standard returns, and Aggressive increases them by 30%. Higher risk typically comes with higher potential rewards but also greater volatility.'
    },
    {
      id: '3',
      question: 'Are fees and taxes included?',
      answer: 'No, these projections do not account for investment fees, management costs, or taxes. Real-world returns will be lower due to these factors. Always consider expense ratios and tax implications when making investment decisions.'
    },
    {
      id: '4',
      question: 'Should I invest in the highest returning option?',
      answer: 'Not necessarily. Higher returns typically come with higher risk. Diversification across multiple asset classes often provides better risk-adjusted returns over time. Consider your age, goals, and risk tolerance.'
    },
    {
      id: '5',
      question: 'How often should I review my investments?',
      answer: 'Review your investment strategy annually or when major life events occur. Avoid making frequent changes based on short-term market movements. Dollar-cost averaging through regular contributions can help smooth out market volatility.'
    }
  ];

  return (
    <div style={{ paddingBottom: '48px' }} className="min-h-screen bg-background mt-4">
      <div className="max-w-4xl mx-auto px-6">
        <div className="text-center mb-12">
        <h1 className="text-3xl font-semibold text-foreground mb-4">
          About NestValue | AI-Powered Investment Forecast Tool USA
        </h1>
          <p className="text-xl text-muted-foreground">
            Learn how NestValue uses AI & historical data to forecast savings vs investments. Understand our assumptions, accuracy, and safe investing guidance.
          </p>
        </div>

        {/* Assumptions Section */}
        <Card className="mb-8 shadow-lg border">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BookOpen className="w-5 h-5 text-blue-600" />
              <span>Investment Calculator Return Assumptions - Best Safe Investments USA 2025</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-6">
              Our investment calculator uses historical market data to project returns for bank savings vs stock investments. 
              Compare S&P 500, crypto, bonds, and gold returns to make informed investment decisions for 2025 and beyond.
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              {assumptions.map((item, index) => (
                <div key={index} className="bg-muted/50 p-4 rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-foreground">{item.investment}</h3>
                    <span className="text-green-600 font-semibold">{item.return}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Internal Links */}
        <Card className="mb-8 shadow-lg border">
          <CardHeader>
            <CardTitle>Ready to Start Planning?</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Button 
                onClick={() => onPageChange('input')}
                className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white"
              >
                Try Our Free Investment Calculator
              </Button>
              <Button 
                onClick={() => onPageChange('home')}
                variant="outline"
                className="border-blue-300 dark:border-blue-700 text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/30"
              >
                View Investment Options
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* FAQ Section */}
        <Card className="mb-8 shadow-lg border">
          <CardHeader>
            <CardTitle>Investment Calculator FAQ - How Much Will My Money Grow?</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {faqs.map((faq) => (
              <Collapsible
                key={faq.id}
                open={openFaq === faq.id}
                onOpenChange={(isOpen) => setOpenFaq(isOpen ? faq.id : null)}
              >
                <CollapsibleTrigger asChild>
                  <Button
                    variant="ghost"
                    className="w-full justify-between p-4 h-auto text-left hover:bg-muted/50"
                  >
                    <span className="font-medium">{faq.question}</span>
                    <ChevronDown className={`w-4 h-4 transition-transform ${openFaq === faq.id ? 'rotate-180' : ''}`} />
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className="px-4 pb-4">
                  <p className="text-muted-foreground leading-relaxed">{faq.answer}</p>
                </CollapsibleContent>
              </Collapsible>
            ))}
          </CardContent>
        </Card>

        {/* Disclaimer */}
        <Alert className="mb-8 bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800">
          <AlertTriangle className="h-4 w-4 text-amber-600" />
          <AlertDescription className="text-amber-800 dark:text-amber-200">
            <strong>Important Disclaimer:</strong> This tool is for educational purposes only and does not constitute financial advice. 
            Investment projections are based on historical data and assumptions that may not reflect future market conditions. 
            Always consult with a qualified financial advisor before making investment decisions. Past performance does not guarantee future results.
          </AlertDescription>
        </Alert>

        {/* Learn More Section */}
        <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 shadow-lg">
          <CardContent className="p-8 text-center">
            <h3 className="text-xl font-semibold text-blue-900 dark:text-blue-100 mb-4">
              Learn More About Investment Planning & Financial Growth
            </h3>
            <p className="text-blue-800 dark:text-blue-200 mb-6">
              Explore additional resources to enhance your investment knowledge, compare bank vs stock returns, 
              and make informed financial decisions for 2025 and beyond.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button 
                variant="outline" 
                className="border-blue-300 dark:border-blue-700 text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/30"
                onClick={() => window.open('https://www.investor.gov', '_blank')}
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                SEC Investor.gov
              </Button>
              <Button 
                variant="outline" 
                className="border-blue-300 dark:border-blue-700 text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/30"
                onClick={() => window.open('https://www.bogleheads.org', '_blank')}
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Bogleheads Community
              </Button>
              <Button 
                variant="outline" 
                className="border-blue-300 dark:border-blue-700 text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/30"
                onClick={() => window.open('https://www.morningstar.com', '_blank')}
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Morningstar Research
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
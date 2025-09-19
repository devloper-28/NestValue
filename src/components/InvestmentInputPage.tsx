import { useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Alert, AlertDescription } from "./ui/alert";
import { Lightbulb, Calculator, Trash2 } from "lucide-react";

interface InvestmentData {
  totalBalance: string;
  amount: string;
  monthlyContribution: string;
  targetYear: string;
  riskProfile: string;
}

interface InvestmentInputPageProps {
  onCalculate: (data: InvestmentData) => void;
}

export function InvestmentInputPage({ onCalculate }: InvestmentInputPageProps) {
  const [formData, setFormData] = useState<InvestmentData>(() => {
    // Load saved data from localStorage on component mount
    const savedData = localStorage.getItem('investmentFormData');
    if (savedData) {
      try {
        return JSON.parse(savedData);
      } catch (error) {
        console.warn('Failed to parse saved form data:', error);
      }
    }
    return {
      totalBalance: "",
      amount: "",
      monthlyContribution: "",
      targetYear: "",
      riskProfile: ""
    };
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 30 }, (_, i) => currentYear + i + 1);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.totalBalance || parseFloat(formData.totalBalance) <= 0) {
      newErrors.totalBalance = "Please enter your total available balance";
    }

    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      newErrors.amount = "Please enter how much you want to invest";
    }

    if (formData.amount && formData.totalBalance && parseFloat(formData.amount) > parseFloat(formData.totalBalance)) {
      newErrors.amount = "Investment amount cannot exceed your total balance";
    }

    if (formData.monthlyContribution && parseFloat(formData.monthlyContribution) < 0) {
      newErrors.monthlyContribution = "Monthly contribution cannot be negative";
    }

    if (!formData.targetYear) {
      newErrors.targetYear = "Please select a target year";
    }

    if (!formData.riskProfile) {
      newErrors.riskProfile = "Please select a risk profile";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onCalculate(formData);
    }
  };

  const updateField = (field: keyof InvestmentData, value: string) => {
    const newFormData = { ...formData, [field]: value };
    setFormData(newFormData);
    
    // Auto-save to localStorage
    localStorage.setItem('investmentFormData', JSON.stringify(newFormData));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const clearFormData = () => {
    const emptyFormData = {
      totalBalance: "",
      amount: "",
      monthlyContribution: "",
      targetYear: "",
      riskProfile: ""
    };
    setFormData(emptyFormData);
    localStorage.removeItem('investmentFormData');
    localStorage.removeItem('investmentResultsData');
    localStorage.removeItem('currentPage');
    setErrors({});
  };

  // Check if there's saved data
  const hasSavedData = localStorage.getItem('investmentFormData') !== null;

  return (
    <div className="min-h-screen bg-background py-8 sm:py-12 " style={{ paddingBottom: '48px' }}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-foreground mb-3 sm:mb-4 mt-4">
            Savings vs Investment Calculator USA | NestValue
          </h1>
          <p className="text-base sm:text-lg lg:text-xl text-muted-foreground mt-4">
            Enter your balance & get forecasts. Compare banks, stocks, bonds, gold & crypto to see which investments grow your money fastest.
          </p>
          {hasSavedData && (
            <div className="mt-4 inline-flex items-center px-3 py-1 rounded-full text-sm bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
              Form data auto-saved
            </div>
          )}
        </div>

        <div className="grid lg:grid-cols-3 gap-6 lg:gap-8">
          <div className="lg:col-span-2">
            <Card className="shadow-lg border">
              <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-2 sm:space-y-0">
                <CardTitle className="flex items-center space-x-2 text-base sm:text-lg">
                  <Calculator className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                  <span>Stock vs Bank Returns Calculator USA</span>
                </CardTitle>
                <Button
                  type="button"
                  onClick={clearFormData}
                  variant="outline"
                  size="sm"
                  className="text-muted-foreground hover:text-red-600 hover:border-red-300 self-start sm:self-auto"
                  title="Clear all form data"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="totalBalance">Total Available Balance ($) - Your Savings</Label>
                    <Input
                      id="totalBalance"
                      type="number"
                      placeholder="e.g., 10000, 50000, 100000"
                      value={formData.totalBalance}
                      onChange={(e) => updateField('totalBalance', e.target.value)}
                      className={errors.totalBalance ? "border-red-500" : ""}
                    />
                    {errors.totalBalance && <p className="text-red-500 text-sm">{errors.totalBalance}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="amount">Amount to Invest ($) - S&P 500, Crypto, Bonds, Gold</Label>
                    <Input
                      id="amount"
                      type="number"
                      placeholder="e.g., 5000, 10000, 25000"
                      value={formData.amount}
                      onChange={(e) => updateField('amount', e.target.value)}
                      className={errors.amount ? "border-red-500" : ""}
                    />
                    {errors.amount && <p className="text-red-500 text-sm">{errors.amount}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="monthly">Monthly Investment Contribution ($) - Optional</Label>
                    <Input
                      id="monthly"
                      type="number"
                      placeholder="e.g., 500, 1000, 2000"
                      value={formData.monthlyContribution}
                      onChange={(e) => updateField('monthlyContribution', e.target.value)}
                      className={errors.monthlyContribution ? "border-red-500" : ""}
                    />
                    {errors.monthlyContribution && <p className="text-red-500 text-sm">{errors.monthlyContribution}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label>Investment Timeline (Target Year) - How Much Will My Money Grow?</Label>
                    <Select onValueChange={(value) => updateField('targetYear', value)}>
                      <SelectTrigger className={errors.targetYear ? "border-red-500" : ""}>
                        <SelectValue placeholder="How long to invest? (2025-2054)" />
                      </SelectTrigger>
                      <SelectContent>
                        {years.map(year => (
                          <SelectItem key={year} value={year.toString()}>
                            {year} ({year - currentYear} years)
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.targetYear && <p className="text-red-500 text-sm">{errors.targetYear}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label>Investment Risk Profile - Best Safe Investments USA</Label>
                    <Select onValueChange={(value) => updateField('riskProfile', value)}>
                      <SelectTrigger className={errors.riskProfile ? "border-red-500" : ""}>
                        <SelectValue placeholder="Choose your investment strategy" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="conservative">Conservative - Bonds, CDs, High-yield savings (2-4% returns)</SelectItem>
                        <SelectItem value="moderate">Moderate - S&P 500, Index funds (6-10% returns)</SelectItem>
                        <SelectItem value="aggressive">Aggressive - Individual stocks, Crypto (10%+ returns)</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.riskProfile && <p className="text-red-500 text-sm">{errors.riskProfile}</p>}
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white py-4 sm:py-6 text-sm sm:text-lg rounded-xl"
                  >
                    Calculate How Much My Money Will Grow
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-4 sm:space-y-6">
            {formData.totalBalance && parseFloat(formData.totalBalance) > 0 && (
              <Card className="bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
                <CardContent className="p-4 sm:p-6">
                  <div className="flex items-start space-x-3">
                    <Lightbulb className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 mt-1 flex-shrink-0" />
                    <div className="min-w-0">
                      <h3 className="font-semibold text-green-900 dark:text-green-100 mb-2 text-sm sm:text-base">Smart Investment Advice</h3>
                      <div className="text-xs sm:text-sm text-green-800 dark:text-green-200 space-y-2">
                        <p><strong>Total Balance:</strong> ${parseFloat(formData.totalBalance).toLocaleString()}</p>
                        {formData.amount && (
                          <p><strong>Investing:</strong> ${parseFloat(formData.amount).toLocaleString()} ({(parseFloat(formData.amount) / parseFloat(formData.totalBalance) * 100).toFixed(1)}%)</p>
                        )}
                        <div className="mt-3">
                          <p className="font-medium mb-1">Recommended Allocation:</p>
                          <ul className="space-y-1 text-xs">
                            <li>• <strong>Emergency Fund:</strong> Keep 3-6 months expenses in savings</li>
                            <li>• <strong>Conservative (30-40%):</strong> Bonds, CDs, High-yield savings</li>
                            <li>• <strong>Moderate (40-50%):</strong> S&P 500, Index funds</li>
                            <li>• <strong>Aggressive (10-20%):</strong> Individual stocks, Crypto</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-start space-x-3">
                  <Lightbulb className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 mt-1 flex-shrink-0" />
                  <div className="min-w-0">
                    <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2 text-sm sm:text-base">Investment Tips</h3>
                    <ul className="text-xs sm:text-sm text-blue-800 dark:text-blue-200 space-y-1">
                      <li>• Higher risk may mean higher reward</li>
                      <li>• Diversification helps reduce risk</li>
                      <li>• Time in market beats timing the market</li>
                      <li>• Regular contributions compound growth</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Alert>
              <AlertDescription>
                <strong>Remember:</strong> This tool provides educational projections only. 
                Past performance doesn't guarantee future results. Always consult with a 
                financial advisor for personalized advice.
              </AlertDescription>
            </Alert>
          </div>
        </div>
      </div>
    </div>
  );
}
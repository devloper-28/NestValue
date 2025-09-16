export interface InvestmentOption {
  name: string;
  expectedReturn: number;
  volatility: number;
  color: string;
}

export const investmentOptions: InvestmentOption[] = [
  { name: 'Bank', expectedReturn: 0.015, volatility: 0.001, color: '#8884d8' },
  { name: 'Bonds', expectedReturn: 0.04, volatility: 0.05, color: '#82ca9d' },
  { name: 'Stocks (S&P 500)', expectedReturn: 0.07, volatility: 0.15, color: '#ffc658' },
  { name: 'Gold', expectedReturn: 0.025, volatility: 0.12, color: '#ff7300' },
  { name: 'Crypto', expectedReturn: 0.12, volatility: 0.40, color: '#8dd1e1' },
  { name: 'Diversified Portfolio', expectedReturn: 0.055, volatility: 0.08, color: '#d084d0' },
];

export function adjustReturnForRisk(baseReturn: number, riskProfile: string): number {
  const adjustments = {
    conservative: 0.7,
    moderate: 1.0,
    aggressive: 1.3
  };
  return baseReturn * adjustments[riskProfile as keyof typeof adjustments];
}

export function calculateFutureValue(
  principal: number,
  monthlyContribution: number,
  annualReturn: number,
  years: number
): number {
  const monthlyReturn = annualReturn / 12;
  const totalMonths = years * 12;
  
  // Future value of principal
  const principalFV = principal * Math.pow(1 + annualReturn, years);
  
  // Future value of annuity (monthly contributions)
  let annuityFV = 0;
  if (monthlyContribution > 0 && monthlyReturn > 0) {
    annuityFV = monthlyContribution * 
      ((Math.pow(1 + monthlyReturn, totalMonths) - 1) / monthlyReturn);
  } else if (monthlyContribution > 0) {
    annuityFV = monthlyContribution * totalMonths;
  }
  
  return principalFV + annuityFV;
}

export function generateProjectionData(
  principal: number,
  monthlyContribution: number,
  years: number,
  riskProfile: string
) {
  console.log('🔧 Generating projection data:', { principal, monthlyContribution, years, riskProfile });
  const projectionData = [];
  
  for (let year = 0; year <= years; year++) {
    const dataPoint: any = { year: new Date().getFullYear() + year };
    
    investmentOptions.forEach(option => {
      const adjustedReturn = adjustReturnForRisk(option.expectedReturn, riskProfile);
      const value = calculateFutureValue(principal, monthlyContribution, adjustedReturn, year);
      dataPoint[option.name] = Math.round(value);
    });
    
    projectionData.push(dataPoint);
  }
  
  console.log('📊 Generated projection data:', projectionData);
  return projectionData;
}

export function calculateBestWorstCase(
  principal: number,
  monthlyContribution: number,
  years: number,
  option: InvestmentOption,
  riskProfile: string
) {
  const baseReturn = adjustReturnForRisk(option.expectedReturn, riskProfile);
  
  // Best case: return + 1 standard deviation
  const bestReturn = baseReturn + option.volatility;
  const bestCase = calculateFutureValue(principal, monthlyContribution, bestReturn, years);
  
  // Worst case: return - 1 standard deviation (but not negative)
  const worstReturn = Math.max(baseReturn - option.volatility, -0.05);
  const worstCase = calculateFutureValue(principal, monthlyContribution, worstReturn, years);
  
  return {
    best: Math.round(bestCase),
    worst: Math.round(worstCase),
    expected: Math.round(calculateFutureValue(principal, monthlyContribution, baseReturn, years))
  };
}
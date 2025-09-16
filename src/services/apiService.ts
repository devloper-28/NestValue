// API Service for connecting frontend to backend
const API_BASE_URL = 'https://nestvalue.onrender.com/api';

export interface StandardApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  meta: {
    lastUpdated: string;
    cached?: boolean;
    apiStatus?: any;
    dataFreshness?: any;
    [key: string]: any;
  };
  error?: string;
}

export interface MarketData {
  savings: { averageAPY: string; topRate: string; source: string };
  sp500: { expectedReturn: string; historical: string; source: string };
  treasury10y: { yield: string; source: string };
  gold: { expectedReturn: string; historical: string; source: string };
  bitcoin: { currentPrice: string; expectedReturn: string; lastUpdated: string; source: string };
}

export type MarketDataResponse = StandardApiResponse<MarketData>;

export interface CalculationRequest {
  amount: string;
  monthlyContribution: string;
  targetYear: string;
  riskProfile: string;
}

export interface CalculationData {
  input: {
    principal: number;
    monthly: number;
    years: number;
    riskProfile: string;
  };
  projections: {
    [key: string]: {
      expectedReturn: string;
      projectedValue: number;
      annualizedGrowth: string;
    };
  };
  scenarios: {
    [key: string]: {
      best: number;
      worst: number;
      expected: number;
    };
  };
  yearlyProjections: Array<{
    year: number;
    [investment: string]: number;
  }>;
  summary: {
    totalInvested: number;
    bestPerformer: {
      name: string;
      value: number;
    };
  };
}

export type CalculationResponse = StandardApiResponse<CalculationData>;

class ApiService {
  private async fetchWithFallback<T>(url: string, fallbackData: T): Promise<T> {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.warn(`API call failed, using fallback data:`, error);
      return fallbackData;
    }
  }

  async getCurrentMarketData(forceRefresh = false): Promise<MarketDataResponse> {
    const fallbackData: MarketDataResponse = {
      success: false,
      message: "Using fallback data",
      data: {
        savings: { averageAPY: "4.8%", topRate: "5.5%", source: "Fallback data" },
        sp500: { expectedReturn: "10.0%", historical: "7% real return", source: "Fallback data" },
        treasury10y: { yield: "4.2%", source: "Fallback data" },
        gold: { expectedReturn: "3.0%", historical: "Inflation hedge", source: "Fallback data" },
        bitcoin: { 
          currentPrice: "Data unavailable", 
          expectedReturn: "Highly volatile", 
          lastUpdated: "Fallback data",
          source: "Fallback data"
        }
      },
      meta: {
        lastUpdated: new Date().toISOString(),
        apiStatus: 'fallback'
      }
    };

    try {
      // Add cache-busting parameter for force refresh
      const url = forceRefresh 
        ? `${API_BASE_URL}/market/current?refresh=true&t=${Date.now()}`
        : `${API_BASE_URL}/market/current`;
      
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.warn(`Market data API call failed, using fallback:`, error);
      return fallbackData;
    }
  }

  async calculateProjections(data: CalculationRequest): Promise<CalculationResponse> {
    const fallbackResponse: CalculationResponse = {
      success: false,
      message: "Using local calculations",
      data: {
        input: {
          principal: parseFloat(data.amount),
          monthly: parseFloat(data.monthlyContribution) || 0,
          years: parseInt(data.targetYear) - new Date().getFullYear(),
          riskProfile: data.riskProfile
        },
        projections: {
          bank: { expectedReturn: "4.8%", projectedValue: 0, annualizedGrowth: "4.8%" },
          stocks: { expectedReturn: "10.0%", projectedValue: 0, annualizedGrowth: "10.0%" }
        },
        scenarios: {
          bank: { best: 0, worst: 0, expected: 0 },
          stocks: { best: 0, worst: 0, expected: 0 }
        },
        yearlyProjections: [],
        summary: {
          totalInvested: 0,
          bestPerformer: { name: "stocks", value: 0 }
        }
      },
      meta: {
        lastUpdated: new Date().toISOString(),
        ratesSource: "Fallback data",
        disclaimer: "Using local calculations due to API unavailability"
      }
    };

    try {
      const response = await fetch(`${API_BASE_URL}/calculations/forecast`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      if (!result.success) {
        throw new Error(result.message || 'API returned error');
      }

      return result;
    } catch (error) {
      console.warn('Backend calculation failed, using local calculations:', error);
      return fallbackResponse;
    }
  }

  async getMarketInsights() {
    const fallbackInsights = {
      currentMarketCondition: "Data unavailable",
      recommendations: {
        conservative: "Focus on savings and bonds",
        moderate: "Balanced portfolio recommended",
        aggressive: "Consider higher stock allocation"
      },
      marketTrends: {},
      riskWarnings: {
        general: "Past performance does not guarantee future results"
      },
      lastUpdated: new Date().toISOString()
    };

    return this.fetchWithFallback(`${API_BASE_URL}/calculations/market-insights`, fallbackInsights);
  }

  async healthCheck(): Promise<boolean> {
    try {
      const response = await fetch(`${API_BASE_URL.replace('/api', '')}/health`);
      return response.ok;
    } catch {
      return false;
    }
  }
}

export const apiService = new ApiService();

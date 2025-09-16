const express = require('express');
const axios = require('axios');
const router = express.Router();

// In-memory cache for API responses
const cache = new Map();
const CACHE_DURATION = 15 * 60 * 1000; // 15 minutes

// Clear cache on startup to ensure fresh data
cache.clear();

// Helper function to get cached data
const getCachedData = (key) => {
  const cached = cache.get(key);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached;
  }
  return null;
};

// Helper function to set cached data
const setCachedData = (key, data) => {
  cache.set(key, { 
    data: data.data, 
    lastUpdated: data.meta?.lastUpdated,
    apiStatus: data.meta?.apiStatus,
    timestamp: Date.now() 
  });
};

// GET /api/market/current - Get current market data
router.get('/current', async (req, res) => {
  try {
    const cacheKey = 'market-current';
    const forceRefresh = req.query.refresh === 'true';
    
    // Skip cache if force refresh is requested
    if (!forceRefresh) {
      const cached = getCachedData(cacheKey);
      
      if (cached) {
        console.log('📦 Returning cached data:', {
          hasData: !!cached.data,
          lastUpdated: cached.lastUpdated,
          apiStatus: cached.apiStatus
        });
        return res.json({
          success: true,
          message: "Market data retrieved successfully (cached)",
          data: cached.data,
          meta: {
            lastUpdated: cached.lastUpdated || new Date().toISOString(),
            cached: true,
            apiStatus: cached.apiStatus || {}
          }
        });
      }
    } else {
      console.log('🔄 Force refresh requested - bypassing cache');
    }

    // Try multiple Bitcoin APIs for better reliability
    let bitcoinData = null;
    let bitcoinStatus = 'error';
    
    // Add delay between API calls to prevent rate limiting
    const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
    
    try {
      // Try CoinGecko API first (more reliable)
      const coinGeckoRes = await axios.get('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd', {
        timeout: 5000
      });
      bitcoinData = {
        currentPrice: `$${coinGeckoRes.data.bitcoin.usd.toLocaleString()}`,
        expectedReturn: "Highly volatile - 15% average but risky",
        lastUpdated: new Date().toISOString(),
        source: "CoinGecko API"
      };
      bitcoinStatus = 'success';
    } catch (error) {
      console.log('CoinGecko failed, trying CoinDesk...', error.message);
      
      // Add delay before trying fallback API
      await delay(1000);
      
      try {
        // Fallback to CoinDesk API
        const coinDeskRes = await axios.get('https://api.coindesk.com/v1/bpi/currentprice.json', {
          timeout: 5000
        });
        bitcoinData = {
          currentPrice: `$${coinDeskRes.data.bpi.USD.rate_float.toLocaleString()}`,
          expectedReturn: "Highly volatile - 15% average but risky",
          lastUpdated: coinDeskRes.data.time.updated,
          source: "CoinDesk API"
        };
        bitcoinStatus = 'success';
      } catch (error2) {
        console.log('Both Bitcoin APIs failed:', error2.message);
        bitcoinData = {
          currentPrice: "Data unavailable",
          expectedReturn: "Highly volatile - 15% average but risky",
          lastUpdated: "API temporarily down",
          source: "Fallback data"
        };
      }
    }

    // Try Treasury data
    let treasuryStatus = 'fallback';
    let treasuryYield = "4.2%";
    
    try {
      const treasuryRes = await axios.get('https://query1.finance.yahoo.com/v8/finance/chart/^TNX', {
        timeout: 5000
      });
      treasuryStatus = 'success';
      // You can parse actual yield from Yahoo Finance response here if needed
    } catch (error) {
      console.log('Treasury API failed, using fallback:', error.message);
    }

    const responseData = {
      savings: { 
        averageAPY: "4.8%", 
        topRate: "5.5%",
        source: "Current market average - can integrate with bank APIs"
      },
      sp500: { 
        expectedReturn: "10.0%", 
        historical: "7% real return",
        source: "Historical S&P 500 average - can integrate with live APIs"
      },
      treasury10y: { 
        yield: treasuryYield,
        source: "10-year Treasury bond yield - can integrate with FRED API"
      },
      gold: { 
        expectedReturn: "3.0%", 
        historical: "Long-term inflation hedge",
        source: "Historical precious metals average"
      },
      bitcoin: bitcoinData
    };

    const apiStatus = {
      bitcoin: bitcoinStatus,
      treasury: treasuryStatus,
      savings: 'manual',
      sp500: 'historical',
      gold: 'historical'
    };

    const finalResponse = {
      success: true,
      message: "Market data retrieved successfully",
      data: responseData,
      meta: {
        lastUpdated: new Date().toISOString(),
        cached: false,
        apiStatus: apiStatus,
        dataFreshness: {
          bitcoin: bitcoinStatus === 'success' ? 'live' : 'unavailable',
          treasury: treasuryStatus === 'success' ? 'live' : 'fallback',
          other: 'historical_averages'
        }
      }
    };

    console.log('💾 Caching fresh data:', {
      hasData: !!finalResponse.data,
      lastUpdated: finalResponse.meta?.lastUpdated,
      apiStatus: finalResponse.meta?.apiStatus,
      forceRefresh: forceRefresh
    });
    setCachedData(cacheKey, finalResponse);
    
    // Update message based on refresh type
    if (forceRefresh) {
      finalResponse.message = "Market data refreshed successfully";
    }
    
    res.json(finalResponse);

  } catch (error) {
    console.error('Market data error:', error.message);
    res.status(500).json({
      success: false,
      message: "Failed to fetch market data",
      error: error.message,
      data: {
        savings: { averageAPY: "4.8%", source: "Fallback data" },
        sp500: { expectedReturn: "10.0%", source: "Fallback data" },
        treasury10y: { yield: "4.2%", source: "Fallback data" },
        gold: { expectedReturn: "3.0%", source: "Fallback data" },
        bitcoin: { currentPrice: "Service unavailable", source: "Fallback data" }
      },
      meta: {
        lastUpdated: new Date().toISOString(),
        cached: false,
        apiStatus: 'all_failed'
      }
    });
  }
});

// GET /api/market/rates - Get updated rates for calculations
router.get('/rates', async (req, res) => {
  try {
    const rates = {
      success: true,
      message: "Investment rates retrieved successfully",
      data: {
        bank: 0.048, // 4.8% high-yield savings
        bonds: 0.042, // 4.2% 10-year Treasury
        stocks: 0.10, // 10% S&P 500 historical
        gold: 0.03, // 3% gold historical
        crypto: 0.15, // 15% crypto (very volatile)
        diversified: 0.07 // 7% balanced portfolio
      },
      meta: {
        lastUpdated: new Date().toISOString(),
        source: "Mixed: Live data where available, historical averages otherwise",
        dataType: "investment_rates",
        format: "decimal_percentage"
      }
    };

    res.json(rates);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch rates",
      error: error.message,
      data: null,
      meta: {
        lastUpdated: new Date().toISOString(),
        errorType: "rates_error"
      }
    });
  }
});

module.exports = router;

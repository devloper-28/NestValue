# 🚀 Quick Backend Setup (5 minutes)

## Step 1: Install Backend Dependencies
```bash
# In your main project folder
npm install express cors dotenv axios node-cron express-rate-limit nodemon
```

## Step 2: Start Backend Server
```bash
# Terminal 1: Start backend
node server.js
# Server runs on http://localhost:3001
```

## Step 3: Start Frontend (separate terminal)
```bash
# Terminal 2: Start frontend
npm run dev
# Frontend runs on http://localhost:3000
```

## Step 4: Test Integration
1. Go to http://localhost:3000
2. Fill investment form
3. Check browser Network tab - you'll see API calls to localhost:3001
4. Backend provides enhanced calculations with real market insights

## Step 5: Get Free API Keys (Optional - for live data)
1. **Alpha Vantage**: https://www.alphavantage.co/support/#api-key (500 free calls/day)
2. **FRED**: https://fred.stlouisfed.org/docs/api/api_key.html (unlimited free)
3. Add to `.env` file

## What Works NOW:
✅ Live Bitcoin prices
✅ Enhanced calculations 
✅ Market insights
✅ Rate limiting & caching
✅ Error handling with fallbacks
✅ API integration ready

## Next Phase APIs to Add:
- Alpha Vantage for stocks/ETFs
- FRED for Treasury/economic data  
- Bank rate aggregators
- Precious metals APIs

// API Configuration
const isDevelopment = process.env.NODE_ENV === 'development';

// Backend URLs
export const API_BASE_URL = isDevelopment 
  ? 'http://localhost:5000' 
  : 'https://nestvalue.onrender.com'; // Your actual Render URL

// API Endpoints
export const API_ENDPOINTS = {
  // Email endpoints
  COLLECT_EMAIL: `${API_BASE_URL}/api/collect-email`,
  GET_EMAILS: `${API_BASE_URL}/api/emails`,
  
  // Contact endpoints
  SUBMIT_CONTACT: `${API_BASE_URL}/api/contact`,
  GET_CONTACTS: `${API_BASE_URL}/api/contacts`,
  
  // Market data endpoints
  MARKET_DATA: `${API_BASE_URL}/api/market`,
  CALCULATIONS: `${API_BASE_URL}/api/calculations`,
  
  // Health check
  HEALTH: `${API_BASE_URL}/health`
};

// Admin password
export const ADMIN_PASSWORD = 'nestvalue2025';

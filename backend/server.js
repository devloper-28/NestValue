const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use('/api/', limiter);

// Routes
app.use('/api/market', require('./routes/marketData'));
app.use('/api/calculations', require('./routes/calculations'));

// Email collection endpoint
const EMAILS_FILE = path.join(__dirname, 'emails.json');

// Initialize emails file if it doesn't exist
if (!fs.existsSync(EMAILS_FILE)) {
  fs.writeFileSync(EMAILS_FILE, JSON.stringify([]));
}

// Collect consultation emails
app.post('/api/collect-email', (req, res) => {
  try {
    const { email, investmentData } = req.body;
    
    if (!email || !investmentData) {
      return res.status(400).json({ success: false, message: 'Email and investment data required' });
    }
    
    // Read existing emails
    const emails = JSON.parse(fs.readFileSync(EMAILS_FILE, 'utf8'));
    
    // Add new email
    const newEmail = {
      id: Date.now(),
      email,
      investmentData,
      timestamp: new Date().toISOString(),
      ip: req.ip
    };
    
    emails.push(newEmail);
    
    // Save to file
    fs.writeFileSync(EMAILS_FILE, JSON.stringify(emails, null, 2));
    
    console.log('📧 New consultation email collected:', newEmail.email);
    
    res.json({ success: true, message: 'Email collected successfully' });
  } catch (error) {
    console.error('❌ Error collecting email:', error);
    res.status(500).json({ success: false, message: 'Error collecting email' });
  }
});

// Get all emails (admin only)
app.get('/api/emails', (req, res) => {
  const { password } = req.query;
  
  if (password !== 'nestvalue2025') {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  
  try {
    const emails = JSON.parse(fs.readFileSync(EMAILS_FILE, 'utf8'));
    res.json(emails);
  } catch (error) {
    res.status(500).json({ error: 'Error reading emails' });
  }
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`🚀 Backend server running on port ${PORT}`);
  console.log(`📊 Market data API ready at http://localhost:${PORT}/api/market`);
});

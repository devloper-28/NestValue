const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// MongoDB imports
const { connectToMongoDB, getCollections, closeConnection } = require('./config/mongodb');

const app = express();
const PORT = process.env.PORT || 5000;

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

// Initialize MongoDB connection
let mongoConnected = false;

async function initializeMongoDB() {
  try {
    await connectToMongoDB();
    mongoConnected = true;
    console.log('✅ MongoDB connected successfully');
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error);
    console.log('🔄 Falling back to file storage');
    mongoConnected = false;
  }
}

// Fallback file storage
const EMAILS_FILE = path.join(__dirname, 'emails.json');
const CONTACTS_FILE = path.join(__dirname, 'contacts.json');

// Initialize files if they don't exist
if (!fs.existsSync(EMAILS_FILE)) {
  fs.writeFileSync(EMAILS_FILE, JSON.stringify([]));
}
if (!fs.existsSync(CONTACTS_FILE)) {
  fs.writeFileSync(CONTACTS_FILE, JSON.stringify([]));
}

// Collect consultation emails
app.post('/api/collect-email', async (req, res) => {
  try {
    const { email, investmentData } = req.body;
    
    if (!email || !investmentData) {
      return res.status(400).json({ success: false, message: 'Email and investment data required' });
    }
    
    // Create new email object
    const newEmail = {
      id: Date.now().toString(),
      email,
      investmentData,
      timestamp: new Date().toISOString(),
      ip: req.ip,
      status: 'unread'
    };
    
    if (mongoConnected) {
      // Save to MongoDB
      const { emails: emailsCollection } = await getCollections();
      await emailsCollection.insertOne(newEmail);
      console.log('📧 New consultation email saved to MongoDB:', newEmail.email);
    } else {
      // Fallback to file storage
      const emails = JSON.parse(fs.readFileSync(EMAILS_FILE, 'utf8'));
      emails.push(newEmail);
      fs.writeFileSync(EMAILS_FILE, JSON.stringify(emails, null, 2));
      console.log('📧 New consultation email saved to file:', newEmail.email);
    }
    
    res.json({ success: true, message: 'Email collected successfully' });
  } catch (error) {
    console.error('❌ Error collecting email:', error);
    res.status(500).json({ success: false, message: 'Error collecting email' });
  }
});

// Get all emails (admin only)
app.get('/api/emails', async (req, res) => {
  const { password } = req.query;
  
  if (password !== 'nestvalue2025') {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  
  try {
    let emails = [];
    
    if (mongoConnected) {
      // Get from MongoDB
      const { emails: emailsCollection } = await getCollections();
      emails = await emailsCollection.find({}).sort({ timestamp: -1 }).toArray();
    } else {
      // Fallback to file storage
      emails = JSON.parse(fs.readFileSync(EMAILS_FILE, 'utf8'));
    }
    
    res.json(emails);
  } catch (error) {
    console.error('Error reading emails:', error);
    res.status(500).json({ error: 'Error reading emails' });
  }
});

// Contact form endpoint
app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, subject, message, timestamp } = req.body;
    
    if (!name || !email || !subject || !message) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Create contact data
    const contactData = {
      id: Date.now().toString(),
      name,
      email,
      subject,
      message,
      timestamp: timestamp || new Date().toISOString(),
      ip: req.ip || req.connection.remoteAddress || 'Unknown',
      status: 'unread'
    };

    if (mongoConnected) {
      // Save to MongoDB
      const { contacts: contactsCollection } = await getCollections();
      await contactsCollection.insertOne(contactData);
      console.log('📧 New contact form saved to MongoDB:', contactData.email);
    } else {
      // Fallback to file storage
      let contacts = [];
      try {
        const contactsData = fs.readFileSync(CONTACTS_FILE, 'utf8');
        contacts = JSON.parse(contactsData);
      } catch (error) {
        contacts = [];
      }
      contacts.push(contactData);
      fs.writeFileSync(CONTACTS_FILE, JSON.stringify(contacts, null, 2));
      console.log('📧 New contact form saved to file:', contactData.email);
    }

    res.json({ success: true, message: 'Contact form submitted successfully' });
  } catch (error) {
    console.error('Error processing contact form:', error);
    res.status(500).json({ error: 'Error processing contact form' });
  }
});

// Get contacts endpoint
app.get('/api/contacts', async (req, res) => {
  const { password } = req.query;
  
  if (password !== 'nestvalue2025') {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    let contacts = [];
    
    if (mongoConnected) {
      // Get from MongoDB
      const { contacts: contactsCollection } = await getCollections();
      contacts = await contactsCollection.find({}).sort({ timestamp: -1 }).toArray();
    } else {
      // Fallback to file storage
      const contactsData = fs.readFileSync(CONTACTS_FILE, 'utf8');
      contacts = JSON.parse(contactsData);
    }
    
    res.json(contacts);
  } catch (error) {
    console.error('Error reading contacts:', error);
    res.status(500).json({ error: 'Error reading contacts' });
  }
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Start server
async function startServer() {
  try {
    // Initialize MongoDB
    await initializeMongoDB();
    
    app.listen(PORT, () => {
      console.log(`🚀 Backend server running on port ${PORT}`);
      console.log(`📊 Market data API ready at http://localhost:${PORT}/api/market`);
      console.log(`💾 Database: ${mongoConnected ? 'MongoDB Connected' : 'File Storage (Fallback)'}`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n🔄 Shutting down gracefully...');
  if (mongoConnected) {
    await closeConnection();
  }
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('\n🔄 Shutting down gracefully...');
  if (mongoConnected) {
    await closeConnection();
  }
  process.exit(0);
});

startServer();

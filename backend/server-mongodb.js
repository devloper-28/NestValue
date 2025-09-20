const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const rateLimit = require('express-rate-limit');
const cron = require('node-cron');
const axios = require('axios');
require('dotenv').config();

const { connectToMongoDB, getCollections, closeConnection } = require('./config/mongodb');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use('/api/', limiter);

// Store data in memory as backup
let emails = [];
let contacts = [];

// Initialize MongoDB connection
async function initializeDatabase() {
  try {
    await connectToMongoDB();
    const { emails: emailsCollection, contacts: contactsCollection } = await getCollections();
    
    // Load existing data from MongoDB
    const existingEmails = await emailsCollection.find({}).toArray();
    const existingContacts = await contactsCollection.find({}).toArray();
    
    emails = existingEmails;
    contacts = existingContacts;
    
    console.log(`📧 Loaded ${emails.length} emails from MongoDB`);
    console.log(`📞 Loaded ${contacts.length} contacts from MongoDB`);
  } catch (error) {
    console.error('❌ Database initialization failed:', error);
    console.log('🔄 Falling back to file-based storage');
  }
}

// Save data to MongoDB
async function saveToMongoDB() {
  try {
    const { emails: emailsCollection, contacts: contactsCollection } = await getCollections();
    
    // Clear existing data and insert new data
    await emailsCollection.deleteMany({});
    await contactsCollection.deleteMany({});
    
    if (emails.length > 0) {
      await emailsCollection.insertMany(emails);
    }
    if (contacts.length > 0) {
      await contactsCollection.insertMany(contacts);
    }
    
    console.log('💾 Data saved to MongoDB');
  } catch (error) {
    console.error('❌ Failed to save to MongoDB:', error);
  }
}

// API Routes

// Get all emails
app.get('/api/emails', async (req, res) => {
  try {
    res.json(emails);
  } catch (error) {
    console.error('Error fetching emails:', error);
    res.status(500).json({ error: 'Failed to fetch emails' });
  }
});

// Get all contacts
app.get('/api/contacts', async (req, res) => {
  try {
    res.json(contacts);
  } catch (error) {
    console.error('Error fetching contacts:', error);
    res.status(500).json({ error: 'Failed to fetch contacts' });
  }
});

// Submit email
app.post('/api/submit-email', async (req, res) => {
  try {
    const { email, name, message } = req.body;
    
    if (!email || !name || !message) {
      return res.status(400).json({ error: 'All fields are required' });
    }
    
    const newEmail = {
      id: Date.now().toString(),
      email,
      name,
      message,
      timestamp: new Date().toISOString(),
      status: 'unread'
    };
    
    emails.push(newEmail);
    
    // Save to MongoDB
    await saveToMongoDB();
    
    res.json({ message: 'Email submitted successfully', email: newEmail });
  } catch (error) {
    console.error('Error submitting email:', error);
    res.status(500).json({ error: 'Failed to submit email' });
  }
});

// Submit contact
app.post('/api/submit-contact', async (req, res) => {
  try {
    const { name, email, phone, message } = req.body;
    
    if (!name || !email || !phone || !message) {
      return res.status(400).json({ error: 'All fields are required' });
    }
    
    const newContact = {
      id: Date.now().toString(),
      name,
      email,
      phone,
      message,
      timestamp: new Date().toISOString(),
      status: 'unread'
    };
    
    contacts.push(newContact);
    
    // Save to MongoDB
    await saveToMongoDB();
    
    res.json({ message: 'Contact submitted successfully', contact: newContact });
  } catch (error) {
    console.error('Error submitting contact:', error);
    res.status(500).json({ error: 'Failed to submit contact' });
  }
});

// Mark email as read
app.put('/api/emails/:id/read', async (req, res) => {
  try {
    const { id } = req.params;
    const email = emails.find(e => e.id === id);
    
    if (!email) {
      return res.status(404).json({ error: 'Email not found' });
    }
    
    email.status = 'read';
    email.readAt = new Date().toISOString();
    
    // Save to MongoDB
    await saveToMongoDB();
    
    res.json({ message: 'Email marked as read', email });
  } catch (error) {
    console.error('Error updating email:', error);
    res.status(500).json({ error: 'Failed to update email' });
  }
});

// Mark contact as read
app.put('/api/contacts/:id/read', async (req, res) => {
  try {
    const { id } = req.params;
    const contact = contacts.find(c => c.id === id);
    
    if (!contact) {
      return res.status(404).json({ error: 'Contact not found' });
    }
    
    contact.status = 'read';
    contact.readAt = new Date().toISOString();
    
    // Save to MongoDB
    await saveToMongoDB();
    
    res.json({ message: 'Contact marked as read', contact });
  } catch (error) {
    console.error('Error updating contact:', error);
    res.status(500).json({ error: 'Failed to update contact' });
  }
});

// Delete email
app.delete('/api/emails/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const emailIndex = emails.findIndex(e => e.id === id);
    
    if (emailIndex === -1) {
      return res.status(404).json({ error: 'Email not found' });
    }
    
    emails.splice(emailIndex, 1);
    
    // Save to MongoDB
    await saveToMongoDB();
    
    res.json({ message: 'Email deleted successfully' });
  } catch (error) {
    console.error('Error deleting email:', error);
    res.status(500).json({ error: 'Failed to delete email' });
  }
});

// Delete contact
app.delete('/api/contacts/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const contactIndex = contacts.findIndex(c => c.id === id);
    
    if (contactIndex === -1) {
      return res.status(404).json({ error: 'Contact not found' });
    }
    
    contacts.splice(contactIndex, 1);
    
    // Save to MongoDB
    await saveToMongoDB();
    
    res.json({ message: 'Contact deleted successfully' });
  } catch (error) {
    console.error('Error deleting contact:', error);
    res.status(500).json({ error: 'Failed to delete contact' });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    emails: emails.length,
    contacts: contacts.length
  });
});

// Auto-save to MongoDB every 5 minutes
cron.schedule('*/5 * * * *', async () => {
  console.log('🔄 Auto-saving data to MongoDB...');
  await saveToMongoDB();
});

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n🔄 Shutting down gracefully...');
  await saveToMongoDB();
  await closeConnection();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('\n🔄 Shutting down gracefully...');
  await saveToMongoDB();
  await closeConnection();
  process.exit(0);
});

// Start server
async function startServer() {
  try {
    await initializeDatabase();
    
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📊 MongoDB: ${process.env.MONGODB_URI ? 'Connected' : 'Not configured'}`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

startServer();

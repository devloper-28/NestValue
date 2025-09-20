const { MongoClient } = require('mongodb');

// MongoDB connection string
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017';
const DB_NAME = process.env.DB_NAME || 'investment_forecast';

// MongoDB connection options for production
const MONGODB_OPTIONS = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  ssl: true,
  sslValidate: false, // Set to false for Render compatibility
  authSource: 'admin',
  retryWrites: true,
  w: 'majority',
  serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
  socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
  family: 4 // Use IPv4, skip trying IPv6
};

let client;
let db;

// Connect to MongoDB
async function connectToMongoDB() {
  try {
    if (!client) {
      console.log('🔄 Attempting to connect to MongoDB...');
      console.log('📍 Connection URI:', MONGODB_URI.replace(/\/\/.*@/, '//***:***@')); // Hide credentials in logs
      
      client = new MongoClient(MONGODB_URI, MONGODB_OPTIONS);
      await client.connect();
      
      // Test the connection
      await client.db('admin').command({ ping: 1 });
      console.log('✅ Connected to MongoDB successfully');
    }
    
    if (!db) {
      db = client.db(DB_NAME);
    }
    
    return { client, db };
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    console.error('🔍 Error details:', error);
    throw error;
  }
}

// Get database instance
async function getDB() {
  if (!db) {
    await connectToMongoDB();
  }
  return db;
}

// Get collections
async function getCollections() {
  const database = await getDB();
  return {
    emails: database.collection('emails'),
    contacts: database.collection('contacts')
  };
}

// Close connection
async function closeConnection() {
  if (client) {
    await client.close();
    console.log('🔌 MongoDB connection closed');
  }
}

module.exports = {
  connectToMongoDB,
  getDB,
  getCollections,
  closeConnection
};

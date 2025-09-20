const { MongoClient } = require('mongodb');

// MongoDB connection string
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017';
const DB_NAME = process.env.DB_NAME || 'investment_forecast';

let client;
let db;

// Connect to MongoDB
async function connectToMongoDB() {
  try {
    if (!client) {
      client = new MongoClient(MONGODB_URI);
      await client.connect();
      console.log('✅ Connected to MongoDB');
    }
    
    if (!db) {
      db = client.db(DB_NAME);
    }
    
    return { client, db };
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
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

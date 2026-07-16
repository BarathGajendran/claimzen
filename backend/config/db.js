const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/claimzen';
    console.log(`Connecting to MongoDB at: ${mongoURI}...`);
    
    const conn = await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 5000 // Timeout after 5 seconds instead of 30
    });
    
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return true;
  } catch (error) {
    console.error(`\x1b[31mMongoDB Connection Failed!\x1b[0m`);
    console.error(`Error details: ${error.message}`);
    console.log(`\n\x1b[33m[Warning]\x1b[0m ClaimVision API is running without an active MongoDB connection.`);
    console.log(`Please ensure:`);
    console.log(`1. Your local MongoDB database is running (e.g. run 'mongod')`);
    console.log(`2. Or provide a valid MONGODB_URI in your backend/.env file\n`);
    
    // We do not crash the app, but route handlers will require DB connection.
    // In our server.js, we will check this connection.
    return false;
  }
};

module.exports = connectDB;

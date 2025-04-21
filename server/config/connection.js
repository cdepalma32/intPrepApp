const mongoose = require('mongoose');
require('dotenv').config(); // Load environment variables

const connectDB = async () => {
  try {
    // Use an environment variable for the MongoDB connection string
const connectionString = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/intprepapp';
await mongoose.connect(connectionString);
console.log(`MongoDB connected: ${mongoose.connection.name}`);
  }catch (err) {
    console.error('MongoDB connection error:', err);
    process.exit(1); // exit process if connection fails
  }
  };

module.exports = connectDB; // exports the function that handles the DB connection
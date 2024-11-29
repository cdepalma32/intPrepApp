const mongoose = require('mongoose');
require('dotenv').config(); // Load environment variables from .env

// Use an environment variable for the MongoDB connection string
const connectionString = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/intprepapp';

// Connect to MongoDB without deprecated options
mongoose.connect(connectionString)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log('MongoDB connection error:', err));

module.exports = mongoose.connection;

const mongoose = require('mongoose');
require('dotenv'.config()); // load environment variables from .env

// use an environment variable for the MongoDB connection string
const connectionString = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/intprepapp';

// Connect to MongoDB
mongoose.connect(connectionString, {
    useNewUrlParser: true,  // Uses new MongoDB URL parser (ensuring compatibility)
    useUnifiedTopology: true, // Uses the new server discovery and monitoring engine
  })
  .then(() => console.log('Connected to MongoDB!'))
  .catch((err) => console.log('Failed to connect to MongoDB:', err));
  
  module.exports = mongoose.connection;
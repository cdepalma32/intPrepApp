// Use ES module syntax for importing dependencies
import dotenv from 'dotenv';
import express from 'express';
import connectDB from './config/connection'; // import the connect DB function

// Load environment variables from .env file
dotenv.config();

// Create an Express app
const app = express();


// Connect to MongoDB using the connectDB function from connection.js
connectDB();


// example of express routes
app.listen(process.env.PORT || 3001, () => {
  console.log(`Server running on port ${process.env.PORT || 3001}`);
});




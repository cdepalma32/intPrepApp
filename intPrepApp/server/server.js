// Use ES module syntax for importing dependencies
import dotenv from 'dotenv';
import mongoose from 'mongoose';

// Load environment variables from .env file
dotenv.config();

// Log the MongoDB URI to ensure it's correctly loaded from .env
console.log(process.env.MONGODB_URI);

// MongoDB connection setup
const mongoURI = process.env.MONGODB_URI; // Use the URI from .env file

// Connect to MongoDB using Mongoose
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('MongoDB connected');
  })
  .catch((err) => {
    console.log('MongoDB connection error:', err);
  });

// Your additional server setup (Express or other middleware)
// Example: if you're using Express to handle routes
// import express from 'express';
// const app = express();
// app.listen(process.env.PORT, () => console.log(`Server running on port ${process.env.PORT}`));

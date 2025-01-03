
// Use CommonJS syntax for imports
require('dotenv').config(); // Load environment variables
const express = require('express'); // Import express
const connectDB = require('./config/connection'); // Import connectDB function

// Create an Express app
const app = express();

// Connect to MongoDB
connectDB();

// Example of express routes
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

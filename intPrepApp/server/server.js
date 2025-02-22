// Use CommonJS syntax for imports
require('dotenv').config({ path: '../.env' }); // <-- Explicitly set path
console.log("Using JWT Secret:", process.env.JWT_SECRET);
const express = require('express'); // Import express
const connectDB = require('./config/connection'); // Import connectDB function
const routes = require('./routes');


// Create an Express app
const app = express();


// JSON parsing middleware (requesting bodies)
app.use(express.json());

// register routes
app.use(routes);

// Connect to MongoDB
connectDB();

// Example of express routes
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

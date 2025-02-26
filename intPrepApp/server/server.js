const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });

const express = require("express");
const connectDB = require("./config/connection");
const routes = require("./routes");

// Ensure .env variables are properly loaded
if (!process.env.JWT_SECRET) {
  console.error(" JWT_SECRET is missing. Check your .env file!");
  process.exit(1);
}


// Initialize Express app
const app = express();
app.use(express.json()); // JSON parsing middleware

// Connect to MongoDB
connectDB();

// Register routes
app.use(routes);

// Log database connection
console.log(" Using MongoDB URI:", process.env.MONGODB_URI);

// Start server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(` Server running on http://localhost:${PORT}`);
});

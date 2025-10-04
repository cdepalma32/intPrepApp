const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, ".env") });

console.log("SERVER STARTING");
console.log("JWT_SECRET Loaded:", process.env.JWT_SECRET || "NOT LOADED!");

const cors = require("cors");
const express = require("express");
const connectDB = require("./config/connection");

// Initialize Express app (do this BEFORE app.use)
const app = express();

// CORS + JSON
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}));
app.use(express.json());

// Ensure .env variables are properly loaded
if (!process.env.JWT_SECRET) {
  console.error(" JWT_SECRET is missing. Check your .env file!");
  process.exit(1);
}

// Connect to MongoDB
connectDB();
console.log(" Using MongoDB URI:", process.env.MONGODB_URI);

// Mount routes ONCE
// ./routes/index.js already wires /api, /protected, etc.
const routes = require("./routes");
app.use("/", routes);

// Start server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(` Server running on http://localhost:${PORT}`);
});

// Global error guards
process.on("uncaughtException", (err) => {
  console.error("UNCAUGHT EXCEPTION:", err);
});
process.on("unhandledRejection", (err) => {
  console.error("UNHANDLED PROMISE REJECTION:", err);
});

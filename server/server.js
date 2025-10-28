const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });

console.log('=== SERVER STARTING ===');
console.log('JWT_SECRET Loaded:', process.env.JWT_SECRET ? '[OK]' : '[MISSING]');

const cors = require('cors');
const express = require('express');
const connectDB = require('./config/connection');

const app = express();

// CORS + JSON
app.use(
  cors({
    origin: 'http://localhost:5173',
    credentials: true,
  })
);
app.use(express.json());

// Guard: required env
if (!process.env.JWT_SECRET) {
  console.error('❌ JWT_SECRET is missing. Check .env file!');
  process.exit(1);
}

// DB
connectDB();
console.log('Using MongoDB URI:', process.env.MONGODB_URI ? '[SET]' : '[MISSING]');

// Quick probe to prove we’re on the correct server
app.get('/__probe', (req, res) => res.json({ ok: true, where: 'server.js' }));

// Mount routes (root router wires /api, /protected, etc.)
const routesPath = './routes';
console.log('Resolving routes from:', require.resolve(routesPath));
const routes = require(routesPath);
app.use('/', routes);

// (Optional) centralized 404 for unhandled routes (helps distinguish route vs controller issues)
// app.use((req, res) => res.status(404).json({ error: 'Route not found', path: req.originalUrl }));

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);

  // Print all endpoints after app is ready
  try {
    const listEndpoints = require('express-list-endpoints');
    const table = listEndpoints(app);
    console.log('\n=== Express Endpoints Mounted ===');
    console.table(
      table.map((e) => ({
        methods: e.methods.join(','),
        path: e.path,
      }))
    );
    console.log('=================================\n');
  } catch (e) {
    console.warn(
      'Install express-list-endpoints to see routes table: npm i express-list-endpoints'
    );
  }
});

// Global error guards
process.on('uncaughtException', (err) => {
  console.error('UNCAUGHT EXCEPTION:', err);
});
process.on('unhandledRejection', (err) => {
  console.error('UNHANDLED PROMISE REJECTION:', err);
});

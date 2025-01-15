// route entry point for all routes
const express = require('express');
const router = express.Router();
// const publicRoutes = require('./publicRoutes');
const protectedRoutes = require('./protectedRoutes');
const apiRoutes = require('./api');

// // public routes
// router.use('/', publicRoutes);

// protected routes
router.use('/protected', protectedRoutes);

// api routes
router.use('/api', apiRoutes);

module.exports = router;
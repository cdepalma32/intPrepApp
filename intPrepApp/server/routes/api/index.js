// central file to import and configure all API routes
const router = require('express').Router();
const userRoutes = require('../api/userRoutes');
const protectedRoutes = require('../protectedRoutes');
const topicRoutes = require('../api/topicRoutes');
const anagramRoutes = require('../api/anagramRoutes');
const interviewRoutes = require('../api/interviewRoutes');

// add route models
router.use('/users', userRoutes);
router.use('/protected', protectedRoutes);
router.use('/topics', topicRoutes);
router.use('/anagrams', anagramRoutes);
router.use('interview', interviewRoutes);

module.exports = router;
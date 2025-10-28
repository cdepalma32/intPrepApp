// central file to import and configure all API routes
const router = require('express').Router();

const userRoutes = require('./userRoutes');
const topicRoutes = require('./topicRoutes');
const anagramRoutes = require('./anagramRoutes');
const interviewRoutes = require('./interviewRoutes');

// add route models
router.get('/ping', (req, res) => res.json({ ok: true }));
router.use('/users', userRoutes);
router.use('/topics', topicRoutes);
router.use('/anagrams', anagramRoutes);
router.use('/interview', interviewRoutes);

module.exports = router;
// routes for topic functionality and CRUD operations for JavaScript/MERN topics

const router = require('express').Router();
const { getAllTopics, getTopicById, createTopic, updateTopic, deleteTopic } = require('../../controllers/topicController');
const { verifyToken } = require('../../middleware/authMiddleware');

// Log confirmation
console.log(" topicRoutes.js loaded!");

    // PUBLIC ROUTES
// GET /api/topics - Get all topics (public)
router.get('/', getAllTopics);

// GET /api/topics/:id - Get a specific topic by ID (public)
router.get('/:id', getTopicById);


    // PROTECTED ROUTES (require auth)
// POST /api/topics - Create a new topic (protected)
router.post('/', verifyToken, createTopic);

// PUT /api/topics/:id - Update an existing topic (protected)
router.put('/:id', verifyToken, updateTopic);

// DELETE /api/topics/:id - Delete a topic (protected)
router.delete('/:id', verifyToken, deleteTopic);


    // METHOD RESTRICTION HANDLER (optional)

// Could add router.all() catch-alls like you did in userRoutes if needed

module.exports = router;
// routes for topic functionality and CRUD operations for JavaScript/MERN topics

const router = require('express').Router();
const { getAllTopics, getTopicById, createTopic, updateTopic, deleteTopic } = require('../../controllers/topicController');
const { verifyToken, requireAdmin } = require('../../middleware/authMiddleware');

// Log confirmation
console.log(" topicRoutes.js loaded!");

    // PUBLIC ROUTES
// GET /api/topics - Get all topics (public)
router.get('/', getAllTopics);



    // PROTECTED ROUTES (require auth)

// GET /api/topics/:id - Get a specific topic by ID (private)
router.get('/:id', verifyToken, requireAdmin, getTopicById);

// POST /api/topics - Create a new topic (protected)
router.post('/', verifyToken, requireAdmin, createTopic);

// PUT /api/topics/:id - Update an existing topic (protected)
router.put('/:id', verifyToken, requireAdmin, updateTopic);

// DELETE /api/topics/:id - Delete a topic (protected)
router.delete('/:id', verifyToken, requireAdmin, deleteTopic);


    // METHOD RESTRICTION HANDLER (optional)

// Could add router.all() catch-alls like you did in userRoutes if needed

module.exports = router;
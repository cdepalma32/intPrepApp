// routes for topic functionality and CRUD operations for JavaScript/MERN topics

const router = require('express').Router();
const { getAllTopics, getTopicById, createTopic, updateTopic, deleteTopic } = require('../../controllers/topicController');
const { verifyToken, requireAdmin } = require('../../middleware/authMiddleware');

    // AUTHENTICATED ROUTES
// GET /api/topics - Get all topics (authenticated user)
router.get('/', verifyToken, getAllTopics);

// GET /api/topics/:id - Get a specific topic by ID (authenticated user)
router.get('/:id', verifyToken, getTopicById);


    // ADMIN ONLY ROUTES
// POST /api/topics - Create a new topic (protected, admin)
router.post('/', verifyToken, requireAdmin, createTopic);

// PUT /api/topics/:id - Update an existing topic (protected, admin)
router.put('/:id', verifyToken, requireAdmin, updateTopic);

// DELETE /api/topics/:id - Delete a topic (protected, admin)
router.delete('/:id', verifyToken, requireAdmin, deleteTopic);


    // METHOD RESTRICTION HANDLER (optional)

// Could add router.all() catch-alls like you did in userRoutes if needed

module.exports = router;
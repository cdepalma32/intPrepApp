// routes requiring authentication
const router = require('express').Router();
const { verifyToken } = require('../middleware/authMiddleware'); // middleware for auth
const { getAllTopics } = require('../controllers/topicController'); 

// Apply middleware to all protected routes
router.use(verifyToken);

// Topics Selection (protected)
router.get('/topics', async (req, res) => {
    try { // try catch for all route handlers
        // fetch topics from the database using the controller function
        const topics = await getAllTopics();
        res.json({ success: true, topics });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error fetching topics', error: error.message }); // returns meaningful error message.
    }
    });

// example of another protected route (eg user profile) GET / profile



module.exports = router;
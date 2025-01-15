// manage CRUD operations for JavaScript/MERN topics
const router = require('express').Router();
const { getAllTopics, getTopicById, createTopic, updateTopic, deleteTopic } = require('../../controllers/topicController');
const { verifyToken } = require('../../utils/auth');

// public GET all Topics
router.get('/', getAllTopics);

// public GET a single Topic
router.get('/:id', getTopicById);

// protected ADD/ create a new topic
router.post('/', verifyToken, createTopic);

// protected UPDATE an existing topic
router.put('/:id', verifyToken, updateTopic);

// protected DELETE a topic
router.delete('/:id', verifyToken, deleteTopic);

module.exports = router;
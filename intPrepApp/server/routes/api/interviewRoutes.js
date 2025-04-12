// routes for managing CRUD operations and user interaction with interview questions
const router = require('express').Router();
const { getQuestion, submitAnswer, createQuestion, updateQuestion, deleteQuestion } = require('../../controllers/interviewController');
const { verifyToken } = require('../../middleware/authMiddleware');

// public GET questions for a topic
router.get('/:topicId', getQuestion);

// protected SUBMIT an answer / validate and store user submitted answers
router.post('/submit/:questionId', verifyToken, submitAnswer);

// protected ADD a new question / admin function
router.post('/', verifyToken, createQuestion);

// protected UPDATE an existing question
router.put('/:id', verifyToken, updateQuestion);

// protected DELETE a question
router.delete('/:id', verifyToken, deleteQuestion);

module.exports = router;
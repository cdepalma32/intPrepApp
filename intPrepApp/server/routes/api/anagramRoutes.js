// routes for managing CRUD operations and user interactions with anagrams
const router = require('express').Router();
const { getAnagrams, submitAnagram, createAnagram, updateAnagram, deleteAnagram } = require('../../controllers/anagramController');
const { verifyToken } = require('../../utils/auth');

// public GET anagrams for a topic
router.get('/:topicId', getAnagrams);

// protected SUBMIT an anagram answer / validate and store user-submitted anagram answers
router.post('/submit', submitAnagram);

// protected ADD a new anagram / admin function
router.post('/', verifyToken, createAnagram);

// protected UPDATE an existing anagram
router.put('/:id', verifyToken, updateAnagram);

// protected DELETE an anagram
router.delete(':id', verifyToken, deleteAnagram);

module.exports = router;
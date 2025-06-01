const router = require('express').Router();
const {
  getAnagrams,
  submitAnagram,
  createAnagram,
  updateAnagram,
  deleteAnagram,
} = require('../../controllers/anagramController');
const { verifyToken } = require('../../middleware/authMiddleware');

// Public GET route to fetch all anagrams
router.get('/', getAnagrams);

// Protected routes (as before)
router.post('/submit', verifyToken, submitAnagram);
router.post('/', verifyToken, createAnagram);
router.put('/:id', verifyToken, updateAnagram);
router.delete('/:id', verifyToken, deleteAnagram);

module.exports = router;

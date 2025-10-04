// routes for user functionality and authentication / user account management
const router = require('express').Router();
const {
  refreshTokenHandler,
  registerUser,
  loginUser,
  logoutUser,
  getUserProfile,
  updateUserProfile,
  deleteUser,
  getAllUsers,
  updateAnagramProgress,
  getAnagramSummary,
} = require('../../controllers/userController');
const { verifyToken, validateSignup, requireAdmin } = require('../../middleware/authMiddleware');

// POST /api/users/signup - Register a new User
router.post('/signup', validateSignup, registerUser); // Handles user registration

// POST /api/users/signin - Login a user
router.post('/signin', loginUser);

// POST /api/users/refresh - Refresh a user's token
router.post('/refresh', refreshTokenHandler);

// Reject any non-POST requests to /logout
router.use('/logout', (req, res, next) => {
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      error: "Method not allowed. Use POST instead."
    });
  }
  next(); // Only POST requests get through
});

// POST /api/users/logout - Logout the user
router.post('/logout', logoutUser);

// AUTHENTICATED ROUTES
// GET /api/users/profile - Get user profile (Protected)
router.get('/profile', verifyToken, getUserProfile);

// PUT /api/users/profile - Update user profile (Protected)
router.put('/profile', verifyToken, updateUserProfile);

// PROGRESS ROUTES (Protected)
router.patch('/progress/anagram', verifyToken, updateAnagramProgress);
router.get('/progress/anagram/summary', verifyToken, getAnagramSummary);

// DELETE /api/users/:userId - Delete user account (Protected)
router.delete('/:userId', verifyToken, deleteUser);

// ADMIN ONLY ROUTES
// GET /api/users - Get all users (Admin only)
router.get('/', verifyToken, requireAdmin, getAllUsers);

module.exports = router;

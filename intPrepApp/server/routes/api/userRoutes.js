// routes for user functionality and authentication / user account management

const router = require('express').Router();
const {registerUser, loginUser, logoutUser, getUserProfile, updateUserProfile, deleteUser} = require('../../controllers/userController');
const { verifyToken, validateSignup } = require('../../middleware/authMiddleware');

// POST /api/users/signup - Register a new User
router.post('/signup', validateSignup, registerUser); // Handles user registration

// POST /api/users/signin - Login a user
router.post('/signin', loginUser);

//POST /api/users/Logout - Logout the user
router.post('/logout', logoutUser);

// GET /api/users/profile - Get user profile (Protected)
router.get('/profile', verifyToken, getUserProfile); // Fetches user details for authenticated users

// PUT /api/users/profile - Update user profile (Protected)
router.put('/profile', verifyToken, updateUserProfile);
 
// DELETE /api/users/profile - Delete user account (Protected)
router.delete('/', verifyToken, deleteUser); // Delete's the user's account

module.exports = router;


// routes for user functionality and authentication / user account management

const router = require('express').Router();
const {refreshTokenHandler, registerUser, loginUser, logoutUser, getUserProfile, updateUserProfile, deleteUser, getAllUsers } = require('../../controllers/userController');
const { verifyToken, validateSignup, requireAdmin } = require('../../middleware/authMiddleware');

// POST /api/users/signup - Register a new User
router.post('/signup', validateSignup, registerUser); // Handles user registration

// POST /api/users/signin - Login a user
router.post('/signin', loginUser);

// POST /api/users/refresh - refreshes a users' token
router.post('/refresh', refreshTokenHandler);

//POST /api/users/Logout - Logout the user
router.post('/logout', logoutUser);

    // method restriction - catches unsupported methods on /logout
    router.all('/logout', (req, res) => {
        res.status(405).json({ success: false, error: "Method not allowed.  Use POST instead." });
    });


    // AUTHENTICATED ROUTES
// GET /api/users/profile - Get user profile (Protected)
router.get('/profile', verifyToken, getUserProfile ); 

// PUT /api/users/profile - Update user profile (Protected)
router.put('/profile', verifyToken, updateUserProfile  );
 
// DELETE /api/users/profile - Delete user account (Protected)
router.delete('/:userId', verifyToken, deleteUser);

    // ADMIN ONLY ROUTES
// GET /api/users - Get all users (Admin only)
router.get('/', verifyToken, requireAdmin, getAllUsers);

module.exports = router;


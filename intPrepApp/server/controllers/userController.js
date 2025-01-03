const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// POST /api/users/register
const registerUser = async (req, res) => {
    try {
        const { username, email, password, role } = req.body;

        // Validate input
        if (
            !username || typeof username !== 'string' || !username.trim() ||
            !email || typeof email !== 'string' || !email.trim() ||
            !password || typeof password !== 'string' || password.length < 6
        ) {
            return res.status(400).json({ success: false, error: 'Invalid input. Ensure all fields are provided with valid data.' });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ success: false, error: 'Email already in use.' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user
        const user = await User.create({
            username,
            email,
            password: hashedPassword,
            role: role || 'user' // Default role is 'user'
        });

        res.status(201).json({ success: true, message: 'User registered successfully!', user });
    } catch (error) {
        console.error('Error registering user:', error.message);
        res.status(500).json({ success: false, error: 'Failed to register user.' });
    }
};

// POST /api/users/login
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate input
        if (!email || !password) {
            return res.status(400).json({ success: false, error: 'Email and password are required.' });
        }

        // Find user
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ success: false, error: 'Invalid credentials!' });
        }

        // Check password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ success: false, error: 'Invalid credentials!' });
        }

        // Generate JWT
        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
            expiresIn: '1h'
        });

        res.status(200).json({ success: true, message: 'User logged in successfully!', token });
    } catch (error) {
        console.error('Error logging in user:', error.message);
        res.status(500).json({ success: false, error: 'Failed to log in user.' });
    }
};

// POST /api/users/logout
const logoutUser = async (req, res) => {
    try {
        res.status(200).json({ success: true, message: 'User logged out successfully!' });
    } catch (error) {
        console.error('Error logging out user:', error.message);
        res.status(500).json({ success: false, error: 'Failed to log out user.' });
    }
};

// GET /api/users/profile
const getUserProfile = async (req, res) => {
    try {
        // Fetch user profile from token
        const user = await User.findById(req.user.id).select('-password'); // Exclude password
        if (!user) {
            return res.status(404).json({ success: false, error: 'User not found.' });
        }
        res.status(200).json({ success: true, user });
    } catch (error) {
        console.error('Error fetching user profile:', error.message);
        res.status(500).json({ success: false, error: 'Failed to fetch user profile.' });
    }
};

// PUT /api/users/profile
const updateUserProfile = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // Fetch the user
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ success: false, error: 'User not found.' });
        }

        // Update fields
        if (username) user.username = username;
        if (email) user.email = email;
        if (password) user.password = await bcrypt.hash(password, 10); // Hash new password

        // Save changes
        const updatedUser = await user.save();
        res.status(200).json({ success: true, message: 'User profile updated successfully!', updatedUser });
    } catch (error) {
        console.error('Error updating profile:', error.message);
        res.status(500).json({ success: false, error: 'Failed to update profile.' });
    }
};

// DELETE /api/users/:userId
const deleteUser = async (req, res) => {
    try {
        const { userId } = req.params;

        // Ensure valid user ID
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ success: false, error: 'Invalid user ID.' });
        }

        // Delete user
        const user = await User.findByIdAndDelete(userId);
        if (!user) {
            return res.status(404).json({ success: false, error: 'User not found.' });
        }

        res.status(200).json({ success: true, message: 'User deleted successfully!' });
    } catch (error) {
        console.error('Error deleting user:', error.message);
        res.status(500).json({ success: false, error: 'Failed to delete user.' });
    }
};

// Export all functions
module.exports = {
    registerUser,
    loginUser,
    logoutUser,
    getUserProfile,
    updateUserProfile,
    deleteUser
};

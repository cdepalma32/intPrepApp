const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// POST /api/users/register
const registerUser = async (req, res) => {
    try {
        let { username, email, password, role } = req.body;
        email = email.toLowerCase().trim();

        // Validate input
        if (!username || !email || !password) {
            return res.status(400).json({ success: false, error: 'All fields are required.' });
        }

        // Check if user exists
        if (await User.findOne({ email })) {
            return res.status(400).json({ success: false, error: 'Email already in use.' });
        }

        // Create & save user (password is hashed via pre-save middleware)
        const user = new User({ username, email, password, role: role || 'user' });
        await user.save();

        // Generate JWT token
        const token = jwt.sign(
            { id: user._id, email: user.email, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '2h' }
        );

        res.status(201).json({
            success: true,
            message: 'User registered successfully!',
            user: { _id: user._id, username: user.username, email: user.email, role: user.role },
            token
        });

    } catch (error) {
        console.error('Error registering user:', error.message);
        res.status(500).json({ success: false, error: 'Failed to register user.' });
    }
};

// POST /api/users/login
const loginUser = async (req, res) => {
    try {
        let { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ success: false, error: 'Email and password are required.' });
        }

        email = email.toLowerCase().trim();

        // Find user & include password
        const foundUser = await User.findOne({ email }).select('+password');
        if (!foundUser) {
            return res.status(401).json({ success: false, error: 'Invalid credentials!' });
        }

        // Compare passwords
        if (!(await bcrypt.compare(password, foundUser.password))) {
            return res.status(401).json({ success: false, error: 'Invalid credentials!' });
        }

        // Generate JWT token
        const token = jwt.sign(
            { id: foundUser._id, email: foundUser.email, role: foundUser.role },
            process.env.JWT_SECRET,
            { expiresIn: '2h' }
        );

        res.status(200).json({ success: true, message: 'User logged in successfully!', token });

    } catch (error) {
        console.error('Error logging in user:', error.message);
        res.status(500).json({ success: false, error: 'Failed to log in user.' });
    }
};

// POST /api/users/logout
const logoutUser = (req, res) => {
    res.status(200).json({ success: true, message: 'User logged out successfully!' });
};

// GET /api/users/profile
const getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
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
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ success: false, error: 'User not found.' });
        }

        if (username) user.username = username;
        if (email) user.email = email;
        if (password) user.password = password; // Hashing handled by pre-save middleware

        const updatedUser = await user.save();
        res.status(200).json({ success: true, message: 'Profile updated successfully!', updatedUser });

    } catch (error) {
        console.error('Error updating profile:', error.message);
        res.status(500).json({ success: false, error: 'Failed to update profile.' });
    }
};

// DELETE /api/users/:userId
const deleteUser = async (req, res) => {
    try {
        const { userId } = req.params;
        if (!userId.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({ success: false, error: 'Invalid user ID.' });
        }

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

module.exports = {
    registerUser,
    loginUser,
    logoutUser,
    getUserProfile,
    updateUserProfile,
    deleteUser
};

const mongoose = require('mongoose');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { verifyRefreshToken, generateAccessToken, generateRefreshToken } = require('../utils/auth');

// POST /api/users/register
const registerUser = async (req, res) => {
    try {
        console.log("Registering user:", req.body); // log incoming requests
        let { username, email, password, role } = req.body;
        email = email.toLowerCase().trim();

        // Validate input
        if (!username || !email || !password) {
            return res.status(400).json({ success: false, error: 'All fields are required.' });
        }

        // Check if user exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            console.log("User already exists:", email); // log duplicate
            return res.status(400).json({ success: false, error: 'Email already in use.'})
        }

        // Create & save user (password is hashed via pre-save middleware)
        const user = new User({ username, email, password, role: role || 'user' });
        await user.save();
        console.log("user successfully saved:", user); // log successful save
        // Generate JWT token
        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);

        res.status(201).json({
            success: true,
            message: 'User registered successfully!',
            user: { _id: user._id, username: user.username, email: user.email, role: user.role },
            accessToken,
            refreshToken
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

        // check for missing email or password
        if (!email && !password) {
            return res.status(400).json({ success: false, error: 'Email and password are required.' });
        }
        if (!email || email.trim() === "") {
            return res.status(400).json({ succes: false, error: 'Email is required. '});
        }
        if (!password || password.trim() === "") {
            return res.status(400).json({ success: false, error: 'Password is required.' });
        }

        // Normalize & validate email format
        email = email.toLowerCase().trim();
        if (!/^\S+@\S+\.\S+$/.test(email)) {
            return res.status(400).json({ success: false, error: 'Invalid email format. '});
        }

        // Find user & include password
        const foundUser = await User.findOne({ email }).select('+password');
        if (!foundUser) {
            // logs detailed non-existent email credentials for backend data
            return res.status(401).json({ success: false, error: 'Invalid credentials!' });
        }

        // Compare passwords
        if (!(await bcrypt.compare(password, foundUser.password))) {
            return res.status(401).json({ success: false, error: 'Invalid credentials!' });
        }

        // Generate JWT token
        const accessToken = generateAccessToken(foundUser);
        const refreshToken = generateRefreshToken(foundUser);        

        res.status(200).json({
            success: true,
            message: 'User logged in successfully!',
            accessToken,
            refreshToken,
            user: {
              id: foundUser._id,
              username: foundUser.username,
              email: foundUser.email,
              role: foundUser.role
            }
          });          

    } catch (error) {
        console.error('Error logging in user:', error.message);
        res.status(500).json({ success: false, error: 'Failed to log in user.' });
    }
};

// POST /api/users/refresh
const refreshTokenHandler = async (req, res) => {
    try {
        const {refreshToken} = req.body;

        if (!refreshToken) {
            return res.status(400).json({success: false, message: 'Refresh token missing.' });
        }

        const decoded = verifyRefreshToken(refreshToken);
        if (!decoded) {
            return res.status(403).json({ success: false, message: 'Invalid or expired refresh token.' });
        }

        const newAccessToken = generateAccessToken(decoded);
        const newRefreshToken = generateRefreshToken(decoded); // Token rotation

        return res.status(200).json({
            success: true, 
            accessToken: newAccessToken,
            refreshToken: newRefreshToken,
            user: {
                id: decoded.id,
                username: decoded.username,
                role: decoded.role,
            },
        });
    } catch (err) {
        console.error('[REFRESH TOKEN ERROR]', err);
        res.status(500).json({success: false, message: 'Internal server error.'});
    }
};

// POST /api/users/logout
const logoutUser = (req, res) => {
    try {
        res.status(200).json({ success: true, message: 'User logged out successfully!' });
    } catch (error) {
        console.log("Error logging out user:", error.message );
        res.status(500).json({ success: false, error: "Failed to log out user." });
    }

};

// GET /api/users/profile
const getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        if (!user) {
            return res.status(404).json({ error: 'User not found.' });
        }
        res.status(200).json(user); // Just return the user object
    } catch (error) {
        console.error('Error fetching user profile:', error.message);
        res.status(500).json({ error: 'Failed to fetch user profile.' });
    }
};



// GET /api/users    GET ALL USERS
const getAllUsers = async (req, res) => {
    try{ 
        // Fetch all users from the database
        const users = await User.find({}).select('-password'); // exclude passwords
        if (!users || users.length === 0) {
            return res.status(404).json({ success: false, error: 'No users found.' });
        }
        res.status(200).json({ success: true, users });
    } catch (error) {
        console.error('Error retrieving all users:', error.message);
    }
        res.status(500).json({ success: false, error: 'Failed to retreive users.' });
    };


// PUT /api/users/profile
const updateUserProfile = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // Ensures a minimum of 1 field is provided for update
        if (!username && !email && !password) {
            return res.status(400).json({ success: false, error: "No update fields provided." });
        }

        // Find a user in database
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ success: false, error: "User not found." });
        }

        // Update username (if provided)
        if (username) {
            if (username.trim()==="") { // ensures .trim() on username check
                return res.status(400).json({ success: false, error: "Username cannot be empty." });
            }
            user.username=username;
        }

    // Update email (if provided)
    if (email) {
    if (!/^\S+@\S+\.\S+$/.test(email)) {
                 return res.status(400).json({ success: false, error: "Invalid email format." });
            }

    // Skip DB query if email isn't changing
    if (email !== user.email) {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ success: false, error: "Email already in use." });
        }
    }
        user.email = email;  
    } 

        // Update password (if provided)
        if (password) {
            if (password.length < 6) {
                return res.status(400).json({ success: false, error: "Password must be at least 6 characters long."});
            }
            user.password = password; // hashing handled by pre-save middleware
        }

        // Save updates
        const updatedUser = await user.save();
        res.status(200).json({ success: true, message: 'Profile updated successfully!', 
            user: {
                _id: updatedUser._id,
                username: updatedUser.username,
                email: updatedUser.email,
            },
        });

    } catch (error) {
        console.error('Error updating profile:', error.message);
        res.status(500).json({ success: false, error: 'Failed to update profile.' });
    }
};

// DELETE /api/users/:userId
const deleteUser = async (req, res) => {
    try {
        const { userId } = req.params;

        // Prevent user from deleting someon else's account
        if(req.user.id !== userId) {
            return res.status(403).json({ message: "forbidden: You can only delete your own account."})
        }
        
        // Validate user ID format
        if (!userId.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({ success: false, error: 'Invalid user ID.' });
        }

        // Find and delete user
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

// PATCH /api/users/progress/anagram
const updateAnagramProgress = async (req, res) => {
  console.log('[PATCH] /progress/anagram → incoming body:', req.body);

  try {
    const { sessionId, topic, startedAt, finishedAt, totalAttempted, totalCorrect } = req.body;

    if (!startedAt || !finishedAt || typeof totalAttempted !== 'number' || typeof totalCorrect !== 'number') {
      return res.status(400).json({ success: false, error: 'Missing or invalid fields.' });
    }
    if (totalAttempted < 0 || totalCorrect < 0 || totalCorrect > totalAttempted) {
      return res.status(400).json({ success: false, error: 'Invalid score totals.' });
    }

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ success: false, error: 'User not found.' });

    const started = new Date(startedAt);
    const finished = new Date(finishedAt);
    const durationMs = finished - started;
    const accuracyPct = totalAttempted > 0 ? totalCorrect / totalAttempted : 0;

    const newSession = {
      sessionId: sessionId || new mongoose.Types.ObjectId().toString(),
      topic,
      startedAt: started,
      finishedAt: finished,
      durationMs,
      totalAttempted,
      totalCorrect,
      accuracyPct,
      targetCount: 25,
    };

    user.anagramSessions.push(newSession);

    // rollups
    const sessions = user.anagramSessions;
    const totalSets = sessions.length;
    const accs  = sessions.map(s => s.accuracyPct || 0);
    const times = sessions.map(s => s.durationMs).filter(Boolean);

    const bestAccuracy = accs.length ? Math.max(...accs) : 0;
    const avgAccuracy  = accs.length ? accs.reduce((a,b)=>a+b,0) / accs.length : 0;
    const bestAvgTimeMs = times.length ? Math.min(...times) : null;
    const avgTimeMs     = times.length ? Math.round(times.reduce((a,b)=>a+b,0) / times.length) : null;

    user.anagramStats = {
      totalSetsCompleted: totalSets,
      bestAccuracy,
      avgAccuracy,
      bestAvgTimeMs,
      avgTimeMs,
    };

    await user.save();

    return res.status(200).json({
      success: true,
      message: 'Anagram progress updated successfully!',
      stats: user.anagramStats,
      latestSession: newSession,
    });
  } catch (err) {
    console.error('❌ Error updating anagram progress:', err.message);
    return res.status(500).json({ success: false, error: 'Server error updating anagram progress.' });
  }
};

// GET /api/users/progress/anagram/summary
const getAnagramSummary = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('anagramStats').lean();
    if (!user) return res.status(404).json({ success: false, error: 'User not found.' });

    const summary = user.anagramStats || {
      totalSetsCompleted: 0,
      bestAccuracy: 0,
      avgAccuracy: 0,
      bestAvgTimeMs: null,
      avgTimeMs: null,
    };

    return res.status(200).json({ success: true, summary });
  } catch (err) {
    console.error('❌ getAnagramSummary error:', err);
    return res.status(500).json({ success: false, error: 'Server error.' });
  }
};

module.exports = {
  registerUser,
  loginUser,
  refreshTokenHandler,
  logoutUser,
  getUserProfile,
  updateUserProfile,
  deleteUser,
  getAllUsers,
  updateAnagramProgress,
  getAnagramSummary,
};




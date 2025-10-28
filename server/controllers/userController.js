const mongoose = require('mongoose');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const {
  verifyRefreshToken,
  generateAccessToken,
  generateRefreshToken,
} = require('../utils/auth');

/**
 * POST /api/users/signup
 */
const registerUser = async (req, res) => {
  try {
    const { username, email } = req.body || {};
    // Redact password in logs
    console.log('Registering user:', { username, email, password: '[redacted]' });

    let { password, role } = req.body || {};
    const normalizedEmail = (email || '').toLowerCase().trim();

    // Validate input
    if (!username || !normalizedEmail || !password) {
      return res.status(400).json({ success: false, error: 'All fields are required.' });
    }

    // Check if user exists
    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      console.log('User already exists:', normalizedEmail);
      return res.status(400).json({ success: false, error: 'Email already in use.' });
    }

    // Create & save user (password hashed via model pre-save)
    const user = new User({
      username,
      email: normalizedEmail,
      password,
      role: role || 'user',
    });
    await user.save();
    console.log('User successfully saved:', user.username);

    // Tokens
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    return res.status(201).json({
      success: true,
      message: 'User registered successfully!',
      user: {
        id: user._id, // normalized to id (Option A)
        username: user.username,
        email: user.email,
        role: user.role,
      },
      accessToken,
      refreshToken,
    });
  } catch (error) {
    console.error('Error registering user:', error.message);
    return res.status(500).json({ success: false, error: 'Failed to register user.' });
  }
};

/**
 * POST /api/users/login  (mounted as /api/users/signin)
 */
const loginUser = async (req, res) => {
  try {
    let { email, password } = req.body || {};

    if (!email && !password) {
      return res.status(400).json({ success: false, error: 'Email and password are required.' });
    }
    if (!email || email.trim() === '') {
      return res.status(400).json({ success: false, error: 'Email is required.' });
    }
    if (!password || password.trim() === '') {
      return res.status(400).json({ success: false, error: 'Password is required.' });
    }

    // Normalize & validate email
    email = email.toLowerCase().trim();
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      return res.status(400).json({ success: false, error: 'Invalid email format.' });
    }

    // Find user & include password for comparison
    const foundUser = await User.findOne({ email }).select('+password');
    if (!foundUser) {
      return res.status(401).json({ success: false, error: 'Invalid credentials!' });
    }

    // Compare passwords
    const match = await bcrypt.compare(password, foundUser.password);
    if (!match) {
      return res.status(401).json({ success: false, error: 'Invalid credentials!' });
    }

    // Tokens
    const accessToken = generateAccessToken(foundUser);
    const refreshToken = generateRefreshToken(foundUser);

    return res.status(200).json({
      success: true,
      message: 'User logged in successfully!',
      accessToken,
      refreshToken,
      user: {
        id: foundUser._id, // normalized to id (Option A)
        username: foundUser.username,
        email: foundUser.email,
        role: foundUser.role,
      },
    });
  } catch (error) {
    console.error('Error logging in user:', error.message);
    return res.status(500).json({ success: false, error: 'Failed to log in user.' });
  }
};

/**
 * POST /api/users/refresh
 * Body: { refreshToken }
 * Decoded payload is expected to include sub/username/role
 */
const refreshTokenHandler = async (req, res) => {
  try {
    const { refreshToken } = req.body || {};
    if (!refreshToken) {
      return res.status(400).json({ success: false, message: 'Refresh token missing.' });
    }

    const decoded = verifyRefreshToken(refreshToken);
    if (!decoded) {
      return res.status(403).json({ success: false, message: 'Invalid or expired refresh token.' });
    }

    // Issue new pair (rotation)
    const newAccessToken = generateAccessToken(decoded);
    const newRefreshToken = generateRefreshToken(decoded);

    return res.status(200).json({
      success: true,
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
      user: {
        id: decoded.sub, // ← prefer sub from token
        username: decoded.username,
        role: decoded.role,
      },
    });
  } catch (err) {
    console.error('[REFRESH TOKEN ERROR]', err);
    return res.status(500).json({ success: false, message: 'Internal server error.' });
  }
};

/**
 * POST /api/users/logout
 */
const logoutUser = (req, res) => {
  try {
    return res.status(200).json({ success: true, message: 'User logged out successfully!' });
  } catch (error) {
    console.log('Error logging out user:', error.message);
    return res.status(500).json({ success: false, error: 'Failed to log out user.' });
  }
};

/**
 * GET /api/users/profile  (Protected)
 */
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }
    // Return the plain user doc (keeps FE simple)
    return res.status(200).json({
      id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
      anagramProgress: user.anagramProgress,
      reviewedQuestions: user.reviewedQuestions,
      anagramSessions: user.anagramSessions,
      anagramStats: user.anagramStats,
    });
  } catch (error) {
    console.error('Error fetching user profile:', error.message);
    return res.status(500).json({ error: 'Failed to fetch user profile.' });
  }
};

/**
 * GET /api/users  (Admin only)
 */
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}).select('-password');
    if (!users || users.length === 0) {
      return res.status(404).json({ success: false, error: 'No users found.' });
    }
    return res.status(200).json({ success: true, users });
  } catch (error) {
    console.error('Error retrieving all users:', error.message);
    return res.status(500).json({ success: false, error: 'Failed to retrieve users.' });
  }
};

/**
 * PUT /api/users/profile  (Protected)
 */
const updateUserProfile = async (req, res) => {
  try {
    const { username, email, password } = req.body || {};

    // Must include at least one field
    if (!username && !email && !password) {
      return res.status(400).json({ success: false, error: 'No update fields provided.' });
    }

    const user = await User.findById(req.user.id).select('+password');
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found.' });
    }

    if (username) {
      if (username.trim() === '') {
        return res.status(400).json({ success: false, error: 'Username cannot be empty.' });
      }
      user.username = username;
    }

    if (email) {
      if (!/^\S+@\S+\.\S+$/.test(email)) {
        return res.status(400).json({ success: false, error: 'Invalid email format.' });
      }
      const normalizedEmail = email.toLowerCase().trim();
      if (normalizedEmail !== user.email) {
        const existingUser = await User.findOne({ email: normalizedEmail });
        if (existingUser) {
          return res.status(400).json({ success: false, error: 'Email already in use.' });
        }
      }
      user.email = normalizedEmail;
    }

    if (password) {
      if (password.length < 6) {
        return res.status(400).json({ success: false, error: 'Password must be at least 6 characters long.' });
      }
      user.password = password; // pre-save will hash
    }

    const updatedUser = await user.save();
    return res.status(200).json({
      success: true,
      message: 'Profile updated successfully!',
      user: {
        id: updatedUser._id,
        username: updatedUser.username,
        email: updatedUser.email,
        role: updatedUser.role,
      },
    });
  } catch (error) {
    console.error('Error updating profile:', error.message);
    return res.status(500).json({ success: false, error: 'Failed to update profile.' });
  }
};

/**
 * DELETE /api/users/:userId  (Protected; self-delete)
 */
const deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;

    // Only allow self-delete (unless adding admin override)
    if (req.user.id !== userId) {
      return res.status(403).json({ message: 'Forbidden: You can only delete your own account.' });
    }

    // Validate ObjectId
    if (!/^[0-9a-fA-F]{24}$/.test(userId)) {
      return res.status(400).json({ success: false, error: 'Invalid user ID.' });
    }

    const user = await User.findByIdAndDelete(userId);
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found.' });
    }

    return res.status(200).json({ success: true, message: 'User deleted successfully!' });
  } catch (error) {
    console.error('Error deleting user:', error.message);
    return res.status(500).json({ success: false, error: 'Failed to delete user.' });
  }
};

/**
 * PATCH /api/users/progress/anagram  (Protected)
 */
const updateAnagramProgress = async (req, res) => {
  console.log('[PATCH] /progress/anagram → incoming body:', req.body);

  try {
    const { sessionId, topic, startedAt, finishedAt, totalAttempted, totalCorrect } = req.body || {};

    if (
      !startedAt ||
      !finishedAt ||
      typeof totalAttempted !== 'number' ||
      typeof totalCorrect !== 'number'
    ) {
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
    const sessions = user.anagramSessions || [];
    const totalSets = sessions.length;
    const accs = sessions.map((s) => s.accuracyPct || 0);
    const times = sessions.map((s) => s.durationMs).filter(Boolean);

    const bestAccuracy = accs.length ? Math.max(...accs) : 0;
    const avgAccuracy = accs.length ? accs.reduce((a, b) => a + b, 0) / accs.length : 0;
    const bestAvgTimeMs = times.length ? Math.min(...times) : null;
    const avgTimeMs = times.length ? Math.round(times.reduce((a, b) => a + b, 0) / times.length) : null;

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

/**
 * GET /api/users/progress/anagram/summary  (Protected)
 */
const getAnagramSummary = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('anagramStats').lean();
    if (!user) return res.status(404).json({ success: false, error: 'User not found.' });

    const summary =
      user.anagramStats || {
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

/**
 * GET /api/users/progress/anagram/sessions?limit=3  (Protected)
 * Returns recent anagram sessions with minimal fields.
 */
const listRecentAnagramSessions = async (req, res) => {
  try {
    const MAX_LIMIT = 10;
    let limit = parseInt(req.query.limit, 10);
    if (!Number.isFinite(limit) || limit <= 0) limit = 3;
    if (limit > MAX_LIMIT) limit = MAX_LIMIT;

    const user = await User.findById(req.user.id)
      .select('anagramSessions')
      .lean();

    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found.' });
    }

    const sessions = (user.anagramSessions || [])
      .filter(s => s && s.finishedAt) // only sessions that are completed
      .sort((a, b) => new Date(b.finishedAt) - new Date(a.finishedAt))
      .slice(0, limit)
      .map(s => {
        const totalCorrect = s.totalCorrect ?? 0;
        const totalAttempted = s.totalAttempted ?? 0;

        // prefer stored accuracyPct/durationMs; fallback compute if needed
        const accuracyPct = (typeof s.accuracyPct === 'number')
          ? s.accuracyPct
          : (totalAttempted > 0 ? totalCorrect / totalAttempted : 0);

        const durationMs = (typeof s.durationMs === 'number')
          ? s.durationMs
          : (s.startedAt && s.finishedAt
              ? new Date(s.finishedAt) - new Date(s.startedAt)
              : null);

        return {
          sessionId: s.sessionId,
          topic: s.topic || null,
          finishedAt: s.finishedAt,
          totalCorrect,
          totalAttempted,
          accuracyPct,
          durationMs,
        };
      });

    return res.status(200).json({ success: true, sessions });
  } catch (err) {
    console.error('❌ listRecentAnagramSessions error:', err);
    return res.status(500).json({ success: false, error: 'Server error.' });
  }
};

module.exports = {
  registerUser,
  loginUser,
  refreshTokenHandler,
  logoutUser,
  getUserProfile,
  getAllUsers,
  updateUserProfile,
  deleteUser,
  updateAnagramProgress,
  getAnagramSummary,
  listRecentAnagramSessions,
};

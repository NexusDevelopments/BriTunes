const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { protect } = require('../middleware/auth');

// Profanity filter
const badWords = ['fuck', 'shit', 'bitch', 'ass', 'damn', 'crap', 'hell', 'bastard', 'dick', 'pussy', 'cock', 'slut', 'whore', 'nigger', 'nigga', 'fag', 'retard'];

const containsProfanity = (text) => {
  const lowerText = text.toLowerCase();
  return badWords.some(word => lowerText.includes(word));
};

const isPasswordStrong = (password) => {
  // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const isLongEnough = password.length >= 8;
  
  return hasUpperCase && hasLowerCase && hasNumber && isLongEnough;
};

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d'
  });
};

// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
router.post('/register', [
  body('username').trim().isLength({ min: 3, max: 20 }).withMessage('Username must be between 3-20 characters'),
  body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ error: errors.array()[0].msg });
  }

  const { username, password, displayName } = req.body;

  try {
    // Validate username length
    if (username.length > 20) {
      return res.status(400).json({ error: 'Username must be 20 characters or less' });
    }

    // Check for profanity in username
    if (containsProfanity(username)) {
      return res.status(400).json({ error: 'Username contains inappropriate language' });
    }

    // Validate display name if provided
    const finalDisplayName = displayName || username;
    if (finalDisplayName.length > 20) {
      return res.status(400).json({ error: 'Display name must be 20 characters or less' });
    }

    if (containsProfanity(finalDisplayName)) {
      return res.status(400).json({ error: 'Display name contains inappropriate language' });
    }

    // Check password strength
    if (!isPasswordStrong(password)) {
      return res.status(400).json({ error: 'Password must be at least 8 characters and contain uppercase, lowercase, and a number' });
    }

    // Check if username already exists
    const userExists = await User.findOne({ username });

    if (userExists) {
      return res.status(400).json({ error: 'Username is already taken' });
    }

    // Create user
    const user = await User.create({
      username,
      password,
      displayName: finalDisplayName
    });

    if (user) {
      const token = generateToken(user._id);

      res.status(201).json({
        _id: user._id,
        username: user.username,
        displayName: user.displayName,
        profileImage: user.profileImage,
        token
      });
    } else {
      res.status(400).json({ error: 'Invalid user data' });
    }
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Server error during registration' });
  }
});

// @route   POST /api/auth/login
// @desc    Authenticate user & get token
// @access  Public
router.post('/login', [
  body('username').trim().notEmpty().withMessage('Username is required'),
  body('password').exists().withMessage('Password is required')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ error: errors.array()[0].msg });
  }

  const { username, password } = req.body;

  try {
    // Check for user
    const user = await User.findOne({ username });

    if (user && (await user.matchPassword(password))) {
      const token = generateToken(user._id);

      res.json({
        _id: user._id,
        username: user.username,
        displayName: user.displayName,
        profileImage: user.profileImage,
        token
      });
    } else {
      res.status(401).json({ error: 'Invalid username or password' });
    }
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Server error during login' });
  }
});

// @route   GET /api/auth/me
// @desc    Get current user
// @access  Private
router.get('/me', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    res.json(user);
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;

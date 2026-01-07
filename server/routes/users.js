const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { protect } = require('../middleware/auth');

// @route   GET /api/users/profile
// @desc    Get user profile
// @access  Private
router.get('/profile', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    res.json(user);
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   PUT /api/users/profile
// @desc    Update user profile
// @access  Private
router.put('/profile', protect, async (req, res) => {
  try {
    const { displayName, profileImage } = req.body;
    
    const user = await User.findById(req.user._id);

    if (displayName) user.displayName = displayName;
    if (profileImage !== undefined) user.profileImage = profileImage;

    await user.save();

    res.json({
      _id: user._id,
      username: user.username,
      email: user.email,
      displayName: user.displayName,
      profileImage: user.profileImage
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   GET /api/users/notifications
// @desc    Get user notifications
// @access  Private
router.get('/notifications', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    
    // Sort notifications by date (newest first)
    const notifications = user.notifications.sort((a, b) => 
      new Date(b.createdAt) - new Date(a.createdAt)
    );

    res.json(notifications);
  } catch (error) {
    console.error('Get notifications error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   PUT /api/users/notifications/:id/read
// @desc    Mark notification as read
// @access  Private
router.put('/notifications/:id/read', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    
    const notification = user.notifications.id(req.params.id);
    if (!notification) {
      return res.status(404).json({ error: 'Notification not found' });
    }

    notification.read = true;
    await user.save();

    res.json({ message: 'Notification marked as read' });
  } catch (error) {
    console.error('Mark notification read error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   POST /api/users/listening-history
// @desc    Add track to listening history
// @access  Private
router.post('/listening-history', protect, async (req, res) => {
  try {
    const { trackId, trackName, artistName } = req.body;
    
    const user = await User.findById(req.user._id);

    // Add to listening history (keep last 100 tracks)
    user.listeningHistory.unshift({
      trackId,
      trackName,
      artistName,
      playedAt: new Date()
    });

    // Keep only last 100 tracks
    if (user.listeningHistory.length > 100) {
      user.listeningHistory = user.listeningHistory.slice(0, 100);
    }

    await user.save();

    res.json({ message: 'Added to listening history' });
  } catch (error) {
    console.error('Add to listening history error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   GET /api/users/listening-history
// @desc    Get user's listening history
// @access  Private
router.get('/listening-history', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    res.json(user.listeningHistory);
  } catch (error) {
    console.error('Get listening history error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;

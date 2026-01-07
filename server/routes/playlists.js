const express = require('express');
const router = express.Router();
const Playlist = require('../models/Playlist');
const User = require('../models/User');
const spotifyService = require('../services/spotifyService');
const { protect } = require('../middleware/auth');

// @route   POST /api/playlists
// @desc    Create a new playlist
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    const { name, description, isPublic, coverImage } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'Playlist name is required' });
    }

    const playlist = await Playlist.create({
      name,
      description: description || '',
      owner: req.user._id,
      isPublic: isPublic !== undefined ? isPublic : true,
      coverImage: coverImage || '',
      tracks: []
    });

    res.status(201).json(playlist);
  } catch (error) {
    console.error('Create playlist error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   GET /api/playlists
// @desc    Get user's playlists
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const playlists = await Playlist.find({ owner: req.user._id })
      .sort({ createdAt: -1 });
    
    res.json(playlists);
  } catch (error) {
    console.error('Get playlists error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   GET /api/playlists/:id
// @desc    Get playlist by ID
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const playlist = await Playlist.findById(req.params.id).populate('owner', 'username displayName');

    if (!playlist) {
      return res.status(404).json({ error: 'Playlist not found' });
    }

    // Check if user has access to this playlist
    if (!playlist.isPublic && playlist.owner._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Access denied' });
    }

    res.json(playlist);
  } catch (error) {
    console.error('Get playlist error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   PUT /api/playlists/:id
// @desc    Update playlist
// @access  Private
router.put('/:id', protect, async (req, res) => {
  try {
    const playlist = await Playlist.findById(req.params.id);

    if (!playlist) {
      return res.status(404).json({ error: 'Playlist not found' });
    }

    // Check if user owns this playlist
    if (playlist.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const { name, description, isPublic, coverImage } = req.body;

    if (name) playlist.name = name;
    if (description !== undefined) playlist.description = description;
    if (isPublic !== undefined) playlist.isPublic = isPublic;
    if (coverImage !== undefined) playlist.coverImage = coverImage;

    await playlist.save();

    res.json(playlist);
  } catch (error) {
    console.error('Update playlist error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   DELETE /api/playlists/:id
// @desc    Delete playlist
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    const playlist = await Playlist.findById(req.params.id);

    if (!playlist) {
      return res.status(404).json({ error: 'Playlist not found' });
    }

    // Check if user owns this playlist
    if (playlist.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Access denied' });
    }

    await playlist.deleteOne();

    res.json({ message: 'Playlist deleted successfully' });
  } catch (error) {
    console.error('Delete playlist error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   POST /api/playlists/:id/tracks
// @desc    Add track to playlist
// @access  Private
router.post('/:id/tracks', protect, async (req, res) => {
  try {
    const playlist = await Playlist.findById(req.params.id);

    if (!playlist) {
      return res.status(404).json({ error: 'Playlist not found' });
    }

    // Check if user owns this playlist
    if (playlist.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const { trackId, trackName, artistName, albumName, duration, imageUrl } = req.body;

    if (!trackId) {
      return res.status(400).json({ error: 'Track ID is required' });
    }

    // Check if track already exists in playlist
    const trackExists = playlist.tracks.some(track => track.trackId === trackId);
    
    if (trackExists) {
      return res.status(400).json({ error: 'Track already in playlist' });
    }

    // Add track to playlist
    playlist.tracks.push({
      trackId,
      trackName,
      artistName,
      albumName,
      duration,
      imageUrl
    });

    await playlist.save();

    res.json(playlist);
  } catch (error) {
    console.error('Add track to playlist error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   DELETE /api/playlists/:id/tracks/:trackId
// @desc    Remove track from playlist
// @access  Private
router.delete('/:id/tracks/:trackId', protect, async (req, res) => {
  try {
    const playlist = await Playlist.findById(req.params.id);

    if (!playlist) {
      return res.status(404).json({ error: 'Playlist not found' });
    }

    // Check if user owns this playlist
    if (playlist.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Access denied' });
    }

    // Remove track from playlist
    playlist.tracks = playlist.tracks.filter(
      track => track.trackId !== req.params.trackId
    );

    await playlist.save();

    res.json(playlist);
  } catch (error) {
    console.error('Remove track from playlist error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   GET /api/playlists/:id/recommendations
// @desc    Get song recommendations based on playlist
// @access  Private
router.get('/:id/recommendations', protect, async (req, res) => {
  try {
    const playlist = await Playlist.findById(req.params.id);

    if (!playlist) {
      return res.status(404).json({ error: 'Playlist not found' });
    }

    // Get up to 5 random track IDs from the playlist
    const trackIds = playlist.tracks
      .map(track => track.trackId)
      .sort(() => 0.5 - Math.random())
      .slice(0, 5);

    if (trackIds.length === 0) {
      return res.json({ tracks: [] });
    }

    // Get recommendations from Spotify
    const recommendations = await spotifyService.getRecommendations(trackIds, []);

    res.json(recommendations);
  } catch (error) {
    console.error('Get playlist recommendations error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;

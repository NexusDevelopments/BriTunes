const express = require('express');
const router = express.Router();
const spotifyService = require('../services/spotifyService');
const { protect } = require('../middleware/auth');

// @route   GET /api/music/search
// @desc    Search for music (tracks, artists, albums)
// @access  Private
router.get('/search', protect, async (req, res) => {
  try {
    const { q, type, limit } = req.query;

    if (!q) {
      return res.status(400).json({ error: 'Search query is required' });
    }

    const results = await spotifyService.search(q, type || 'track,artist,album', limit || 20);
    res.json(results);
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ error: error.message });
  }
});

// @route   GET /api/music/track/:id
// @desc    Get track details
// @access  Private
router.get('/track/:id', protect, async (req, res) => {
  try {
    const track = await spotifyService.getTrack(req.params.id);
    res.json(track);
  } catch (error) {
    console.error('Get track error:', error);
    res.status(500).json({ error: error.message });
  }
});

// @route   GET /api/music/album/:id
// @desc    Get album details
// @access  Private
router.get('/album/:id', protect, async (req, res) => {
  try {
    const album = await spotifyService.getAlbum(req.params.id);
    res.json(album);
  } catch (error) {
    console.error('Get album error:', error);
    res.status(500).json({ error: error.message });
  }
});

// @route   GET /api/music/recommendations
// @desc    Get song recommendations
// @access  Private
router.get('/recommendations', protect, async (req, res) => {
  try {
    const { seed_tracks, seed_artists, limit } = req.query;
    
    const seedTracks = seed_tracks ? seed_tracks.split(',') : [];
    const seedArtists = seed_artists ? seed_artists.split(',') : [];

    const recommendations = await spotifyService.getRecommendations(
      seedTracks,
      seedArtists,
      limit || 20
    );
    
    res.json(recommendations);
  } catch (error) {
    console.error('Get recommendations error:', error);
    res.status(500).json({ error: error.message });
  }
});

// @route   GET /api/music/new-releases
// @desc    Get new releases
// @access  Private
router.get('/new-releases', protect, async (req, res) => {
  try {
    const { limit } = req.query;
    const newReleases = await spotifyService.getNewReleases(limit || 20);
    res.json(newReleases);
  } catch (error) {
    console.error('Get new releases error:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

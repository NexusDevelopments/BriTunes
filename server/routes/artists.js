const express = require('express');
const router = express.Router();
const spotifyService = require('../services/spotifyService');
const User = require('../models/User');
const { protect } = require('../middleware/auth');

// @route   GET /api/artists/:id
// @desc    Get artist details
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const artist = await spotifyService.getArtist(req.params.id);
    res.json(artist);
  } catch (error) {
    console.error('Get artist error:', error);
    res.status(500).json({ error: error.message });
  }
});

// @route   GET /api/artists/:id/albums
// @desc    Get artist's albums
// @access  Private
router.get('/:id/albums', protect, async (req, res) => {
  try {
    const { limit } = req.query;
    const albums = await spotifyService.getArtistAlbums(req.params.id, limit || 20);
    res.json(albums);
  } catch (error) {
    console.error('Get artist albums error:', error);
    res.status(500).json({ error: error.message });
  }
});

// @route   GET /api/artists/:id/top-tracks
// @desc    Get artist's top tracks
// @access  Private
router.get('/:id/top-tracks', protect, async (req, res) => {
  try {
    const topTracks = await spotifyService.getArtistTopTracks(req.params.id);
    res.json(topTracks);
  } catch (error) {
    console.error('Get artist top tracks error:', error);
    res.status(500).json({ error: error.message });
  }
});

// @route   POST /api/artists/:id/follow
// @desc    Follow an artist
// @access  Private
router.post('/:id/follow', protect, async (req, res) => {
  try {
    const artistId = req.params.id;
    const user = await User.findById(req.user._id);

    // Check if already following
    const isFollowing = user.followedArtists.some(
      artist => artist.artistId === artistId
    );

    if (isFollowing) {
      return res.status(400).json({ error: 'Already following this artist' });
    }

    // Get artist details from Spotify
    const artist = await spotifyService.getArtist(artistId);

    // Add to followed artists
    user.followedArtists.push({
      artistId: artist.id,
      artistName: artist.name,
      artistImage: artist.images && artist.images.length > 0 ? artist.images[0].url : ''
    });

    await user.save();

    res.json({ 
      message: 'Successfully followed artist',
      artist: {
        id: artist.id,
        name: artist.name,
        image: artist.images && artist.images.length > 0 ? artist.images[0].url : ''
      }
    });
  } catch (error) {
    console.error('Follow artist error:', error);
    res.status(500).json({ error: error.message });
  }
});

// @route   DELETE /api/artists/:id/follow
// @desc    Unfollow an artist
// @access  Private
router.delete('/:id/follow', protect, async (req, res) => {
  try {
    const artistId = req.params.id;
    const user = await User.findById(req.user._id);

    // Remove from followed artists
    user.followedArtists = user.followedArtists.filter(
      artist => artist.artistId !== artistId
    );

    await user.save();

    res.json({ message: 'Successfully unfollowed artist' });
  } catch (error) {
    console.error('Unfollow artist error:', error);
    res.status(500).json({ error: error.message });
  }
});

// @route   GET /api/artists/followed/list
// @desc    Get user's followed artists
// @access  Private
router.get('/followed/list', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    res.json(user.followedArtists);
  } catch (error) {
    console.error('Get followed artists error:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

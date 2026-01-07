const mongoose = require('mongoose');

const playlistSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    default: ''
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  coverImage: {
    type: String,
    default: ''
  },
  isPublic: {
    type: Boolean,
    default: true
  },
  tracks: [{
    trackId: String,
    trackName: String,
    artistName: String,
    albumName: String,
    duration: Number,
    imageUrl: String,
    addedAt: {
      type: Date,
      default: Date.now
    }
  }],
  collaborative: {
    type: Boolean,
    default: false
  },
  followers: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Playlist', playlistSchema);

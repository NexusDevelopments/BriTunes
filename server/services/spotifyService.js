const axios = require('axios');

class MusicService {
  constructor() {
    // Deezer API - completely free, no API key required
    this.deezerBaseUrl = 'https://api.deezer.com';
    // AudioDB API - free tier available
    this.audioDbBaseUrl = 'https://theaudiodb.com/api/v1/json';
    this.audioDbKey = process.env.AUDIODB_API_KEY || '2'; // '2' is the free test key
  }

  // Search for tracks, artists, or albums using Deezer API
  async search(query, type = 'track,artist,album', limit = 20) {
    try {
      const types = type.split(',');
      const results = {};

      // Search for each type
      if (types.includes('track')) {
        const trackRes = await axios.get(`${this.deezerBaseUrl}/search`, {
          params: { q: query, limit: limit }
        });
        results.tracks = {
          items: trackRes.data.data.map(track => ({
            id: track.id.toString(),
            name: track.title,
            artists: [{ name: track.artist.name, id: track.artist.id.toString() }],
            album: {
              name: track.album.title,
              images: [{ url: track.album.cover_xl || track.album.cover_big }]
            },
            duration_ms: track.duration * 1000,
            preview_url: track.preview
          }))
        };
      }

      if (types.includes('artist')) {
        const artistRes = await axios.get(`${this.deezerBaseUrl}/search/artist`, {
          params: { q: query, limit: limit }
        });
        results.artists = {
          items: artistRes.data.data.map(artist => ({
            id: artist.id.toString(),
            name: artist.name,
            images: [{ url: artist.picture_xl || artist.picture_big }],
            followers: { total: artist.nb_fan || 0 }
          }))
        };
      }

      if (types.includes('album')) {
        const albumRes = await axios.get(`${this.deezerBaseUrl}/search/album`, {
          params: { q: query, limit: limit }
        });
        results.albums = {
          items: albumRes.data.data.map(album => ({
            id: album.id.toString(),
            name: album.title,
            artists: [{ name: album.artist.name }],
            images: [{ url: album.cover_xl || album.cover_big }],
            release_date: album.release_date,
            total_tracks: album.nb_tracks || 0,
            album_type: album.record_type || 'album'
          }))
        };
      }

      return results;
    } catch (error) {
      console.error('Music search error:', error.response?.data || error.message);
      throw new Error('Failed to search music');
    }
  }

  // Get track by ID
  async getTrack(trackId) {
    try {
      const response = await axios.get(`${this.deezerBaseUrl}/track/${trackId}`);
      const track = response.data;
      
      return {
        id: track.id.toString(),
        name: track.title,
        artists: [{ name: track.artist.name, id: track.artist.id.toString() }],
        album: {
          name: track.album.title,
          images: [{ url: track.album.cover_xl }]
        },
        duration_ms: track.duration * 1000,
        preview_url: track.preview
      };
    } catch (error) {
      console.error('Get track error:', error.response?.data || error.message);
      throw new Error('Failed to get track');
    }
  }

  // Get artist by ID
  async getArtist(artistId) {
    try {
      const response = await axios.get(`${this.deezerBaseUrl}/artist/${artistId}`);
      const artist = response.data;
      
      return {
        id: artist.id.toString(),
        name: artist.name,
        images: [{ url: artist.picture_xl || artist.picture_big }],
        followers: { total: artist.nb_fan || 0 },
        genres: [] // Deezer doesn't provide genres in basic endpoint
      };
    } catch (error) {
      console.error('Get artist error:', error.response?.data || error.message);
      throw new Error('Failed to get artist');
    }
  }

  // Get artist's albums
  async getArtistAlbums(artistId, limit = 20) {
    try {
      const response = await axios.get(`${this.deezerBaseUrl}/artist/${artistId}/albums`, {
        params: { limit: limit }
      });
      
      return {
        items: response.data.data.map(album => ({
          id: album.id.toString(),
          name: album.title,
          images: [{ url: album.cover_xl || album.cover_big }],
          release_date: album.release_date,
          total_tracks: album.nb_tracks || 0,
          album_type: album.record_type || 'album'
        }))
      };
    } catch (error) {
      console.error('Get artist albums error:', error.response?.data || error.message);
      throw new Error('Failed to get artist albums');
    }
  }

  // Get artist's top tracks
  async getArtistTopTracks(artistId) {
    try {
      const response = await axios.get(`${this.deezerBaseUrl}/artist/${artistId}/top`, {
        params: { limit: 10 }
      });
      
      return {
        tracks: response.data.data.map(track => ({
          id: track.id.toString(),
          name: track.title,
          artists: [{ name: track.artist.name }],
          album: {
            name: track.album.title,
            images: [{ url: track.album.cover_xl }]
          },
          duration_ms: track.duration * 1000,
          preview_url: track.preview
        }))
      };
    } catch (error) {
      console.error('Get artist top tracks error:', error.response?.data || error.message);
      throw new Error('Failed to get artist top tracks');
    }
  }

  // Get album by ID
  async getAlbum(albumId) {
    try {
      const response = await axios.get(`${this.deezerBaseUrl}/album/${albumId}`);
      const album = response.data;
      
      return {
        id: album.id.toString(),
        name: album.title,
        artists: [{ name: album.artist.name }],
        images: [{ url: album.cover_xl }],
        release_date: album.release_date,
        total_tracks: album.nb_tracks,
        tracks: {
          items: album.tracks?.data?.map(track => ({
            id: track.id.toString(),
            name: track.title,
            duration_ms: track.duration * 1000
          })) || []
        }
      };
    } catch (error) {
      console.error('Get album error:', error.response?.data || error.message);
      throw new Error('Failed to get album');
    }
  }

  // Get recommendations based on seed tracks and artists
  async getRecommendations(seedTracks = [], seedArtists = [], limit = 20) {
    try {
      // Get radio tracks from a random seed track or artist
      const seedId = seedTracks[0] || seedArtists[0];
      if (!seedId) {
        // If no seeds, return popular tracks
        const response = await axios.get(`${this.deezerBaseUrl}/chart/0/tracks`, {
          params: { limit: limit }
        });
        return {
          tracks: response.data.data.map(track => ({
            id: track.id.toString(),
            name: track.title,
            artists: [{ name: track.artist.name }],
            album: {
              name: track.album.title,
              images: [{ url: track.album.cover_xl }]
            },
            duration_ms: track.duration * 1000,
            preview_url: track.preview
          }))
        };
      }

      // Get related tracks using radio endpoint
      const endpoint = seedTracks[0] ? `/track/${seedId}/radio` : `/artist/${seedId}/radio`;
      const response = await axios.get(`${this.deezerBaseUrl}${endpoint}`, {
        params: { limit: limit }
      });
      
      return {
        tracks: response.data.data.map(track => ({
          id: track.id.toString(),
          name: track.title,
          artists: [{ name: track.artist.name }],
          album: {
            name: track.album.title,
            images: [{ url: track.album.cover_xl }]
          },
          duration_ms: track.duration * 1000,
          preview_url: track.preview
        }))
      };
    } catch (error) {
      console.error('Get recommendations error:', error.response?.data || error.message);
      throw new Error('Failed to get recommendations');
    }
  }

  // Get new releases (chart albums)
  async getNewReleases(limit = 20) {
    try {
      const response = await axios.get(`${this.deezerBaseUrl}/chart/0/albums`, {
        params: { limit: limit }
      });
      
      return {
        albums: {
          items: response.data.data.map(album => ({
            id: album.id.toString(),
            name: album.title,
            artists: [{ name: album.artist.name }],
            images: [{ url: album.cover_xl || album.cover_big }],
            release_date: album.release_date,
            total_tracks: album.nb_tracks || 0,
            album_type: album.record_type || 'album'
          }))
        }
      };
    } catch (error) {
      console.error('Get new releases error:', error.response?.data || error.message);
      throw new Error('Failed to get new releases');
    }
  }
}

module.exports = new MusicService();

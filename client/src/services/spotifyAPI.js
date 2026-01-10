import axios from 'axios';

const API_BASE = 'https://api.spotify.com/v1';

class SpotifyAPI {
  constructor() {
    this.token = null;
  }

  setToken(token) {
    this.token = token;
  }

  async request(endpoint, method = 'GET', data = null) {
    try {
      const config = {
        method,
        url: `${API_BASE}${endpoint}`,
        headers: {
          Authorization: `Bearer ${this.token}`,
          'Content-Type': 'application/json',
        },
      };

      if (data) {
        config.data = data;
      }

      const response = await axios(config);
      return response.data;
    } catch (error) {
      console.error('Spotify API Error:', error);
      throw error;
    }
  }

  // Search
  async search(query, type = 'track,album,artist,playlist', limit = 20) {
    return this.request(`/search?q=${encodeURIComponent(query)}&type=${type}&limit=${limit}`);
  }

  // Playlists
  async getPlaylists(limit = 50) {
    return this.request(`/me/playlists?limit=${limit}`);
  }

  async getPlaylist(playlistId) {
    return this.request(`/playlists/${playlistId}`);
  }

  async createPlaylist(userId, name, isPublic = true) {
    return this.request(`/users/${userId}/playlists`, 'POST', {
      name,
      public: isPublic,
    });
  }

  async addTracksToPlaylist(playlistId, uris) {
    return this.request(`/playlists/${playlistId}/tracks`, 'POST', { uris });
  }

  async removeTracksFromPlaylist(playlistId, uris) {
    return this.request(`/playlists/${playlistId}/tracks`, 'DELETE', {
      tracks: uris.map((uri) => ({ uri })),
    });
  }

  // Albums
  async getAlbum(albumId) {
    return this.request(`/albums/${albumId}`);
  }

  async getUserAlbums(limit = 50) {
    return this.request(`/me/albums?limit=${limit}`);
  }

  async saveAlbum(albumId) {
    return this.request(`/me/albums?ids=${albumId}`, 'PUT');
  }

  async removeAlbum(albumId) {
    return this.request(`/me/albums?ids=${albumId}`, 'DELETE');
  }

  // Artists
  async getArtist(artistId) {
    return this.request(`/artists/${artistId}`);
  }

  async getArtistTopTracks(artistId, market = 'US') {
    return this.request(`/artists/${artistId}/top-tracks?market=${market}`);
  }

  async getArtistAlbums(artistId) {
    return this.request(`/artists/${artistId}/albums`);
  }

  async getRelatedArtists(artistId) {
    return this.request(`/artists/${artistId}/related-artists`);
  }

  async getUserArtists(limit = 50) {
    return this.request(`/me/following?type=artist&limit=${limit}`);
  }

  async followArtist(artistId) {
    return this.request(`/me/following?type=artist&ids=${artistId}`, 'PUT');
  }

  async unfollowArtist(artistId) {
    return this.request(`/me/following?type=artist&ids=${artistId}`, 'DELETE');
  }

  // Tracks
  async getTrack(trackId) {
    return this.request(`/tracks/${trackId}`);
  }

  async saveTracks(trackIds) {
    return this.request(`/me/tracks`, 'PUT', { ids: trackIds });
  }

  async removeTracks(trackIds) {
    return this.request(`/me/tracks`, 'DELETE', { ids: trackIds });
  }

  async getSavedTracks(limit = 50) {
    return this.request(`/me/tracks?limit=${limit}`);
  }

  // User
  async getCurrentUser() {
    return this.request('/me');
  }

  async getUserTopTracks(timeRange = 'medium_term', limit = 20) {
    return this.request(`/me/top/tracks?time_range=${timeRange}&limit=${limit}`);
  }

  async getUserTopArtists(timeRange = 'medium_term', limit = 20) {
    return this.request(`/me/top/artists?time_range=${timeRange}&limit=${limit}`);
  }

  async getRecentlyPlayed(limit = 50) {
    return this.request(`/me/player/recently-played?limit=${limit}`);
  }

  // Browse
  async getFeaturedPlaylists() {
    return this.request('/browse/featured-playlists');
  }

  async getNewReleases(limit = 20) {
    return this.request(`/browse/new-releases?limit=${limit}`);
  }

  async getCategories(limit = 50) {
    return this.request(`/browse/categories?limit=${limit}`);
  }

  async getCategoryPlaylists(categoryId, limit = 20) {
    return this.request(`/browse/categories/${categoryId}/playlists?limit=${limit}`);
  }

  async getRecommendations(seedTracks, seedArtists, limit = 20) {
    const params = new URLSearchParams();
    if (seedTracks) params.append('seed_tracks', seedTracks.join(','));
    if (seedArtists) params.append('seed_artists', seedArtists.join(','));
    params.append('limit', limit);
    return this.request(`/recommendations?${params.toString()}`);
  }

  // Player
  async getDevices() {
    return this.request('/me/player/devices');
  }

  async transferPlayback(deviceId) {
    return this.request('/me/player', 'PUT', { device_ids: [deviceId] });
  }

  async getPlaybackState() {
    return this.request('/me/player');
  }

  async play(contextUri = null, uris = null, offset = null, deviceId = null) {
    const body = {};
    if (contextUri) body.context_uri = contextUri;
    if (uris) body.uris = uris;
    if (offset) body.offset = offset;
    
    const endpoint = deviceId ? `/me/player/play?device_id=${deviceId}` : '/me/player/play';
    return this.request(endpoint, 'PUT', body);
  }

  async pause() {
    return this.request('/me/player/pause', 'PUT');
  }

  async next() {
    return this.request('/me/player/next', 'POST');
  }

  async previous() {
    return this.request('/me/player/previous', 'POST');
  }

  async seek(positionMs) {
    return this.request(`/me/player/seek?position_ms=${positionMs}`, 'PUT');
  }

  async setVolume(volumePercent) {
    return this.request(`/me/player/volume?volume_percent=${volumePercent}`, 'PUT');
  }

  async setShuffle(state) {
    return this.request(`/me/player/shuffle?state=${state}`, 'PUT');
  }

  async setRepeat(state) {
    return this.request(`/me/player/repeat?state=${state}`, 'PUT');
  }

  async addToQueue(uri) {
    return this.request(`/me/player/queue?uri=${uri}`, 'POST');
  }
}

export default new SpotifyAPI();

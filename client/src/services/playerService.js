// Player service for controlling Spotify playback
class PlayerService {
  constructor() {
    this.player = null;
    this.deviceId = null;
  }

  // Initialize Spotify player
  initializePlayer(token, onStateChange, onReady) {
    if (!window.Spotify) {
      console.error('Spotify SDK not loaded');
      return;
    }

    this.player = new window.Spotify.Player({
      name: 'BriTunes Web Player',
      getOAuthToken: (cb) => {
        cb(token);
      },
      volume: 0.5,
    });

    // Ready
    this.player.addListener('ready', ({ device_id }) => {
      console.log('Ready with Device ID', device_id);
      this.deviceId = device_id;
      if (onReady) onReady(device_id);
    });

    // Not Ready
    this.player.addListener('not_ready', ({ device_id }) => {
      console.log('Device ID has gone offline', device_id);
    });

    // Player state changed
    this.player.addListener('player_state_changed', (state) => {
      if (onStateChange) onStateChange(state);
    });

    // Connect to the player
    this.player.connect();
  }

  // Play
  async play({ spotify_uri, uris, offset } = {}) {
    const token = localStorage.getItem('token');
    const body = {};

    if (spotify_uri) {
      body.context_uri = spotify_uri;
    }
    if (uris) {
      body.uris = uris;
    }
    if (offset) {
      body.offset = offset;
    }

    try {
      await fetch(`https://api.spotify.com/v1/me/player/play?device_id=${this.deviceId}`, {
        method: 'PUT',
        body: JSON.stringify(body),
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (error) {
      console.error('Error playing track:', error);
    }
  }

  // Pause
  async pause() {
    if (this.player) {
      await this.player.pause();
    }
  }

  // Resume
  async resume() {
    if (this.player) {
      await this.player.resume();
    }
  }

  // Toggle play/pause
  async togglePlay() {
    if (this.player) {
      await this.player.togglePlay();
    }
  }

  // Previous track
  async previousTrack() {
    if (this.player) {
      await this.player.previousTrack();
    }
  }

  // Next track
  async nextTrack() {
    if (this.player) {
      await this.player.nextTrack();
    }
  }

  // Seek to position
  async seek(position_ms) {
    if (this.player) {
      await this.player.seek(position_ms);
    }
  }

  // Set volume
  async setVolume(volume) {
    if (this.player) {
      await this.player.setVolume(volume);
    }
  }

  // Get current state
  async getCurrentState() {
    if (this.player) {
      return await this.player.getCurrentState();
    }
    return null;
  }

  // Disconnect
  disconnect() {
    if (this.player) {
      this.player.disconnect();
    }
  }
}

const playerServiceInstance = new PlayerService();
export default playerServiceInstance;

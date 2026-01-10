import { useState, useEffect } from 'react';

export const useSpotifyAuth = () => {
  const [token, setToken] = useState(null);

  useEffect(() => {
    // Check URL for token
    const hash = window.location.hash;
    if (hash) {
      const params = new URLSearchParams(hash.substring(1));
      const accessToken = params.get('access_token');
      
      if (accessToken) {
        setToken(accessToken);
        localStorage.setItem('spotify_token', accessToken);
        
        // Clear hash from URL
        window.history.replaceState(null, null, ' ');
      }
    } else {
      // Check localStorage
      const storedToken = localStorage.getItem('spotify_token');
      if (storedToken) {
        setToken(storedToken);
      }
    }
  }, []);

  const login = () => {
    const clientId = process.env.REACT_APP_SPOTIFY_CLIENT_ID;
    const redirectUri = process.env.REACT_APP_SPOTIFY_REDIRECT_URI;
    const scopes = [
      'user-read-private',
      'user-read-email',
      'user-library-read',
      'user-library-modify',
      'user-top-read',
      'user-read-recently-played',
      'user-follow-read',
      'user-follow-modify',
      'playlist-read-private',
      'playlist-read-collaborative',
      'playlist-modify-public',
      'playlist-modify-private',
      'streaming',
      'user-read-playback-state',
      'user-modify-playback-state',
      'user-read-currently-playing',
    ];

    const authUrl = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&redirect_uri=${encodeURIComponent(
      redirectUri
    )}&scope=${encodeURIComponent(scopes.join(' '))}`;

    window.location.href = authUrl;
  };

  const logout = () => {
    setToken(null);
    localStorage.removeItem('spotify_token');
  };

  return { token, login, logout };
};

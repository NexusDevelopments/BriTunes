import spotifyAPI from './spotifyAPI';

export const searchAll = async (query) => {
  return await spotifyAPI.search(query, 'track,album,artist,playlist');
};

export const searchTracks = async (query, limit = 20) => {
  return await spotifyAPI.search(query, 'track', limit);
};

export const searchAlbums = async (query, limit = 20) => {
  return await spotifyAPI.search(query, 'album', limit);
};

export const searchArtists = async (query, limit = 20) => {
  return await spotifyAPI.search(query, 'artist', limit);
};

export const searchPlaylists = async (query, limit = 20) => {
  return await spotifyAPI.search(query, 'playlist', limit);
};

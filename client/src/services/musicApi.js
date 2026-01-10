import axios from 'axios';

// Multiple API sources for better coverage
const JAMENDO_CLIENT_ID = '95a69cf0'; // Public client ID

class MusicAPI {
  constructor() {
    this.currentSource = 'jamendo';
  }

  // Jamendo API - Full songs, Creative Commons
  async jamendoSearch(query, type = 'tracks') {
    try {
      const endpoint = type === 'artist' ? 'artists' : 'tracks';
      const params = {
        client_id: JAMENDO_CLIENT_ID,
        format: 'json',
        limit: 20,
        search: query,
        audioformat: 'mp32'
      };
      
      const response = await axios.get(`https://api.jamendo.com/v3.0/${endpoint}`, { params });
      return this.formatJamendoResults(response.data.results, type);
    } catch (error) {
      console.error('Jamendo API error:', error);
      return [];
    }
  }

  async jamendoGetAlbum(albumId) {
    try {
      const response = await axios.get(`https://api.jamendo.com/v3.0/albums`, {
        params: {
          client_id: JAMENDO_CLIENT_ID,
          format: 'json',
          id: albumId
        }
      });
      return response.data.results[0];
    } catch (error) {
      console.error('Jamendo album error:', error);
      return null;
    }
  }

  async jamendoGetAlbumTracks(albumId) {
    try {
      const response = await axios.get(`https://api.jamendo.com/v3.0/albums/tracks`, {
        params: {
          client_id: JAMENDO_CLIENT_ID,
          format: 'json',
          id: albumId
        }
      });
      return response.data.results[0]?.tracks || [];
    } catch (error) {
      console.error('Jamendo tracks error:', error);
      return [];
    }
  }

  async jamendoGetArtist(artistId) {
    try {
      const response = await axios.get(`https://api.jamendo.com/v3.0/artists`, {
        params: {
          client_id: JAMENDO_CLIENT_ID,
          format: 'json',
          id: artistId
        }
      });
      return response.data.results[0];
    } catch (error) {
      console.error('Jamendo artist error:', error);
      return null;
    }
  }

  async jamendoGetArtistAlbums(artistId) {
    try {
      const response = await axios.get(`https://api.jamendo.com/v3.0/artists/albums`, {
        params: {
          client_id: JAMENDO_CLIENT_ID,
          format: 'json',
          id: artistId,
          limit: 20
        }
      });
      return response.data.results[0]?.albums || [];
    } catch (error) {
      console.error('Jamendo artist albums error:', error);
      return [];
    }
  }

  async jamendoGetChart() {
    try {
      const response = await axios.get(`https://api.jamendo.com/v3.0/tracks`, {
        params: {
          client_id: JAMENDO_CLIENT_ID,
          format: 'json',
          limit: 50,
          order: 'popularity_total',
          audioformat: 'mp32'
        }
      });
      return response.data.results;
    } catch (error) {
      console.error('Jamendo chart error:', error);
      return [];
    }
  }

  async jamendoGetPlaylists() {
    try {
      const response = await axios.get(`https://api.jamendo.com/v3.0/playlists`, {
        params: {
          client_id: JAMENDO_CLIENT_ID,
          format: 'json',
          limit: 20
        }
      });
      return response.data.results;
    } catch (error) {
      console.error('Jamendo playlists error:', error);
      return [];
    }
  }

  formatJamendoResults(results, type) {
    if (!results) return [];
    
    return results.map(item => {
      if (type === 'track' || type === 'tracks') {
        return {
          id: item.id,
          name: item.name,
          title: item.name,
          artist: {
            id: item.artist_id,
            name: item.artist_name
          },
          album: {
            id: item.album_id,
            name: item.album_name,
            cover_medium: item.album_image,
            image: item.album_image
          },
          duration: item.duration * 1000,
          preview: item.audio,
          audiodownload: item.audiodownload,
          audio: item.audio,
          image: item.album_image,
          cover_medium: item.album_image
        };
      } else if (type === 'artist') {
        return {
          id: item.id,
          name: item.name,
          picture_medium: item.image,
          image: item.image
        };
      } else if (type === 'album') {
        return {
          id: item.id,
          name: item.name,
          title: item.name,
          artist: {
            id: item.artist_id,
            name: item.artist_name
          },
          cover_medium: item.image,
          image: item.image,
          release_date: item.releasedate
        };
      }
      return item;
    });
  }

  // Main search function
  async search(query, type = 'track') {
    const jamendoType = type === 'playlist' ? 'tracks' : type;
    const results = await this.jamendoSearch(query, jamendoType);
    return { data: results };
  }

  // Get featured/chart content
  async getChart() {
    const tracks = await this.jamendoGetChart();
    return {
      tracks: { data: this.formatJamendoResults(tracks, 'track') },
      albums: { data: [] },
      artists: { data: [] },
      playlists: { data: [] }
    };
  }

  async getAlbum(id) {
    const album = await this.jamendoGetAlbum(id);
    const tracks = await this.jamendoGetAlbumTracks(id);
    
    return {
      ...album,
      title: album.name,
      artist: {
        id: album.artist_id,
        name: album.artist_name
      },
      cover_medium: album.image,
      release_date: album.releasedate,
      tracks: {
        data: this.formatJamendoResults(tracks, 'track')
      }
    };
  }

  async getArtist(id) {
    const artist = await this.jamendoGetArtist(id);
    return {
      ...artist,
      picture_medium: artist.image
    };
  }

  async getArtistTopTracks(id) {
    const albums = await this.jamendoGetArtistAlbums(id);
    const allTracks = [];
    
    for (const album of albums.slice(0, 3)) {
      const tracks = await this.jamendoGetAlbumTracks(album.id);
      allTracks.push(...tracks);
    }
    
    return { data: this.formatJamendoResults(allTracks.slice(0, 10), 'track') };
  }

  async getArtistAlbums(id) {
    const albums = await this.jamendoGetArtistAlbums(id);
    return { data: this.formatJamendoResults(albums, 'album') };
  }

  async getPlaylist(id) {
    // For now, return chart tracks as playlists
    const tracks = await this.jamendoGetChart();
    return {
      id,
      title: 'Top Tracks',
      name: 'Top Tracks',
      picture_medium: tracks[0]?.album_image,
      tracks: {
        data: this.formatJamendoResults(tracks, 'track')
      }
    };
  }

  async getBrowseCategories() {
    const playlists = await this.jamendoGetPlaylists();
    return playlists.map(p => ({
      id: p.id,
      name: p.name,
      images: [{ url: p.image }]
    }));
  }
}

// Export singleton instance
const musicApi = new MusicAPI();

export const searchMusic = (query, type) => musicApi.search(query, type);
export const getChart = () => musicApi.getChart();
export const getAlbum = (id) => musicApi.getAlbum(id);
export const getArtist = (id) => musicApi.getArtist(id);
export const getArtistTopTracks = (id) => musicApi.getArtistTopTracks(id);
export const getArtistAlbums = (id) => musicApi.getArtistAlbums(id);
export const getPlaylist = (id) => musicApi.getPlaylist(id);
export const getBrowseCategories = () => musicApi.getBrowseCategories();

export default musicApi;

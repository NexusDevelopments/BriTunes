import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
  playlists: [],
  albums: [],
  artists: [],
  likedSongs: [],
  loading: false,
  error: null,
};

// Async thunks
export const fetchLibrary = createAsyncThunk(
  'library/fetchLibrary',
  async (_, { rejectWithValue, getState }) => {
    const token = getState().auth.token;
    try {
      const [playlistsRes, albumsRes, artistsRes] = await Promise.all([
        axios.get('/api/playlists', {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get('/api/albums', {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get('/api/artists', {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);
      return {
        playlists: playlistsRes.data,
        albums: albumsRes.data,
        artists: artistsRes.data,
      };
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const librarySlice = createSlice({
  name: 'library',
  initialState,
  reducers: {
    addPlaylist: (state, action) => {
      state.playlists.push(action.payload);
    },
    removePlaylist: (state, action) => {
      state.playlists = state.playlists.filter((p) => p.id !== action.payload);
    },
    addAlbum: (state, action) => {
      state.albums.push(action.payload);
    },
    removeAlbum: (state, action) => {
      state.albums = state.albums.filter((a) => a.id !== action.payload);
    },
    addArtist: (state, action) => {
      state.artists.push(action.payload);
    },
    removeArtist: (state, action) => {
      state.artists = state.artists.filter((a) => a.id !== action.payload);
    },
    setLikedSongs: (state, action) => {
      state.likedSongs = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchLibrary.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchLibrary.fulfilled, (state, action) => {
        state.loading = false;
        state.playlists = action.payload.playlists;
        state.albums = action.payload.albums;
        state.artists = action.payload.artists;
      })
      .addCase(fetchLibrary.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const {
  addPlaylist,
  removePlaylist,
  addAlbum,
  removeAlbum,
  addArtist,
  removeArtist,
  setLikedSongs,
} = librarySlice.actions;
export default librarySlice.reducer;

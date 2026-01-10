import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  state: null, // Spotify playback state
  devices: [],
  activeDeviceId: null,
  activeDeviceType: null,
  liked: false,
  currentTrack: null,
};

export const spotifySlice = createSlice({
  name: 'spotify',
  initialState,
  reducers: {
    setState: (state, action) => {
      state.state = action.payload;
      if (action.payload?.track_window?.current_track) {
        state.currentTrack = action.payload.track_window.current_track;
      }
    },
    setDevices: (state, action) => {
      state.devices = action.payload;
    },
    setActiveDevice: (state, action) => {
      state.activeDeviceId = action.payload.id;
      state.activeDeviceType = action.payload.type;
    },
    setLiked: (state, action) => {
      state.liked = action.payload;
    },
    clearSpotifyState: (state) => {
      state.state = null;
      state.devices = [];
      state.activeDeviceId = null;
      state.activeDeviceType = null;
      state.currentTrack = null;
    },
  },
});

export const { setState, setDevices, setActiveDevice, setLiked, clearSpotifyState } =
  spotifySlice.actions;
export default spotifySlice.reducer;

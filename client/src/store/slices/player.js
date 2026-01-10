import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isPlaying: false,
  currentTime: 0,
  duration: 0,
  volume: 1.0,
  shuffle: false,
  repeat: 'off', // 'off', 'track', 'context'
  paused: true,
};

export const playerSlice = createSlice({
  name: 'player',
  initialState,
  reducers: {
    setPlaying: (state, action) => {
      state.isPlaying = action.payload;
      state.paused = !action.payload;
    },
    setCurrentTime: (state, action) => {
      state.currentTime = action.payload;
    },
    setDuration: (state, action) => {
      state.duration = action.payload;
    },
    setVolume: (state, action) => {
      state.volume = action.payload;
    },
    setShuffle: (state, action) => {
      state.shuffle = action.payload;
    },
    setRepeat: (state, action) => {
      state.repeat = action.payload;
    },
  },
});

export const { setPlaying, setCurrentTime, setDuration, setVolume, setShuffle, setRepeat } =
  playerSlice.actions;
export default playerSlice.reducer;

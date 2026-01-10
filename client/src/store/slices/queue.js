import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  queue: [],
  currentlyPlaying: null,
};

export const queueSlice = createSlice({
  name: 'queue',
  initialState,
  reducers: {
    setQueue: (state, action) => {
      state.queue = action.payload;
    },
    setCurrentlyPlaying: (state, action) => {
      state.currentlyPlaying = action.payload;
    },
    addToQueue: (state, action) => {
      state.queue.push(action.payload);
    },
    removeFromQueue: (state, action) => {
      state.queue = state.queue.filter((_, index) => index !== action.payload);
    },
    clearQueue: (state) => {
      state.queue = [];
    },
  },
});

export const { setQueue, setCurrentlyPlaying, addToQueue, removeFromQueue, clearQueue } =
  queueSlice.actions;
export default queueSlice.reducer;

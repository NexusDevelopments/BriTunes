import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  sidebarCollapsed: false,
  queueOpen: false,
  devicesOpen: false,
  nowPlayingOpen: false,
  fullScreen: false,
};

export const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.sidebarCollapsed = !state.sidebarCollapsed;
    },
    toggleQueue: (state) => {
      state.queueOpen = !state.queueOpen;
    },
    toggleDevices: (state) => {
      state.devicesOpen = !state.devicesOpen;
    },
    toggleNowPlaying: (state) => {
      state.nowPlayingOpen = !state.nowPlayingOpen;
    },
    toggleFullScreen: (state) => {
      state.fullScreen = !state.fullScreen;
    },
    closeAllPanels: (state) => {
      state.queueOpen = false;
      state.devicesOpen = false;
      state.nowPlayingOpen = false;
    },
  },
});

export const {
  toggleSidebar,
  toggleQueue,
  toggleDevices,
  toggleNowPlaying,
  toggleFullScreen,
  closeAllPanels,
} = uiSlice.actions;
export default uiSlice.reducer;

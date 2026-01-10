import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { combineReducers } from '@reduxjs/toolkit';

// Import reducers
import authReducer from './slices/auth';
import spotifyReducer from './slices/spotify';
import playerReducer from './slices/player';
import queueReducer from './slices/queue';
import libraryReducer from './slices/library';
import uiReducer from './slices/ui';

const persistConfig = {
  key: 'britunes-root',
  storage,
  whitelist: ['auth', 'library'],
};

const rootReducer = combineReducers({
  auth: authReducer,
  spotify: spotifyReducer,
  player: playerReducer,
  queue: queueReducer,
  library: libraryReducer,
  ui: uiReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
});

export const persistor = persistStore(store);

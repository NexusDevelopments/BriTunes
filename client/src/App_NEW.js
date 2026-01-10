import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from './store/store';
import { SpotifyPlayerProvider } from './context/SpotifyPlayerContext';

// Components
import MainLayout from './components/MainLayout/MainLayout';
import TopNav from './components/TopNav/TopNav';
import PrivateRoute from './components/PrivateRoute';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import HomePage from './pages/HomePage/HomePage';
import SearchPage from './pages/SearchPage/SearchPage';
import Browse from './pages/Browse/Browse';
import AlbumDetail from './pages/AlbumDetail/AlbumDetail';
import ArtistDetail from './pages/ArtistDetail/ArtistDetail';
import PlaylistDetail from './pages/PlaylistDetail/PlaylistDetail';
import Library from './pages/Library';
import Profile from './pages/Profile';

// Services
import spotifyAPI from './services/spotifyAPI';

import './App.css';

function App() {
  useEffect(() => {
    // Set token for Spotify API from Redux store
    const token = localStorage.getItem('spotify_token');
    if (token) {
      spotifyAPI.setToken(token);
    }
  }, []);

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <SpotifyPlayerProvider>
          <Router>
            <div className="app">
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                
                <Route
                  path="/*"
                  element={
                    <PrivateRoute>
                      <MainLayout>
                        <TopNav />
                        <Routes>
                          <Route path="/" element={<HomePage />} />
                          <Route path="/search" element={<SearchPage />} />
                          <Route path="/browse" element={<Browse />} />
                          <Route path="/library" element={<Library />} />
                          <Route path="/profile" element={<Profile />} />
                          <Route path="/album/:id" element={<AlbumDetail />} />
                          <Route path="/artist/:id" element={<ArtistDetail />} />
                          <Route path="/playlist/:id" element={<PlaylistDetail />} />
                          <Route path="*" element={<Navigate to="/" replace />} />
                        </Routes>
                      </MainLayout>
                    </PrivateRoute>
                  }
                />
              </Routes>
            </div>
          </Router>
        </SpotifyPlayerProvider>
      </PersistGate>
    </Provider>
  );
}

export default App;

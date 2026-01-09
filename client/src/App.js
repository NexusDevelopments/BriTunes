import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { PlayerProvider } from './context/PlayerContext';
import Navbar from './components/Navbar';
import MusicPlayer from './components/MusicPlayer';
import PreviewNotification from './components/PreviewNotification';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Search from './pages/Search';
import Artist from './pages/Artist';
import Album from './pages/Album';
import Library from './pages/Library';
import Profile from './pages/Profile';
import PrivateRoute from './components/PrivateRoute';
import './App.css';

function App() {
  const [showNotification, setShowNotification] = useState(false);

  useEffect(() => {
    // Check if notification has been shown before
    const hasSeenNotification = localStorage.getItem('hasSeenPreviewNotification');
    if (!hasSeenNotification) {
      // Show notification after 2 seconds on first visit
      const timer = setTimeout(() => {
        setShowNotification(true);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleCloseNotification = () => {
    setShowNotification(false);
    localStorage.setItem('hasSeenPreviewNotification', 'true');
  };

  return (
    <AuthProvider>
      <PlayerProvider>
        <Router>
          <div className="App">
            <Navbar />
            <div className="app-content">
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/" element={<Home />} />
                <Route path="/search" element={<Search />} />
                <Route path="/artist/:id" element={<Artist />} />
                <Route path="/album/:id" element={<Album />} />
                <Route path="/library" element={
                  <PrivateRoute>
                    <Library />
                  </PrivateRoute>
                } />
                <Route path="/profile" element={
                  <PrivateRoute>
                    <Profile />
                  </PrivateRoute>
                } />
                <Route path="*" element={<Navigate to="/" />} />
              </Routes>
            </div>
            <MusicPlayer />
            <PreviewNotification 
              show={showNotification} 
              onClose={handleCloseNotification} 
            />
          </div>
        </Router>
      </PlayerProvider>
    </AuthProvider>
  );
}

export default App;

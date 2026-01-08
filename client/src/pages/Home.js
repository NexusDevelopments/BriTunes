import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaMusic } from 'react-icons/fa';
import './Home.css';

const Home = () => {
  const [newReleases, setNewReleases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchNewReleases();
  }, []);

  const fetchNewReleases = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/music/new-releases?limit=20');
      
      // Extract tracks from albums
      const albums = response.data.albums?.items || [];
      setNewReleases(albums);
    } catch (error) {
      console.error('Error fetching new releases:', error);
      setError('Failed to load new releases');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="home-container">
      <div className="home-header">
        <div className="header-content">
          <FaMusic className="header-icon" />
          <div>
            <h1>Welcome to BriTunes</h1>
            <p>Discover new music and enjoy your favorites</p>
          </div>
        </div>
      </div>

      <div className="container">
        {error && <div className="error-message">{error}</div>}

        <section className="music-section">
          <div className="section-header">
            <h2>New Releases</h2>
            <p>Check out the latest albums and singles</p>
          </div>

          <div className="grid grid-4">
            {newReleases.map((album) => (
              <div key={album.id} className="album-card">
                <div className="album-image">
                  {album.images && album.images.length > 0 ? (
                    <img src={album.images[0].url} alt={album.name} />
                  ) : (
                    <div className="album-image-placeholder">
                      <FaMusic />
                    </div>
                  )}
                </div>
                <div className="album-info">
                  <h3 className="album-name" title={album.name}>{album.name}</h3>
                  <p className="album-artist">
                    {album.artists?.map(artist => artist.name).join(', ')}
                  </p>
                  <p className="album-type">{album.album_type} • {album.total_tracks} tracks</p>
                </div>
              </div>
            ))}
          </div>

          {newReleases.length === 0 && !loading && (
            <div className="empty-state">
              <FaMusic />
              <p>No new releases available at the moment</p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default Home;

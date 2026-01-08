import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaMusic, FaPlay } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import './Home.css';

const Home = () => {
  const [charts, setCharts] = useState([]);
  const [newReleases, setNewReleases] = useState([]);
  const [topArtists, setTopArtists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchMusic();
  }, []);

  const fetchMusic = async () => {
    try {
      setLoading(true);
      
      // Fetch chart tracks from Deezer (top 50 songs globally)
      const chartsResponse = await axios.get('https://api.deezer.com/chart/0/tracks?limit=20');
      setCharts(chartsResponse.data.data || []);

      // Fetch new releases (albums)
      const albumsResponse = await axios.get('https://api.deezer.com/chart/0/albums?limit=12');
      setNewReleases(albumsResponse.data.data || []);

      // Fetch top artists
      const artistsResponse = await axios.get('https://api.deezer.com/chart/0/artists?limit=12');
      setTopArtists(artistsResponse.data.data || []);

      setError('');
    } catch (error) {
      console.error('Error fetching music:', error);
      setError('Failed to load music. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <p>Loading 90+ million songs...</p>
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
            <p>Stream 90+ million songs from millions of artists worldwide</p>
          </div>
        </div>
      </div>

      <div className="container">
        {error && <div className="error-message">{error}</div>}

        {/* Top Charts */}
        <section className="music-section">
          <div className="section-header">
            <h2>🔥 Top Charts</h2>
            <p>Most popular songs right now</p>
          </div>

          <div className="tracks-grid">
            {charts.slice(0, 10).map((track, index) => (
              <div key={track.id} className="track-item">
                <div className="track-number">#{index + 1}</div>
                <img src={track.album.cover_medium} alt={track.title} className="track-cover" />
                <div className="track-details">
                  <h4>{track.title}</h4>
                  <p>{track.artist.name}</p>
                </div>
                <div className="track-duration">{Math.floor(track.duration / 60)}:{(track.duration % 60).toString().padStart(2, '0')}</div>
                <a href={track.preview} target="_blank" rel="noopener noreferrer" className="play-button">
                  <FaPlay />
                </a>
              </div>
            ))}
          </div>
        </section>

        {/* New Releases */}
        <section className="music-section">
          <div className="section-header">
            <h2>🎵 New Album Releases</h2>
            <p>Fresh albums from top artists</p>
          </div>

          <div className="grid grid-4">
            {newReleases.map((album) => (
              <div key={album.id} className="album-card">
                <div className="album-image">
                  <img src={album.cover_medium} alt={album.title} />
                </div>
                <div className="album-info">
                  <h3 className="album-name" title={album.title}>{album.title}</h3>
                  <p className="album-artist">{album.artist.name}</p>
                  <p className="album-type">{album.nb_tracks} tracks</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Top Artists */}
        <section className="music-section">
          <div className="section-header">
            <h2>⭐ Top Artists</h2>
            <p>Most popular artists worldwide</p>
          </div>

          <div className="grid grid-6">
            {topArtists.map((artist) => (
              <Link to={`/artist/${artist.id}`} key={artist.id} className="artist-card">
                <div className="artist-image">
                  <img src={artist.picture_medium} alt={artist.name} />
                </div>
                <div className="artist-info">
                  <h3>{artist.name}</h3>
                  <p>{(artist.nb_fan || 0).toLocaleString()} fans</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Home;

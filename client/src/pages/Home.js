import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { FaMusic, FaPlay, FaSearch } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { PlayerContext } from '../context/PlayerContext';
import './Home.css';

const Home = () => {
  const [charts, setCharts] = useState([]);
  const [newReleases, setNewReleases] = useState([]);
  const [topArtists, setTopArtists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const { playTrack } = useContext(PlayerContext);
  const navigate = useNavigate();

  // CORS proxy to access Deezer API
  const CORS_PROXY = 'https://corsproxy.io/?';
  const DEEZER_API = 'https://api.deezer.com';

  useEffect(() => {
    fetchMusic();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const fetchMusic = async () => {
    try {
      setLoading(true);
      
      // Fetch rap/hip-hop charts
      const rapSearchResponse = await axios.get(`${CORS_PROXY}${encodeURIComponent(DEEZER_API + '/search?q=rap&limit=20')}`);
      setCharts(rapSearchResponse.data.data || []);

      // Fetch popular rap albums
      const albumsResponse = await axios.get(`${CORS_PROXY}${encodeURIComponent(DEEZER_API + '/search/album?q=hip hop&limit=12')}`);
      setNewReleases(albumsResponse.data.data || []);

      // Fetch popular rappers - search for well-known rap artists
      const rapperNames = ['Drake', 'Kendrick Lamar', 'J. Cole', 'Travis Scott', 'Eminem', 'Kanye West', 'Lil Baby', 'Future', 'Young Thug', 'Polo G', '21 Savage', 'Lil Durk'];
      const artistPromises = rapperNames.map(name => 
        axios.get(`${CORS_PROXY}${encodeURIComponent(DEEZER_API + '/search/artist?q=' + name + '&limit=1')}`)
      );
      
      const artistResults = await Promise.all(artistPromises);
      const artists = artistResults
        .map(res => res.data.data?.[0])
        .filter(artist => artist); // Filter out any null results
      
      setTopArtists(artists);

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
            <p>Stream the hottest rap & hip-hop from 90+ million songs</p>
          </div>
        </div>
        
        {/* Search Bar */}
        <form onSubmit={handleSearch} className="home-search-form">
          <div className="home-search-wrapper">
            <FaSearch className="search-icon" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for songs, artists, or albums..."
              className="home-search-input"
            />
          </div>
          <button type="submit" className="btn btn-primary">
            Search
          </button>
        </form>
      </div>

      <div className="container">
        {error && <div className="error-message">{error}</div>}

        {/* Top Charts */}
        <section className="music-section">
          <div className="section-header">
            <h2>🔥 Popular Rap Songs</h2>
            <p>Hottest rap tracks right now</p>
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
                <button onClick={() => playTrack(track, charts)} className="play-button">
                  <FaPlay />
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* New Releases */}
        <section className="music-section">
          <div className="section-header">
            <h2>🎵 Hip-Hop Albums</h2>
            <p>Latest and greatest rap albums</p>
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
            <h2>⭐ Popular Rappers</h2>
            <p>Top hip-hop artists you need to know</p>
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

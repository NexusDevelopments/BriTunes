import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaSearch, FaMusic } from 'react-icons/fa';
import { PlayerContext } from '../context/PlayerContext';
import './Search.css';

const Search = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const navigate = useNavigate();

  const { playTrack } = useContext(PlayerContext);

  // CORS proxy to access Deezer API
  const CORS_PROXY = 'https://corsproxy.io/?';
  const DEEZER_API = 'https://api.deezer.com';

  const handleSearch = async (e) => {
    e.preventDefault();
    
    if (!query.trim()) return;

    setLoading(true);
    try {
      // Search Deezer API directly with CORS proxy
      const response = await axios.get(`${CORS_PROXY}${encodeURIComponent(DEEZER_API + '/search?q=' + encodeURIComponent(query) + '&limit=50')}`);
      
      const tracks = response.data.data || [];
      
      // Extract unique artists and albums
      const artistsMap = new Map();
      const albumsMap = new Map();
      
      tracks.forEach(track => {
        if (track.artist && !artistsMap.has(track.artist.id)) {
          artistsMap.set(track.artist.id, track.artist);
        }
        if (track.album && !albumsMap.has(track.album.id)) {
          albumsMap.set(track.album.id, track.album);
        }
      });

      setResults({
        tracks: tracks,
        artists: Array.from(artistsMap.values()),
        albums: Array.from(albumsMap.values())
      });
    } catch (error) {
      console.error('Search error:', error);
      setResults({ tracks: [], artists: [], albums: [] });
    } finally {
      setLoading(false);
    }
  };

  const handleArtistClick = (artistId) => {
    navigate(`/artist/${artistId}`);
  };

  return (
    <div className="search-container">
      <div className="container">
        <div className="search-header">
          <h1>Search</h1>
          <p>Find your favorite songs, artists, and albums</p>
        </div>

        <form onSubmit={handleSearch} className="search-form">
          <div className="search-input-wrapper">
            <FaSearch className="search-icon" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search for songs, artists, or albums..."
              className="search-input"
            />
          </div>
          <button type="submit" className="btn btn-primary">
            Search
          </button>
        </form>

        {loading && (
          <div className="loading">
            <div className="spinner"></div>
          </div>
        )}

        {results && !loading && (
          <div className="search-results">
            <div className="tabs">
              <button
                className={`tab ${activeTab === 'all' ? 'active' : ''}`}
                onClick={() => setActiveTab('all')}
              >
                All
              </button>
              <button
                className={`tab ${activeTab === 'tracks' ? 'active' : ''}`}
                onClick={() => setActiveTab('tracks')}
              >
                Tracks ({results.tracks?.length || 0})
              </button>
              <button
                className={`tab ${activeTab === 'artists' ? 'active' : ''}`}
                onClick={() => setActiveTab('artists')}
              >
                Artists ({results.artists?.length || 0})
              </button>
              <button
                className={`tab ${activeTab === 'albums' ? 'active' : ''}`}
                onClick={() => setActiveTab('albums')}
              >
                Albums ({results.albums?.length || 0})
              </button>
            </div>

            {(activeTab === 'all' || activeTab === 'tracks') && results.tracks && results.tracks.length > 0 && (
              <section className="result-section">
                <h2>Tracks</h2>
                <div className="tracks-list">
                  {results.tracks.slice(0, activeTab === 'all' ? 10 : undefined).map((track, index) => (
                    <div key={track.id} className="track-item">
                      <div className="track-number">#{index + 1}</div>
                      <img src={track.album.cover_medium} alt={track.title} className="track-cover" />
                      <div className="track-details">
                        <h4>{track.title}</h4>
                        <p>{track.artist.name}</p>
                      </div>
                      <div className="track-duration">{Math.floor(track.duration / 60)}:{(track.duration % 60).toString().padStart(2, '0')}</div>
                      <button onClick={() => playTrack(track, results.tracks)} className="play-button">
                        <FaMusic />
                      </button>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {(activeTab === 'all' || activeTab === 'artists') && results.artists && results.artists.length > 0 && (
              <section className="result-section">
                <h2>Artists</h2>
                <div className="grid grid-3">
                  {results.artists.slice(0, activeTab === 'all' ? 6 : undefined).map((artist) => (
                    <div
                      key={artist.id}
                      className="artist-card"
                      onClick={() => handleArtistClick(artist.id)}
                    >
                      <div className="artist-image">
                        <img src={artist.picture_medium} alt={artist.name} />
                      </div>
                      <h3>{artist.name}</h3>
                      <p>Artist</p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {(activeTab === 'all' || activeTab === 'albums') && results.albums && results.albums.length > 0 && (
              <section className="result-section">
                <h2>Albums</h2>
                <div className="grid grid-4">
                  {results.albums.slice(0, activeTab === 'all' ? 8 : undefined).map((album) => (
                    <div key={album.id} className="album-card">
                      <div className="album-image">
                        <img src={album.cover_medium} alt={album.title} />
                      </div>
                      <div className="album-info">
                        <h3>{album.title}</h3>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>
        )}

        {!results && !loading && (
          <div className="empty-state">
            <FaSearch />
            <p>Search for your favorite music</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Search;

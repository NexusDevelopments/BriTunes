import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaSearch, FaMusic, FaUser } from 'react-icons/fa';
import TrackCard from '../components/TrackCard';
import './Search.css';

const Search = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const navigate = useNavigate();

  const handleSearch = async (e) => {
    e.preventDefault();
    
    if (!query.trim()) return;

    setLoading(true);
    try {
      const response = await axios.get('/api/music/search', {
        params: { q: query, limit: 30 }
      });
      setResults(response.data);
    } catch (error) {
      console.error('Search error:', error);
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
                Tracks ({results.tracks?.items?.length || 0})
              </button>
              <button
                className={`tab ${activeTab === 'artists' ? 'active' : ''}`}
                onClick={() => setActiveTab('artists')}
              >
                Artists ({results.artists?.items?.length || 0})
              </button>
              <button
                className={`tab ${activeTab === 'albums' ? 'active' : ''}`}
                onClick={() => setActiveTab('albums')}
              >
                Albums ({results.albums?.items?.length || 0})
              </button>
            </div>

            {(activeTab === 'all' || activeTab === 'tracks') && results.tracks?.items && (
              <section className="result-section">
                <h2>Tracks</h2>
                <div className="grid grid-4">
                  {results.tracks.items.slice(0, activeTab === 'all' ? 8 : undefined).map((track) => (
                    <TrackCard key={track.id} track={track} />
                  ))}
                </div>
              </section>
            )}

            {(activeTab === 'all' || activeTab === 'artists') && results.artists?.items && (
              <section className="result-section">
                <h2>Artists</h2>
                <div className="grid grid-3">
                  {results.artists.items.slice(0, activeTab === 'all' ? 6 : undefined).map((artist) => (
                    <div
                      key={artist.id}
                      className="artist-card"
                      onClick={() => handleArtistClick(artist.id)}
                    >
                      <div className="artist-image">
                        {artist.images && artist.images.length > 0 ? (
                          <img src={artist.images[0].url} alt={artist.name} />
                        ) : (
                          <div className="artist-image-placeholder">
                            <FaUser />
                          </div>
                        )}
                      </div>
                      <h3>{artist.name}</h3>
                      <p>{artist.followers?.total?.toLocaleString()} followers</p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {(activeTab === 'all' || activeTab === 'albums') && results.albums?.items && (
              <section className="result-section">
                <h2>Albums</h2>
                <div className="grid grid-4">
                  {results.albums.items.slice(0, activeTab === 'all' ? 8 : undefined).map((album) => (
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
                        <h3>{album.name}</h3>
                        <p>{album.artists?.map(a => a.name).join(', ')}</p>
                        <span className="album-year">{album.release_date?.split('-')[0]}</span>
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

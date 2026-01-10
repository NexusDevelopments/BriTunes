import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { searchAll } from '../../services/searchService';
import { FaSearch } from 'react-icons/fa';
import './SearchPage.css';

const SearchPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [results, setResults] = useState(null);
  const [activeTab, setActiveTab] = useState('all');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const q = searchParams.get('q');
    if (q && q !== query) {
      setQuery(q);
      performSearch(q);
    }
  }, [searchParams, query]);

  const performSearch = async (searchQuery) => {
    if (!searchQuery.trim()) return;

    setLoading(true);
    try {
      const data = await searchAll(searchQuery);
      setResults(data);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      setSearchParams({ q: query });
      performSearch(query);
    }
  };

  const renderTracks = () => {
    const tracks = results?.tracks?.items || [];
    if (tracks.length === 0) return <p className="no-results">No tracks found</p>;

    return (
      <div className="search-results-list">
        {tracks.map((track) => (
          <div key={track.id} className="search-track-item">
            <img src={track.album?.images?.[0]?.url} alt={track.name} />
            <div className="track-info">
              <h4>{track.name}</h4>
              <p>{track.artists?.map(a => a.name).join(', ')}</p>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderAlbums = () => {
    const albums = results?.albums?.items || [];
    if (albums.length === 0) return <p className="no-results">No albums found</p>;

    return (
      <div className="search-grid">
        {albums.map((album) => (
          <div key={album.id} className="search-card">
            <img src={album.images?.[0]?.url} alt={album.name} />
            <h4>{album.name}</h4>
            <p>{album.artists?.map(a => a.name).join(', ')}</p>
          </div>
        ))}
      </div>
    );
  };

  const renderArtists = () => {
    const artists = results?.artists?.items || [];
    if (artists.length === 0) return <p className="no-results">No artists found</p>;

    return (
      <div className="search-grid">
        {artists.map((artist) => (
          <div key={artist.id} className="search-card">
            <img src={artist.images?.[0]?.url} alt={artist.name} className="artist-img" />
            <h4>{artist.name}</h4>
            <p>Artist</p>
          </div>
        ))}
      </div>
    );
  };

  const renderPlaylists = () => {
    const playlists = results?.playlists?.items || [];
    if (playlists.length === 0) return <p className="no-results">No playlists found</p>;

    return (
      <div className="search-grid">
        {playlists.map((playlist) => (
          <div key={playlist.id} className="search-card">
            <img src={playlist.images?.[0]?.url} alt={playlist.name} />
            <h4>{playlist.name}</h4>
            <p>By {playlist.owner?.display_name}</p>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="search-page">
      <div className="search-header">
        <form onSubmit={handleSearch} className="search-form">
          <FaSearch />
          <input
            type="text"
            placeholder="What do you want to listen to?"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </form>
      </div>

      {loading && <div className="loading">Searching...</div>}

      {results && !loading && (
        <>
          <div className="search-tabs">
            <button
              className={activeTab === 'all' ? 'active' : ''}
              onClick={() => setActiveTab('all')}
            >
              All
            </button>
            <button
              className={activeTab === 'tracks' ? 'active' : ''}
              onClick={() => setActiveTab('tracks')}
            >
              Songs
            </button>
            <button
              className={activeTab === 'albums' ? 'active' : ''}
              onClick={() => setActiveTab('albums')}
            >
              Albums
            </button>
            <button
              className={activeTab === 'artists' ? 'active' : ''}
              onClick={() => setActiveTab('artists')}
            >
              Artists
            </button>
            <button
              className={activeTab === 'playlists' ? 'active' : ''}
              onClick={() => setActiveTab('playlists')}
            >
              Playlists
            </button>
          </div>

          <div className="search-content">
            {activeTab === 'all' && (
              <>
                {results.tracks?.items?.length > 0 && (
                  <section>
                    <h2>Songs</h2>
                    {renderTracks()}
                  </section>
                )}
                {results.artists?.items?.length > 0 && (
                  <section>
                    <h2>Artists</h2>
                    {renderArtists()}
                  </section>
                )}
                {results.albums?.items?.length > 0 && (
                  <section>
                    <h2>Albums</h2>
                    {renderAlbums()}
                  </section>
                )}
                {results.playlists?.items?.length > 0 && (
                  <section>
                    <h2>Playlists</h2>
                    {renderPlaylists()}
                  </section>
                )}
              </>
            )}
            {activeTab === 'tracks' && renderTracks()}
            {activeTab === 'albums' && renderAlbums()}
            {activeTab === 'artists' && renderArtists()}
            {activeTab === 'playlists' && renderPlaylists()}
          </div>
        </>
      )}
    </div>
  );
};

export default SearchPage;

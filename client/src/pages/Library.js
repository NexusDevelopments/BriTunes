import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaPlus, FaMusic, FaTrash, FaEdit } from 'react-icons/fa';
import './Library.css';

const Library = () => {
  const [playlists, setPlaylists] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState('');
  const [newPlaylistDesc, setNewPlaylistDesc] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPlaylists();
  }, []);

  const fetchPlaylists = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/playlists');
      setPlaylists(response.data);
    } catch (error) {
      console.error('Error fetching playlists:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePlaylist = async (e) => {
    e.preventDefault();
    
    if (!newPlaylistName.trim()) return;

    try {
      await axios.post('/api/playlists', {
        name: newPlaylistName,
        description: newPlaylistDesc
      });

      setNewPlaylistName('');
      setNewPlaylistDesc('');
      setShowCreateModal(false);
      fetchPlaylists();
    } catch (error) {
      console.error('Error creating playlist:', error);
    }
  };

  const handleDeletePlaylist = async (playlistId) => {
    if (!window.confirm('Are you sure you want to delete this playlist?')) {
      return;
    }

    try {
      await axios.delete(`/api/playlists/${playlistId}`);
      fetchPlaylists();
    } catch (error) {
      console.error('Error deleting playlist:', error);
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
    <div className="library-container">
      <div className="container">
        <div className="library-header">
          <div>
            <h1>Your Library</h1>
            <p>Manage your playlists and music collection</p>
          </div>
          <button className="btn btn-primary" onClick={() => setShowCreateModal(true)}>
            <FaPlus /> Create Playlist
          </button>
        </div>

        <div className="grid grid-3">
          {playlists.map((playlist) => (
            <div key={playlist._id} className="playlist-card">
              <div className="playlist-image">
                {playlist.coverImage ? (
                  <img src={playlist.coverImage} alt={playlist.name} />
                ) : (
                  <div className="playlist-image-placeholder">
                    <FaMusic />
                  </div>
                )}
              </div>
              <div className="playlist-info">
                <h3>{playlist.name}</h3>
                <p>{playlist.description || 'No description'}</p>
                <span className="playlist-count">{playlist.tracks?.length || 0} tracks</span>
              </div>
              <div className="playlist-actions">
                <button
                  className="action-btn delete-btn"
                  onClick={() => handleDeletePlaylist(playlist._id)}
                  title="Delete playlist"
                >
                  <FaTrash />
                </button>
              </div>
            </div>
          ))}
        </div>

        {playlists.length === 0 && (
          <div className="empty-state">
            <FaMusic />
            <p>No playlists yet</p>
            <button className="btn btn-primary" onClick={() => setShowCreateModal(true)}>
              <FaPlus /> Create Your First Playlist
            </button>
          </div>
        )}
      </div>

      {showCreateModal && (
        <div className="modal-overlay" onClick={() => setShowCreateModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Create Playlist</h2>
              <button className="close-btn" onClick={() => setShowCreateModal(false)}>
                ×
              </button>
            </div>
            <form onSubmit={handleCreatePlaylist}>
              <div className="input-group">
                <label>Playlist Name</label>
                <input
                  type="text"
                  value={newPlaylistName}
                  onChange={(e) => setNewPlaylistName(e.target.value)}
                  placeholder="My Awesome Playlist"
                  required
                />
              </div>
              <div className="input-group">
                <label>Description (Optional)</label>
                <textarea
                  value={newPlaylistDesc}
                  onChange={(e) => setNewPlaylistDesc(e.target.value)}
                  placeholder="Describe your playlist..."
                  rows="3"
                />
              </div>
              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setShowCreateModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Library;

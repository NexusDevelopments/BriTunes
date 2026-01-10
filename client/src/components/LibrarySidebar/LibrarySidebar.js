import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { toggleSidebar } from '../../store/slices/ui';
import { FaMusic, FaCompactDisc, FaMicrophone, FaHeart, FaPlus, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import './LibrarySidebar.css';

const LibrarySidebar = () => {
  const dispatch = useDispatch();
  const { playlists, albums, artists } = useSelector((state) => state.library);
  const { sidebarCollapsed } = useSelector((state) => state.ui);
  const [activeTab, setActiveTab] = useState('playlists');

  const handleToggle = () => {
    dispatch(toggleSidebar());
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'playlists':
        return playlists.map((playlist) => (
          <div key={playlist.id} className="library-item">
            <img src={playlist.images?.[0]?.url || '/placeholder.png'} alt={playlist.name} />
            <div className="library-item-info">
              <h4>{playlist.name}</h4>
              <p>{playlist.tracks?.total || 0} songs</p>
            </div>
          </div>
        ));
      case 'albums':
        return albums.map((album) => (
          <div key={album.id} className="library-item">
            <img src={album.images?.[0]?.url} alt={album.name} />
            <div className="library-item-info">
              <h4>{album.name}</h4>
              <p>{album.artists?.[0]?.name}</p>
            </div>
          </div>
        ));
      case 'artists':
        return artists.map((artist) => (
          <div key={artist.id} className="library-item">
            <img src={artist.images?.[0]?.url} alt={artist.name} className="artist-img" />
            <div className="library-item-info">
              <h4>{artist.name}</h4>
              <p>Artist</p>
            </div>
          </div>
        ));
      default:
        return null;
    }
  };

  return (
    <div className={`library-sidebar ${sidebarCollapsed ? 'collapsed' : ''}`}>
      <div className="library-header">
        <div className="library-title">
          <FaMusic />
          {!sidebarCollapsed && <h2>Your Library</h2>}
        </div>
        <button className="toggle-btn" onClick={handleToggle}>
          {sidebarCollapsed ? <FaChevronRight /> : <FaChevronLeft />}
        </button>
      </div>

      {!sidebarCollapsed && (
        <>
          <div className="library-tabs">
            <button
              className={activeTab === 'playlists' ? 'active' : ''}
              onClick={() => setActiveTab('playlists')}
            >
              <FaMusic /> Playlists
            </button>
            <button
              className={activeTab === 'albums' ? 'active' : ''}
              onClick={() => setActiveTab('albums')}
            >
              <FaCompactDisc /> Albums
            </button>
            <button
              className={activeTab === 'artists' ? 'active' : ''}
              onClick={() => setActiveTab('artists')}
            >
              <FaMicrophone /> Artists
            </button>
          </div>

          <div className="library-actions">
            <button className="create-btn">
              <FaPlus /> Create Playlist
            </button>
            <button className="liked-btn">
              <FaHeart /> Liked Songs
            </button>
          </div>

          <div className="library-content">
            {renderContent()}
          </div>
        </>
      )}
    </div>
  );
};

export default LibrarySidebar;

import React from 'react';
import { FaPlay, FaPlus } from 'react-icons/fa';
import './TrackCard.css';

const TrackCard = ({ track, onPlay, onAddToPlaylist }) => {
  const getImageUrl = () => {
    if (track.album?.images && track.album.images.length > 0) {
      return track.album.images[0].url;
    }
    if (track.imageUrl) {
      return track.imageUrl;
    }
    return null;
  };

  const getArtistNames = () => {
    if (track.artists && Array.isArray(track.artists)) {
      return track.artists.map(artist => artist.name).join(', ');
    }
    return track.artistName || 'Unknown Artist';
  };

  const formatDuration = (ms) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = ((ms % 60000) / 1000).toFixed(0);
    return `${minutes}:${seconds.padStart(2, '0')}`;
  };

  return (
    <div className="track-card">
      <div className="track-image">
        {getImageUrl() ? (
          <img src={getImageUrl()} alt={track.name} />
        ) : (
          <div className="track-image-placeholder">
            <FaPlay />
          </div>
        )}
        <div className="track-overlay">
          <button className="play-button" onClick={() => onPlay && onPlay(track)}>
            <FaPlay />
          </button>
        </div>
      </div>
      <div className="track-info">
        <h3 className="track-name" title={track.name}>
          {track.name || track.trackName}
        </h3>
        <p className="track-artist">{getArtistNames()}</p>
        {track.duration_ms && (
          <p className="track-duration">{formatDuration(track.duration_ms)}</p>
        )}
      </div>
      {onAddToPlaylist && (
        <button className="add-button" onClick={() => onAddToPlaylist(track)}>
          <FaPlus />
        </button>
      )}
    </div>
  );
};

export default TrackCard;

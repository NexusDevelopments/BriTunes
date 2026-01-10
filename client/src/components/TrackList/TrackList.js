import React from 'react';
import { FaPlay, FaHeart, FaRegHeart, FaEllipsisH } from 'react-icons/fa';
import './TrackList.css';

const TrackList = ({ tracks, onPlay, onLike, showAlbum = true, showAddedDate = false }) => {
  const formatDuration = (ms) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = ((ms % 60000) / 1000).toFixed(0);
    return `${minutes}:${seconds.padStart(2, '0')}`;
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const now = new Date();
    const diffDays = Math.ceil((now - date) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
    return `${Math.floor(diffDays / 365)} years ago`;
  };

  return (
    <div className="track-list">
      <div className="track-list-header">
        <div className="col-number">#</div>
        <div className="col-title">TITLE</div>
        {showAlbum && <div className="col-album">ALBUM</div>}
        {showAddedDate && <div className="col-added">DATE ADDED</div>}
        <div className="col-like"></div>
        <div className="col-duration">⏱</div>
      </div>

      <div className="track-list-body">
        {tracks.map((track, index) => {
          const trackData = track.track || track;
          return (
            <div
              key={`${trackData.id}-${index}`}
              className="track-list-row"
              onClick={() => onPlay && onPlay(trackData, index)}
            >
              <div className="col-number">
                <span className="track-number">{index + 1}</span>
                <button className="play-btn-small">
                  <FaPlay />
                </button>
              </div>

              <div className="col-title">
                {trackData.album?.images?.[0] && (
                  <img
                    src={trackData.album.images[0].url}
                    alt={trackData.name}
                    className="track-thumbnail"
                  />
                )}
                <div className="track-text">
                  <h4>{trackData.name}</h4>
                  <p>{trackData.artists?.map(a => a.name).join(', ')}</p>
                </div>
              </div>

              {showAlbum && (
                <div className="col-album">
                  {trackData.album?.name}
                </div>
              )}

              {showAddedDate && (
                <div className="col-added">
                  {formatDate(track.added_at)}
                </div>
              )}

              <div className="col-like">
                <button
                  className="like-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    onLike && onLike(trackData);
                  }}
                >
                  {trackData.is_liked ? <FaHeart /> : <FaRegHeart />}
                </button>
              </div>

              <div className="col-duration">
                {formatDuration(trackData.duration_ms)}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TrackList;

import React from 'react';
import { FaPlay } from 'react-icons/fa';
import './MediaCard.css';

const MediaCard = ({ item, type = 'track', onPlay, onClick }) => {
  const getImage = () => {
    if (type === 'track') return item.album?.images?.[0]?.url;
    if (type === 'artist') return item.images?.[0]?.url;
    if (type === 'album' || type === 'playlist') return item.images?.[0]?.url;
    return '/placeholder.png';
  };

  const getTitle = () => item.name || 'Unknown';

  const getSubtitle = () => {
    if (type === 'track') return item.artists?.map(a => a.name).join(', ');
    if (type === 'album') return item.artists?.map(a => a.name).join(', ');
    if (type === 'playlist') return `By ${item.owner?.display_name}`;
    if (type === 'artist') return 'Artist';
    return '';
  };

  return (
    <div className="media-card" onClick={onClick}>
      <div className="media-card-image">
        <img
          src={getImage()}
          alt={getTitle()}
          className={type === 'artist' ? 'artist-image' : ''}
        />
        {onPlay && (
          <button
            className="play-btn-media-card"
            onClick={(e) => {
              e.stopPropagation();
              onPlay(item);
            }}
          >
            <FaPlay />
          </button>
        )}
      </div>

      <div className="media-card-content">
        <h3>{getTitle()}</h3>
        <p>{getSubtitle()}</p>
      </div>
    </div>
  );
};

export default MediaCard;

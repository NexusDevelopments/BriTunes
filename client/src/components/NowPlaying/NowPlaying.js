import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { toggleNowPlaying } from '../../store/slices/ui';
import { FaTimes, FaHeart, FaRegHeart, FaPlus } from 'react-icons/fa';
import { setLiked } from '../../store/slices/spotify';
import './NowPlaying.css';

const NowPlaying = () => {
  const dispatch = useDispatch();
  const { nowPlayingOpen } = useSelector((state) => state.ui);
  const spotifyState = useSelector((state) => state.spotify.state);
  const { liked } = useSelector((state) => state.spotify);

  const currentTrack = spotifyState?.track_window?.current_track;

  const handleClose = () => {
    dispatch(toggleNowPlaying());
  };

  const handleLike = () => {
    dispatch(setLiked(!liked));
    // TODO: Call API to save/unsave track
  };

  if (!nowPlayingOpen || !currentTrack) return null;

  return (
    <div className="now-playing-panel">
      <div className="now-playing-header">
        <button className="close-btn" onClick={handleClose}>
          <FaTimes />
        </button>
      </div>

      <div className="now-playing-content">
        <div className="album-art-large">
          <img
            src={currentTrack.album.images[0]?.url}
            alt={currentTrack.album.name}
          />
        </div>

        <div className="track-details-large">
          <h1>{currentTrack.name}</h1>
          <h2>{currentTrack.artists.map((artist) => artist.name).join(', ')}</h2>
          <h3>{currentTrack.album.name}</h3>
        </div>

        <div className="track-actions">
          <button className={`action-btn ${liked ? 'liked' : ''}`} onClick={handleLike}>
            {liked ? <FaHeart /> : <FaRegHeart />}
          </button>
          <button className="action-btn">
            <FaPlus />
          </button>
        </div>

        <div className="lyrics-section">
          <h4>Lyrics</h4>
          <p className="lyrics-placeholder">Lyrics not available</p>
        </div>
      </div>
    </div>
  );
};

export default NowPlaying;

import React from 'react';
import { useSelector } from 'react-redux';
import PlaybackControls from './MusicPlayer/PlaybackControls';
import ProgressBar from './MusicPlayer/ProgressBar';
import VolumeControl from './MusicPlayer/VolumeControl';
import { FaListUl, FaExpand } from 'react-icons/fa';
import { useDispatch } from 'react-redux';
import { toggleQueue, toggleNowPlaying } from '../store/slices/ui';
import './MusicPlayer.css';

const MusicPlayer = () => {
  const dispatch = useDispatch();
  const spotifyState = useSelector((state) => state.spotify.state);
  const currentTrack = spotifyState?.track_window?.current_track;

  if (!currentTrack) {
    return null;
  }

  return (
    <div className="music-player-new">
      {/* Track Info */}
      <div className="player-track-info">
        <img 
          src={currentTrack.album?.images?.[0]?.url} 
          alt={currentTrack.name}
          className="player-album-art"
        />
        <div className="player-track-details">
          <h4>{currentTrack.name}</h4>
          <p>{currentTrack.artists?.map(a => a.name).join(', ')}</p>
        </div>
      </div>

      {/* Playback Controls Center */}
      <div className="player-controls-center">
        <PlaybackControls />
        <ProgressBar />
      </div>

      {/* Right Controls */}
      <div className="player-right-controls">
        <button
          className="player-icon-btn"
          onClick={() => dispatch(toggleQueue())}
          title="Queue"
        >
          <FaListUl />
        </button>
        <button
          className="player-icon-btn"
          onClick={() => dispatch(toggleNowPlaying())}
          title="Now Playing"
        >
          <FaExpand />
        </button>
        <VolumeControl />
      </div>
    </div>
  );
};

export default MusicPlayer;

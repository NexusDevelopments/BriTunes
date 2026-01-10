import React, { useContext, useState } from 'react';
import { PlayerContext } from '../context/PlayerContext';
import { FaPlay, FaPause, FaStepForward, FaStepBackward, FaListUl, FaMusic, FaTimes } from 'react-icons/fa';
import './MusicPlayer.css';

const MusicPlayer = () => {
  const {
    currentTrack,
    queue,
    isPlaying,
    currentTime,
    duration,
    play,
    pause,
    playNext,
    playPrevious,
    seek,
    removeFromQueue
  } = useContext(PlayerContext);

  const [showQueue, setShowQueue] = useState(false);
  const [showLyrics, setShowLyrics] = useState(false);

  if (!currentTrack) return null;

  const formatTime = (time) => {
    if (!time || isNaN(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleSeek = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = x / rect.width;
    seek(percentage * duration);
  };

  return (
    <>
      <div className="music-player">
        <div className="player-track-info">
          <img 
            src={currentTrack.album?.cover_medium || currentTrack.album?.cover_small} 
            alt={currentTrack.title}
            className="player-album-art"
          />
          <div className="player-track-details">
            <h4>{currentTrack.title}</h4>
            <p>{currentTrack.artist?.name}</p>
          </div>
        </div>

        <div className="player-controls">
          <div className="control-buttons">
            <button onClick={playPrevious} className="control-btn">
              <FaStepBackward />
            </button>
            <button onClick={isPlaying ? pause : play} className="control-btn control-btn-play">
              {isPlaying ? <FaPause /> : <FaPlay />}
            </button>
            <button onClick={playNext} className="control-btn">
              <FaStepForward />
            </button>
          </div>

          <div className="progress-bar-container">
            <span className="time-display">{formatTime(currentTime)}</span>
            <div className="progress-bar" onClick={handleSeek}>
              <div 
                className="progress-bar-fill" 
                style={{ width: `${(currentTime / duration) * 100 || 0}%` }}
              />
            </div>
            <span className="time-display">{formatTime(duration)}</span>
          </div>
        </div>

        <div className="player-actions">
          <button 
            className={`action-btn ${showLyrics ? 'active' : ''}`}
            onClick={() => setShowLyrics(!showLyrics)}
            title="Lyrics"
          >
            <FaMusic /> Lyrics
          </button>
          <button 
            className={`action-btn ${showQueue ? 'active' : ''}`}
            onClick={() => setShowQueue(!showQueue)}
            title="Queue"
          >
            <FaListUl /> Queue ({queue.length})
          </button>
        </div>
      </div>

      {/* Queue Panel */}
      {showQueue && (
        <div className="queue-panel">
          <div className="queue-header">
            <h3>Queue ({queue.length})</h3>
            <button onClick={() => setShowQueue(false)} className="close-btn">
              <FaTimes />
            </button>
          </div>
          <div className="queue-list">
            {queue.length === 0 ? (
              <div className="empty-queue">
                <FaMusic />
                <p>No songs in queue</p>
              </div>
            ) : (
              queue.map((track, index) => (
                <div 
                  key={`${track.id}-${index}`} 
                  className={`queue-item ${currentTrack?.id === track.id ? 'active' : ''}`}
                >
                  <img src={track.album?.cover_small} alt={track.title} />
                  <div className="queue-item-info">
                    <h4>{track.title}</h4>
                    <p>{track.artist?.name}</p>
                  </div>
                  <button 
                    onClick={() => removeFromQueue(track.id)}
                    className="remove-btn"
                    title="Remove from queue"
                  >
                    <FaTimes />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Lyrics Panel */}
      {showLyrics && (
        <div className="lyrics-panel">
          <div className="lyrics-header">
            <h3>Lyrics</h3>
            <button onClick={() => setShowLyrics(false)} className="close-btn">
              <FaTimes />
            </button>
          </div>
          <div className="lyrics-content">
            <div className="lyrics-placeholder">
              <FaMusic />
              <h4>{currentTrack.title}</h4>
              <p>{currentTrack.artist?.name}</p>
              <div className="lyrics-text">
                <p style={{ color: 'rgba(255,255,255,0.5)', fontStyle: 'italic' }}>
                  Lyrics not available for this track.<br />
                  Enjoying the 30-second preview from Deezer!
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MusicPlayer;

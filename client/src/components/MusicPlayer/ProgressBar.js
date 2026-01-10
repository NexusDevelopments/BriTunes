import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import playerService from '../../../services/playerService';
import './ProgressBar.css';

const ProgressBar = () => {
  const spotifyState = useSelector((state) => state.spotify.state);
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    if (spotifyState) {
      setPosition(spotifyState.position);
      setDuration(spotifyState.duration);
    }
  }, [spotifyState]);

  useEffect(() => {
    if (!spotifyState?.paused && !isDragging) {
      const interval = setInterval(() => {
        setPosition((prev) => Math.min(prev + 1000, duration));
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [spotifyState?.paused, duration, isDragging]);

  const formatTime = (ms) => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const handleSeek = (e) => {
    const progressBar = e.currentTarget;
    const rect = progressBar.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    const newPosition = Math.floor(duration * percent);
    setPosition(newPosition);
    playerService.seek(newPosition);
  };

  const handleMouseDown = () => {
    setIsDragging(true);
  };

  const handleMouseUp = (e) => {
    setIsDragging(false);
    handleSeek(e);
  };

  const progress = duration > 0 ? (position / duration) * 100 : 0;

  return (
    <div className="progress-bar-container">
      <span className="time-label">{formatTime(position)}</span>
      <div
        className="progress-bar"
        onClick={handleSeek}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
      >
        <div className="progress-track">
          <div className="progress-fill" style={{ width: `${progress}%` }}>
            <div className="progress-handle" />
          </div>
        </div>
      </div>
      <span className="time-label">{formatTime(duration)}</span>
    </div>
  );
};

export default ProgressBar;

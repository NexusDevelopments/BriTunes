import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FaVolumeUp, FaVolumeMute, FaVolumeDown } from 'react-icons/fa';
import { setVolume } from '../../../store/slices/player';
import playerService from '../../../services/playerService';
import './VolumeControl.css';

const VolumeControl = () => {
  const dispatch = useDispatch();
  const volume = useSelector((state) => state.player.volume);
  const [showSlider, setShowSlider] = useState(false);

  const handleVolumeChange = async (e) => {
    const newVolume = parseFloat(e.target.value);
    dispatch(setVolume(newVolume));
    await playerService.setVolume(newVolume);
  };

  const toggleMute = async () => {
    const newVolume = volume > 0 ? 0 : 1;
    dispatch(setVolume(newVolume));
    await playerService.setVolume(newVolume);
  };

  const getVolumeIcon = () => {
    if (volume === 0) return <FaVolumeMute />;
    if (volume < 0.5) return <FaVolumeDown />;
    return <FaVolumeUp />;
  };

  return (
    <div
      className="volume-control"
      onMouseEnter={() => setShowSlider(true)}
      onMouseLeave={() => setShowSlider(false)}
    >
      <button className="volume-btn" onClick={toggleMute} title="Mute">
        {getVolumeIcon()}
      </button>

      <div className={`volume-slider-container ${showSlider ? 'show' : ''}`}>
        <input
          type="range"
          className="volume-slider"
          min="0"
          max="1"
          step="0.01"
          value={volume}
          onChange={handleVolumeChange}
        />
      </div>
    </div>
  );
};

export default VolumeControl;

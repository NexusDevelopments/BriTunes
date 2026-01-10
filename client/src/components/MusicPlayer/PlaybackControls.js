import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { FaPlay, FaPause, FaStepBackward, FaStepForward, FaRandom, FaRedoAlt } from 'react-icons/fa';
import { setShuffle, setRepeat } from '../../store/slices/player';
import playerService from '../../services/playerService';
import './PlaybackControls.css';

const PlaybackControls = () => {
  const dispatch = useDispatch();
  const { shuffle, repeat, paused } = useSelector((state) => state.player);
  const spotifyState = useSelector((state) => state.spotify.state);

  const handlePlayPause = async () => {
    await playerService.togglePlay();
  };

  const handlePrevious = async () => {
    await playerService.previousTrack();
  };

  const handleNext = async () => {
    await playerService.nextTrack();
  };

  const handleShuffle = () => {
    dispatch(setShuffle(!shuffle));
  };

  const handleRepeat = () => {
    const modes = ['off', 'context', 'track'];
    const currentIndex = modes.indexOf(repeat);
    const nextMode = modes[(currentIndex + 1) % modes.length];
    dispatch(setRepeat(nextMode));
  };

  const isDisabled = !spotifyState;

  return (
    <div className="playback-controls">
      <div className="controls-row">
        <button
          className={`control-btn shuffle ${shuffle ? 'active' : ''}`}
          onClick={handleShuffle}
          disabled={isDisabled}
          title="Shuffle"
        >
          <FaRandom />
        </button>

        <button
          className="control-btn prev"
          onClick={handlePrevious}
          disabled={isDisabled}
          title="Previous"
        >
          <FaStepBackward />
        </button>

        <button
          className="control-btn play-pause"
          onClick={handlePlayPause}
          disabled={isDisabled}
          title={paused ? 'Play' : 'Pause'}
        >
          {paused ? <FaPlay /> : <FaPause />}
        </button>

        <button
          className="control-btn next"
          onClick={handleNext}
          disabled={isDisabled}
          title="Next"
        >
          <FaStepForward />
        </button>

        <button
          className={`control-btn repeat ${repeat !== 'off' ? 'active' : ''} ${
            repeat === 'track' ? 'repeat-one' : ''
          }`}
          onClick={handleRepeat}
          disabled={isDisabled}
          title={repeat === 'off' ? 'Enable repeat' : repeat === 'context' ? 'Repeat all' : 'Repeat track'}
        >
          <FaRedoAlt />
          {repeat === 'track' && <span className="repeat-dot">•</span>}
        </button>
      </div>
    </div>
  );
};

export default PlaybackControls;

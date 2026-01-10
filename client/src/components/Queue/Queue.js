import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { toggleQueue } from '../../store/slices/ui';
import { removeFromQueue } from '../../store/slices/queue';
import { FaTimes, FaMusic } from 'react-icons/fa';
import './Queue.css';

const Queue = () => {
  const dispatch = useDispatch();
  const { queue, currentlyPlaying } = useSelector((state) => state.queue);
  const { queueOpen } = useSelector((state) => state.ui);

  const handleClose = () => {
    dispatch(toggleQueue());
  };

  const handleRemove = (index) => {
    dispatch(removeFromQueue(index));
  };

  if (!queueOpen) return null;

  return (
    <div className="queue-panel">
      <div className="queue-header">
        <h2>Queue</h2>
        <button className="close-btn" onClick={handleClose}>
          <FaTimes />
        </button>
      </div>

      {currentlyPlaying && (
        <div className="now-playing-section">
          <h3>Now Playing</h3>
          <div className="queue-track current">
            <img
              src={currentlyPlaying.album?.images?.[0]?.url}
              alt={currentlyPlaying.name}
            />
            <div className="track-info">
              <h4>{currentlyPlaying.name}</h4>
              <p>{currentlyPlaying.artists?.map((a) => a.name).join(', ')}</p>
            </div>
          </div>
        </div>
      )}

      <div className="queue-list-section">
        <h3>Next Up</h3>
        {queue.length === 0 ? (
          <div className="queue-empty">
            <FaMusic />
            <p>Queue is empty</p>
          </div>
        ) : (
          <div className="queue-list">
            {queue.map((track, index) => (
              <div key={`${track.id}-${index}`} className="queue-track">
                <img
                  src={track.album?.images?.[0]?.url}
                  alt={track.name}
                />
                <div className="track-info">
                  <h4>{track.name}</h4>
                  <p>{track.artists?.map((a) => a.name).join(', ')}</p>
                </div>
                <button
                  className="remove-btn"
                  onClick={() => handleRemove(index)}
                >
                  <FaTimes />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Queue;

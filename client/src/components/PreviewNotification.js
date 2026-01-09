import React, { useEffect, useState } from 'react';
import './PreviewNotification.css';

const PreviewNotification = ({ show, onClose }) => {
  const [countdown, setCountdown] = useState(10);
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    if (show) {
      setCountdown(10);
      setProgress(100);

      const interval = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            clearInterval(interval);
            onClose();
            return 0;
          }
          return prev - 1;
        });

        setProgress(prev => {
          const newProgress = prev - 10;
          return newProgress < 0 ? 0 : newProgress;
        });
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [show, onClose]);

  if (!show) return null;

  return (
    <div className="preview-notification-overlay">
      <div className="preview-notification">
        <div className="notification-content">
          <h3>🎵 Preview Mode</h3>
          <p>The songs are only 30 seconds long. It's a preview.</p>
          <p className="working-on">Working on getting full songs!</p>
          <div className="countdown-bar-container">
            <div 
              className="countdown-bar" 
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <span className="countdown-text">{countdown}s</span>
        </div>
        <button className="close-notification" onClick={onClose}>×</button>
      </div>
    </div>
  );
};

export default PreviewNotification;

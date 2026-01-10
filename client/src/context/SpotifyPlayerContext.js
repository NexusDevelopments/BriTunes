import React, { createContext, useState, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setState } from '../store/slices/spotify';
import { setPlaying } from '../store/slices/player';
import playerService from '../services/playerService';

export const SpotifyPlayerContext = createContext();

export const SpotifyPlayerProvider = ({ children }) => {
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth);
  const [deviceId, setDeviceId] = useState(null);
  const [isReady, setIsReady] = useState(false);

  const initializePlayer = useCallback(() => {
    if (!token) return;

    playerService.initializePlayer(
      token,
      (state) => {
        if (state) {
          dispatch(setState(state));
          dispatch(setPlaying(!state.paused));
        }
      },
      (id) => {
        setDeviceId(id);
        setIsReady(true);
      }
    );
  }, [token, dispatch]);

  useEffect(() => {
    if (token) {
      // Load Spotify SDK
      const script = document.createElement('script');
      script.src = 'https://sdk.scdn.co/spotify-player.js';
      script.async = true;
      document.body.appendChild(script);

      window.onSpotifyWebPlaybackSDKReady = () => {
        initializePlayer();
      };

      return () => {
        playerService.disconnect();
      };
    }
  }, [token, initializePlayer]);

  const value = {
    deviceId,
    isReady,
  };

  return (
    <SpotifyPlayerContext.Provider value={value}>
      {children}
    </SpotifyPlayerContext.Provider>
  );
};

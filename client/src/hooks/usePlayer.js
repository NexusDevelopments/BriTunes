import { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import playerService from '../services/playerService';

export const usePlayer = () => {
  const dispatch = useDispatch();
  const spotifyState = useSelector((state) => state.spotify.state);
  const { isPlaying, volume, shuffle, repeat } = useSelector((state) => state.player);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (spotifyState) {
      setDuration(spotifyState.duration);
      setCurrentTime(spotifyState.position);
    }
  }, [spotifyState]);

  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = setInterval(() => {
        setCurrentTime((prev) => {
          if (prev >= duration) {
            return duration;
          }
          return prev + 1000;
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isPlaying, duration]);

  const play = async (contextUri, uris, offset) => {
    await playerService.play(contextUri, uris, offset);
  };

  const pause = async () => {
    await playerService.pause();
  };

  const togglePlay = async () => {
    await playerService.togglePlay();
  };

  const next = async () => {
    await playerService.nextTrack();
  };

  const previous = async () => {
    await playerService.previousTrack();
  };

  const seek = async (positionMs) => {
    await playerService.seek(positionMs);
    setCurrentTime(positionMs);
  };

  const setVol = async (vol) => {
    await playerService.setVolume(vol);
  };

  return {
    currentTime,
    duration,
    isPlaying,
    volume,
    shuffle,
    repeat,
    play,
    pause,
    togglePlay,
    next,
    previous,
    seek,
    setVolume: setVol,
  };
};

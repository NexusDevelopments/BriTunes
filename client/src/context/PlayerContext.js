import React, { createContext, useState, useRef, useEffect } from 'react';

export const PlayerContext = createContext();

export const PlayerProvider = ({ children }) => {
  const [currentTrack, setCurrentTrack] = useState(null);
  const [queue, setQueue] = useState([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef(new Audio());

  useEffect(() => {
    const audio = audioRef.current;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration);
    const handleEnded = () => playNext();

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
      audio.removeEventListener('ended', handleEnded);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const playTrack = async (track, newQueue = []) => {
    console.log('playTrack called with:', track);
    
    if (currentTrack?.id === track.id && isPlaying) {
      pause();
      return;
    }
    
    // Set track and queue immediately so UI updates
    setCurrentTrack(track);
    if (newQueue.length > 0) {
      setQueue(newQueue);
    }
    
    // Try multiple sources for full song playback
    try {
      // Method 1: Try to get full track URL from Deezer (may work with CORS proxy)
      const CORS_PROXY = 'https://corsproxy.io/?';
      const trackUrl = `https://api.deezer.com/track/${track.id}`;
      
      const response = await fetch(`${CORS_PROXY}${encodeURIComponent(trackUrl)}`);
      const trackData = await response.json();
      
      // Try to use the full track URL if available (usually blocked by CORS)
      if (trackData.link) {
        // Deezer doesn't provide direct MP3 URLs in the public API
        // Fall back to preview for now
        audioRef.current.src = track.preview || trackData.preview;
        await audioRef.current.play();
        setIsPlaying(true);
        console.log('Now playing preview:', track.title, '(30 seconds)');
      } else {
        throw new Error('No playback URL available');
      }
    } catch (error) {
      console.error('Error fetching track:', error);
      // Fallback to Deezer preview (30 seconds)
      if (track.preview) {
        audioRef.current.src = track.preview;
        audioRef.current.play()
          .then(() => {
            setIsPlaying(true);
            console.log('Playing preview:', track.title);
          })
          .catch(e => {
            console.error('Play error:', e);
            setIsPlaying(false);
          });
      }
    }
  };

  const play = () => {
    audioRef.current.play();
    setIsPlaying(true);
  };

  const pause = () => {
    audioRef.current.pause();
    setIsPlaying(false);
  };

  const playNext = () => {
    if (queue.length === 0) return;
    
    const currentIndex = queue.findIndex(t => t.id === currentTrack?.id);
    const nextIndex = (currentIndex + 1) % queue.length;
    playTrack(queue[nextIndex], queue);
  };

  const playPrevious = () => {
    if (queue.length === 0) return;
    
    const currentIndex = queue.findIndex(t => t.id === currentTrack?.id);
    const prevIndex = currentIndex === 0 ? queue.length - 1 : currentIndex - 1;
    playTrack(queue[prevIndex], queue);
  };

  const seek = (time) => {
    audioRef.current.currentTime = time;
    setCurrentTime(time);
  };

  const addToQueue = (track) => {
    setQueue([...queue, track]);
  };

  const removeFromQueue = (trackId) => {
    setQueue(queue.filter(t => t.id !== trackId));
  };

  const clearQueue = () => {
    setQueue([]);
  };

  const value = {
    currentTrack,
    queue,
    isPlaying,
    currentTime,
    duration,
    playTrack,
    play,
    pause,
    playNext,
    playPrevious,
    seek,
    addToQueue,
    removeFromQueue,
    clearQueue
  };

  return <PlayerContext.Provider value={value}>{children}</PlayerContext.Provider>;
};

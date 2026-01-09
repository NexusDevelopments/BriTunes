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
    if (currentTrack?.id === track.id && isPlaying) {
      pause();
    } else {
      setCurrentTrack(track);
      if (newQueue.length > 0) {
        setQueue(newQueue);
      }
      
      // Try to get full song from YouTube Music/YouTube
      try {
        const searchQuery = `${track.title} ${track.artist?.name || ''} audio`;
        
        // Use invidious instance to get audio stream
        const invidiousInstance = 'https://invidious.jing.rocks';
        const searchUrl = `${invidiousInstance}/api/v1/search?q=${encodeURIComponent(searchQuery)}&type=video`;
        
        const response = await fetch(searchUrl);
        const data = await response.json();
        
        if (data && data.length > 0) {
          const videoId = data[0].videoId;
          const audioUrl = `${invidiousInstance}/latest_version?id=${videoId}&itag=140`; // 140 is audio-only format
          
          audioRef.current.src = audioUrl;
          audioRef.current.play();
          setIsPlaying(true);
        } else {
          // Fallback to preview if YouTube fetch fails
          audioRef.current.src = track.preview;
          audioRef.current.play();
          setIsPlaying(true);
        }
      } catch (error) {
        console.error('Error fetching full song:', error);
        // Fallback to Deezer preview
        audioRef.current.src = track.preview;
        audioRef.current.play();
        setIsPlaying(true);
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

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
    
    // Try to find full song from multiple sources
    try {
      const searchQuery = `${track.title} ${track.artist?.name || ''}`;
      
      // Method 1: Try Jamendo (free music platform with full songs)
      const jamendoClientId = 'f9c34f3d'; // Public demo client ID
      const jamendoSearch = `https://api.jamendo.com/v3.0/tracks/?client_id=${jamendoClientId}&format=json&limit=1&search=${encodeURIComponent(searchQuery)}&audioformat=mp32`;
      
      const jamendoResponse = await fetch(jamendoSearch);
      const jamendoData = await jamendoResponse.json();
      
      if (jamendoData.results && jamendoData.results.length > 0) {
        const jamendoTrack = jamendoData.results[0];
        if (jamendoTrack.audio) {
          audioRef.current.src = jamendoTrack.audio;
          await audioRef.current.play();
          setIsPlaying(true);
          console.log('Playing full song from Jamendo:', jamendoTrack.name);
          return;
        }
      }
      
      // Method 2: Try Free Music Archive
      const fmaSearch = `https://freemusicarchive.org/api/get/tracks.json?api_key=60BLHNQCAOUFPIBZ&limit=1&search_query=${encodeURIComponent(searchQuery)}`;
      
      try {
        const fmaResponse = await fetch(fmaSearch);
        const fmaData = await fmaResponse.json();
        
        if (fmaData.dataset && fmaData.dataset.length > 0) {
          const fmaTrack = fmaData.dataset[0];
          if (fmaTrack.track_url) {
            audioRef.current.src = fmaTrack.track_url;
            await audioRef.current.play();
            setIsPlaying(true);
            console.log('Playing full song from FMA:', fmaTrack.track_title);
            return;
          }
        }
      } catch (fmaError) {
        console.log('FMA not available, trying next source...');
      }
      
      // Fallback: Use Deezer preview (30 seconds)
      if (track.preview) {
        audioRef.current.src = track.preview;
        await audioRef.current.play();
        setIsPlaying(true);
        console.log('Playing Deezer preview (30s):', track.title);
      }
    } catch (error) {
      console.error('Error fetching track:', error);
      // Final fallback to Deezer preview
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

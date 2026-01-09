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
      
      // Try to get full song from SoundCloud
      try {
        const searchQuery = `${track.title} ${track.artist?.name || ''}`;
        
        // Use SoundCloud API with a client ID (public)
        const clientId = 'iZIs9mchVcX5lhVRyQGGAYlNPVldzAoX'; // Public SoundCloud client ID
        const searchUrl = `https://api-v2.soundcloud.com/search/tracks?q=${encodeURIComponent(searchQuery)}&client_id=${clientId}&limit=1`;
        
        const response = await fetch(searchUrl);
        const data = await response.json();
        
        if (data.collection && data.collection.length > 0) {
          const scTrack = data.collection[0];
          
          // Get stream URL
          if (scTrack.media?.transcodings?.length > 0) {
            // Find progressive MP3 stream (works without additional auth)
            const mp3Stream = scTrack.media.transcodings.find(t => 
              t.format.protocol === 'progressive' && t.format.mime_type.includes('audio/mpeg')
            );
            
            if (mp3Stream) {
              const streamResponse = await fetch(`${mp3Stream.url}?client_id=${clientId}`);
              const streamData = await streamResponse.json();
              
              if (streamData.url) {
                audioRef.current.src = streamData.url;
                await audioRef.current.play();
                setIsPlaying(true);
                console.log('Playing from SoundCloud:', scTrack.title);
                return;
              }
            }
          }
        }
        
        // Fallback to Deezer preview if SoundCloud fails
        console.log('SoundCloud not available, using Deezer preview');
        audioRef.current.src = track.preview;
        await audioRef.current.play();
        setIsPlaying(true);
      } catch (error) {
        console.error('Error fetching from SoundCloud:', error);
        // Fallback to Deezer preview
        audioRef.current.src = track.preview;
        audioRef.current.play()
          .then(() => setIsPlaying(true))
          .catch(e => console.error('Play error:', e));
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

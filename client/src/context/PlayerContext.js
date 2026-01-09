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
    
    // Try to get full song from YouTube via Invidious
    try {
      const searchQuery = `${track.title} ${track.artist?.name || ''} official audio`;
      
      // Use multiple Invidious instances for reliability
      const invidiousInstances = [
        'https://inv.nadeko.net',
        'https://invidious.private.coffee',
        'https://yt.artemislena.eu',
        'https://invidious.nerdvpn.de'
      ];
      
      for (const instance of invidiousInstances) {
        try {
          console.log(`Trying ${instance}...`);
          
          // Search for the video
          const searchUrl = `${instance}/api/v1/search?q=${encodeURIComponent(searchQuery)}&type=video`;
          const searchResponse = await fetch(searchUrl, { signal: AbortSignal.timeout(5000) });
          const searchData = await searchResponse.json();
          
          if (searchData && searchData.length > 0) {
            const videoId = searchData[0].videoId;
            
            // Get video info with formats
            const videoUrl = `${instance}/api/v1/videos/${videoId}`;
            const videoResponse = await fetch(videoUrl, { signal: AbortSignal.timeout(5000) });
            const videoData = await videoResponse.json();
            
            // Find best audio format
            const audioFormats = videoData.adaptiveFormats?.filter(f => 
              f.type?.includes('audio')
            ) || [];
            
            if (audioFormats.length > 0) {
              // Sort by bitrate and get best quality
              const bestAudio = audioFormats.sort((a, b) => (b.bitrate || 0) - (a.bitrate || 0))[0];
              
              if (bestAudio.url) {
                audioRef.current.src = bestAudio.url;
                await audioRef.current.play();
                setIsPlaying(true);
                console.log('✅ Playing full song from YouTube:', track.title);
                return;
              }
            }
          }
        } catch (instanceError) {
          console.log(`${instance} failed, trying next...`);
          continue;
        }
      }
      
      // Fallback to Deezer preview
      console.log('YouTube sources unavailable, using Deezer preview');
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

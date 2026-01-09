import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaPlay, FaClock, FaMusic } from 'react-icons/fa';
import { PlayerContext } from '../context/PlayerContext';
import './Album.css';

const Album = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [album, setAlbum] = useState(null);
  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(true);

  const { playTrack } = useContext(PlayerContext);
  const CORS_PROXY = 'https://corsproxy.io/?';
  const DEEZER_API = 'https://api.deezer.com';

  useEffect(() => {
    const fetchAlbumData = async () => {
      try {
        setLoading(true);
        
        // Fetch album info
        const albumRes = await axios.get(`${CORS_PROXY}${encodeURIComponent(DEEZER_API + '/album/' + id)}`);
        setAlbum(albumRes.data);
        setTracks(albumRes.data.tracks?.data || []);

      } catch (error) {
        console.error('Error fetching album data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAlbumData();
  }, [id]);

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getTotalDuration = () => {
    const totalSeconds = tracks.reduce((acc, track) => acc + track.duration, 0);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    if (hours > 0) {
      return `${hours} hr ${minutes} min`;
    }
    return `${minutes} min`;
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    );
  }

  if (!album) {
    return (
      <div className="container">
        <div className="error-message">Album not found</div>
      </div>
    );
  }

  return (
    <div className="album-container">
      <div className="album-header">
        <div className="album-header-content">
          <div className="album-cover-large">
            {album.cover_xl ? (
              <img src={album.cover_xl} alt={album.title} />
            ) : (
              <div className="album-cover-placeholder">
                <FaMusic />
              </div>
            )}
          </div>
          <div className="album-header-info">
            <span className="album-label">ALBUM</span>
            <h1>{album.title}</h1>
            <div className="album-meta">
              <span 
                className="artist-link" 
                onClick={() => navigate(`/artist/${album.artist.id}`)}
              >
                {album.artist.name}
              </span>
              <span>• {album.release_date?.split('-')[0]}</span>
              <span>• {tracks.length} songs</span>
              <span>• {getTotalDuration()}</span>
            </div>
            <button 
              className="btn btn-primary btn-play-all"
              onClick={() => playTrack(tracks[0], tracks)}
            >
              <FaPlay /> Play Album
            </button>
          </div>
        </div>
      </div>

      <div className="container">
        <div className="tracks-table">
          <div className="tracks-table-header">
            <div className="track-col-number">#</div>
            <div className="track-col-title">TITLE</div>
            <div className="track-col-duration"><FaClock /></div>
          </div>
          
          {tracks.map((track, index) => (
            <div 
              key={track.id} 
              className="track-row"
              onClick={() => playTrack(track, tracks)}
            >
              <div className="track-col-number">
                <span className="track-number-text">{index + 1}</span>
                <FaPlay className="track-play-icon" />
              </div>
              <div className="track-col-title">
                <div className="track-title">{track.title}</div>
                {track.explicit_lyrics && (
                  <span className="explicit-badge">E</span>
                )}
              </div>
              <div className="track-col-duration">{formatDuration(track.duration)}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Album;

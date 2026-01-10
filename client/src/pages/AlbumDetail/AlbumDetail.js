import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import spotifyAPI from '../../services/spotifyAPI';
import { FaPlay, FaHeart, FaRegHeart, FaClock } from 'react-icons/fa';
import './AlbumDetail.css';

const AlbumDetail = () => {
  const { id } = useParams();
  const [album, setAlbum] = useState(null);
  const [isSaved, setIsSaved] = useState(false);

  const fetchAlbum = async () => {
    try {
      const data = await spotifyAPI.getAlbum(id);
      setAlbum(data);
    } catch (error) {
      console.error('Error fetching album:', error);
    }
  };

  useEffect(() => {
    if (id) {
      fetchAlbum();
    }
  }, [id, fetchAlbum]);

  const handleSave = async () => {
    try {
      if (isSaved) {
        await spotifyAPI.removeAlbum(id);
      } else {
        await spotifyAPI.saveAlbum(id);
      }
      setIsSaved(!isSaved);
    } catch (error) {
      console.error('Error saving album:', error);
    }
  };

  const formatDuration = (ms) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = ((ms % 60000) / 1000).toFixed(0);
    return `${minutes}:${seconds.padStart(2, '0')}`;
  };

  if (!album) {
    return <div className="loading">Loading...</div>;
  }

  const totalDuration = album.tracks?.items.reduce((acc, track) => acc + track.duration_ms, 0);
  const totalMinutes = Math.floor(totalDuration / 60000);

  return (
    <div className="album-detail">
      <div className="album-header">
        <img src={album.images[0]?.url} alt={album.name} />
        <div className="album-info">
          <p className="type">ALBUM</p>
          <h1>{album.name}</h1>
          <div className="album-meta">
            <span className="artist">{album.artists?.map(a => a.name).join(', ')}</span>
            <span className="separator">•</span>
            <span>{album.release_date?.split('-')[0]}</span>
            <span className="separator">•</span>
            <span>{album.total_tracks} songs</span>
            <span className="separator">•</span>
            <span>{totalMinutes} min</span>
          </div>
        </div>
      </div>

      <div className="album-actions">
        <button className="play-btn">
          <FaPlay />
        </button>
        <button className={`save-btn ${isSaved ? 'saved' : ''}`} onClick={handleSave}>
          {isSaved ? <FaHeart /> : <FaRegHeart />}
        </button>
      </div>

      <div className="tracks-list">
        <div className="tracks-header">
          <div className="track-number">#</div>
          <div className="track-title">TITLE</div>
          <div className="track-duration"><FaClock /></div>
        </div>
        {album.tracks?.items.map((track, index) => (
          <div key={track.id} className="track-row">
            <div className="track-number">{index + 1}</div>
            <div className="track-title">
              <h4>{track.name}</h4>
              <p>{track.artists?.map(a => a.name).join(', ')}</p>
            </div>
            <div className="track-duration">{formatDuration(track.duration_ms)}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AlbumDetail;

import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import spotifyAPI from '../../services/spotifyAPI';
import { FaPlay, FaHeart, FaRegHeart, FaClock } from 'react-icons/fa';
import './PlaylistDetail.css';

const PlaylistDetail = () => {
  const { id } = useParams();
  const [playlist, setPlaylist] = useState(null);

  useEffect(() => {
    if (id) {
      fetchPlaylist();
    }
  }, [id]);

  const fetchPlaylist = async () => {
    try {
      const data = await spotifyAPI.getPlaylist(id);
      setPlaylist(data);
    } catch (error) {
      console.error('Error fetching playlist:', error);
    }
  };

  const formatDuration = (ms) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = ((ms % 60000) / 1000).toFixed(0);
    return `${minutes}:${seconds.padStart(2, '0')}`;
  };

  const formatAddedDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
    return `${Math.floor(diffDays / 365)} years ago`;
  };

  if (!playlist) {
    return <div className="loading">Loading...</div>;
  }

  const totalDuration = playlist.tracks?.items.reduce((acc, item) => acc + item.track.duration_ms, 0);
  const totalHours = Math.floor(totalDuration / 3600000);
  const totalMinutes = Math.floor((totalDuration % 3600000) / 60000);

  return (
    <div className="playlist-detail">
      <div className="playlist-header">
        <img src={playlist.images?.[0]?.url || '/placeholder.png'} alt={playlist.name} />
        <div className="playlist-info">
          <p className="type">PLAYLIST</p>
          <h1>{playlist.name}</h1>
          {playlist.description && <p className="description">{playlist.description}</p>}
          <div className="playlist-meta">
            <span className="owner">{playlist.owner?.display_name}</span>
            <span className="separator">•</span>
            <span>{playlist.followers?.total} followers</span>
            <span className="separator">•</span>
            <span>{playlist.tracks?.total} songs</span>
            {totalHours > 0 && (
              <>
                <span className="separator">•</span>
                <span>{totalHours}h {totalMinutes}m</span>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="playlist-actions">
        <button className="play-btn">
          <FaPlay />
        </button>
      </div>

      <div className="tracks-list">
        <div className="tracks-header">
          <div className="track-number">#</div>
          <div className="track-title">TITLE</div>
          <div className="track-album">ALBUM</div>
          <div className="track-added">DATE ADDED</div>
          <div className="track-duration"><FaClock /></div>
        </div>
        {playlist.tracks?.items.map((item, index) => {
          const track = item.track;
          return (
            <div key={`${track.id}-${index}`} className="track-row">
              <div className="track-number">{index + 1}</div>
              <div className="track-title">
                <img src={track.album?.images?.[0]?.url} alt={track.name} />
                <div>
                  <h4>{track.name}</h4>
                  <p>{track.artists?.map(a => a.name).join(', ')}</p>
                </div>
              </div>
              <div className="track-album">{track.album?.name}</div>
              <div className="track-added">{formatAddedDate(item.added_at)}</div>
              <div className="track-duration">{formatDuration(track.duration_ms)}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PlaylistDetail;

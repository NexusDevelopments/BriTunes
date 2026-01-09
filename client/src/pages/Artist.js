import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { FaUserCircle, FaCheckCircle, FaPlus, FaPlay } from 'react-icons/fa';
import { PlayerContext } from '../context/PlayerContext';
import './Artist.css';

const Artist = () => {
  const { id } = useParams();
  const [artist, setArtist] = useState(null);
  const [topTracks, setTopTracks] = useState([]);
  const [albums, setAlbums] = useState([]);
  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(true);

  const { playTrack } = useContext(PlayerContext);
  const CORS_PROXY = 'https://corsproxy.io/?';
  const DEEZER_API = 'https://api.deezer.com';

  const fetchArtistData = async () => {
    try {
      setLoading(true);
      
      // Fetch artist info
      const artistRes = await axios.get(`${CORS_PROXY}${encodeURIComponent(DEEZER_API + '/artist/' + id)}`);
      setArtist(artistRes.data);

      // Fetch top tracks
      const tracksRes = await axios.get(`${CORS_PROXY}${encodeURIComponent(DEEZER_API + '/artist/' + id + '/top?limit=10')}`);
      setTopTracks(tracksRes.data.data || []);

      // Fetch albums
      const albumsRes = await axios.get(`${CORS_PROXY}${encodeURIComponent(DEEZER_API + '/artist/' + id + '/albums?limit=10')}`);
      setAlbums(albumsRes.data.data || []);

      // Check if following from localStorage
      const followedArtists = JSON.parse(localStorage.getItem('followedArtists') || '[]');
      setIsFollowing(followedArtists.includes(id));

    } catch (error) {
      console.error('Error fetching artist data:', error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchArtistData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleFollowToggle = () => {
    const followedArtists = JSON.parse(localStorage.getItem('followedArtists') || '[]');
    
    if (isFollowing) {
      // Unfollow
      const updated = followedArtists.filter(artistId => artistId !== id);
      localStorage.setItem('followedArtists', JSON.stringify(updated));
      setIsFollowing(false);
    } else {
      // Follow
      followedArtists.push(id);
      localStorage.setItem('followedArtists', JSON.stringify(followedArtists));
      setIsFollowing(true);
    }
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    );
  }

  if (!artist) {
    return (
      <div className="container">
        <div className="error-message">Artist not found</div>
      </div>
    );
  }

  return (
    <div className="artist-container">
      <div className="artist-header">
        <div className="artist-header-content">
          <div className="artist-image-large">
            <img src={artist.picture_xl || artist.picture_big} alt={artist.name} />
          </div>
          <div className="artist-header-info">
            <span className="artist-label">ARTIST</span>
            <h1>{artist.name}</h1>
            <div className="artist-stats">
              <span>{(artist.nb_fan || 0).toLocaleString()} fans</span>
              <span>• {(artist.nb_album || 0)} albums</span>
            </div>
            <button
              className={`btn ${isFollowing ? 'btn-secondary' : 'btn-primary'}`}
              onClick={handleFollowToggle}
            >
              {isFollowing ? (
                <>
                  <FaCheckCircle /> Following
                </>
              ) : (
                <>
                  <FaPlus /> Follow
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      <div className="container">
        <section className="artist-section">
          <h2>Popular Tracks</h2>
          <div className="tracks-list">
            {topTracks.map((track, index) => (
              <div key={track.id} className="track-item">
                <div className="track-number">#{index + 1}</div>
                <img src={track.album.cover_medium} alt={track.title} className="track-cover" />
                <div className="track-details">
                  <h4>{track.title}</h4>
                  <p>{track.artist.name}</p>
                </div>
                <div className="track-duration">{Math.floor(track.duration / 60)}:{(track.duration % 60).toString().padStart(2, '0')}</div>
                <button onClick={() => playTrack(track, topTracks)} className="play-button">
                  <FaPlay />
                </button>
              </div>
            ))}
          </div>
        </section>

        <section className="artist-section">
          <h2>Albums</h2>
          <div className="grid grid-4">
            {albums.map((album) => (
              <div key={album.id} className="album-card">
                <div className="album-image">
                  <img src={album.cover_medium} alt={album.title} />
                </div>
                <div className="album-info">
                  <h3>{album.title}</h3>
                  <p>{album.release_date?.split('-')[0]} • {album.nb_tracks || 0} tracks</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Artist;

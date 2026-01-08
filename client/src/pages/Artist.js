import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { FaUserCircle, FaCheckCircle, FaPlus } from 'react-icons/fa';
import TrackCard from '../components/TrackCard';
import './Artist.css';

const Artist = () => {
  const { id } = useParams();
  const [artist, setArtist] = useState(null);
  const [topTracks, setTopTracks] = useState([]);
  const [albums, setAlbums] = useState([]);
  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchArtistData = async () => {
    try {
      setLoading(true);
      
      const [artistRes, tracksRes, albumsRes] = await Promise.all([
        axios.get(`/api/artists/${id}`),
        axios.get(`/api/artists/${id}/top-tracks`),
        axios.get(`/api/artists/${id}/albums?limit=10`)
      ]);

      setArtist(artistRes.data);
      setTopTracks(tracksRes.data.tracks || []);
      setAlbums(albumsRes.data.items || []);

      // Check if following
      const followedRes = await axios.get('/api/artists/followed/list');
      const following = followedRes.data.some(a => a.artistId === id);
      setIsFollowing(following);

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
  const handleFollowToggle = async () => {
    try {
      if (isFollowing) {
        await axios.delete(`/api/artists/${id}/follow`);
        setIsFollowing(false);
      } else {
        await axios.post(`/api/artists/${id}/follow`);
        setIsFollowing(true);
      }
    } catch (error) {
      console.error('Error toggling follow:', error);
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
            {artist.images && artist.images.length > 0 ? (
              <img src={artist.images[0].url} alt={artist.name} />
            ) : (
              <div className="artist-image-placeholder">
                <FaUserCircle />
              </div>
            )}
          </div>
          <div className="artist-header-info">
            <span className="artist-label">Artist</span>
            <h1>{artist.name}</h1>
            <div className="artist-stats">
              <span>{artist.followers?.total?.toLocaleString()} followers</span>
              {artist.genres && artist.genres.length > 0 && (
                <span>• {artist.genres.slice(0, 3).join(', ')}</span>
              )}
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
          <div className="grid grid-4">
            {topTracks.map((track) => (
              <TrackCard key={track.id} track={track} />
            ))}
          </div>
        </section>

        <section className="artist-section">
          <h2>Albums</h2>
          <div className="grid grid-4">
            {albums.map((album) => (
              <div key={album.id} className="album-card">
                <div className="album-image">
                  {album.images && album.images.length > 0 ? (
                    <img src={album.images[0].url} alt={album.name} />
                  ) : (
                    <div className="album-image-placeholder"></div>
                  )}
                </div>
                <div className="album-info">
                  <h3>{album.name}</h3>
                  <p>{album.release_date?.split('-')[0]} • {album.total_tracks} tracks</p>
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

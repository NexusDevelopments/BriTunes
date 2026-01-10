import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import spotifyAPI from '../../services/spotifyAPI';
import { FaPlay, FaUserPlus, FaUserCheck } from 'react-icons/fa';
import './ArtistDetail.css';

const ArtistDetail = () => {
  const { id } = useParams();
  const [artist, setArtist] = useState(null);
  const [topTracks, setTopTracks] = useState([]);
  const [albums, setAlbums] = useState([]);
  const [relatedArtists, setRelatedArtists] = useState([]);
  const [isFollowing, setIsFollowing] = useState(false);

  const fetchArtistData = async () => {
    try {
      const [artistData, topTracksData, albumsData, relatedData] = await Promise.all([
        spotifyAPI.getArtist(id),
        spotifyAPI.getArtistTopTracks(id),
        spotifyAPI.getArtistAlbums(id),
        spotifyAPI.getRelatedArtists(id),
      ]);

      setArtist(artistData);
      setTopTracks(topTracksData.tracks.slice(0, 5));
      setAlbums(albumsData.items.slice(0, 6));
      setRelatedArtists(relatedData.artists.slice(0, 6));
    } catch (error) {
      console.error('Error fetching artist:', error);
    }
  };

  useEffect(() => {
    if (id) {
      fetchArtistData();
    }
  }, [id, fetchArtistData]);

  const handleFollow = async () => {
    try {
      if (isFollowing) {
        await spotifyAPI.unfollowArtist(id);
      } else {
        await spotifyAPI.followArtist(id);
      }
      setIsFollowing(!isFollowing);
    } catch (error) {
      console.error('Error following artist:', error);
    }
  };

  const formatNumber = (num) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num;
  };

  if (!artist) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="artist-detail">
      <div className="artist-header">
        <img src={artist.images[0]?.url} alt={artist.name} />
        <div className="artist-info">
          <p className="verified">✓ Verified Artist</p>
          <h1>{artist.name}</h1>
          <p className="followers">{formatNumber(artist.followers?.total)} followers</p>
        </div>
      </div>

      <div className="artist-actions">
        <button className="play-btn">
          <FaPlay />
        </button>
        <button className={`follow-btn ${isFollowing ? 'following' : ''}`} onClick={handleFollow}>
          {isFollowing ? (
            <>
              <FaUserCheck /> Following
            </>
          ) : (
            <>
              <FaUserPlus /> Follow
            </>
          )}
        </button>
      </div>

      <section className="top-tracks-section">
        <h2>Popular</h2>
        <div className="top-tracks">
          {topTracks.map((track, index) => (
            <div key={track.id} className="track-item">
              <span className="track-number">{index + 1}</span>
              <img src={track.album.images[0]?.url} alt={track.name} />
              <div className="track-info">
                <h4>{track.name}</h4>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="albums-section">
        <h2>Albums</h2>
        <div className="albums-grid">
          {albums.map((album) => (
            <div key={album.id} className="album-card">
              <img src={album.images[0]?.url} alt={album.name} />
              <h4>{album.name}</h4>
              <p>{album.release_date?.split('-')[0]}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="related-section">
        <h2>Fans also like</h2>
        <div className="related-grid">
          {relatedArtists.map((relatedArtist) => (
            <div key={relatedArtist.id} className="artist-card">
              <img src={relatedArtist.images[0]?.url} alt={relatedArtist.name} />
              <h4>{relatedArtist.name}</h4>
              <p>Artist</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default ArtistDetail;

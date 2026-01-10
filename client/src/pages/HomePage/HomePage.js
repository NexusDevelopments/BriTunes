import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import spotifyAPI from '../../services/spotifyAPI';
import { FaPlay } from 'react-icons/fa';
import './HomePage.css';

const HomePage = () => {
  const [featured, setFeatured] = useState([]);
  const [newReleases, setNewReleases] = useState([]);
  const [recentlyPlayed, setRecentlyPlayed] = useState([]);
  const [topTracks, setTopTracks] = useState([]);
  const [recommendations, setRecommendations] = useState([]);

  useEffect(() => {
    fetchHomeData();
  }, []);

  const fetchHomeData = async () => {
    try {
      const [
        featuredData,
        releasesData,
        recentData,
        topTracksData,
      ] = await Promise.all([
        spotifyAPI.getFeaturedPlaylists(),
        spotifyAPI.getNewReleases(),
        spotifyAPI.getRecentlyPlayed(),
        spotifyAPI.getUserTopTracks('short_term', 10),
      ]);

      setFeatured(featuredData.playlists?.items.slice(0, 6) || []);
      setNewReleases(releasesData.albums?.items.slice(0, 6) || []);
      setRecentlyPlayed(recentData.items?.slice(0, 6) || []);
      setTopTracks(topTracksData.items || []);

      // Get recommendations based on top tracks
      if (topTracksData.items?.length > 0) {
        const seedTracks = topTracksData.items.slice(0, 5).map(t => t.id);
        const recsData = await spotifyAPI.getRecommendations(seedTracks, null, 6);
        setRecommendations(recsData.tracks || []);
      }
    } catch (error) {
      console.error('Error fetching home data:', error);
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div className="home-page">
      <h1>{getGreeting()}</h1>

      {recentlyPlayed.length > 0 && (
        <section className="recent-section">
          <div className="recent-grid">
            {recentlyPlayed.map((item, index) => (
              <div key={`recent-${index}`} className="recent-card">
                <img src={item.track?.album?.images?.[0]?.url} alt={item.track?.name} />
                <span>{item.track?.name}</span>
                <button className="play-btn-overlay">
                  <FaPlay />
                </button>
              </div>
            ))}
          </div>
        </section>
      )}

      {topTracks.length > 0 && (
        <section className="home-section">
          <h2>Your top tracks</h2>
          <div className="home-grid">
            {topTracks.slice(0, 6).map((track) => (
              <div key={track.id} className="home-card">
                <img src={track.album?.images?.[0]?.url} alt={track.name} />
                <h3>{track.name}</h3>
                <p>{track.artists?.map(a => a.name).join(', ')}</p>
                <button className="play-btn-card">
                  <FaPlay />
                </button>
              </div>
            ))}
          </div>
        </section>
      )}

      {featured.length > 0 && (
        <section className="home-section">
          <h2>Featured playlists</h2>
          <div className="home-grid">
            {featured.map((playlist) => (
              <div key={playlist.id} className="home-card">
                <img src={playlist.images?.[0]?.url} alt={playlist.name} />
                <h3>{playlist.name}</h3>
                <p>{playlist.description}</p>
                <button className="play-btn-card">
                  <FaPlay />
                </button>
              </div>
            ))}
          </div>
        </section>
      )}

      {recommendations.length > 0 && (
        <section className="home-section">
          <h2>Recommended for you</h2>
          <div className="home-grid">
            {recommendations.map((track) => (
              <div key={track.id} className="home-card">
                <img src={track.album?.images?.[0]?.url} alt={track.name} />
                <h3>{track.name}</h3>
                <p>{track.artists?.map(a => a.name).join(', ')}</p>
                <button className="play-btn-card">
                  <FaPlay />
                </button>
              </div>
            ))}
          </div>
        </section>
      )}

      {newReleases.length > 0 && (
        <section className="home-section">
          <h2>New releases</h2>
          <div className="home-grid">
            {newReleases.map((album) => (
              <div key={album.id} className="home-card">
                <img src={album.images?.[0]?.url} alt={album.name} />
                <h3>{album.name}</h3>
                <p>{album.artists?.map(a => a.name).join(', ')}</p>
                <button className="play-btn-card">
                  <FaPlay />
                </button>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default HomePage;

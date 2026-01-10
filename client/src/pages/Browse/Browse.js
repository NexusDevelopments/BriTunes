import React, { useState, useEffect } from 'react';
import spotifyAPI from '../../services/spotifyAPI';
import './Browse.css';

const Browse = () => {
  const [featured, setFeatured] = useState([]);
  const [newReleases, setNewReleases] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetchBrowseData();
  }, []);

  const fetchBrowseData = async () => {
    try {
      const [featuredData, releasesData, categoriesData] = await Promise.all([
        spotifyAPI.getFeaturedPlaylists(),
        spotifyAPI.getNewReleases(),
        spotifyAPI.getCategories(),
      ]);

      setFeatured(featuredData.playlists?.items.slice(0, 6) || []);
      setNewReleases(releasesData.albums?.items.slice(0, 6) || []);
      setCategories(categoriesData.categories?.items.slice(0, 8) || []);
    } catch (error) {
      console.error('Error fetching browse data:', error);
    }
  };

  return (
    <div className="browse-page">
      <h1>Browse</h1>

      <section className="browse-section">
        <h2>Featured Playlists</h2>
        <div className="browse-grid">
          {featured.map((playlist) => (
            <div key={playlist.id} className="browse-card">
              <img src={playlist.images?.[0]?.url} alt={playlist.name} />
              <h3>{playlist.name}</h3>
              <p>{playlist.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="browse-section">
        <h2>New Releases</h2>
        <div className="browse-grid">
          {newReleases.map((album) => (
            <div key={album.id} className="browse-card">
              <img src={album.images?.[0]?.url} alt={album.name} />
              <h3>{album.name}</h3>
              <p>{album.artists?.map(a => a.name).join(', ')}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="browse-section">
        <h2>Browse All</h2>
        <div className="categories-grid">
          {categories.map((category) => (
            <div
              key={category.id}
              className="category-card"
              style={{
                background: `linear-gradient(135deg, ${getRandomColor()} 0%, ${getRandomColor()} 100%)`,
              }}
            >
              <h3>{category.name}</h3>
              {category.icons?.[0] && (
                <img src={category.icons[0].url} alt={category.name} />
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

const getRandomColor = () => {
  const colors = [
    '#3b82f6',
    '#8b5cf6',
    '#ec4899',
    '#ef4444',
    '#f59e0b',
    '#10b981',
    '#06b6d4',
    '#6366f1',
  ];
  return colors[Math.floor(Math.random() * colors.length)];
};

export default Browse;

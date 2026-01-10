import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaHome, FaSearch, FaCompactDisc, FaMicrophone, FaMusic } from 'react-icons/fa';
import './TopNav.css';

const TopNav = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="top-nav">
      <div className="nav-items">
        <button
          className={`nav-item ${isActive('/') ? 'active' : ''}`}
          onClick={() => navigate('/')}
        >
          <FaHome />
          <span>Home</span>
        </button>
        
        <button
          className={`nav-item ${isActive('/search') ? 'active' : ''}`}
          onClick={() => navigate('/search')}
        >
          <FaSearch />
          <span>Search</span>
        </button>
        
        <button
          className={`nav-item ${isActive('/browse') ? 'active' : ''}`}
          onClick={() => navigate('/browse')}
        >
          <FaMusic />
          <span>Browse</span>
        </button>
      </div>
    </nav>
  );
};

export default TopNav;

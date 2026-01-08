import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { FaMusic, FaSearch, FaUserCircle, FaSignOutAlt } from 'react-icons/fa';
import './Navbar.css';

const Navbar = () => {
  const { isAuthenticated, logout, user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <FaMusic className="logo-icon" />
          <span>BriTunes</span>
        </Link>

        <div className="navbar-menu">
          <Link to="/" className="navbar-link">Home</Link>
          <Link to="/search" className="navbar-link">
            <FaSearch /> Search
          </Link>
          <Link to="/library" className="navbar-link">Library</Link>
        </div>

        <div className="navbar-user">
          <div className="user-menu-container">
            <button 
              className="user-menu-button"
              onClick={() => setShowUserMenu(!showUserMenu)}
            >
              {user?.profileImage ? (
                <img src={user.profileImage} alt="Profile" className="user-avatar" />
              ) : (
                <FaUserCircle className="user-icon" />
              )}
              <span>{user?.displayName || user?.username}</span>
            </button>

            {showUserMenu && (
              <div className="user-dropdown">
                <Link to="/profile" className="dropdown-item" onClick={() => setShowUserMenu(false)}>
                  <FaUserCircle /> Profile
                </Link>
                <button className="dropdown-item" onClick={handleLogout}>
                  <FaSignOutAlt /> Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

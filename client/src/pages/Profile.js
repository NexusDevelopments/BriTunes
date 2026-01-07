import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { FaUserCircle, FaEdit } from 'react-icons/fa';
import axios from 'axios';
import './Profile.css';

const Profile = () => {
  const { user } = useContext(AuthContext);
  const [isEditing, setIsEditing] = useState(false);
  const [displayName, setDisplayName] = useState(user?.displayName || '');
  const [profileImage, setProfileImage] = useState(user?.profileImage || '');
  const [message, setMessage] = useState('');

  const handleUpdate = async (e) => {
    e.preventDefault();
    
    try {
      await axios.put('/api/users/profile', {
        displayName,
        profileImage
      });

      setMessage('Profile updated successfully!');
      setIsEditing(false);
      
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Error updating profile:', error);
      setMessage('Failed to update profile');
    }
  };

  return (
    <div className="profile-container">
      <div className="container">
        <div className="profile-header">
          <div className="profile-image-large">
            {user?.profileImage ? (
              <img src={user.profileImage} alt={user.displayName} />
            ) : (
              <FaUserCircle />
            )}
          </div>
          <div className="profile-header-info">
            <span className="profile-label">Profile</span>
            <h1>{user?.displayName || user?.username}</h1>
            <p className="profile-email">{user?.email}</p>
          </div>
        </div>

        <div className="profile-content">
          <div className="profile-card">
            <div className="card-header">
              <h2>Account Information</h2>
              <button
                className="btn btn-secondary"
                onClick={() => setIsEditing(!isEditing)}
              >
                <FaEdit /> {isEditing ? 'Cancel' : 'Edit'}
              </button>
            </div>

            {message && (
              <div className={message.includes('success') ? 'success-message' : 'error-message'}>
                {message}
              </div>
            )}

            {isEditing ? (
              <form onSubmit={handleUpdate} className="profile-form">
                <div className="input-group">
                  <label>Display Name</label>
                  <input
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="Your display name"
                  />
                </div>

                <div className="input-group">
                  <label>Profile Image URL</label>
                  <input
                    type="url"
                    value={profileImage}
                    onChange={(e) => setProfileImage(e.target.value)}
                    placeholder="https://example.com/image.jpg"
                  />
                </div>

                <button type="submit" className="btn btn-primary">
                  Save Changes
                </button>
              </form>
            ) : (
              <div className="profile-info">
                <div className="info-item">
                  <label>Username</label>
                  <p>{user?.username}</p>
                </div>
                <div className="info-item">
                  <label>Display Name</label>
                  <p>{user?.displayName || 'Not set'}</p>
                </div>
                <div className="info-item">
                  <label>Email</label>
                  <p>{user?.email}</p>
                </div>
                <div className="info-item">
                  <label>Followed Artists</label>
                  <p>{user?.followedArtists?.length || 0} artists</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;

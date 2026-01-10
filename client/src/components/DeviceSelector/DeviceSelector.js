import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import spotifyAPI from '../../services/spotifyAPI';
import { FaDesktop, FaMobileAlt, FaCheck } from 'react-icons/fa';
import './DeviceSelector.css';

const DeviceSelector = () => {
  const [devices, setDevices] = useState([]);
  const [activeDeviceId, setActiveDeviceId] = useState(null);
  const { token } = useSelector((state) => state.auth);

  useEffect(() => {
    if (token) {
      fetchDevices();
      const interval = setInterval(fetchDevices, 5000);
      return () => clearInterval(interval);
    }
  }, [token]);

  const fetchDevices = async () => {
    try {
      const data = await spotifyAPI.getDevices();
      setDevices(data.devices);
      const active = data.devices.find((d) => d.is_active);
      if (active) setActiveDeviceId(active.id);
    } catch (error) {
      console.error('Error fetching devices:', error);
    }
  };

  const handleDeviceSelect = async (deviceId) => {
    try {
      await spotifyAPI.transferPlayback(deviceId);
      setActiveDeviceId(deviceId);
    } catch (error) {
      console.error('Error switching device:', error);
    }
  };

  const getDeviceIcon = (type) => {
    switch (type.toLowerCase()) {
      case 'computer':
        return <FaDesktop />;
      case 'smartphone':
        return <FaMobileAlt />;
      default:
        return <FaDesktop />;
    }
  };

  return (
    <div className="device-selector">
      <h3>Connect to a device</h3>
      
      {devices.length === 0 ? (
        <div className="no-devices">
          <p>No devices found</p>
          <p className="device-hint">Open Spotify on another device to see it here</p>
        </div>
      ) : (
        <div className="device-list">
          {devices.map((device) => (
            <div
              key={device.id}
              className={`device-item ${device.id === activeDeviceId ? 'active' : ''}`}
              onClick={() => handleDeviceSelect(device.id)}
            >
              <div className="device-icon">
                {getDeviceIcon(device.type)}
              </div>
              <div className="device-info">
                <h4>{device.name}</h4>
                <p>{device.type}</p>
              </div>
              {device.id === activeDeviceId && (
                <div className="device-active-indicator">
                  <FaCheck />
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DeviceSelector;

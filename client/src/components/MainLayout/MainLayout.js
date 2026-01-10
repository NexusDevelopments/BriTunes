import React from 'react';
import { useSelector } from 'react-redux';
import LibrarySidebar from '../LibrarySidebar/LibrarySidebar';
import Queue from '../Queue/Queue';
import NowPlaying from '../NowPlaying/NowPlaying';
import MusicPlayer from '../MusicPlayer';
import './MainLayout.css';

const MainLayout = ({ children }) => {
  const { queueOpen, nowPlayingOpen } = useSelector((state) => state.ui);

  return (
    <div className="main-layout">
      <LibrarySidebar />
      
      <div className="main-content">
        <div className="content-wrapper">
          {children}
        </div>
        
        <MusicPlayer />
      </div>

      {queueOpen && <Queue />}
      {nowPlayingOpen && <NowPlaying />}
    </div>
  );
};

export default MainLayout;

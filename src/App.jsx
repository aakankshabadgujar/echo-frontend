import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import MainContent from './components/MainContent';
import Player from './components/Player';
import Auth from './Auth';

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);
  
  // Track State: For the Player
  const [currentTrack, setCurrentTrack] = useState(null);
  
  // Playlist State: To filter what MainContent shows
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);

  useEffect(() => {
    // Check if token exists on load
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
    }
    setLoading(false);
  }, []);

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    setIsLoggedIn(false);
    setCurrentTrack(null);
    setSelectedPlaylist(null);
  };

  // 1. Loading Screen
  if (loading) {
    return (
      <div className="h-screen bg-black flex items-center justify-center text-white">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-zinc-400 font-medium">Waking up Echo...</p>
        </div>
      </div>
    );
  }

  // 2. Auth Screen
  if (!isLoggedIn) {
    return <Auth onLoginSuccess={handleLoginSuccess} />;
  }

  // 3. Main App Layout
  return (
    <div className="flex h-screen bg-black text-white overflow-hidden">
      {/* SIDEBAR: Controls navigation and playlist selection */}
      <Sidebar 
        onLogout={handleLogout} 
        onSelectPlaylist={(playlist) => setSelectedPlaylist(playlist)}
        onSelectHome={() => setSelectedPlaylist(null)} // Reset to "Explore Music"
      />
      
      {/* MAIN CONTENT: Shows grid based on selectedPlaylist */}
      <main className="flex-1 relative overflow-y-auto bg-gradient-to-b from-zinc-900 to-black">
        <MainContent 
          selectedPlaylist={selectedPlaylist}
          onTrackSelect={(track) => setCurrentTrack(track)} 
        />
      </main>

      {/* PLAYER: Sits at the bottom when a track is chosen */}
      {currentTrack && (
        <Player 
          currentTrack={currentTrack} 
          onNext={() => console.log("Skip Forward logic here")} 
          onPrev={() => console.log("Skip Backward logic here")} 
        />
      )}
    </div>
  );
};

export default App;
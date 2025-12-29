import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from './components/Sidebar';
import MainContent from './components/MainContent';
import Player from './components/Player';
import Auth from './Auth';

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);
  const [currentTrack, setCurrentTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);

  // --- LIVE BACKEND URL ---
  const BACKEND_URL = "https://echo-backend-0rw1.onrender.com";

  useEffect(() => {
    // Wake up the backend and check if token is valid
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          // Optional: Verify token with backend
          // await axios.get(`${BACKEND_URL}/verify`, { headers: { Authorization: `Bearer ${token}` } });
          setIsLoggedIn(true);
        } catch (err) {
          localStorage.removeItem('token');
          setIsLoggedIn(false);
        }
      }
      // Give the backend a moment to wake up from "Spin Down"
      setLoading(false);
    };

    checkAuth();
  }, []);

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    setIsLoggedIn(false);
  };

  // 1. Show a loading screen while the app "wakes up"
  if (loading) {
    return (
      <div className="h-screen bg-black flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-zinc-400 font-medium">Waking up Echo...</p>
        </div>
      </div>
    );
  }

  // 2. If not logged in, ONLY show the Auth screen
  if (!isLoggedIn) {
    return <Auth onLoginSuccess={handleLoginSuccess} />;
  }

  // 3. Main App Shell (Only shows when logged in)
  return (
    <div className="flex h-screen bg-black text-white overflow-hidden">
      <Sidebar onLogout={handleLogout} />
      
      <main className="flex-1 relative overflow-y-auto bg-gradient-to-b from-zinc-800 to-black">
        <MainContent 
          onTrackSelect={(track) => {
            setCurrentTrack(track);
            setIsPlaying(true);
          }} 
        />
      </main>

      {currentTrack && (
        <Player 
          track={currentTrack} 
          isPlaying={isPlaying} 
          onPlayPause={() => setIsPlaying(!isPlaying)} 
        />
      )}
    </div>
  );
};

export default App;
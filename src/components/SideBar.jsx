import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Home, Search, Library, Plus, 
  Heart, ListMusic, Loader2, LogOut 
} from 'lucide-react';

const Sidebar = ({ onSelectCategory, onSelectPlaylist, onSelectHome, onLogout }) => {
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState('');

  const BACKEND_URL = "https://echo-backend-0rw1.onrender.com";
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchPlaylists();
  }, []);

  const fetchPlaylists = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/playlists`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPlaylists(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      console.error("Failed to fetch playlists:", err);
    }
  };

  const handleCreatePlaylist = async (e) => {
    e.preventDefault();
    if (!newPlaylistName.trim()) return;
    
    setLoading(true);
    try {
      const response = await axios.post(`${BACKEND_URL}/playlists`, 
        { name: newPlaylistName },
        { headers: { Authorization: `Bearer ${token}` }}
      );
      setPlaylists([...playlists, response.data]);
      setNewPlaylistName('');
      setIsCreating(false);
    } catch (err) {
      alert("Failed to create playlist.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-64 bg-black h-full flex flex-col gap-2 p-2 border-r border-zinc-800">
      {/* Navigation Section */}
      <div className="bg-zinc-900 rounded-lg p-4 space-y-4">
        <div 
          onClick={onSelectHome}
          className="flex items-center gap-4 text-zinc-400 hover:text-white cursor-pointer transition group"
        >
          <Home size={24} />
          <span className="font-semibold">Home</span>
        </div>
        <div className="flex items-center gap-4 text-zinc-400 hover:text-white cursor-pointer transition group">
          <Search size={24} />
          <span className="font-semibold">Search</span>
        </div>
      </div>

      {/* Library & Playlists Section */}
      <div className="bg-zinc-900 rounded-lg flex-1 overflow-hidden flex flex-col">
        <div className="p-4 flex items-center justify-between">
          <div className="flex items-center gap-2 text-zinc-400">
            <Library size={24} />
            <span className="font-semibold">Your Library</span>
          </div>
          <button 
            onClick={() => setIsCreating(!isCreating)}
            className="text-zinc-400 hover:text-white hover:bg-zinc-800 p-1 rounded-full transition"
          >
            <Plus size={20} />
          </button>
        </div>

        {isCreating && (
          <form onSubmit={handleCreatePlaylist} className="px-4 mb-4">
            <input 
              autoFocus
              className="w-full bg-zinc-800 border border-zinc-700 rounded-md p-2 text-sm text-white focus:border-green-500 outline-none"
              placeholder="New Playlist Name"
              value={newPlaylistName}
              onChange={(e) => setNewPlaylistName(e.target.value)}
            />
            <div className="flex justify-end gap-2 mt-2">
              <button type="submit" disabled={loading} className="text-xs bg-green-500 text-black px-3 py-1 rounded-full font-bold">
                {loading ? <Loader2 size={12} className="animate-spin" /> : "Create"}
              </button>
            </div>
          </form>
        )}

        <div className="flex-1 overflow-y-auto px-2 space-y-1">
          {playlists.map((playlist) => (
            <div 
              key={playlist.id}
              onClick={() => onSelectPlaylist(playlist)}
              className="flex items-center gap-3 p-2 text-zinc-400 hover:bg-zinc-800/50 rounded-md cursor-pointer transition"
            >
              <ListMusic size={20} />
              <span className="text-sm font-medium truncate">{playlist.name}</span>
            </div>
          ))}
        </div>

        {/* Logout Button */}
        <div className="p-4 border-t border-zinc-800">
          <button 
            onClick={onLogout}
            className="flex items-center gap-3 text-zinc-400 hover:text-red-500 transition w-full"
          >
            <LogOut size={20} />
            <span className="text-sm font-medium">Logout</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, Play, Plus, Trash2, Loader2, ListMusic } from 'lucide-react';

const MainContent = ({ onTrackSelect, selectedPlaylist }) => {
  const [tracks, setTracks] = useState([]);
  const [userPlaylists, setUserPlaylists] = useState([]); // Store playlists for the dropdown
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [activeMenu, setActiveMenu] = useState(null); // Tracks which song's "Add" menu is open

  const BACKEND_URL = "https://echo-backend-0rw1.onrender.com";
  const token = localStorage.getItem('token');

  // Fetch tracks and user playlists
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const headers = { Authorization: `Bearer ${token}` };
        
        // 1. Fetch Tracks (Playlist-specific or Global)
        const trackEndpoint = selectedPlaylist 
          ? `${BACKEND_URL}/playlists/${selectedPlaylist.id}/tracks` 
          : `${BACKEND_URL}/tracks`;
        const trackRes = await axios.get(trackEndpoint, { headers });
        setTracks(Array.isArray(trackRes.data) ? trackRes.data : []);

        // 2. Fetch User Playlists for the "Add to" dropdown
        const playlistRes = await axios.get(`${BACKEND_URL}/playlists`, { headers });
        setUserPlaylists(Array.isArray(playlistRes.data) ? playlistRes.data : []);
        
      } catch (err) {
        console.error("Data fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [selectedPlaylist]);

  const handleAddToPlaylist = async (trackId, playlistId) => {
    try {
      await axios.post(`${BACKEND_URL}/playlists/${playlistId}/tracks`, 
        { track_id: trackId },
        { headers: { Authorization: `Bearer ${token}` }}
      );
      alert("Added to playlist!");
      setActiveMenu(null); // Close dropdown
    } catch (err) {
      alert("Error adding song. It might already be in that playlist.");
    }
  };

  const handleRemoveFromPlaylist = async (trackId) => {
    try {
      await axios.delete(`${BACKEND_URL}/playlists/${selectedPlaylist.id}/tracks/${trackId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTracks(tracks.filter(t => t.id !== trackId));
    } catch (err) {
      alert("Failed to remove song.");
    }
  };

  const filteredTracks = tracks.filter(track => 
    track.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    track.artist?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) return (
    <div className="flex flex-col items-center justify-center h-full text-zinc-500">
      <Loader2 className="animate-spin mb-4 text-green-500" size={32} />
      <p>Syncing library...</p>
    </div>
  );

  return (
    <div className="p-8 pb-32 h-full overflow-y-auto bg-black">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-bold text-white">
          {selectedPlaylist ? selectedPlaylist.name : "Explore Music"}
        </h2>
        <div className="relative w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
          <input
            type="text" placeholder="Search..."
            className="w-full bg-zinc-900 border border-zinc-800 rounded-full py-2 pl-10 pr-4 text-white outline-none focus:border-green-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {filteredTracks.map((track) => (
          <div key={track.id} className="bg-zinc-900/40 p-4 rounded-xl hover:bg-zinc-800/60 transition-all group relative">
            <div className="relative aspect-square mb-4 shadow-lg overflow-hidden rounded-lg" onClick={() => onTrackSelect(track)}>
              <img src={track.cover_url || track.cover_image} alt="" className="object-cover w-full h-full group-hover:scale-105 transition-transform" />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Play size={40} fill="white" />
              </div>
            </div>

            <div className="flex justify-between items-start">
              <div className="truncate">
                <h3 className="font-bold truncate text-white text-sm">{track.title}</h3>
                <p className="text-xs text-zinc-400 truncate">{track.artist}</p>
              </div>

              <div className="relative">
                {selectedPlaylist ? (
                  <button onClick={() => handleRemoveFromPlaylist(track.id)} className="text-zinc-500 hover:text-red-500"><Trash2 size={18} /></button>
                ) : (
                  <>
                    <button onClick={() => setActiveMenu(activeMenu === track.id ? null : track.id)} className="text-zinc-500 hover:text-green-500 transition-all"><Plus size={18} /></button>
                    
                    {/* DROP_DOWN MENU */}
                    {activeMenu === track.id && (
                      <div className="absolute right-0 bottom-8 w-48 bg-zinc-800 border border-zinc-700 rounded-lg shadow-2xl z-50 py-2">
                        <p className="text-[10px] uppercase text-zinc-500 px-3 mb-1 font-bold">Add to Playlist</p>
                        {userPlaylists.map(pl => (
                          <button key={pl.id} onClick={() => handleAddToPlaylist(track.id, pl.id)} className="w-full text-left px-3 py-2 text-sm text-zinc-300 hover:bg-green-500 hover:text-black transition-colors flex items-center gap-2">
                            <ListMusic size={14} /> {pl.name}
                          </button>
                        ))}
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MainContent;
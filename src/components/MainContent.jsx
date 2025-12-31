import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, Play, Plus, Trash2, Loader2, MoreVertical } from 'lucide-react';

const MainContent = ({ onTrackSelect, selectedPlaylist }) => {
  const [tracks, setTracks] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [showPlaylistDropdown, setShowPlaylistDropdown] = useState(null); // Tracks which song's menu is open

  const BACKEND_URL = "https://echo-backend-0rw1.onrender.com";
  const token = localStorage.getItem('token');

  // Fetch tracks based on whether a playlist is selected or "Home" is active
  useEffect(() => {
    const fetchContent = async () => {
      setLoading(true);
      try {
        const endpoint = selectedPlaylist 
          ? `${BACKEND_URL}/playlists/${selectedPlaylist.id}/tracks` 
          : `${BACKEND_URL}/tracks`;
        
        const response = await axios.get(endpoint, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        setTracks(Array.isArray(response.data) ? response.data : []);
      } catch (err) {
        console.error("Error fetching content:", err);
        setTracks([]);
      } finally {
        setLoading(false);
      }
    };
    fetchContent();
  }, [selectedPlaylist]);

  // Handle adding a song to a playlist
  const handleAddToPlaylist = async (trackId) => {
    const playlistId = prompt("Enter the Playlist ID to add this song to:"); // Temporary prompt for ID
    if (!playlistId) return;

    try {
      await axios.post(`${BACKEND_URL}/playlists/${playlistId}/tracks`, 
        { track_id: trackId },
        { headers: { Authorization: `Bearer ${token}` }}
      );
      alert("Song added to playlist!");
    } catch (err) {
      alert("Failed to add song. Check if the Playlist ID is correct.");
    }
  };

  // Handle removing a song (only shows when viewing a manual playlist)
  const handleRemoveFromPlaylist = async (trackId) => {
    if (!selectedPlaylist) return;
    try {
      await axios.delete(`${BACKEND_URL}/playlists/${selectedPlaylist.id}/tracks/${trackId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTracks(tracks.filter(t => t.id !== trackId)); // Update UI immediately
    } catch (err) {
      alert("Failed to remove song.");
    }
  };

  // Search filter logic
  const filteredTracks = tracks.filter(track => 
    track.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    track.artist?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-zinc-500">
        <Loader2 className="animate-spin mb-4 text-green-500" size={32} />
        <p>Loading music...</p>
      </div>
    );
  }

  return (
    <div className="p-8 pb-32 h-full overflow-y-auto">
      {/* Header with Search */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold text-white">
            {selectedPlaylist ? selectedPlaylist.name : "Explore Music"}
          </h2>
          {selectedPlaylist && <p className="text-zinc-400 text-sm mt-1">Manual Playlist</p>}
        </div>
        
        <div className="relative w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
          <input
            type="text"
            placeholder="Search songs or artists..."
            className="w-full bg-zinc-900 border border-zinc-800 rounded-full py-2 pl-10 pr-4 text-white outline-none focus:border-green-500 transition-all"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Music Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {filteredTracks.map((track) => (
          <div 
            key={track.id}
            className="bg-zinc-900/40 p-4 rounded-xl hover:bg-zinc-800/60 transition-all cursor-pointer group relative"
          >
            {/* Cover Image & Play Button Overlay */}
            <div className="relative aspect-square mb-4 shadow-lg overflow-hidden rounded-lg bg-zinc-800" onClick={() => onTrackSelect(track)}>
              <img 
                src={track.cover_url || track.cover_image || "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=500"} 
                alt={track.title}
                className="object-cover w-full h-full group-hover:scale-105 transition-transform"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Play size={40} fill="white" className="text-white" />
              </div>
            </div>

            {/* Song Info & Options */}
            <div className="flex justify-between items-start">
              <div className="truncate pr-2">
                <h3 className="font-bold truncate text-white text-sm">{track.title}</h3>
                <p className="text-xs text-zinc-400 truncate">{track.artist}</p>
              </div>
              
              <div className="flex gap-2">
                {selectedPlaylist ? (
                  <button 
                    onClick={() => handleRemoveFromPlaylist(track.id)}
                    className="text-zinc-500 hover:text-red-500 transition-colors"
                    title="Remove from playlist"
                  >
                    <Trash2 size={18} />
                  </button>
                ) : (
                  <button 
                    onClick={() => handleAddToPlaylist(track.id)}
                    className="text-zinc-500 hover:text-green-500 opacity-0 group-hover:opacity-100 transition-all"
                    title="Add to playlist"
                  >
                    <Plus size={18} />
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredTracks.length === 0 && (
        <div className="text-center py-20 text-zinc-500">
          <p>No songs found matching your search.</p>
        </div>
      )}
    </div>
  );
};

export default MainContent;
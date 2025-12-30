import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, Play, Music } from 'lucide-react';

const MainContent = ({ onTrackSelect }) => {
  // We start with an empty array so .filter doesn't crash the app
  const [tracks, setTracks] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  const BACKEND_URL = "https://echo-backend-0rw1.onrender.com";

  useEffect(() => {
    const fetchTracks = async () => {
      try {
        const response = await axios.get(`${BACKEND_URL}/tracks`);
        // Only set tracks if we actually got an array back
        setTracks(Array.isArray(response.data) ? response.data : []);
      } catch (err) {
        console.error("Error fetching tracks:", err);
        setTracks([]); 
      } finally {
        setLoading(false);
      }
    };
    fetchTracks();
  }, []);

  // Safe filter logic to prevent "filter is not a function"
  const filteredTracks = tracks.filter(track => 
    track.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    track.artist?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) return <div className="p-8 text-zinc-500">Loading your music...</div>;

  return (
    <div className="p-8 pb-24">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-bold text-white">Explore Music</h2>
        <div className="relative w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
          <input
            type="text"
            placeholder="Search..."
            className="w-full bg-zinc-900 border border-zinc-800 rounded-full py-2 pl-10 pr-4 text-white outline-none focus:border-green-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {filteredTracks.map((track) => (
          <div 
            key={track.id}
            onClick={() => onTrackSelect(track)}
            className="bg-zinc-900/40 p-4 rounded-xl hover:bg-zinc-800/60 transition-all cursor-pointer group"
          >
            <div className="relative aspect-square mb-4 shadow-lg overflow-hidden rounded-lg bg-zinc-800">
              <img 
                src={track.cover_image || "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=500"} 
                alt={track.title}
                className="object-cover w-full h-full group-hover:scale-105 transition-transform"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Play size={32} fill="white" className="text-white" />
              </div>
            </div>
            <h3 className="font-bold truncate text-white">{track.title}</h3>
            <p className="text-sm text-zinc-400 truncate">{track.artist}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MainContent;
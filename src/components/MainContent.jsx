import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, Play, Music, Loader2 } from 'lucide-react';

const MainContent = ({ onTrackSelect }) => {
  // 1. Initialize as an empty array to prevent "o.filter is not a function"
  const [tracks, setTracks] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // --- LIVE BACKEND URL ---
  const BACKEND_URL = "https://echo-backend-0rw1.onrender.com";

  useEffect(() => {
    const fetchTracks = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${BACKEND_URL}/tracks`);
        
        // 2. Validate that data is an array before setting state
        if (response.data && Array.isArray(response.data)) {
          setTracks(response.data);
        } else {
          setTracks([]); 
          console.warn("Backend returned non-array data:", response.data);
        }
        setError(null);
      } catch (err) {
        console.error("Fetch error:", err);
        setError("Unable to connect to the music database.");
        setTracks([]); // Fallback to empty list on error
      } finally {
        setLoading(false);
      }
    };

    fetchTracks();
  }, []);

  // 3. Safe filter logic: check Array.isArray to prevent crashes during renders
  const filteredTracks = (Array.isArray(tracks) ? tracks : []).filter(track => 
    track.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    track.artist?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-8 pb-24 min-h-full">
      {/* Header & Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <h2 className="text-3xl font-bold text-white">Explore Music</h2>
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
          <input
            type="text"
            placeholder="Search songs or artists..."
            className="w-full bg-zinc-900 border border-zinc-800 rounded-full py-2.5 pl-10 pr-4 text-white outline-none focus:border-green-500 transition-all placeholder:text-zinc-600"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 text-zinc-500">
          <Loader2 className="animate-spin mb-4 text-green-500" size={40} />
          <p className="font-medium">Waking up Echo backend...</p>
        </div>
      ) : error ? (
        <div className="bg-red-500/10 border border-red-500/50 p-6 rounded-2xl text-red-500 text-center">
          <p className="font-bold">Database Connection Error</p>
          <p className="text-sm mt-1">{error}</p>
        </div>
      ) : (
        /* Music Grid */
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {filteredTracks.map((track) => (
            <div 
              key={track.id}
              onClick={() => onTrackSelect(track)}
              className="bg-zinc-900/40 p-4 rounded-xl hover:bg-zinc-800/60 transition-all cursor-pointer group border border-transparent hover:border-zinc-700"
            >
              <div className="relative aspect-square mb-4 shadow-2xl overflow-hidden rounded-lg bg-zinc-800">
                <img 
                  src={track.cover_image || "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=500"} 
                  alt={track.title}
                  className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <div className="bg-green-500 p-3 rounded-full shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-transform">
                    <Play size={24} fill="black" className="text-black ml-1" />
                  </div>
                </div>
              </div>
              <h3 className="font-bold truncate text-white mb-0.5">{track.title}</h3>
              <p className="text-sm text-zinc-400 truncate">{track.artist}</p>
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && filteredTracks.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-zinc-500">
          <Music className="mb-4 opacity-20" size={64} />
          <p>No tracks found for "{searchQuery}"</p>
        </div>
      )}
    </div>
  );
};

export default MainContent;
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Home, Search, Library, Play, Pause, SkipBack, SkipForward, Volume2, Music, LogOut, PlusCircle, Trash2 } from 'lucide-react';
import Auth from './Auth';

function App() {
  // --- CORE STATES ---
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'));
  const [tracks, setTracks] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentTrack, setCurrentTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  
  // --- PLAYER & LIBRARY STATES ---
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);
  const [myPlaylists, setMyPlaylists] = useState([
    { name: "My Favorites", tracks: [] },
    { name: "Bollywood Hits", tracks: [] }
  ]);
  
  const audioRef = useRef(null);

  // --- FETCH TRACKS ---
  useEffect(() => {
    if (isLoggedIn) {
      axios.get('https://echo-backend-0rw1.onrender.com')
        .then(res => {
          setTracks(res.data);
          if (res.data.length > 0) setCurrentTrack(res.data[0]);
        })
        .catch(err => console.error(err));
    }
  }, [isLoggedIn]);

  // --- AUDIO & VOLUME LOGIC ---
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
      if (isPlaying) {
        audioRef.current.play().catch(() => console.log("Interaction needed"));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentTrack, volume]);

  // --- PROGRESS LOGIC (MOCK DURATION) ---
  useEffect(() => {
    let interval;
    if (isPlaying) {
      interval = setInterval(() => setProgress((prev) => (prev >= 100 ? 0 : prev + 1.66)), 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, currentTrack]);

  // --- PLAYLIST LOGIC ---
  const addToPlaylist = (playlistName, track) => {
    setMyPlaylists(prev => prev.map(pl => {
      if (pl.name === playlistName) {
        if (pl.tracks.find(t => t.id === track.id)) return pl;
        return { ...pl, tracks: [...pl.tracks, track] };
      }
      return pl;
    }));
  };

  const removeFromPlaylist = (e, trackId) => {
    e.stopPropagation();
    setMyPlaylists(prev => prev.map(pl => {
      if (pl.name === selectedPlaylist.name) {
        const updatedTracks = pl.tracks.filter(t => t.id !== trackId);
        const updatedPl = { ...pl, tracks: updatedTracks };
        setSelectedPlaylist(updatedPl);
        return updatedPl;
      }
      return pl;
    }));
  };

  const createPlaylist = () => {
    const name = prompt("Enter Playlist Name:");
    if (name) setMyPlaylists([...myPlaylists, { name, tracks: [] }]);
  };

  if (!isLoggedIn) return <Auth onLoginSuccess={() => setIsLoggedIn(true)} />;

  // --- FILTERING LOGIC ---
  const displayTracks = selectedPlaylist 
    ? selectedPlaylist.tracks 
    : tracks.filter(t => 
        t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.artist.toLowerCase().includes(searchQuery.toLowerCase())
      );

  return (
    <div className="flex h-screen bg-black text-white font-sans overflow-hidden">
      <audio key={currentTrack?.id} ref={audioRef} src={currentTrack?.audio_url} onEnded={() => setIsPlaying(false)} />

      {/* SIDEBAR */}
      <div className="w-64 bg-black p-6 flex flex-col gap-8 border-r border-zinc-900">
        <h1 className="text-2xl font-bold text-green-500 flex items-center gap-2 cursor-pointer" onClick={() => setSelectedPlaylist(null)}>
          <Music size={28} /> Echo
        </h1>
        
        <nav className="space-y-6 text-zinc-400 font-bold flex-1 overflow-y-auto">
          <div onClick={() => setSelectedPlaylist(null)} className={`flex items-center gap-4 hover:text-white cursor-pointer transition-colors ${!selectedPlaylist && 'text-white'}`}>
            <Home size={22}/> Home
          </div>
          <div className="flex items-center gap-4 hover:text-white cursor-pointer"><Search size={22}/> Search</div>
          
          <div className="mt-10 mb-4 text-xs uppercase tracking-widest text-zinc-500">Your Playlists</div>
          <div onClick={createPlaylist} className="flex items-center gap-4 hover:text-white cursor-pointer text-sm mb-4"><PlusCircle size={20}/> Create New</div>
          
          <div className="space-y-2">
            {myPlaylists.map((pl, i) => (
              <div key={i} onClick={() => setSelectedPlaylist(pl)} className={`flex flex-col gap-1 cursor-pointer p-2 rounded-md transition-all ${selectedPlaylist?.name === pl.name ? 'bg-zinc-800 text-white' : 'hover:bg-zinc-900'}`}>
                <div className="flex items-center gap-3 text-sm truncate"><Library size={18}/> {pl.name}</div>
                <span className="text-[10px] ml-8 text-zinc-500">{pl.tracks.length} songs</span>
              </div>
            ))}
          </div>
        </nav>

        <button onClick={() => {localStorage.removeItem('token'); setIsLoggedIn(false);}} className="flex items-center gap-4 text-zinc-500 hover:text-red-500 font-bold pb-4 transition-colors"><LogOut size={22} /> Logout</button>
      </div>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 overflow-y-auto bg-gradient-to-b from-zinc-900 to-black p-8 pb-32">
        <header className="flex justify-between items-center mb-10">
          <div className="flex items-center gap-4 bg-zinc-800/50 border border-zinc-700 px-4 py-2 rounded-full w-96 focus-within:border-zinc-500 transition-all">
            <Search size={20} className="text-zinc-400" />
            <input 
              type="text" 
              placeholder="Search songs or artists..." 
              className="bg-transparent outline-none w-full text-sm" 
              onChange={(e) => { setSelectedPlaylist(null); setSearchQuery(e.target.value); }} 
            />
          </div>
          <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center font-bold text-black shadow-lg">A</div>
        </header>

        <h3 className="text-4xl font-black mb-8">{selectedPlaylist ? selectedPlaylist.name : "Trending Now"}</h3>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {displayTracks.length > 0 ? displayTracks.map((track) => (
            <div key={track.id} className="bg-zinc-900/40 p-5 rounded-xl hover:bg-zinc-800 transition-all cursor-pointer group border border-transparent hover:border-zinc-700 relative shadow-lg">
              <div onClick={() => { setCurrentTrack(track); setIsPlaying(true); setProgress(0); }}>
                <div className="w-full aspect-square rounded-lg mb-4 bg-zinc-800 flex items-center justify-center overflow-hidden shadow-2xl">
                   <img 
                    src={track.cover_image} 
                    className="w-full h-full object-cover" 
                    onError={(e) => {e.target.src = "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=500";}}
                    alt={track.title}
                   />
                </div>
                <h4 className="font-bold truncate">{track.title}</h4>
                <p className="text-sm text-zinc-500 truncate">{track.artist}</p>
              </div>
              
              {/* PLAYLIST ACTIONS */}
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                {selectedPlaylist ? (
                  <button onClick={(e) => removeFromPlaylist(e, track.id)} className="bg-red-500/20 p-2 rounded text-red-500 hover:bg-red-500 hover:text-white transition-all">
                    <Trash2 size={14} />
                  </button>
                ) : (
                  <select 
                    className="bg-zinc-950 text-[10px] border border-zinc-700 rounded px-1 py-1 outline-none cursor-pointer hover:border-green-500"
                    onChange={(e) => {
                      if(e.target.value) addToPlaylist(e.target.value, track);
                      e.target.value = "";
                    }}
                  >
                    <option value="">Add to...</option>
                    {myPlaylists.map((pl, i) => <option key={i} value={pl.name}>{pl.name}</option>)}
                  </select>
                )}
              </div>
            </div>
          )) : (
            <div className="col-span-full py-20 text-center text-zinc-500">
              {selectedPlaylist ? "Playlist is empty." : "No tracks found."}
            </div>
          )}
        </div>
      </div>

      {/* PLAYER BAR */}
      <div className="fixed bottom-0 w-full bg-zinc-950/95 backdrop-blur-xl border-t border-zinc-900 h-24 px-6 flex items-center justify-between z-50">
        <div className="flex items-center gap-4 w-1/4">
          <div className="w-14 h-14 bg-zinc-800 rounded-md overflow-hidden flex items-center justify-center border border-zinc-800 shadow-md">
            {currentTrack ? <img src={currentTrack.cover_image} className="w-full h-full object-cover" alt="cover" /> : <Music className="text-zinc-600" />}
          </div>
          <div className="truncate">
            <div className="text-sm font-bold truncate">{currentTrack?.title || "Select Song"}</div>
            <div className="text-xs text-zinc-500 truncate">{currentTrack?.artist || "Artist"}</div>
          </div>
        </div>
        
        <div className="flex flex-col items-center gap-3 w-2/4">
          <div className="flex items-center gap-8">
            <SkipBack className="text-zinc-500 hover:text-white cursor-pointer" size={24} />
            <div onClick={() => setIsPlaying(!isPlaying)} className="bg-white p-3 rounded-full text-black hover:scale-105 active:scale-95 transition-all cursor-pointer shadow-xl">
              {isPlaying ? <Pause size={24} fill="black" /> : <Play size={24} fill="black" />}
            </div>
            <SkipForward className="text-zinc-500 hover:text-white cursor-pointer" size={24} />
          </div>
          <div className="w-full max-w-md bg-zinc-800 h-1.5 rounded-full overflow-hidden">
            <div style={{ width: `${progress}%` }} className="bg-green-500 h-full transition-all duration-1000 ease-linear"></div>
          </div>
        </div>
        
        <div className="flex items-center justify-end gap-4 w-1/4">
          <Volume2 size={20} className="text-zinc-500" />
          <input 
            type="range" min="0" max="1" step="0.01" 
            value={volume} 
            onChange={(e) => setVolume(parseFloat(e.target.value))} 
            className="w-24 accent-green-500 cursor-pointer h-1.5 bg-zinc-800 rounded-lg appearance-none" 
          />
        </div>
      </div>
    </div>
  );
}

export default App;
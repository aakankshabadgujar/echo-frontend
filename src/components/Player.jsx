import React, { useRef, useEffect, useState } from 'react';
import { 
  Play, Pause, SkipBack, SkipForward, 
  Volume2, VolumeX, Repeat, Shuffle 
} from 'lucide-react';

const Player = ({ currentTrack, onNext, onPrev }) => {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [isMuted, setIsMuted] = useState(false);

  // --- AUDIO LOGIC ---

  // Play/Pause toggle
  useEffect(() => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.play().catch(err => console.error("Playback error:", err));
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying, currentTrack]);

  // Volume control fix
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  // Handle time updates for the progress bar
  const handleTimeUpdate = () => {
    setCurrentTime(audioRef.current.currentTime);
    setDuration(audioRef.current.duration || 0);
  };

  const handleSeek = (e) => {
    const time = parseFloat(e.target.value);
    audioRef.current.currentTime = time;
    setCurrentTime(time);
  };

  const formatTime = (time) => {
    if (isNaN(time)) return "0:00";
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  if (!currentTrack) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-zinc-900/95 border-t border-zinc-800 px-4 py-3 backdrop-blur-lg z-50">
      <audio
        ref={audioRef}
        src={currentTrack.url}
        onTimeUpdate={handleTimeUpdate}
        onEnded={onNext}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      />

      <div className="max-w-screen-2xl mx-auto flex items-center justify-between gap-4">
        
        {/* 1. Track Info */}
        <div className="flex items-center gap-4 w-[30%] min-w-0">
          <img 
            src={currentTrack.cover_url || "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=100&h=100&fit=crop"} 
            alt={currentTrack.title}
            className="w-14 h-14 rounded-md object-cover shadow-lg"
          />
          <div className="truncate">
            <h4 className="text-white font-semibold truncate text-sm">{currentTrack.title}</h4>
            <p className="text-zinc-400 text-xs truncate">{currentTrack.artist}</p>
          </div>
        </div>

        {/* 2. Main Controls & Progress Bar */}
        <div className="flex flex-col items-center gap-2 w-[40%] max-w-2xl">
          <div className="flex items-center gap-6">
            <Shuffle className="text-zinc-500 hover:text-green-500 cursor-pointer transition" size={18} />
            <SkipBack 
              className="text-zinc-200 hover:text-white cursor-pointer transition fill-current" 
              onClick={onPrev} 
            />
            <button 
              onClick={() => setIsPlaying(!isPlaying)}
              className="bg-white rounded-full p-2 hover:scale-105 transition active:scale-95"
            >
              {isPlaying ? <Pause size={24} fill="black" /> : <Play size={24} className="ml-1" fill="black" />}
            </button>
            <SkipForward 
              className="text-zinc-200 hover:text-white cursor-pointer transition fill-current" 
              onClick={onNext} 
            />
            <Repeat className="text-zinc-500 hover:text-green-500 cursor-pointer transition" size={18} />
          </div>

          <div className="flex items-center gap-2 w-full">
            <span className="text-[10px] text-zinc-500 w-8 text-right">{formatTime(currentTime)}</span>
            <input
              type="range"
              min="0"
              max={duration || 0}
              value={currentTime}
              onChange={handleSeek}
              className="flex-1 h-1 bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-green-500 hover:accent-green-400"
            />
            <span className="text-[10px] text-zinc-500 w-8">{formatTime(duration)}</span>
          </div>
        </div>

        {/* 3. Volume & Additional Controls */}
        <div className="flex items-center justify-end gap-3 w-[30%]">
          <button onClick={() => setIsMuted(!isMuted)}>
            {isMuted || volume === 0 ? (
              <VolumeX className="text-zinc-400" size={20} />
            ) : (
              <Volume2 className="text-zinc-400" size={20} />
            )}
          </button>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={isMuted ? 0 : volume}
            onChange={(e) => {
              setVolume(parseFloat(e.target.value));
              setIsMuted(false);
            }}
            className="w-24 h-1 bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-white"
          />
        </div>

      </div>
    </div>
  );
};

export default Player;
import React, { useRef, useEffect, useState } from 'react';
import { Play, Pause, SkipForward, SkipBack, Volume2 } from 'lucide-react';

const Player = ({ track, isPlaying, onPlayPause }) => {
  const audioRef = useRef(null);
  const [progress, setProgress] = useState(0);

  // Sync audio state with play/pause clicks
  useEffect(() => {
    if (isPlaying) {
      audioRef.current.play().catch(e => console.error("Playback error:", e));
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying, track]);

  const handleTimeUpdate = () => {
    const current = audioRef.current.currentTime;
    const duration = audioRef.current.duration;
    setProgress((current / duration) * 100);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-zinc-900/90 backdrop-blur-lg border-t border-zinc-800 h-24 px-6 flex items-center justify-between">
      <audio 
        ref={audioRef} 
        src={track.audio_url} 
        onTimeUpdate={handleTimeUpdate}
        onEnded={() => onPlayPause(false)}
      />

      <div className="flex items-center gap-4 w-1/3">
        <img src={track.cover_image} className="h-14 w-14 rounded shadow-lg" alt="" />
        <div className="overflow-hidden">
          <p className="font-bold text-white truncate">{track.title}</p>
          <p className="text-xs text-zinc-400 truncate">{track.artist}</p>
        </div>
      </div>

      <div className="flex flex-col items-center gap-2 w-1/3">
        <div className="flex items-center gap-6 text-zinc-300">
          <SkipBack size={24} className="cursor-pointer hover:text-white" />
          <button onClick={onPlayPause} className="bg-white p-2 rounded-full hover:scale-105 transition">
            {isPlaying ? <Pause size={24} fill="black" className="text-black" /> : <Play size={24} fill="black" className="text-black ml-1" />}
          </button>
          <SkipForward size={24} className="cursor-pointer hover:text-white" />
        </div>
        <div className="w-full bg-zinc-700 h-1 rounded-full overflow-hidden">
          <div className="bg-green-500 h-full" style={{ width: `${progress}%` }} />
        </div>
      </div>

      <div className="w-1/3 flex justify-end items-center gap-2 text-zinc-400">
        <Volume2 size={20} />
        <div className="w-24 bg-zinc-700 h-1 rounded-full">
          <div className="bg-zinc-400 h-full w-1/2" />
        </div>
      </div>
    </div>
  );
};

export default Player;
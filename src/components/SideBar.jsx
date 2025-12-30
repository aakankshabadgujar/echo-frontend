import React from 'react';
import { Home, Library, Heart, LogOut, Music } from 'lucide-react';

const Sidebar = ({ onLogout }) => {
  const navItems = [
    { icon: <Home size={22} />, label: 'Home', active: true },
    { icon: <Library size={22} />, label: 'Your Library', active: false },
    { icon: <Heart size={22} />, label: 'Liked Songs', active: false },
  ];

  return (
    <div className="w-64 bg-black h-full flex flex-col border-r border-zinc-800">
      <div className="p-6 mb-4 flex items-center gap-2 text-green-500">
        <Music size={32} />
        <span className="text-2xl font-bold text-white">Echo</span>
      </div>

      <nav className="flex-1 px-4 space-y-2">
        {navItems.map((item, idx) => (
          <button
            key={idx}
            className={`w-full flex items-center gap-4 px-4 py-3 rounded-lg transition-all ${
              item.active ? 'bg-zinc-800 text-white' : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
            }`}
          >
            {item.icon}
            <span className="font-medium">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-zinc-800">
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-4 px-4 py-3 text-zinc-400 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all"
        >
          <LogOut size={22} />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;

import React, { useState } from 'react';
import { ViewType, User } from '../types';

interface NavbarProps {
  currentView: ViewType;
  setView: (view: ViewType) => void;
  isDarkMode: boolean;
  toggleTheme: () => void;
  user: User | null;
}

const Navbar: React.FC<NavbarProps> = ({ currentView, setView, isDarkMode, toggleTheme, user }) => {
  const [toolsOpen, setToolsOpen] = useState(false);

  const mainNav = [
    { label: 'Home', view: 'home' },
    { label: 'Library', view: 'library' },
    { label: 'About', view: 'about' },
    { label: 'Contact', view: 'contact' },
  ];

  const toolsNav = [
    { label: 'History', view: 'history', icon: '🕰️' },
    { label: 'Reminders', view: 'reminders', icon: '🔔' },
    { label: 'Statistics', view: 'stats', icon: '📊' },
    { label: 'Community', view: 'community', icon: '🌎' },
    { label: 'Settings', view: 'settings', icon: '⚙️' },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 px-4 py-6 flex justify-center pointer-events-none">
      <div className="liquid-glass px-6 py-3 rounded-full flex items-center gap-4 md:gap-8 shadow-2xl pointer-events-auto border border-white/30 glow-emerald max-w-[95vw] overflow-visible">
        <div 
          className="flex items-center gap-2 cursor-pointer group shrink-0" 
          onClick={() => setView('home')}
        >
          <div className="bg-emerald-500 w-8 h-8 rounded-lg flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform">
            <span className="text-lg">🌿</span>
          </div>
          <span className="font-black text-lg tracking-tighter hidden sm:block dark:text-white">FloraLens</span>
        </div>

        <ul className="flex items-center gap-4 md:gap-6 text-[10px] md:text-xs font-black uppercase tracking-widest shrink-0">
          {mainNav.map((item) => (
            <li 
              key={item.view}
              className={`cursor-pointer transition-all hover:scale-110 whitespace-nowrap ${currentView === item.view ? 'text-emerald-500' : 'text-slate-500 dark:text-slate-400'}`}
              onClick={() => { setView(item.view as ViewType); setToolsOpen(false); }}
            >
              {item.label}
            </li>
          ))}
          
          {/* Expanded More Tools Dropdown */}
          <li className="relative">
            <button 
              onClick={() => setToolsOpen(!toolsOpen)}
              onMouseEnter={() => setToolsOpen(true)}
              className={`flex items-center gap-1 cursor-pointer transition-all hover:scale-110 whitespace-nowrap uppercase ${toolsNav.some(t => t.view === currentView) ? 'text-emerald-500' : 'text-slate-500 dark:text-slate-400'}`}
            >
              Tools <span className={`transition-transform duration-300 ${toolsOpen ? 'rotate-180' : ''}`}>⌄</span>
            </button>
            {toolsOpen && (
              <div 
                className="absolute top-full left-1/2 -translate-x-1/2 mt-4 liquid-glass p-3 rounded-[2rem] shadow-2xl border border-white/20 min-w-[200px] animate-in fade-in slide-in-from-top-4"
                onMouseLeave={() => setToolsOpen(false)}
              >
                <div className="px-3 py-2 text-[8px] font-black text-emerald-500/50 uppercase tracking-widest border-b border-white/10 mb-2">Botanical Suite</div>
                {toolsNav.map((item) => (
                  <div 
                    key={item.view}
                    onClick={() => { setView(item.view as ViewType); setToolsOpen(false); }}
                    className={`flex items-center gap-3 p-3 rounded-2xl cursor-pointer hover:bg-emerald-500/10 transition-all hover:translate-x-1 ${currentView === item.view ? 'bg-emerald-500/20 text-emerald-600' : 'text-slate-600 dark:text-slate-300'}`}
                  >
                    <span className="text-lg">{item.icon}</span>
                    <span className="font-bold text-[11px] whitespace-nowrap">{item.label}</span>
                  </div>
                ))}
              </div>
            )}
          </li>
        </ul>

        <div className="flex items-center gap-3 shrink-0">
          <button 
            onClick={toggleTheme}
            className="p-2 rounded-full hover:bg-white/10 transition-colors text-lg"
          >
            {isDarkMode ? '☀️' : '🌙'}
          </button>

          <button 
            onClick={() => setView(user ? 'profile' : 'auth')}
            className={`w-10 h-10 rounded-full border-2 transition-all hover:scale-110 overflow-hidden flex items-center justify-center ${user ? 'border-emerald-500 glow-emerald' : 'border-white/20'}`}
          >
            {user ? (
              <img src={user.avatar} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <span className="text-xl">👤</span>
            )}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

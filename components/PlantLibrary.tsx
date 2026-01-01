
import React, { useState } from 'react';
import { PlantIdentification } from '../types';

interface PlantLibraryProps {
  onSelectPlant: (name: string) => void;
  isLoading: boolean;
}

const COMMON_PLANTS = [
  { name: 'Monstera Deliciosa', emoji: '🌿', color: 'emerald' },
  { name: 'Snake Plant', emoji: '🐍', color: 'green' },
  { name: 'Fiddle Leaf Fig', emoji: '🌳', color: 'lime' },
  { name: 'Peace Lily', emoji: '🤍', color: 'white' },
  { name: 'Aloe Vera', emoji: '🌵', color: 'emerald' },
  { name: 'Spider Plant', emoji: '🕷️', color: 'green' },
  { name: 'English Ivy', emoji: '🍃', color: 'emerald' },
  { name: 'ZZ Plant', emoji: '✨', color: 'zinc' },
];

const PlantLibrary: React.FC<PlantLibraryProps> = ({ onSelectPlant, isLoading }) => {
  const [search, setSearch] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim()) onSelectPlant(search);
  };

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-right duration-700 max-w-5xl mx-auto">
      <header className="text-center space-y-4">
        <h2 className="text-5xl font-black dark:text-white">Botanical <span className="text-emerald-500">Archives</span></h2>
        <p className="text-slate-500 dark:text-slate-400 font-medium max-w-xl mx-auto">
          Search our global database of plant species or explore curated favorites.
        </p>
      </header>

      {/* Search Bar */}
      <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
        <div className="relative group">
          <input 
            type="text" 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name (e.g. Lavender, Japanese Maple)..."
            className="w-full liquid-glass py-6 px-8 rounded-[2.5rem] font-bold text-lg dark:text-white outline-none border-2 border-white/20 focus:border-emerald-500 transition-all glow-emerald"
          />
          <button 
            type="submit"
            disabled={isLoading}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-emerald-500 text-white font-black py-3 px-6 rounded-3xl shadow-lg hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
          >
            {isLoading ? 'Searching...' : 'Explore'}
          </button>
        </div>
      </form>

      {/* Grid of Common Plants */}
      <div className="space-y-6">
        <h3 className="text-xl font-black dark:text-white uppercase tracking-widest text-emerald-500/80">Common Species</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {COMMON_PLANTS.map((plant) => (
            <div 
              key={plant.name}
              onClick={() => !isLoading && onSelectPlant(plant.name)}
              className="liquid-glass p-8 rounded-[3rem] text-center cursor-pointer hover:-translate-y-2 transition-all glow-emerald group"
            >
              <div className="text-6xl mb-4 group-hover:scale-110 transition-transform animate-float">
                {plant.emoji}
              </div>
              <h4 className="font-black dark:text-white leading-tight">{plant.name}</h4>
              <p className="text-[10px] uppercase font-bold text-slate-500 mt-2">View Data ↗</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PlantLibrary;


import React from 'react';
import { PlantIdentification } from '../types';

interface PlantDetailsProps {
  data: PlantIdentification;
  imageUrl: string;
  onAddReminder: (task: string, plantName: string) => void;
}

const PlantDetails: React.FC<PlantDetailsProps> = ({ data, imageUrl, onAddReminder }) => {
  const handleShare = async () => {
    if (navigator.share) {
      try {
        const shareData: ShareData = {
          title: `FloraLens Discover: ${data.commonName}`,
          text: `AI Diagnostic: ${data.healthStatus.isHealthy ? 'Healthy' : 'Needs Care'}! Identified ${data.commonName}.`,
        };
        try {
          const url = new URL(window.location.href);
          if (url.protocol.startsWith('http')) shareData.url = url.href;
        } catch (e) {}
        await navigator.share(shareData);
      } catch (err) {
        if ((err as Error).name !== 'AbortError') console.error('Share failed:', err);
      }
    } else {
      alert('Sharing is not supported on this browser.');
    }
  };

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-10 duration-1000">
      {/* Header Image & Main Title */}
      <div className="relative rounded-[3rem] overflow-hidden aspect-video shadow-2xl glow-emerald border-4 border-white/30 dark:border-white/10">
        <img src={imageUrl} alt={data.commonName} className="w-full h-full object-cover" />
        
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-8 md:p-14">
          <div className="flex justify-between items-end gap-4">
            <div className="space-y-2">
              <span className="bg-emerald-500 text-white text-xs font-bold px-3 py-1 rounded-full w-fit mb-4 tracking-widest uppercase inline-block">Analysis Complete</span>
              <h1 className="text-4xl md:text-6xl font-black text-white mb-2 drop-shadow-lg">{data.commonName}</h1>
              <p className="text-emerald-400 italic text-xl md:text-2xl font-semibold opacity-90">{data.scientificName}</p>
            </div>
            <button 
              onClick={handleShare}
              className="liquid-glass p-5 rounded-3xl glow-emerald hover:scale-110 transition-all border border-white/30 flex items-center gap-2 group mb-2"
            >
              <span className="text-2xl group-hover:rotate-12 transition-transform">📤</span>
              <span className="hidden sm:inline font-black text-white uppercase tracking-widest text-xs">Share</span>
            </button>
          </div>
        </div>
      </div>

      {/* NEW: Plant Auto-Diagnosis Prominent Section */}
      <section className="liquid-glass p-8 md:p-12 rounded-[3.5rem] border border-white/30 glow-emerald space-y-10 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
          <span className="text-9xl">🩺</span>
        </div>
        
        <div className="flex flex-col md:flex-row items-center gap-10">
          <div className="shrink-0 space-y-4 text-center">
            <h2 className="text-sm font-black text-emerald-500 uppercase tracking-[0.3em]">AI Auto-Diagnosis</h2>
            <div className="relative w-48 h-48 mx-auto">
               <svg className="w-full h-full transform -rotate-90">
                  <circle cx="96" cy="96" r="86" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-white/10" />
                  <circle 
                    cx="96" cy="96" r="86" 
                    stroke="currentColor" 
                    strokeWidth="12" 
                    fill="transparent" 
                    strokeDasharray={540.35} 
                    strokeDashoffset={540.35 - (540.35 * data.healthStatus.healthScore) / 100} 
                    className={`${data.healthStatus.isHealthy ? 'text-emerald-500' : 'text-amber-500'} transition-all duration-1500 ease-out`} 
                  />
               </svg>
               <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-5xl font-black dark:text-white">{data.healthStatus.healthScore}%</span>
                  <span className="text-[10px] font-bold uppercase tracking-widest opacity-60">Vitality Index</span>
               </div>
            </div>
            <div className={`px-6 py-2 rounded-full font-black text-xs uppercase tracking-widest inline-block ${data.healthStatus.isHealthy ? 'bg-emerald-500 text-white' : 'bg-amber-500 text-white'}`}>
              {data.healthStatus.isHealthy ? 'Specimen Healthy' : 'Treatment Required'}
            </div>
          </div>

          <div className="flex-1 space-y-6">
            <div className="space-y-2">
              <h3 className="text-3xl font-black dark:text-white">Diagnostic Report</h3>
              <p className="text-lg text-slate-600 dark:text-slate-300 font-medium leading-relaxed">
                {data.healthStatus.diagnosis}
              </p>
            </div>

            {/* Weed Classification Section */}
            <div className={`p-6 rounded-[2rem] border ${data.isWeed.status ? 'bg-amber-500/10 border-amber-500/30' : 'bg-emerald-500/10 border-emerald-500/30'} flex gap-5 items-start`}>
               <span className="text-4xl">{data.isWeed.status ? '⚠️' : '🌿'}</span>
               <div>
                  <h4 className="font-black text-lg dark:text-white uppercase tracking-tighter">
                    {data.isWeed.status ? 'Classification: Invasive/Weed' : 'Classification: Cultivated Flora'}
                  </h4>
                  <p className="text-sm text-slate-500 dark:text-slate-400 font-medium mt-1">
                    {data.isWeed.reasoning}
                  </p>
               </div>
            </div>

            {data.healthStatus.treatment && (
              <div className="p-6 bg-blue-500/5 rounded-[2rem] border border-blue-500/20 italic text-blue-600 dark:text-blue-400 font-medium">
                <span className="font-black block mb-1 uppercase text-[10px] tracking-widest">Recommended Treatment:</span>
                "{data.healthStatus.treatment}"
              </div>
            )}
          </div>
        </div>

        {/* Generative Reminders Block */}
        <div className="pt-8 border-t border-white/10">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-black dark:text-white flex items-center gap-3">
              <span className="p-2 bg-emerald-500/20 rounded-xl text-lg">🔔</span>
              Generative Care Schedule
            </h3>
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">AI Projected Tasks</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.suggestedReminders.map((sug, i) => (
              <div key={i} className="bg-white/5 dark:bg-black/20 p-6 rounded-3xl border border-white/10 hover:border-emerald-500/50 transition-all group">
                <div className="flex justify-between items-start mb-4">
                   <div className="bg-emerald-500/20 p-3 rounded-2xl group-hover:scale-110 transition-transform">
                      {sug.task.toLowerCase().includes('water') ? '💧' : sug.task.toLowerCase().includes('light') ? '☀️' : '🌱'}
                   </div>
                   <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-tighter">{sug.frequency}</span>
                </div>
                <h4 className="font-black dark:text-white text-base mb-2">{sug.task}</h4>
                <p className="text-xs text-slate-500 mb-6 leading-relaxed font-medium">{sug.description}</p>
                <button 
                  onClick={() => onAddReminder(sug.task, data.commonName)}
                  className="w-full bg-emerald-500 py-3 rounded-2xl text-[10px] font-black text-white uppercase tracking-widest hover:bg-emerald-600 active:scale-95 transition-all shadow-lg shadow-emerald-500/20"
                >
                  Sync to Reminders
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-10">
          <div>
            <h3 className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mb-4 flex items-center gap-3">
              <span className="p-2 bg-emerald-100 dark:bg-emerald-900/40 rounded-xl">🌿</span>
              Botanical Profile
            </h3>
            <p className="text-slate-600 dark:text-slate-300 leading-loose text-lg font-medium">
              {data.description}
            </p>
          </div>

          {/* Map Section */}
          <div className="bg-white/40 dark:bg-black/20 p-8 rounded-[2.5rem] border border-white/20 glow-emerald relative overflow-hidden">
            <h3 className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mb-6 flex items-center gap-3">
              <span className="p-2 bg-emerald-100 dark:bg-emerald-900/40 rounded-xl">🌍</span>
              Global Native Range
            </h3>
            <div className="relative mb-6 rounded-3xl overflow-hidden bg-emerald-900/10 dark:bg-emerald-500/5 p-4 border border-emerald-500/10">
              <svg viewBox="0 0 1000 500" className="w-full h-auto fill-emerald-500 opacity-40 dark:opacity-20">
                <path d="M150,100 Q200,50 250,100 T350,120 T450,150 T380,250 T200,300 T150,200 Z" />
                <path d="M550,100 Q650,50 750,100 T850,150 T780,300 T600,350 T550,200 Z" />
                <path d="M300,350 Q400,300 500,350 T600,450 T400,500 T300,400 Z" />
                <circle cx="500" cy="250" r="12" className="animate-ping fill-emerald-400/30" />
                <circle cx="500" cy="250" r="6" className="fill-emerald-400" />
              </svg>
            </div>
            <div className="space-y-6">
              <p className="text-slate-600 dark:text-slate-300 font-medium leading-relaxed italic">
                {data.mapData?.summary || "Searching for historical distribution data..."}
              </p>
              {data.mapData?.links && data.mapData.links.length > 0 && (
                <div className="flex flex-wrap gap-3">
                  {data.mapData.links.map((link, idx) => (
                    <a key={idx} href={link.uri} target="_blank" rel="noopener noreferrer" className="bg-emerald-500/10 border border-emerald-500/20 px-4 py-2 rounded-xl text-xs font-black text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500 hover:text-white transition-all">
                      📍 {link.title}
                    </a>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <div className="bg-white/40 dark:bg-black/20 p-8 rounded-3xl border border-white/20 glow-emerald">
            <h4 className="font-black text-slate-800 dark:text-white mb-6 flex items-center gap-3">
              <span className="text-2xl">🧬</span> Quick Facts
            </h4>
            <div className="space-y-4 text-sm">
              <div className="flex justify-between items-center border-b border-slate-200 dark:border-slate-800 pb-3">
                <span className="text-slate-500 dark:text-slate-400 font-semibold">Family</span>
                <span className="font-bold dark:text-white text-emerald-600">{data.family}</span>
              </div>
              <div className="flex justify-between items-center pb-3">
                <span className="text-slate-500 dark:text-slate-400 font-semibold">Genus</span>
                <span className="font-bold dark:text-white text-emerald-600">{data.scientificName.split(' ')[0]}</span>
              </div>
            </div>
          </div>

          <div className={`p-8 rounded-3xl border ${data.toxicity.isToxic ? 'bg-rose-500/10 border-rose-500/30 text-rose-800' : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-800'} glow-emerald`}>
            <h4 className="font-black mb-4 flex items-center gap-3">
              <span className="text-3xl">{data.toxicity.isToxic ? '💀' : '🛡️'}</span> Safety Info
            </h4>
            <p className="text-base leading-relaxed dark:text-slate-200 font-medium">{data.toxicity.details}</p>
          </div>
        </div>
      </div>

      {/* Care Table Section */}
      <div className="liquid-glass overflow-hidden rounded-[2.5rem] border border-white/20">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-emerald-500/20">
              <th className="p-6 font-black text-emerald-700 dark:text-emerald-300 uppercase tracking-widest text-sm">Condition Category</th>
              <th className="p-6 font-black text-emerald-700 dark:text-emerald-300 uppercase tracking-widest text-sm">Optimal Care Specification</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10 font-medium">
            {[
              { label: 'Hydration', icon: '💧', text: data.careInstructions.watering },
              { label: 'Exposure', icon: '☀️', text: data.careInstructions.sunlight },
              { label: 'Foundation', icon: '🌱', text: data.careInstructions.soil },
              { label: 'Nutrients', icon: '🧪', text: data.careInstructions.fertilizer }
            ].map((item, idx) => (
              <tr key={idx} className="hover:bg-white/10 transition-colors">
                <td className="p-6 text-slate-500 dark:text-slate-400 flex items-center gap-3">
                  <span className="text-2xl">{item.icon}</span> {item.label}
                </td>
                <td className="p-6 text-slate-800 dark:text-slate-100">{item.text}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PlantDetails;

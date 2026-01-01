
import React, { useState, useEffect, useRef } from 'react';
import Navbar from './components/Navbar';
import HowItWorks from './components/HowItWorks';
import PlantDetails from './components/PlantDetails';
import PlantLibrary from './components/PlantLibrary';
import { ViewType, PlantIdentification, User, Reminder } from './types';
import { identifyPlant, fetchPlantInfoByName } from './services/geminiService';

const TINT_OPTIONS = [
  { name: 'Crystal', color: 'transparent', preview: 'bg-slate-200' },
  { name: 'Forest', color: '#10b981', preview: 'bg-emerald-500' },
  { name: 'Ocean', color: '#0ea5e9', preview: 'bg-sky-500' },
  { name: 'Sunset', color: '#f43f5e', preview: 'bg-rose-500' },
  { name: 'Midnight', color: '#8b5cf6', preview: 'bg-violet-500' },
  { name: 'Gold', color: '#f59e0b', preview: 'bg-amber-500' },
];

const App: React.FC = () => {
  const [view, setView] = useState<ViewType>('home');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [glassTint, setGlassTint] = useState(() => localStorage.getItem('flora_tint') || 'transparent');
  const [isIdentifying, setIsIdentifying] = useState(false);
  const [result, setResult] = useState<PlantIdentification | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('flora_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [history, setHistory] = useState<any[]>(() => {
    const saved = localStorage.getItem('flora_history');
    return saved ? JSON.parse(saved) : [];
  });

  const [reminders, setReminders] = useState<Reminder[]>(() => {
    const saved = localStorage.getItem('flora_reminders');
    return saved ? JSON.parse(saved) : [
      { id: '1', plant: 'Monstera Deliciosa', task: 'Hydrate root system', dateTime: '2024-12-01T10:00', completed: false, icon: '💧' },
      { id: '2', plant: 'Ficus Lyrata', task: 'Nutrient supplement', dateTime: '2024-12-05T09:00', completed: false, icon: '🧪' }
    ];
  });

  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  useEffect(() => {
    document.documentElement.style.setProperty('--glass-tint', glassTint);
    localStorage.setItem('flora_tint', glassTint);
  }, [glassTint]);

  useEffect(() => {
    localStorage.setItem('flora_history', JSON.stringify(history));
  }, [history]);

  useEffect(() => {
    localStorage.setItem('flora_reminders', JSON.stringify(reminders));
  }, [reminders]);

  const processFile = async (file: File) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64 = reader.result as string;
      setPreviewUrl(base64);
      setIsIdentifying(true);
      setError(null);
      try {
        const data = await identifyPlant(base64);
        setResult(data);
        setHistory(prev => [{ id: Date.now(), data, image: base64 }, ...prev].slice(0, 20));
        setView('result');
      } catch (err) {
        setError('Analysis failed. Please try a clearer shot.');
        console.error(err);
      } finally {
        setIsIdentifying(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleLibrarySearch = async (name: string) => {
    setIsIdentifying(true);
    setPreviewUrl(`https://source.unsplash.com/800x600/?${encodeURIComponent(name)},plant`);
    try {
      const data = await fetchPlantInfoByName(name);
      setResult(data);
      setView('result');
    } catch (err) {
      setError('Could not find information for this plant.');
      console.error(err);
    } finally {
      setIsIdentifying(false);
    }
  };

  const addReminderFromAi = (task: string, plantName: string) => {
    const taskLow = task.toLowerCase();
    let icon = '🌿';
    if (taskLow.includes('water') || taskLow.includes('hydrat')) icon = '💧';
    else if (taskLow.includes('sun') || taskLow.includes('light')) icon = '☀️';
    else if (taskLow.includes('fertilize') || taskLow.includes('nutrient') || taskLow.includes('feed')) icon = '🧪';
    else if (taskLow.includes('soil') || taskLow.includes('repot')) icon = '🌱';

    const newReminder: Reminder = {
      id: Date.now().toString(),
      plant: plantName,
      task: task,
      dateTime: new Date(Date.now() + 86400000).toISOString().slice(0, 16),
      completed: false,
      icon: icon
    };
    setReminders([newReminder, ...reminders]);
    alert(`${task} added to your schedule!`);
  };

  const deleteHistoryItem = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Permanently remove this discovery?')) {
      setHistory(prev => prev.filter(item => item.id !== id));
    }
  };

  const renderContent = () => {
    if (isIdentifying) return (
      <div className="space-y-12 animate-in fade-in zoom-in duration-500 max-w-4xl mx-auto pt-10">
        <div className="relative rounded-[3rem] overflow-hidden aspect-video liquid-glass shadow-2xl glow-emerald border-4 border-white/20">
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40">
             <div className="absolute top-0 left-0 w-full h-1 bg-emerald-400 shadow-[0_0_15px_#10b981] animate-[scan_2.5s_linear_infinite]" />
             <div className="z-10 text-center space-y-4">
                <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto" />
                <h2 className="text-2xl font-black text-white uppercase animate-pulse">Analyzing Species...</h2>
             </div>
          </div>
        </div>
        <style>{`@keyframes scan { 0% { top: 0%; opacity: 0; } 10% { opacity: 1; } 90% { opacity: 1; } 100% { top: 100%; opacity: 0; } }`}</style>
      </div>
    );

    switch (view) {
      case 'home':
        return (
          <div className="space-y-16 animate-in fade-in duration-1000">
            <header className="text-center space-y-6 pt-12">
              <h1 className="text-6xl md:text-8xl font-black tracking-tighter dark:text-white leading-tight">
                Nature's <br /><span className="text-emerald-500 drop-shadow-[0_0_20px_rgba(16,185,129,0.4)]">Digital Pulse.</span>
              </h1>
              <p className="text-xl md:text-2xl text-slate-500 dark:text-slate-400 max-w-2xl mx-auto font-medium">
                Identify any flora, diagnose health, and master your garden.
              </p>
            </header>
            <div className="max-w-2xl mx-auto space-y-10">
              <div 
                onDrop={(e) => { e.preventDefault(); setIsDragging(false); const f = e.dataTransfer.files?.[0]; if(f) processFile(f); }}
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                className={`liquid-glass rounded-[4rem] p-16 text-center transition-all duration-700 glow-emerald border-2 ${isDragging ? 'drop-zone-active bg-emerald-500/10' : 'border-white/20'}`}
              >
                <div className="text-8xl mb-6 animate-float">🌿</div>
                <p className="text-2xl font-black dark:text-white mb-2">Drag Image Here</p>
                <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Botanical Recognition Active</p>
              </div>
              <div className="grid grid-cols-2 gap-6">
                <button onClick={() => cameraInputRef.current?.click()} className="liquid-glass py-8 rounded-[3rem] glow-emerald hover:scale-105 transition-all flex flex-col items-center gap-4 border border-white/30">
                  <div className="text-5xl">📸</div>
                  <span className="font-black text-emerald-500 uppercase tracking-widest text-xs">Snapshot</span>
                </button>
                <button onClick={() => fileInputRef.current?.click()} className="liquid-glass py-8 rounded-[3rem] glow-emerald hover:scale-105 transition-all flex flex-col items-center gap-4 border border-white/30">
                  <div className="text-5xl">📁</div>
                  <span className="font-black text-emerald-500 uppercase tracking-widest text-xs">Upload</span>
                </button>
              </div>
              <input type="file" accept="image/*" capture="environment" className="hidden" ref={cameraInputRef} onChange={(e) => processFile(e.target.files?.[0]!)} />
              <input type="file" accept="image/*" className="hidden" ref={fileInputRef} onChange={(e) => processFile(e.target.files?.[0]!)} />
            </div>
            <HowItWorks />
          </div>
        );
      case 'library':
        return <PlantLibrary onSelectPlant={handleLibrarySearch} isLoading={isIdentifying} />;
      case 'result':
        return result && previewUrl ? (
          <div className="mt-12">
            <button onClick={() => setView('home')} className="mb-8 flex items-center gap-3 text-emerald-500 font-black tracking-tight hover:scale-105 transition-all text-lg">
              <span>←</span> Back
            </button>
            <PlantDetails data={result} imageUrl={previewUrl} onAddReminder={addReminderFromAi} />
          </div>
        ) : null;
      case 'history':
        return (
          <div className="mt-12 space-y-8 animate-in slide-in-from-right duration-500">
             <div className="flex justify-between items-end">
                <h2 className="text-4xl font-black dark:text-white">Past <span className="text-emerald-500">Scans</span></h2>
                <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">{history.length} Discoveries</span>
             </div>
             {history.length === 0 ? <div className="liquid-glass p-12 rounded-[3rem] text-center dark:text-white opacity-50 font-bold">No history yet.</div> : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {history.map((item) => (
                  <div key={item.id} className="group relative">
                    <div onClick={() => { setResult(item.data); setPreviewUrl(item.image); setView('result'); }} className="liquid-glass p-4 rounded-[2.5rem] flex items-center gap-4 cursor-pointer hover:scale-[1.02] transition-all glow-emerald">
                      <img src={item.image} className="w-20 h-20 rounded-2xl object-cover" />
                      <div className="overflow-hidden flex-1">
                        <h4 className="font-black dark:text-white truncate">{item.data.commonName}</h4>
                        <p className={`text-[10px] font-bold ${item.data.healthStatus.isHealthy ? 'text-emerald-500' : 'text-amber-500'}`}>
                          {item.data.healthStatus.isHealthy ? 'Healthy' : 'Needs Care'}
                        </p>
                      </div>
                      <button 
                        onClick={(e) => deleteHistoryItem(item.id, e)}
                        className="p-3 bg-rose-500/10 text-rose-500 rounded-full opacity-0 group-hover:opacity-100 transition-all hover:bg-rose-500 hover:text-white"
                        title="Delete record"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                ))}
              </div>
             )}
          </div>
        );
      case 'reminders':
        return (
          <div className="mt-12 space-y-12">
            <h2 className="text-4xl font-black dark:text-white">Plant <span className="text-emerald-500">Schedules</span></h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {reminders.map((rem) => (
                <div key={rem.id} className="liquid-glass p-8 rounded-[3rem] flex items-center justify-between glow-emerald border border-white/10">
                  <div className="flex items-center gap-5">
                    <span className="text-4xl p-5 bg-emerald-500/10 rounded-3xl">{rem.icon}</span>
                    <div>
                      <h4 className="font-black dark:text-white text-lg">{rem.plant}</h4>
                      <p className="text-xs text-slate-500 font-bold uppercase">{rem.task}</p>
                      <p className="text-[10px] text-emerald-500 font-black mt-1">{new Date(rem.dateTime).toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      case 'stats':
        return (
          <div className="mt-12 space-y-8 animate-in fade-in duration-700">
            <h2 className="text-4xl font-black dark:text-white">Growth <span className="text-emerald-500">Analytics</span></h2>
            <div className="liquid-glass p-20 rounded-[4rem] text-center border border-white/20 glow-emerald">
              <span className="text-7xl block mb-6 animate-float">📊</span>
              <h3 className="text-2xl font-black dark:text-white mb-2">Metrics Coming Soon</h3>
              <p className="text-slate-500 font-medium">We're calibrating our biometric tracking systems.</p>
            </div>
          </div>
        );
      case 'settings':
        return (
          <div className="mt-12 space-y-8 animate-in fade-in duration-700">
            <h2 className="text-4xl font-black dark:text-white">System <span className="text-emerald-500">Settings</span></h2>
            <div className="space-y-6">
              {/* Tint Mode Selector */}
              <div className="liquid-glass p-8 rounded-[3rem] space-y-6 border border-white/20 glow-emerald">
                <div className="flex items-center justify-between">
                   <h3 className="text-xl font-black dark:text-white flex items-center gap-3">
                     <span className="text-2xl">🎨</span> Glass Tint Mode
                   </h3>
                   <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Aesthetic Control</span>
                </div>
                <div className="flex flex-wrap gap-4">
                  {TINT_OPTIONS.map((opt) => (
                    <button 
                      key={opt.name}
                      onClick={() => setGlassTint(opt.color)}
                      className={`flex flex-col items-center gap-2 group p-2 rounded-2xl transition-all ${glassTint === opt.color ? 'bg-emerald-500/10 ring-2 ring-emerald-500' : 'hover:bg-white/5'}`}
                    >
                      <div className={`w-12 h-12 rounded-full ${opt.preview} shadow-lg group-hover:scale-110 transition-transform flex items-center justify-center border-2 border-white/20`}>
                        {glassTint === opt.color && <span className="text-white text-xs">✓</span>}
                      </div>
                      <span className="text-[10px] font-black dark:text-white uppercase tracking-tighter">{opt.name}</span>
                    </button>
                  ))}
                </div>
                <p className="text-xs text-slate-500 font-medium italic">Adjust the subtle color overlay of all application interface elements.</p>
              </div>

              <div className="liquid-glass p-8 rounded-[3rem] space-y-6 border border-white/20">
                <div className="flex justify-between items-center p-6 bg-white/5 rounded-3xl border border-white/10">
                  <span className="font-bold dark:text-white">Notification Alerts</span>
                  <div className="w-12 h-6 bg-emerald-500 rounded-full relative cursor-pointer"><div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div></div>
                </div>
                <div className="flex justify-between items-center p-6 bg-white/5 rounded-3xl border border-white/10">
                  <span className="font-bold dark:text-white">Cloud Sync</span>
                  <div className="w-12 h-6 bg-slate-500 rounded-full relative cursor-pointer"><div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full"></div></div>
                </div>
              </div>
            </div>
          </div>
        );
      case 'community':
        return (
          <div className="mt-12 space-y-8 animate-in fade-in duration-700">
            <h2 className="text-4xl font-black dark:text-white">Botanist <span className="text-emerald-500">Network</span></h2>
            <div className="liquid-glass p-20 rounded-[4rem] text-center border border-white/20 glow-emerald">
              <span className="text-7xl block mb-6 animate-float">🌍</span>
              <h3 className="text-2xl font-black dark:text-white mb-2">Social Hub Launching Soon</h3>
              <p className="text-slate-500 font-medium">Connect with garden enthusiasts worldwide.</p>
            </div>
          </div>
        );
      case 'about':
        return (
          <div className="mt-12 space-y-12 max-w-3xl mx-auto text-center animate-in fade-in duration-700">
            <h2 className="text-5xl font-black dark:text-white">Our <span className="text-emerald-500">Mission</span></h2>
            <div className="liquid-glass p-12 rounded-[3rem] space-y-6 text-lg font-medium text-slate-600 dark:text-slate-300">
              <p>FloraLens was born from a passion for botanical biodiversity and cutting-edge artificial intelligence. We believe every leaf has a story and every gardener deserves an expert by their side.</p>
              <p>Using the power of Gemini, we bring real-time species recognition and health diagnostics to your fingertips, helping you create a greener, healthier world.</p>
            </div>
          </div>
        );
      case 'contact':
        return (
          <div className="mt-12 space-y-12 max-w-3xl mx-auto animate-in fade-in duration-700">
            <h2 className="text-5xl font-black dark:text-white text-center">Get in <span className="text-emerald-500">Touch</span></h2>
            <div className="liquid-glass p-12 rounded-[3rem] space-y-8 glow-emerald">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h4 className="font-black text-slate-800 dark:text-white text-xl mb-2">Support</h4>
                  <p className="text-slate-500">liyanshaikhusa@gmail.com</p>
                </div>
                <div>
                  <h4 className="font-black text-slate-800 dark:text-white text-xl mb-2">Collaborate</h4>
                  <p className="text-slate-500">partnership@floralens.ai</p>
                </div>
              </div>
              <button className="w-full bg-emerald-500 py-6 rounded-3xl font-black text-white text-xl shadow-2xl hover:scale-[1.02] transition-all">Send a Message</button>
            </div>
          </div>
        );
      default:
        return <div className="p-12 text-center dark:text-white">Coming Soon</div>;
    }
  };

  return (
    <div className="min-h-screen pt-32 pb-20 px-6 md:px-12 transition-all duration-700">
      <Navbar currentView={view} setView={setView} isDarkMode={isDarkMode} toggleTheme={() => setIsDarkMode(!isDarkMode)} user={user} />
      <main className="max-w-6xl mx-auto">{renderContent()}</main>
    </div>
  );
};

export default App;

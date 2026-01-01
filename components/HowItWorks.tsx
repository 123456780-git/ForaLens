
import React from 'react';

const steps = [
  {
    icon: '📸',
    title: 'Snapshot',
    desc: 'Capture a vibrant photo of any leaf or flower with your lens.',
    color: 'emerald'
  },
  {
    icon: '✨',
    title: 'AI Magic',
    desc: 'Gemini 3 Flash analyzes textures and veins in milliseconds.',
    color: 'blue'
  },
  {
    icon: '📜',
    title: 'Insight',
    desc: 'Receive expert care tips and botanical secrets instantly.',
    color: 'amber'
  }
];

const HowItWorks: React.FC = () => {
  return (
    <section className="py-20 relative">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-emerald-500/10 blur-[100px] pointer-events-none"></div>
      <h2 className="text-3xl font-extrabold text-center mb-16 dark:text-white tracking-tight">
        Plant Wisdom in <span className="text-emerald-500">3 Steps</span>
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        {steps.map((step, idx) => (
          <div 
            key={idx} 
            className="liquid-glass p-10 rounded-[2.5rem] text-center group hover:-translate-y-3 transition-all duration-500 glow-emerald"
          >
            <div className="text-6xl mb-6 transform group-hover:scale-110 transition-transform duration-300 animate-float">
              {step.icon}
            </div>
            <h3 className="text-2xl font-bold mb-3 dark:text-white">{step.title}</h3>
            <p className="text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
              {step.desc}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default HowItWorks;

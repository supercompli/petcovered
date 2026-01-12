
import React from 'react';

interface HeroProps {
  onCtaClick: () => void;
}

const Hero: React.FC<HeroProps> = ({ onCtaClick }) => {
  return (
    <section className="relative bg-white pt-16 pb-24 overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden -z-10">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/2 -right-24 w-64 h-64 bg-primary/10 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row items-center gap-12">
        <div className="flex-1 text-center lg:text-left">
          <div className="inline-flex items-center gap-2 bg-primary/5 text-primary px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-8 animate-fade-in">
            <span className="w-2 h-2 bg-primary rounded-full animate-pulse"></span>
            Underwritten by GENRIC Insurance (FSP 43638)
          </div>
          
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-gray-900 leading-[1.1] mb-6 tracking-tight">
            Protect your <span className="text-primary italic">best friend</span> without the stress.
          </h1>
          
          <p className="text-lg md:text-xl text-gray-600 mb-10 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-medium">
            South Africa's most transparent pet insurance. Covers accidents, illness, and routine care with 5-day claim settlements.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
            <button 
              onClick={onCtaClick}
              className="bg-primary text-white px-10 py-5 rounded-2xl font-black text-lg hover:shadow-2xl transition-all transform hover:-translate-y-1 hover:scale-[1.02] shadow-xl shadow-primary/20 active:scale-95"
            >
              Start Free Quote
            </button>
            <button 
              className="bg-gray-100 text-gray-900 px-10 py-5 rounded-2xl font-black text-lg hover:bg-gray-200 transition-all border border-transparent hover:border-gray-200 active:scale-95"
              onClick={() => document.getElementById('plans')?.scrollIntoView({ behavior: 'smooth' })}
            >
              View All Plans
            </button>
          </div>

          <div className="mt-12 flex items-center gap-6 justify-center lg:justify-start">
            <div className="flex -space-x-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="w-12 h-12 rounded-full border-4 border-white shadow-lg overflow-hidden">
                   <img src={`https://i.pravatar.cc/150?u=pet${i}`} alt="user" className="w-full h-full object-cover" />
                </div>
              ))}
              <div className="w-12 h-12 rounded-full border-4 border-white bg-primary text-white flex items-center justify-center text-[10px] font-bold shadow-lg">12K+</div>
            </div>
            <div className="text-left">
              <div className="flex text-amber-400 text-sm">★★★★★</div>
              <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Happy Pet Parents</p>
            </div>
          </div>
        </div>

        <div className="flex-1 relative w-full max-w-lg lg:max-w-none">
          <div className="relative z-10 rounded-[60px] overflow-hidden shadow-[0_50px_100px_-20px_rgba(169,70,148,0.3)] border-[12px] border-white">
            <img 
              src="https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?auto=format&fit=crop&q=80&w=1200" 
              alt="Golden Retriever" 
              className="w-full aspect-[4/5] object-cover hover:scale-110 transition-transform duration-1000"
            />
          </div>
          {/* Floating benefit badges */}
          <div className="absolute -top-6 -right-6 bg-white p-4 rounded-3xl shadow-2xl z-20 animate-bounce">
            <span className="text-2xl">⚡</span>
            <span className="block text-[10px] font-black uppercase text-gray-400 mt-1">Fast Claims</span>
          </div>
          <div className="absolute -bottom-10 -left-10 bg-gray-900 text-white p-6 rounded-[32px] shadow-2xl z-20 max-w-[200px] border border-white/10">
            <p className="text-xs font-bold leading-relaxed">"Petcovered saved us R12,000 on Max's surgery last month!"</p>
            <span className="text-primary font-black text-[9px] uppercase mt-2 block tracking-widest">— Sarah, Cape Town</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;

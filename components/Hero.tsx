
import React from 'react';
import { EditableText, EditableImage } from './EditableWrapper';

interface HeroProps {
  onCtaClick: () => void;
}

const Hero: React.FC<HeroProps> = ({ onCtaClick }) => {
  return (
    <section className="relative bg-white pt-12 pb-20 md:pt-20 md:pb-32 overflow-hidden">
      <div className="absolute top-0 right-0 w-1/2 h-full bg-primary/5 -skew-x-6 transform translate-x-24 hidden lg:block -z-0"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
          
          <div className="flex-1 text-center lg:text-left space-y-8">
            <div className="inline-flex items-center gap-3 bg-white px-4 py-2 rounded-full shadow-sm border border-gray-100">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              <EditableText 
                id="hero_badge" 
                defaultText="Underwritten by GENRIC Insurance (FSP 43638)" 
                className="text-[10px] font-black uppercase tracking-[0.15em] text-gray-500" 
              />
            </div>
            
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-gray-900 leading-[1.05] tracking-tight">
              <EditableText id="hero_title_1" defaultText="South Africa's" /> <br/>
              <span className="text-primary italic"><EditableText id="hero_title_2" defaultText="Most Affordable" /></span> <EditableText id="hero_title_3" defaultText="Pet Insurance." />
            </h1>
            
            <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-medium">
              <EditableText 
                id="hero_description" 
                multiline
                defaultText="We focus on what matters: fast payouts, comprehensive illness cover, and any licensed vet of your choice. No breed exclusions." 
              />
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-4">
              <button 
                onClick={onCtaClick}
                className="bg-primary text-white px-10 py-5 rounded-2xl font-black text-lg hover:shadow-2xl hover:scale-[1.02] transition-all transform active:scale-95 shadow-xl shadow-primary/20"
              >
                <EditableText id="hero_cta_primary" defaultText="Get Started" />
              </button>
              <button 
                className="bg-gray-100 text-gray-900 px-10 py-5 rounded-2xl font-black text-lg hover:bg-gray-200 transition-all active:scale-95"
                onClick={() => document.getElementById('plans-section')?.scrollIntoView({ behavior: 'smooth' })}
              >
                <EditableText id="hero_cta_secondary" defaultText="View Plans" />
              </button>
            </div>
          </div>

          <div className="flex-1 relative group">
            <EditableImage 
              id="hero_main_image" 
              defaultSrc="https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&q=80&w=1200"
              alt="Two happy dogs running together outdoors"
              className="relative rounded-[60px] overflow-hidden shadow-2xl border-[10px] border-white transform lg:rotate-2 group-hover:rotate-0 transition-transform duration-700"
            />
            
            <div className="absolute -bottom-8 -left-8 bg-white p-6 rounded-[32px] shadow-2xl border border-gray-100 animate-slide-up">
              <div className="text-primary text-2xl font-black">
                <EditableText id="hero_price_val" defaultText="R95" />
                <span className="text-xs text-gray-400">/pm</span>
              </div>
              <div className="text-[9px] font-black uppercase text-gray-400 tracking-widest">
                <EditableText id="hero_price_label" defaultText="Starting from" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;

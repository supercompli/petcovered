
import React from 'react';
import Logo from './Logo';
import GenricLogo from './GenricLogo';

interface FooterProps {
  onViewChange: (view: any) => void;
  currentView: string;
}

const Footer: React.FC<FooterProps> = ({ onViewChange, currentView }) => {
  const isQuotePage = currentView === 'quote';

  return (
    <footer className="bg-[#0c161c] text-gray-400 pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-4">
        {!isQuotePage && (
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-20">
            <div className="space-y-8">
              <Logo variant="light" className="opacity-90" />
              <p className="text-sm leading-relaxed max-w-xs">
                South Africa's premier digital pet insurance provider. Built for pet owners who value speed, transparency, and the best medical care.
              </p>
              <div className="pt-4">
                <span className="text-[10px] font-black uppercase tracking-widest text-gray-500 block mb-4">Regulatory Underwriting</span>
                <GenricLogo className="opacity-80 grayscale hover:grayscale-0 transition-all" />
              </div>
            </div>

            <div>
              <h4 className="text-white font-black uppercase tracking-widest text-xs mb-8">Navigation</h4>
              <ul className="space-y-4 text-sm font-medium">
                {['Home', 'Plans', 'About', 'Claims'].map((item) => (
                  <li key={item}>
                    <button 
                      onClick={() => onViewChange(item.toLowerCase() as any)}
                      className="hover:text-primary transition-colors text-left"
                    >
                      {item}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-white font-black uppercase tracking-widest text-xs mb-8">Contact Us</h4>
              <ul className="space-y-4 text-sm font-medium">
                <li className="flex gap-3">
                  <span className="text-primary">📍</span>
                  <span>Midrand & Cape Town</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-primary">📞</span>
                  <a href="tel:0876550525" className="hover:text-white transition-colors">087 655 0525</a>
                </li>
                <li className="flex gap-3">
                  <span className="text-primary">✉️</span>
                  <a href="mailto:hello@petcovered.co.za" className="hover:text-white transition-colors">hello@petcovered.co.za</a>
                </li>
              </ul>
            </div>

            <div className="bg-white/5 p-8 rounded-[40px] border border-white/5">
              <h4 className="text-white font-black uppercase tracking-widest text-xs mb-6 text-center">Get Covered</h4>
              <button 
                onClick={() => onViewChange('quote')}
                className="bg-primary text-white w-full py-4 rounded-2xl font-black text-sm hover:scale-105 transition-transform shadow-xl shadow-primary/20"
              >
                Start Free Quote
              </button>
              <div className="mt-8 flex justify-center gap-4">
                {['fb', 'li', 'ig'].map(s => (
                  <div key={s} className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center text-[10px] font-black text-gray-500 hover:text-white hover:bg-primary transition-all cursor-pointer border border-white/5">
                    {s.toUpperCase()}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        <div className="border-t border-white/5 pt-10 flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="max-w-3xl text-center lg:text-left">
            <p className="text-[10px] font-medium leading-relaxed text-gray-600">
              Petcovered® is part of Covered Financial Services (FSP 54871). 
              Underwritten by GENRIC Insurance Company Limited (FSP 43638). 
              GENRIC is an authorised Financial Services Provider and licensed non-life Insurer. 
              This is a Health Insurance Product, not a Medical Aid Scheme. 
              &copy; 2021-2025 Petcovered. All Rights Reserved.
            </p>
          </div>
          <div className="flex items-center gap-6 text-[10px] font-black uppercase tracking-widest whitespace-nowrap">
             <button onClick={() => onViewChange('admin')} className="text-gray-800 hover:text-gray-600 transition-colors">Admin</button>
             <a href="#" className="hover:text-white">Terms</a>
             <a href="#" className="hover:text-white">Privacy</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

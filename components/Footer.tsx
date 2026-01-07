
import React from 'react';
import Logo from './Logo';
import GenricLogo from './GenricLogo';

interface FooterProps {
  onViewChange: (view: 'home' | 'about' | 'claims' | 'plans' | 'quote' | 'admin') => void;
  currentView: 'home' | 'about' | 'claims' | 'plans' | 'quote' | 'admin';
}

const Footer: React.FC<FooterProps> = ({ onViewChange, currentView }) => {
  const isQuotePage = currentView === 'quote';

  return (
    <footer className="bg-[#0c161c] text-gray-400 pt-16 pb-10">
      <div className="max-w-7xl mx-auto px-4">
        {!isQuotePage && (
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
            <div className="space-y-8">
              <div>
                <Logo variant="light" className="mb-6 opacity-90" />
                <p className="text-sm leading-relaxed">
                  Petcovered® is an affordable health insurance solution for individuals and families. 
                  It’s great value for money and offers access to private healthcare services.
                </p>
              </div>
              
              <div className="pt-4 border-t border-gray-800">
                <span className="text-[10px] uppercase font-bold tracking-widest text-gray-500 mb-4 block">Underwritten by</span>
                <GenricLogo className="opacity-90 hover:opacity-100 transition-opacity" />
              </div>
            </div>
            
            <div>
              <h4 className="text-white font-bold mb-6 border-b border-gray-800 pb-2">Contact</h4>
              <ul className="space-y-4 text-sm">
                <li className="flex gap-3">
                  <span className="text-primary">📍</span>
                  <span>Gauteng: The WorkSpace, 191 Bekker Street, Vorna Valley, Midrand, 1685</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-primary">📍</span>
                   <span>Western Cape: Sandown Square Business Park, Block A, Unit 204, Passerina Road, Sandown Rd, Cape Town, 7441</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-primary">📞</span>
                  <span>087 655 0525</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-primary">✉️</span>
                  <span>hello@petcovered.co.za</span>
                </li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-white font-bold mb-6 border-b border-gray-800 pb-2">Quick Links</h4>
              <ul className="space-y-3 text-sm">
                <li><button onClick={() => onViewChange('plans')} className="hover:text-white transition-colors text-left">Compare Plans</button></li>
                <li><button onClick={() => onViewChange('about')} className="hover:text-white transition-colors text-left">About Petcovered®</button></li>
                <li><button onClick={() => onViewChange('claims')} className="hover:text-white transition-colors text-left">How to Claim</button></li>
                <li><button onClick={() => onViewChange('home')} className="hover:text-white transition-colors text-left">Product Summary</button></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-white font-bold mb-6 border-b border-gray-800 pb-2">Support</h4>
              <button 
                onClick={() => onViewChange('quote')}
                className="bg-primary text-white w-full py-3 rounded-lg font-bold hover:opacity-90 transition-opacity mb-6 shadow-lg shadow-primary/20"
              >
                Get a Quote
              </button>
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-xl bg-gray-800 flex items-center justify-center hover:bg-primary transition-all cursor-pointer text-white text-xs font-bold border border-gray-700">FB</div>
                <div className="w-10 h-10 rounded-xl bg-gray-800 flex items-center justify-center hover:bg-primary transition-all cursor-pointer text-white text-xs font-bold border border-gray-700">LI</div>
                <div className="w-10 h-10 rounded-xl bg-gray-800 flex items-center justify-center hover:bg-primary transition-all cursor-pointer text-white text-xs font-bold border border-gray-700">IG</div>
              </div>
            </div>
          </div>
        )}

        <div className={`border-t border-gray-800 flex flex-col items-center gap-6 ${isQuotePage ? 'pt-0' : 'pt-8'}`}>
          <div className="flex flex-col lg:flex-row justify-between items-center gap-6 w-full">
            <p className="text-[10px] leading-relaxed max-w-4xl text-center lg:text-left text-gray-500">
              Petcovered® is part of Covered Financial Services, a registered financial services provider, FSP 54871. 
              Pet Insurance product is administered and underwritten by GENRIC Insurance Company Limited (FSP: 43638), 
              an authorised Financial Services Provider and licensed non-life Insurer. 
              Health Insurance Provider, not a Medical Aid Scheme. 
              ©2021-2026 Petcovered®. All Rights Reserved.
            </p>
            <div className="flex gap-6 text-[10px] font-bold uppercase tracking-widest whitespace-nowrap">
              <button onClick={() => onViewChange('admin')} className="text-gray-700 hover:text-gray-500 transition-colors">Admin Login</button>
              {!isQuotePage && (
                <>
                  <a href="#" className="hover:text-white transition-colors">Terms</a>
                  <a href="#" className="hover:text-white transition-colors">Cookies</a>
                </>
              )}
            </div>
          </div>
          {isQuotePage && (
            <div className="flex items-center gap-4 pt-4">
              <span className="text-[9px] uppercase font-bold text-gray-600 tracking-widest">A Secure Insurance Funnel</span>
              <div className="w-px h-3 bg-gray-800"></div>
              <Logo variant="light" className="scale-75 opacity-50 grayscale" />
            </div>
          )}
        </div>
      </div>
    </footer>
  );
};

export default Footer;

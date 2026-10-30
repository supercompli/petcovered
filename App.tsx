
'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from './components/Header';
import Footer from './components/Footer';
import PricingTable from './components/PricingTable';
import AIChat from './components/AIChat';
import AboutPage from './components/AboutPage';
import ClaimsPage from './components/ClaimsPage';
import PlansPage from './components/PlansPage';
import QuotePage from './components/QuotePage';
import AdminPanel from './components/AdminPanel';
import Hero from './components/Hero';
import FAQ from './components/FAQ';

export type AppView = 'home' | 'about' | 'claims' | 'plans' | 'quote' | 'admin';

interface AppProps {
  initialView?: AppView;
  initialPlanId?: string | null;
}

const viewToPath = (view: AppView) => (view === 'home' ? '/' : `/${view}`);

const App: React.FC<AppProps> = ({ initialView = 'home', initialPlanId = null }) => {
  const router = useRouter();
  const [currentView, setCurrentView] = useState<AppView>(initialView);
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(initialPlanId);

  const navigateTo = (view: AppView) => {
    setCurrentView(view);
    router.push(viewToPath(view));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleStartQuote = (planId?: string) => {
    if (planId) setSelectedPlanId(planId);
    setCurrentView('quote');
    router.push(planId ? `/quote?plan=${encodeURIComponent(planId)}` : '/quote');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderHome = () => (
    <div className="animate-fade-in">
      <Hero onCtaClick={() => handleStartQuote('comp-plus')} />
      
      <div id="plans-section">
        <PricingTable onQuoteClick={(pid) => handleStartQuote(pid)} />
      </div>

      {/* Trust Badges / Stats Section */}
      <section className="bg-white py-20 border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { label: 'Pets Covered', val: '12,400+' },
            { label: 'Claims Paid', val: 'R4.2M+' },
            { label: 'Avg Payout', val: '5 Days' },
            { label: 'Rating', val: '4.9/5' }
          ].map((stat, i) => (
            <div key={i} className="text-center">
              <div className="text-3xl font-black text-primary mb-1">{stat.val}</div>
              <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      <FAQ />

      {/* Final CTA */}
      <section className="py-24 bg-[#a94694] text-white relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <h2 className="text-4xl md:text-5xl font-black mb-6 leading-tight">Ready for total peace of mind?</h2>
          <p className="text-lg opacity-80 mb-10 font-medium">South Africa's most transparent pet health coverage is just 2 minutes away.</p>
          <button 
            onClick={() => handleStartQuote('comp-plus')}
            className="bg-white text-[#a94694] px-12 py-5 rounded-2xl font-black text-xl hover:scale-105 transition-all shadow-2xl"
          >
            Activate Cover Now
          </button>
        </div>
      </section>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col selection:bg-primary/20 bg-gray-50">
      {currentView !== 'admin' && (
        <Header onViewChange={navigateTo} currentView={currentView} />
      )}
      
      <main className="flex-grow">
        {currentView === 'home' && renderHome()}
        {currentView === 'about' && <AboutPage />}
        {currentView === 'claims' && <ClaimsPage />}
        {currentView === 'plans' && <PlansPage onQuoteClick={(pid) => handleStartQuote(pid)} />}
        {currentView === 'quote' && (
          <QuotePage 
            onBack={() => navigateTo('plans')} 
            onNavigate={navigateTo} 
            selectedPlanId={selectedPlanId} 
          />
        )}
        {currentView === 'admin' && <AdminPanel onExit={() => navigateTo('home')} />}
      </main>

      {currentView !== 'admin' && (
        <Footer onViewChange={navigateTo} currentView={currentView} />
      )}
      
      {currentView !== 'admin' && <AIChat />}
    </div>
  );
};

export default App;

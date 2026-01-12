
import React, { useState, useEffect } from 'react';
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

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<'home' | 'about' | 'claims' | 'plans' | 'quote' | 'admin'>('home');
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);

  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash.replace('#', '');
      if (['home', 'about', 'claims', 'plans', 'quote', 'admin'].includes(hash)) {
        setCurrentView(hash as any);
      }
    };
    window.addEventListener('hashchange', handleHash);
    handleHash();
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
    window.location.hash = currentView;
  }, [currentView]);

  const handleStartQuote = (planId?: string) => {
    if (planId) setSelectedPlanId(planId);
    setCurrentView('quote');
  };

  const renderHome = () => (
    <>
      <Hero onCtaClick={() => handleStartQuote('comp-plus')} />
      
      <div id="plans">
        <PricingTable onQuoteClick={(pid) => handleStartQuote(pid)} />
      </div>

      <section className="bg-gray-900 py-24 text-white overflow-hidden relative">
        <div className="absolute top-1/2 left-0 w-64 h-64 bg-primary/10 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-3 gap-12 text-center relative z-10">
           {[
             { title: 'Any Licensed Vet', desc: 'Visit any veterinarian in South Africa of your own choice. We pay them directly.', icon: '🩺' },
             { title: 'Lightning Payouts', icon: '⚡', desc: 'Claims processed and paid within 5 working days of submission.' },
             { title: 'Lifetime Peace', icon: '🏆', desc: 'Once insured before age 9, your pet stays covered for life regardless of age.' }
           ].map((item, i) => (
             <div key={i} className="p-10 bg-white/5 rounded-[40px] border border-white/10 hover:border-primary/50 transition-all group hover:bg-white/[0.08]">
                <span className="text-6xl block mb-8 transform group-hover:scale-110 transition-transform">{item.icon}</span>
                <h3 className="text-xl font-black mb-4 tracking-tight uppercase">{item.title}</h3>
                <p className="text-sm text-gray-400 font-medium leading-relaxed">{item.desc}</p>
             </div>
           ))}
        </div>
      </section>

      <FAQ />

      <section className="py-24 bg-primary text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/10 rounded-full blur-3xl -mr-64 -mt-64"></div>
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <h2 className="text-4xl md:text-5xl font-black mb-8 leading-tight tracking-tight uppercase">Ready to join the family?</h2>
          <p className="text-xl opacity-80 mb-12 font-medium leading-relaxed">Protect your pet today and get access to our network of private healthcare providers across South Africa.</p>
          <button 
            onClick={() => handleStartQuote('comp-plus')}
            className="bg-white text-primary px-16 py-6 rounded-3xl font-black text-xl hover:scale-105 transition-transform shadow-2xl active:scale-95 border-b-4 border-gray-200"
          >
            Activate My Cover
          </button>
        </div>
      </section>
    </>
  );

  return (
    <div className="min-h-screen flex flex-col selection:bg-primary/20">
      {currentView !== 'admin' && <Header onViewChange={setCurrentView} currentView={currentView} />}
      
      <main className="flex-grow">
        {currentView === 'home' && renderHome()}
        {currentView === 'about' && <AboutPage />}
        {currentView === 'claims' && <ClaimsPage />}
        {currentView === 'plans' && <PlansPage onQuoteClick={(pid) => handleStartQuote(pid)} />}
        {currentView === 'quote' && <QuotePage onBack={() => setCurrentView('plans')} selectedPlanId={selectedPlanId} />}
        {currentView === 'admin' && <AdminPanel onExit={() => setCurrentView('home')} />}
      </main>

      {currentView !== 'admin' && <Footer onViewChange={setCurrentView} currentView={currentView} />}
      {currentView !== 'admin' && <AIChat />}
    </div>
  );
};

export default App;


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
import { FAQS, TESTIMONIALS } from './constants';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<'home' | 'about' | 'claims' | 'plans' | 'quote' | 'admin'>('home');
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);

  // Simple URL hash routing for refresh support
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
      {/* Hero Section */}
      <section className="relative bg-white py-20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 flex flex-col lg:flex-row items-center gap-12">
          <div className="lg:w-1/2 text-center lg:text-left z-10">
            <div className="inline-flex items-center gap-2 bg-primary/5 text-primary px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-8">
              <span className="w-2 h-2 bg-primary rounded-full animate-pulse"></span>
              Underwritten by GENRIC Insurance
            </div>
            <h1 className="text-4xl md:text-6xl font-black text-gray-900 leading-tight mb-6">
              Pet Insurance helps you pay for <span className="text-primary">unexpected costs</span>
            </h1>
            <p className="text-lg text-gray-600 mb-8 max-w-xl mx-auto lg:mx-0">
              If your pets have an accident or become ill, your first thoughts can be about their care, not your budget. We've got them covered.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <button 
                onClick={() => handleStartQuote('comp-plus')}
                className="bg-primary text-white px-10 py-5 rounded-2xl font-black text-lg hover:shadow-2xl transition-all transform hover:-translate-y-1 text-center"
              >
                Get Started
              </button>
              <button 
                onClick={() => setCurrentView('plans')}
                className="bg-gray-100 text-gray-900 px-10 py-5 rounded-2xl font-black text-lg hover:bg-gray-200 transition-all text-center"
              >
                Explore Plans
              </button>
            </div>
            <div className="mt-10 flex items-center gap-4 justify-center lg:justify-start">
              <div className="flex -space-x-3">
                {[1, 2, 3, 4].map(i => (
                  <img key={i} className="w-10 h-10 rounded-full border-2 border-white shadow-sm" src={`https://picsum.photos/100/100?random=${i + 20}`} alt="user" />
                ))}
              </div>
              <p className="text-sm text-gray-500 font-bold">Protecting over <span className="text-primary">12,400+</span> furry friends</p>
            </div>
          </div>
          
          <div className="lg:w-1/2 relative">
            <div className="absolute inset-0 bg-primary/10 rounded-full blur-3xl -z-10 animate-pulse scale-125"></div>
            <img 
              src="https://images.unsplash.com/photo-1544568100-847a948585b9?auto=format&fit=crop&q=80&w=1000" 
              alt="Happy Dog" 
              className="rounded-[60px] shadow-2xl relative z-10 transform hover:rotate-1 transition-transform duration-700 border-8 border-white"
            />
          </div>
        </div>
      </section>

      <PricingTable onQuoteClick={(pid) => handleStartQuote(pid)} />

      {/* Feature Section */}
      <section className="bg-gray-900 py-24 text-white">
        <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-3 gap-12 text-center">
           {[
             { title: 'Any Vet', desc: 'Visit any licensed veterinarian in South Africa of your own choice.', icon: '🩺' },
             { title: 'Fast Claims', icon: '⚡', desc: 'Claims processed and paid within 5 working days.' },
             { title: 'Lifetime Cover', icon: '🏆', desc: 'Once insured, your pet stays covered for life regardless of age.' }
           ].map((item, i) => (
             <div key={i} className="p-8 bg-white/5 rounded-3xl border border-white/10 hover:border-primary/50 transition-colors">
                <span className="text-5xl block mb-6">{item.icon}</span>
                <h3 className="text-xl font-black mb-4">{item.title}</h3>
                <p className="text-sm text-gray-400 font-medium leading-relaxed">{item.desc}</p>
             </div>
           ))}
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-24 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-black text-center mb-16 uppercase tracking-tighter">Common Questions</h2>
          <div className="space-y-6">
            {FAQS.map((faq, i) => (
              <div key={i} className="group border rounded-3xl p-8 hover:border-primary hover:bg-primary/[0.01] transition-all">
                <h3 className="text-lg font-black text-gray-900 mb-3 flex items-center justify-between">
                  {faq.question}
                  <span className="text-primary text-xl">+</span>
                </h3>
                <p className="text-gray-600 font-medium leading-relaxed opacity-80">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 bg-primary text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -mr-48 -mt-48"></div>
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <h2 className="text-4xl md:text-5xl font-black mb-8 leading-tight">Ready to join the family?</h2>
          <p className="text-xl opacity-80 mb-12 font-medium">Activate your online account and get started with your Petcovered® insurance plan in under 5 minutes.</p>
          <button 
            onClick={() => handleStartQuote('comp-plus')}
            className="bg-white text-primary px-16 py-6 rounded-full font-black text-xl hover:scale-105 transition-transform shadow-2xl active:scale-95"
          >
            Get Started Now
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

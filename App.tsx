
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

  const renderHome = () => (
    <>
      {/* Hero Section */}
      <section className="relative bg-white py-20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 flex flex-col lg:flex-row items-center gap-12">
          <div className="lg:w-1/2 text-center lg:text-left z-10">
            <h1 className="text-4xl md:text-6xl font-black text-gray-900 leading-tight mb-6">
              Pet Insurance helps you pay for <span className="text-primary">unexpected costs</span>
            </h1>
            <p className="text-lg text-gray-600 mb-8 max-w-xl mx-auto lg:mx-0">
              If your pets have an accident or become ill, your first thoughts can be about their care, not your budget. We've got them covered.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <button 
                onClick={() => setCurrentView('plans')}
                className="bg-primary text-white px-8 py-4 rounded-2xl font-bold text-lg hover:shadow-xl transition-all transform hover:-translate-y-1 text-center"
              >
                View Plans
              </button>
              <button 
                onClick={() => setCurrentView('quote')}
                className="bg-gray-900 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:shadow-xl transition-all transform hover:-translate-y-1 text-center"
              >
                Quick Quote
              </button>
            </div>
          </div>
          
          <div className="lg:w-1/2 relative">
            <div className="absolute inset-0 bg-primary/10 rounded-full blur-3xl -z-10 animate-pulse"></div>
            <img 
              src="https://images.unsplash.com/photo-1544568100-847a948585b9?auto=format&fit=crop&q=80&w=1000" 
              alt="Happy Dog" 
              className="rounded-[40px] shadow-2xl relative z-10 transform hover:scale-105 transition-transform duration-700"
            />
          </div>
        </div>
      </section>

      <PricingTable onQuoteClick={() => setCurrentView('quote')} />

      {/* FAQ Section */}
      <section id="faq" className="py-24 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">Frequently Asked Questions</h2>
          <div className="space-y-6">
            {FAQS.map((faq, i) => (
              <div key={i} className="group border rounded-3xl p-6 hover:border-primary transition-colors">
                <h3 className="text-lg font-bold text-gray-900 mb-2 flex items-center justify-between">
                  {faq.question}
                  <span className="text-primary opacity-0 group-hover:opacity-100 transition-opacity">?</span>
                </h3>
                <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
              </div>
            ))}
          </div>
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
        {currentView === 'plans' && <PlansPage onQuoteClick={() => setCurrentView('quote')} />}
        {currentView === 'quote' && <QuotePage onBack={() => setCurrentView('plans')} />}
        {currentView === 'admin' && <AdminPanel onExit={() => setCurrentView('home')} />}
      </main>

      {currentView !== 'admin' && <Footer onViewChange={setCurrentView} currentView={currentView} />}
      {currentView !== 'admin' && <AIChat />}
    </div>
  );
};

export default App;


import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import PricingTable from './components/PricingTable';
import AIChat from './components/AIChat';
import AboutPage from './components/AboutPage';
import ClaimsPage from './components/ClaimsPage';
import PlansPage from './components/PlansPage';
import { FAQS, TESTIMONIALS } from './constants';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<'home' | 'about' | 'claims' | 'plans'>('home');

  // Scroll to top on view change
  useEffect(() => {
    window.scrollTo(0, 0);
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
                onClick={() => setCurrentView('about')}
                className="bg-white text-gray-700 border-2 border-gray-200 px-8 py-4 rounded-2xl font-bold text-lg hover:border-primary hover:text-primary transition-all"
              >
                How it Works
              </button>
            </div>
            <div className="mt-10 flex items-center gap-4 justify-center lg:justify-start">
              <div className="flex -space-x-3">
                {[1, 2, 3, 4].map(i => (
                  <img key={i} className="w-10 h-10 rounded-full border-2 border-white" src={`https://picsum.photos/100/100?random=${i}`} alt="user" />
                ))}
              </div>
              <p className="text-sm text-gray-500">Trusted by <span className="font-bold text-gray-800">10k+ pet owners</span></p>
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

      {/* Features Quick Grid */}
      <section className="bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
          {[
            { label: 'Low Premiums', icon: '💰' },
            { label: 'High Limits', icon: '📈' },
            { label: 'Double Up', icon: '⚡' },
            { label: 'Fast Claims', icon: '⏱️' },
            { label: 'No Paperwork', icon: '📝' },
            { label: 'Low Excess', icon: '✅' },
          ].map((f, i) => (
            <div key={i} className="bg-white p-6 rounded-2xl shadow-sm text-center border border-gray-100 hover:shadow-md transition-shadow">
              <span className="text-3xl mb-3 block">{f.icon}</span>
              <span className="text-sm font-bold text-gray-700">{f.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing Section - Quick View */}
      <PricingTable />

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

      {/* Testimonials */}
      <section className="py-24 bg-primary/5">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">Wonderful Stories</h2>
          <p className="text-gray-500 text-center mb-16">From our family of pet owners</p>
          
          <div className="grid md:grid-cols-3 gap-8">
            {TESTIMONIALS.map((t, i) => (
              <div key={i} className="bg-white p-8 rounded-3xl shadow-sm relative border border-white hover:border-primary/20 transition-all text-center">
                <div className="flex justify-center text-yellow-400 mb-4">
                  {[...Array(t.stars)].map((_, j) => <span key={j}>★</span>)}
                </div>
                <p className="text-gray-600 mb-6 italic">"{t.text}"</p>
                <div className="flex flex-col items-center gap-2">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary">
                    {t.name[0]}
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">{t.name}</h4>
                    <p className="text-xs text-gray-500">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-primary text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">You’ve come to the right place.</h2>
          <p className="text-xl opacity-90 mb-10">Activate your online account and get started with your Petcovered® insurance plan today.</p>
          <button 
            onClick={() => setCurrentView('plans')}
            className="bg-white text-primary px-10 py-4 rounded-full font-black text-xl hover:scale-105 transition-transform shadow-2xl"
          >
            Let's Do This
          </button>
        </div>
      </section>
    </>
  );

  return (
    <div className="min-h-screen flex flex-col selection:bg-primary/20">
      <Header onViewChange={setCurrentView} currentView={currentView} />
      
      <main className="flex-grow">
        {currentView === 'home' && renderHome()}
        {currentView === 'about' && <AboutPage />}
        {currentView === 'claims' && <ClaimsPage />}
        {currentView === 'plans' && <PlansPage />}
      </main>

      <Footer onViewChange={setCurrentView} />
      <AIChat />
    </div>
  );
};

export default App;

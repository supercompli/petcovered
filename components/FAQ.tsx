
import React, { useState } from 'react';
import { FAQS } from '../constants';

const FAQ: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="py-24 bg-white" id="faq">
      <div className="max-w-3xl mx-auto px-4">
        <div className="text-center mb-16">
          <span className="text-primary font-bold tracking-[0.2em] text-xs uppercase mb-3 block">Got Questions?</span>
          <h2 className="text-3xl md:text-5xl font-black text-gray-900 tracking-tight">Common Enquiries</h2>
        </div>

        <div className="space-y-4">
          {FAQS.map((faq, i) => (
            <div 
              key={i} 
              className={`border-2 rounded-[28px] transition-all duration-300 overflow-hidden ${
                openIndex === i ? 'border-primary bg-primary/[0.02] shadow-lg' : 'border-gray-100 bg-gray-50/50 hover:border-gray-200'
              }`}
            >
              <button 
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full px-8 py-6 text-left flex items-center justify-between gap-4"
              >
                <span className={`text-base font-black transition-colors ${openIndex === i ? 'text-primary' : 'text-gray-900'}`}>
                  {faq.question}
                </span>
                <span className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                  openIndex === i ? 'bg-primary text-white rotate-45' : 'bg-white text-gray-300 border border-gray-100'
                }`}>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 4v16m8-8H4" />
                  </svg>
                </span>
              </button>
              
              <div className={`transition-all duration-300 ease-in-out ${
                openIndex === i ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
              }`}>
                <div className="px-8 pb-8 text-sm text-gray-500 font-medium leading-relaxed">
                  {faq.answer}
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-16 bg-gray-900 rounded-[40px] p-10 text-center text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full blur-2xl"></div>
          <h3 className="text-xl font-bold mb-4 relative z-10">Can't find what you're looking for?</h3>
          <p className="text-gray-400 text-sm mb-8 relative z-10">Our support team is available Mon-Fri, 08:00 - 17:00.</p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 relative z-10">
            <a href="tel:0876550525" className="bg-primary px-8 py-3 rounded-xl font-black text-xs uppercase tracking-widest hover:scale-105 transition-transform">Call Support</a>
            <a href="mailto:hello@petcovered.co.za" className="bg-white/10 backdrop-blur-md px-8 py-3 rounded-xl font-black text-xs uppercase tracking-widest border border-white/10 hover:bg-white/20 transition-all">Email Us</a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQ;

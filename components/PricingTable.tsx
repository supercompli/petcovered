
import React, { useState } from 'react';
import { PET_PLANS } from '../constants';

interface PricingTableProps {
  onQuoteClick: (planId: string) => void;
}

const PricingTable: React.FC<PricingTableProps> = ({ onQuoteClick }) => {
  const [petCount, setPetCount] = useState(1);
  const [species, setSpecies] = useState<'dog' | 'cat'>('dog');
  
  const discount = petCount >= 2 ? 0.10 : 0;
  // Reverse plans so Comprehensive+ is first
  const REVERSED_PLANS = [...PET_PLANS].reverse();

  return (
    <section id="plans" className="py-20 bg-gray-50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <span className="text-primary font-bold tracking-[0.2em] text-xs uppercase mb-2 block">Insurance Coverage</span>
          <h2 className="text-3xl md:text-5xl font-black text-gray-900 mb-4">Compare Our Plans</h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            Calculate your total monthly premium based on the number of furry family members you have.
          </p>
          
          <div className="mt-10 flex flex-col md:flex-row items-center justify-center gap-8">
            <div className="flex items-center gap-4 bg-white p-2 rounded-2xl shadow-sm border">
              <button
                onClick={() => setSpecies('dog')}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all ${
                  species === 'dog' ? 'bg-primary text-white shadow-lg' : 'text-gray-500 hover:bg-gray-50'
                }`}
              >
                <span>🐕</span> Dogs
              </button>
              <button
                onClick={() => setSpecies('cat')}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all ${
                  species === 'cat' ? 'bg-primary text-white shadow-lg' : 'text-gray-500 hover:bg-gray-50'
                }`}
              >
                <span>🐈</span> Cats
              </button>
            </div>

            <div className="flex items-center gap-4">
              <span className="font-bold text-gray-700">How many pets?</span>
              <div className="flex items-center bg-white rounded-full shadow-inner border p-1">
                {[1, 2, 3, 4, 5].map(n => (
                  <button
                    key={n}
                    onClick={() => setPetCount(n)}
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-all font-bold ${
                      petCount === n ? 'bg-primary text-white shadow-md scale-110' : 'text-gray-400 hover:text-gray-600'
                    }`}
                  >
                    {n === 5 ? '5+' : n}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {petCount >= 2 && (
            <div className="mt-6 inline-flex animate-bounce">
              <span className="text-green-600 font-black bg-green-50 px-6 py-2 rounded-full text-[10px] uppercase tracking-widest border border-green-200">
                🎉 10% Multi-pet Discount Applied!
              </span>
            </div>
          )}
        </div>

        <div className="grid md:grid-cols-2 xl:grid-cols-5 gap-4">
          {REVERSED_PLANS.map((plan) => {
            const basePrice = (species === 'dog' ? plan.priceDog : plan.priceCat) * petCount;
            const finalPrice = basePrice * (1 - discount);

            return (
              <div 
                key={plan.id}
                className={`relative bg-white rounded-[32px] overflow-hidden border-2 transition-all hover:shadow-2xl flex flex-col ${
                  plan.featured ? 'border-primary shadow-xl ring-4 ring-primary/5' : 'border-gray-100 hover:border-gray-200'
                }`}
              >
                {plan.featured && (
                  <div className="absolute top-0 right-0 bg-primary text-white text-[10px] font-black px-4 py-1.5 rounded-bl-2xl uppercase tracking-widest z-20">
                    Most Popular
                  </div>
                )}
                
                <div className="p-6 flex-grow flex flex-col">
                  <h3 className="text-lg font-black text-gray-900 mb-1 leading-tight">{plan.name}</h3>
                  <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider h-8 mb-4">{plan.caption}</p>
                  
                  <div className="flex flex-col mb-6">
                    <span className="text-[10px] uppercase font-black text-gray-400 tracking-widest mb-1">Total Premium</span>
                    <div className="flex items-baseline">
                      <span className="text-gray-400 text-xs font-bold">R</span>
                      <span className="text-4xl font-black text-gray-900 mx-0.5 tracking-tighter">{Math.round(finalPrice)}</span>
                      <span className="text-gray-400 text-[10px] font-bold">/mo</span>
                    </div>
                  </div>

                  <div className="mb-6 space-y-2 bg-gray-50 p-4 rounded-2xl">
                    <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-tighter">
                      <span className="text-gray-400">Annual Limit</span>
                      <span className="text-primary">{plan.annualLimit}</span>
                    </div>
                    <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-tighter">
                      <span className="text-gray-400">Excess</span>
                      <span className="text-gray-600">{plan.excess}</span>
                    </div>
                  </div>

                  <ul className="space-y-3 mb-8 flex-grow">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-[12px] leading-tight text-gray-600 font-medium">
                        <svg className="w-4 h-4 text-green-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <button 
                    onClick={() => onQuoteClick(plan.id)}
                    className={`w-full py-4 rounded-2xl font-black text-sm transition-all transform active:scale-95 ${
                      plan.featured 
                        ? 'bg-primary text-white hover:bg-opacity-90 shadow-lg shadow-primary/20' 
                        : 'bg-gray-900 text-white hover:bg-black'
                    }`}
                  >
                    Get Quote
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-12 bg-white rounded-[40px] p-8 md:p-12 shadow-sm border border-gray-100">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-2xl font-bold mb-6 text-gray-900">Additional Options</h3>
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-2xl">✨</div>
                  <div>
                    <h4 className="font-black text-gray-900 text-sm">Routine Care Option</h4>
                    <p className="text-xs text-gray-500">Only R85 per pet, per month for wellness checks and vaccinations.</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-2xl">⏫</div>
                  <div>
                    <h4 className="font-black text-gray-900 text-sm">Double Up Option</h4>
                    <p className="text-xs text-gray-500">Double your premium to double your annual limits instantly.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-primary/5 rounded-3xl p-8 border border-primary/10">
              <h4 className="font-black text-primary mb-4 uppercase tracking-widest text-[10px]">Why Petcovered®?</h4>
              <ul className="grid grid-cols-2 gap-y-3 gap-x-6 text-[11px] font-bold text-gray-700">
                <li className="flex items-center gap-2">
                  <span className="text-primary">✓</span> All Accidents & Illness
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-primary">✓</span> Routine Care
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-primary">✓</span> No Breed Exclusion
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-primary">✓</span> Prompt Settlements
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-primary">✓</span> Dental Cover
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-primary">✓</span> Specialist Treatments
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PricingTable;

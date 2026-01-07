
import React, { useState } from 'react';
import { PET_PLANS } from '../constants';

interface PlansPageProps {
  onQuoteClick: () => void;
}

const PlansPage: React.FC<PlansPageProps> = ({ onQuoteClick }) => {
  const [species, setSpecies] = useState<'dog' | 'cat'>('dog');
  const [petCount, setPetCount] = useState(1);

  // We reverse the plans so it starts with Comprehensive+ (premium first)
  const REVERSED_PLANS = [...PET_PLANS].reverse();
  const discount = petCount >= 2 ? 0.10 : 0;

  // Exact comparison data reordered to match REVERSED_PLANS:
  // Order: [Comprehensive+, Comprehensive Only, Hospital Only, Accident Only, Essential]
  const comparisonRows = [
    { label: 'Accident Cover', val: ['✅', '✅', '✅', '✅', '❌'] },
    { label: 'Illness Cover', val: ['✅', '✅', '✅ (hospital-related only)', '❌', '❌'] },
    { label: 'Consultation Cover', val: ['✅', '✅', '⚠️ Pre-hospital only (if hospitalised)', '❌', '✅'] },
    { label: 'In-Hospital Cover', val: ['✅', '✅', '✅', '❌', '❌'] },
    { label: 'Prescription Medication', val: ['✅', '✅', '⚠️ Hospital-related', '❌', '❌'] },
    { label: 'Specialist Treatment', val: ['✅', '✅', '⚠️ Hospital-related', '❌', '❌'] },
    { label: 'Dental Cover', val: ['✅ (Extended)', '❌', '❌', '❌', '❌'] },
    { label: 'Alternative / Complementary Treatment', val: ['✅ (Extended)', '❌', '❌', '❌', '❌'] },
    { label: 'Boarding Fees', val: ['✅ (Extended)', '❌', '❌', '❌', '❌'] },
    { label: 'Missing / Stolen Pet', val: ['✅ (Extended)', '❌', '❌', '❌', '❌'] },
    { label: 'Death / Condolence Benefit', val: ['✅ (Extended)', '❌', '❌', '❌', '❌'] },
    { label: 'Routine Care (Optional Add-on)', val: ['✅', '✅', '❌', '❌', '❌'] },
    { label: 'Vet of Own Choice', val: ['✅', '✅', '✅', '✅', '✅'] },
    { label: 'Direct Vet Payment', val: ['✅', '✅', '✅', '✅', '✅'] },
    { label: 'Pre-existing Conditions', val: ['❌ (12-month waiting)', '❌ (12-month waiting)', '❌ (12-month waiting)', '❌', '❌'] },
    { label: 'Excess', val: ['10% (Min R500)', '10% (Min R500)', '10% (Min R500)', '10% (Min R500)', '10% (Min R500)'] },
    { label: 'Microchip Required', val: ['✅', '✅', '✅', '✅', '✅'] },
    { label: 'Double-Up Option', val: ['✅', '✅', '✅', '✅', '❌'] },
  ];

  return (
    <div className="animate-fade-in bg-white min-h-screen">
      {/* Dynamic Hero Section */}
      <section className="bg-primary pt-24 pb-48 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-white/10 rounded-full blur-3xl -mr-64 -mt-64"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-black/10 rounded-full blur-3xl -ml-48 -mb-48"></div>
        
        <div className="max-w-7xl mx-auto px-4 text-center relative z-10">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-8">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
            Genric Pet Insurance – Plan Comparison
          </div>
          <h1 className="text-5xl md:text-7xl font-black mb-8 leading-tight">Compare Our <br/><span className="text-white/80 italic">Health Plans</span></h1>
          
          <div className="flex flex-col md:flex-row items-center justify-center gap-6 mt-12">
            {/* Species Toggle */}
            <div className="bg-white/10 backdrop-blur-xl p-1.5 rounded-[22px] inline-flex border border-white/20">
              <button
                onClick={() => setSpecies('dog')}
                className={`px-8 py-3 rounded-[18px] font-black transition-all flex items-center gap-2 text-sm ${
                  species === 'dog' ? 'bg-white text-primary shadow-xl' : 'text-white hover:bg-white/10'
                }`}
              >
                🐕 Dogs
              </button>
              <button
                onClick={() => setSpecies('cat')}
                className={`px-8 py-3 rounded-[18px] font-black transition-all flex items-center gap-2 text-sm ${
                  species === 'cat' ? 'bg-white text-primary shadow-xl' : 'text-white hover:bg-white/10'
                }`}
              >
                🐈 Cats
              </button>
            </div>

            {/* Pet Count Selector */}
            <div className="flex items-center gap-4 bg-white/10 backdrop-blur-xl p-1.5 rounded-[22px] border border-white/20">
              <span className="text-xs font-black uppercase ml-4 opacity-70">Pets:</span>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map(n => (
                  <button
                    key={n}
                    onClick={() => setPetCount(n)}
                    className={`w-10 h-10 rounded-[14px] font-black transition-all text-sm ${
                      petCount === n ? 'bg-white text-primary shadow-lg' : 'text-white/60 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    {n === 5 ? '5+' : n}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {petCount >= 2 && (
            <div className="mt-8 inline-flex animate-bounce">
              <span className="text-green-400 font-black bg-white/10 backdrop-blur-md px-6 py-2 rounded-full text-[10px] uppercase tracking-widest border border-green-400/30">
                🎉 10% Multi-pet Discount Applied!
              </span>
            </div>
          )}
        </div>
      </section>

      {/* Comparison Matrix Table */}
      <section className="max-w-[100vw] 2xl:max-w-[1600px] mx-auto px-0 md:px-8 pb-24 -mt-24 relative z-30">
        <div className="bg-white md:rounded-[48px] shadow-2xl overflow-hidden border-y md:border-x-4 border-gray-100">
          <div className="overflow-x-auto overflow-y-hidden custom-scrollbar">
            <table className="w-full text-left border-collapse min-w-[1100px] table-fixed">
              <thead>
                <tr className="bg-gray-50/95 backdrop-blur-md sticky top-0 z-40 border-b-2 border-gray-100">
                  <th className="p-6 md:p-8 text-[11px] font-black uppercase text-gray-400 tracking-[0.2em] w-[220px] md:w-[280px] sticky left-0 bg-gray-50 z-50 shadow-[4px_0_10px_-5px_rgba(0,0,0,0.1)]">
                    Feature / Cover
                  </th>
                  {REVERSED_PLANS.map(plan => {
                    const basePrice = (species === 'dog' ? plan.priceDog : plan.priceCat) * petCount;
                    const finalPrice = basePrice * (1 - discount);
                    return (
                      <th key={plan.id} className={`p-6 md:p-8 text-center transition-colors ${plan.featured ? 'bg-primary/5' : ''}`}>
                        <div className="flex flex-col items-center gap-2">
                          <span className={`block text-[10px] md:text-xs font-black uppercase tracking-tighter ${plan.featured ? 'text-primary' : 'text-gray-400'}`}>
                            {plan.featured ? '★ Most Popular' : 'Premium'}
                          </span>
                          <span className="block text-lg md:text-xl font-black text-gray-900 leading-tight">
                            {plan.name}
                          </span>
                          <div className="flex items-baseline gap-0.5">
                            <span className="text-xs font-bold text-gray-400">R</span>
                            <span className="text-3xl font-black text-gray-900 tracking-tighter">{Math.round(finalPrice)}</span>
                            <span className="text-[10px] font-bold text-gray-400">/mo</span>
                          </div>
                          <button 
                            onClick={onQuoteClick}
                            className={`mt-4 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                              plan.featured ? 'bg-primary text-white shadow-lg' : 'bg-gray-900 text-white'
                            }`}
                          >
                            Select
                          </button>
                        </div>
                      </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {comparisonRows.map((row, idx) => (
                  <tr key={idx} className="hover:bg-primary/[0.02] transition-colors group">
                    <td className="p-5 md:p-7 sticky left-0 bg-white z-30 shadow-[4px_0_10px_-5px_rgba(0,0,0,0.1)] border-r border-gray-50">
                      <span className="text-xs md:text-sm font-black text-gray-800 group-hover:text-primary transition-colors block leading-tight">
                        {row.label}
                      </span>
                    </td>
                    {REVERSED_PLANS.map((p, pIdx) => {
                      const cellData = row.val[pIdx];
                      const isYes = cellData === '✅';
                      const isNo = cellData === '❌';
                      const isWarning = cellData.startsWith('⚠️');

                      return (
                        <td key={p.id} className={`p-5 md:p-7 text-center transition-colors ${p.featured ? 'bg-primary/[0.01]' : ''}`}>
                          <div className="flex flex-col items-center justify-center">
                            {isYes ? (
                              <div className="bg-green-500 text-white w-7 h-7 md:w-8 md:h-8 rounded-full flex items-center justify-center shadow-lg shadow-green-500/20 transform group-hover:scale-110 transition-transform">
                                <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M5 13l4 4L19 7" />
                                </svg>
                              </div>
                            ) : isNo ? (
                              <div className="text-gray-200 font-black text-lg md:text-xl opacity-40">✕</div>
                            ) : isWarning ? (
                              <div className="flex flex-col items-center gap-1.5 max-w-[140px]">
                                 <div className="bg-amber-100 text-amber-600 w-7 h-7 md:w-8 md:h-8 rounded-xl flex items-center justify-center shadow-sm">
                                    <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                    </svg>
                                 </div>
                                 <span className="text-[9px] md:text-[10px] font-black text-amber-700 leading-tight text-center">{cellData.replace('⚠️ ', '')}</span>
                              </div>
                            ) : (
                              <span className="text-[10px] md:text-[11px] font-black text-gray-500 bg-gray-100/50 px-3 py-1.5 rounded-lg whitespace-pre-line inline-block border border-gray-100">
                                {cellData}
                              </span>
                            )}
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="bg-gray-50 p-6 flex items-center justify-center md:hidden border-t">
            <p className="text-xs font-bold text-gray-400 flex items-center gap-2">
              <svg className="w-4 h-4 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M7 16l-4-4m0 0l4-4m-4 4h18" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"/></svg>
              Scroll to compare plans
              <svg className="w-4 h-4 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M17 8l4 4m0 0l-4 4m4-4H3" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"/></svg>
            </p>
          </div>
        </div>
      </section>

      {/* Important Disclaimers & Info */}
      <section className="max-w-[1600px] mx-auto px-4 md:px-8 pb-24">
        <div className="grid lg:grid-cols-3 gap-8">
           <div className="bg-gray-50 rounded-[40px] p-10 border border-gray-100">
              <h3 className="text-sm font-black text-primary uppercase tracking-widest mb-6">Comprehensive+ Perks</h3>
              <p className="text-xs font-bold text-gray-600 leading-relaxed">
                Only the Comprehensive+ plan includes our "Extended Cover" suite. This covers Dental, Boarding fees if you are hospitalised, Missing Pet rewards, and even Alternative therapies like Acupuncture if recommended by a vet.
              </p>
           </div>
           
           <div className="bg-primary rounded-[40px] p-10 text-white shadow-2xl shadow-primary/20">
              <h3 className="text-sm font-black text-white/60 uppercase tracking-widest mb-6">The Double-Up Option</h3>
              <p className="text-sm font-black leading-relaxed">
                Unique to Petcovered®: You can double your premium to double your annual limits. If you choose this, you automatically qualify for the multi-pet discount, even if you only have one pet!
              </p>
              <div className="mt-8 pt-8 border-t border-white/10 flex items-center justify-between">
                 <span className="text-[10px] font-black uppercase opacity-60">Available on 4/5 plans</span>
                 <span className="bg-white/20 px-3 py-1 rounded-full text-[10px] font-black">Learn More</span>
              </div>
           </div>

           <div className="bg-gray-900 rounded-[40px] p-10 text-white">
              <h3 className="text-sm font-black text-primary uppercase tracking-widest mb-6">Transparency First</h3>
              <ul className="space-y-4 text-xs font-bold text-gray-400">
                <li className="flex gap-3"><span className="text-primary">•</span> 12-month waiting period for pre-existing conditions.</li>
                <li className="flex gap-3"><span className="text-primary">•</span> R500 minimum excess ensures lower monthly premiums.</li>
                <li className="flex gap-3"><span className="text-primary">•</span> Direct payment to vets available on pre-authorised visits.</li>
                <li className="flex gap-3"><span className="text-primary">•</span> All pets must be microchipped as per policy rules.</li>
              </ul>
           </div>
        </div>
      </section>

      {/* Quote CTA */}
      <section className="py-24 max-w-5xl mx-auto px-4 text-center">
        <div className="bg-primary/5 rounded-[60px] p-8 md:p-20 border-4 border-dashed border-primary/20">
          <h2 className="text-4xl font-black mb-6">Ready to Protect Your {species}?</h2>
          <p className="text-lg text-gray-600 mb-10 max-w-xl mx-auto">
            Our expert consultants are ready to guide you through the switch to smarter pet insurance.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-6">
            <button 
              onClick={onQuoteClick}
              className="bg-primary text-white px-12 py-5 rounded-[24px] font-black text-lg shadow-2xl shadow-primary/30 hover:scale-105 transition-transform"
            >
              Get Started Now
            </button>
            <a href="tel:0101094015" className="bg-white text-gray-900 border-2 border-gray-200 px-12 py-5 rounded-[24px] font-black text-lg hover:border-primary hover:text-primary transition-all">
              Call Support
            </a>
          </div>
        </div>
      </section>

      <style dangerouslySetInnerHTML={{ __html: `
        .custom-scrollbar::-webkit-scrollbar {
          height: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #a94694;
          border-radius: 10px;
          border: 3px solid #f1f1f1;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #8e3a7c;
        }
      `}} />
    </div>
  );
};

export default PlansPage;

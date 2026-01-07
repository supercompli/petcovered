
import React, { useState } from 'react';
import { PET_PLANS } from '../constants';

const PlansPage: React.FC = () => {
  const [species, setSpecies] = useState<'dog' | 'cat'>('dog');

  // Exact comparison data based on the provided table
  // Order of values in val array: [Essential, Accident Only, Hospital Only, Comprehensive Only, Comprehensive+]
  const comparisonRows = [
    { label: 'Accident Cover', val: ['❌', '✅', '✅', '✅', '✅'] },
    { label: 'Illness Cover', val: ['❌', '❌', '✅ (hospital-related only)', '✅', '✅'] },
    { label: 'Consultation Cover', val: ['✅', '❌', '⚠️ Pre-hospital only (if hospitalised)', '✅', '✅'] },
    { label: 'In-Hospital Cover', val: ['❌', '❌', '✅', '✅', '✅'] },
    { label: 'Prescription Medication', val: ['❌', '❌', '⚠️ Hospital-related', '✅', '✅'] },
    { label: 'Specialist Treatment', val: ['❌', '❌', '⚠️ Hospital-related', '✅', '✅'] },
    { label: 'Dental Cover', val: ['❌', '❌', '❌', '❌', '✅ (Extended)'] },
    { label: 'Alternative / Complementary Treatment', val: ['❌', '❌', '❌', '❌', '✅ (Extended)'] },
    { label: 'Boarding Fees', val: ['❌', '❌', '❌', '❌', '✅ (Extended)'] },
    { label: 'Missing / Stolen Pet', val: ['❌', '❌', '❌', '❌', '✅ (Extended)'] },
    { label: 'Death / Condolence Benefit', val: ['❌', '❌', '❌', '❌', '✅ (Extended)'] },
    { label: 'Routine Care (Optional Add-on)', val: ['❌', '❌', '❌', '✅', '✅'] },
    { label: 'Vet of Own Choice', val: ['✅', '✅', '✅', '✅', '✅'] },
    { label: 'Direct Vet Payment', val: ['✅', '✅', '✅', '✅', '✅'] },
    { label: 'Pre-existing Conditions', val: ['❌', '❌', '❌ (12-month waiting)', '❌ (12-month waiting)', '❌ (12-month waiting)'] },
    { label: 'Excess', val: ['10% (Min R500)', '10% (Min R500)', '10% (Min R500)', '10% (Min R500)', '10% (Min R500)'] },
    { label: 'Microchip Required', val: ['✅', '✅', '✅', '✅', '✅'] },
    { label: 'Double-Up Option', val: ['❌', '✅', '✅', '✅', '✅'] },
  ];

  return (
    <div className="animate-fade-in bg-white min-h-screen">
      {/* Dynamic Hero Section */}
      <section className="bg-primary pt-24 pb-40 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-white/10 rounded-full blur-3xl -mr-64 -mt-64"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-black/10 rounded-full blur-3xl -ml-48 -mb-48"></div>
        
        <div className="max-w-7xl mx-auto px-4 text-center relative z-10">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-8">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
            Genric Pet Insurance – Plan Comparison
          </div>
          <h1 className="text-5xl md:text-7xl font-black mb-8 leading-tight">Find the Perfect <br/><span className="text-white/80 italic">Level of Cover</span></h1>
          <p className="text-xl opacity-90 max-w-2xl mx-auto mb-12 font-medium">
            Switch species to see tailored pricing for your furry family members.
          </p>

          <div className="flex justify-center">
            <div className="bg-white/10 backdrop-blur-xl p-2 rounded-[24px] inline-flex border border-white/20 shadow-2xl">
              <button
                onClick={() => setSpecies('dog')}
                className={`px-10 py-4 rounded-[18px] font-black transition-all flex items-center gap-3 text-lg ${
                  species === 'dog' ? 'bg-white text-primary shadow-xl scale-105' : 'text-white hover:bg-white/10'
                }`}
              >
                <span>🐕</span> Dogs
              </button>
              <button
                onClick={() => setSpecies('cat')}
                className={`px-10 py-4 rounded-[18px] font-black transition-all flex items-center gap-3 text-lg ${
                  species === 'cat' ? 'bg-white text-primary shadow-xl scale-105' : 'text-white hover:bg-white/10'
                }`}
              >
                <span>🐈</span> Cats
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Plan Cards Summary */}
      <section className="max-w-7xl mx-auto px-4 -mt-24 relative z-20 mb-32">
        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-6">
          {PET_PLANS.map((plan) => {
            const price = species === 'dog' ? plan.priceDog : plan.priceCat;
            return (
              <div 
                key={plan.id}
                className={`bg-white rounded-[48px] p-8 shadow-2xl border-2 flex flex-col group hover:-translate-y-2 transition-all duration-500 ${
                  plan.featured ? 'border-primary ring-8 ring-primary/5' : 'border-transparent'
                }`}
              >
                <div className="mb-6">
                  <h3 className="text-xl font-black text-gray-900 mb-1 group-hover:text-primary transition-colors">{plan.name}</h3>
                  <p className="text-[9px] uppercase font-black text-gray-400 tracking-widest">{plan.caption}</p>
                </div>

                <div className="mb-8">
                  <div className="flex items-baseline mb-2">
                    <span className="text-primary font-black mr-1 text-sm">R</span>
                    <span className="text-5xl font-black text-gray-900 tracking-tighter">{Math.round(price)}</span>
                    <span className="text-gray-400 text-xs font-bold ml-1">/mo</span>
                  </div>
                  <div className="w-12 h-1.5 bg-primary/10 rounded-full group-hover:w-full transition-all duration-700"></div>
                </div>

                <div className="space-y-4 mb-8 flex-grow">
                  <div className="bg-gray-50 p-4 rounded-3xl">
                    <p className="text-[9px] uppercase font-black text-gray-400 mb-1">Annual Max</p>
                    <p className="text-primary font-black text-xl">{plan.annualLimit}</p>
                  </div>
                </div>

                <button className={`w-full py-5 rounded-[22px] font-black text-sm transition-all shadow-lg active:scale-95 ${
                  plan.featured 
                    ? 'bg-primary text-white shadow-primary/20 hover:shadow-primary/40' 
                    : 'bg-gray-900 text-white hover:bg-black shadow-gray-900/20'
                }`}>
                  Select {plan.name}
                </button>
              </div>
            );
          })}
        </div>
      </section>

      {/* Comparison Matrix Table */}
      <section className="max-w-7xl mx-auto px-4 pb-24">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-black text-gray-900 mb-4">Official Cover Matrix</h2>
          <p className="text-gray-500 font-medium">Detailed breakdown of features across all plans.</p>
        </div>

        <div className="overflow-x-auto rounded-[48px] border-4 border-gray-50 bg-white shadow-2xl">
          <table className="w-full text-left border-collapse min-w-[1200px]">
            <thead>
              <tr className="bg-gray-50/80 backdrop-blur-sm sticky top-0 z-30">
                <th className="p-8 text-[11px] font-black uppercase text-gray-400 tracking-[0.2em] w-80">Feature / Cover</th>
                {PET_PLANS.map(p => (
                  <th key={p.id} className="p-8 text-center border-l-2 border-white">
                    <span className="block text-sm font-black text-gray-900 uppercase tracking-tighter leading-tight">{p.name}</span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y-2 divide-gray-50">
              {comparisonRows.map((row, idx) => (
                <tr key={idx} className="hover:bg-primary/[0.02] transition-colors group">
                  <td className="p-8">
                    <span className="text-sm font-black text-gray-800 group-hover:text-primary transition-colors">{row.label}</span>
                  </td>
                  {PET_PLANS.map((p, pIdx) => {
                    const cellData = row.val[pIdx];
                    const isYes = cellData === '✅';
                    const isNo = cellData === '❌';
                    const isWarning = cellData.startsWith('⚠️');

                    return (
                      <td key={p.id} className="p-8 text-center border-l-2 border-gray-50">
                        {isYes ? (
                          <div className="bg-green-500/10 text-green-600 w-8 h-8 rounded-xl flex items-center justify-center mx-auto shadow-sm group-hover:scale-110 transition-transform">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                        ) : isNo ? (
                          <div className="text-gray-200 font-black text-xl mx-auto">✕</div>
                        ) : isWarning ? (
                          <div className="text-center flex flex-col items-center gap-2">
                             <div className="bg-amber-100 text-amber-600 w-8 h-8 rounded-xl flex items-center justify-center shadow-sm">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                             </div>
                             <span className="text-[10px] font-bold text-amber-700 leading-tight max-w-[120px]">{cellData.replace('⚠️ ', '')}</span>
                          </div>
                        ) : (
                          <span className="text-[12px] font-bold text-gray-600 bg-gray-50 px-3 py-1.5 rounded-lg whitespace-pre-line inline-block">
                            {cellData}
                          </span>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Extended Cover Footnotes */}
      <section className="max-w-7xl mx-auto px-4 pb-24">
        <div className="p-10 bg-gray-900 rounded-[40px] text-white">
          <h4 className="text-xs font-black uppercase tracking-[0.2em] text-primary mb-6">Important Information</h4>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-12 text-[11px] font-medium leading-relaxed opacity-80">
            <div className="space-y-4">
              <p><span className="font-black text-white block mb-1">Extended Cover (Comp+):</span> Only the Comprehensive+ plan includes extended cover for Alternative Treatments, Boarding Fees, Missing Pet rewards, Dental, and Death benefits.</p>
              <p><span className="font-black text-white block mb-1">Optional Add-ons:</span> Routine Care is an optional add-on available for Comprehensive plans to help with vaccinations and wellness.</p>
            </div>
            <div className="space-y-4">
              <p><span className="font-black text-white block mb-1">Pre-existing Conditions:</span> Like most insurers, we have a 12-month waiting period for pre-existing conditions to keep premiums affordable for everyone.</p>
              <p><span className="font-black text-white block mb-1">Excess:</span> Our standard excess is 10% with a minimum of R500. This applies to each claim to maintain policy sustainability.</p>
            </div>
            <div className="space-y-4">
              <p><span className="font-black text-white block mb-1">Direct Payment:</span> We can pay your vet directly by arrangement on pre-authorised procedures—just give us a call before the appointment!</p>
              <p><span className="font-black text-white block mb-1">Microchip:</span> All pets must be microchipped. It is the best way to ensure your pet can be identified and returned to you.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Quote CTA */}
      <section className="py-24 max-w-5xl mx-auto px-4 text-center">
        <div className="bg-primary/5 rounded-[60px] p-16 border-4 border-dashed border-primary/20">
          <h2 className="text-4xl font-black mb-6">Ready to Protect Your {species}?</h2>
          <p className="text-lg text-gray-600 mb-10 max-w-xl mx-auto">
            Join thousands of South African pet owners who trust Petcovered® for smart, simple protection.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-6">
            <button className="bg-primary text-white px-12 py-5 rounded-[24px] font-black text-lg shadow-2xl shadow-primary/30 hover:scale-105 transition-transform">
              Get Started Now
            </button>
            <a href="tel:0101094015" className="bg-white text-gray-900 border-2 border-gray-200 px-12 py-5 rounded-[24px] font-black text-lg hover:border-primary hover:text-primary transition-all">
              Call Support
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PlansPage;

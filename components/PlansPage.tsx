
import React, { useState } from 'react';
import { PET_PLANS } from '../constants';

const PlansPage: React.FC = () => {
  const [species, setSpecies] = useState<'dog' | 'cat'>('dog');

  const comparisonRows = [
    { label: 'Overall Annual Limit', key: 'annualLimit' },
    { label: 'Accident Cover', val: ['Yes', 'Yes', 'Yes', 'Yes', 'Yes'] },
    { label: 'Illness Cover', val: ['No', 'No', 'Yes', 'Yes', 'Yes'] },
    { label: 'In-Hospital Cover', val: ['No', 'No', 'Yes', 'Yes', 'Yes'] },
    { label: 'Consultation & Pre-hospital', val: ['Yes', 'No', 'Yes', 'Yes', 'Yes'] },
    { label: 'Routine Care Option', val: ['No', 'No', 'Yes', 'Yes', 'Yes'] },
    { label: 'Dental Cover', val: ['No', 'No', 'No', 'No', 'Yes'] },
    { label: 'Boarding Fees', val: ['No', 'No', 'No', 'No', 'Yes'] },
    { label: 'Missing/Stolen Pet', val: ['No', 'No', 'No', 'No', 'Yes'] },
    { label: 'Breed Exclusions', val: ['None', 'None', 'None', 'None', 'None'] },
    { label: 'Excess', key: 'excess' }
  ];

  return (
    <div className="animate-fade-in pb-20">
      {/* Hero Header */}
      <section className="bg-primary pt-20 pb-32 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -mr-48 -mt-48"></div>
        <div className="max-w-7xl mx-auto px-4 text-center relative z-10">
          <span className="bg-white/20 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-6 inline-block">Plan Comparison</span>
          <h1 className="text-4xl md:text-6xl font-black mb-6">Choose Your Protection</h1>
          <p className="text-xl opacity-90 max-w-2xl mx-auto mb-12">
            From essential consultations to comprehensive medical plus, we have a plan for every pet and every budget.
          </p>

          <div className="flex justify-center">
            <div className="bg-white p-1.5 rounded-2xl inline-flex shadow-xl border border-white/20">
              <button
                onClick={() => setSpecies('dog')}
                className={`px-8 py-3 rounded-xl font-bold transition-all flex items-center gap-2 ${
                  species === 'dog' ? 'bg-primary text-white shadow-md' : 'text-gray-500 hover:bg-gray-50'
                }`}
              >
                🐕 Dogs
              </button>
              <button
                onClick={() => setSpecies('cat')}
                className={`px-8 py-3 rounded-xl font-bold transition-all flex items-center gap-2 ${
                  species === 'cat' ? 'bg-primary text-white shadow-md' : 'text-gray-500 hover:bg-gray-50'
                }`}
              >
                🐈 Cats
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Comparison Grid */}
      <section className="max-w-7xl mx-auto px-4 -mt-16 relative z-20 mb-24">
        <div className="grid md:grid-cols-3 xl:grid-cols-5 gap-6">
          {PET_PLANS.map((plan) => {
            const price = species === 'dog' ? plan.priceDog : plan.priceCat;
            return (
              <div 
                key={plan.id}
                className={`bg-white rounded-[40px] p-8 shadow-xl border-2 flex flex-col ${
                  plan.featured ? 'border-primary ring-4 ring-primary/5 scale-105' : 'border-gray-50'
                }`}
              >
                {plan.featured && (
                  <div className="bg-primary text-white text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full w-fit mb-4">
                    Recommended
                  </div>
                )}
                <h3 className="text-xl font-black text-gray-900 mb-2">{plan.name}</h3>
                <div className="flex items-baseline mb-6">
                  <span className="text-gray-400 font-bold mr-1">R</span>
                  <span className="text-4xl font-black text-gray-900">{Math.round(price)}</span>
                  <span className="text-gray-400 text-xs font-bold">/mo</span>
                </div>
                <div className="space-y-4 mb-8">
                  <div className="bg-gray-50 p-4 rounded-2xl">
                    <p className="text-[10px] uppercase font-black text-gray-400 mb-1">Annual Limit</p>
                    <p className="text-primary font-bold text-lg">{plan.annualLimit}</p>
                  </div>
                  <ul className="space-y-3">
                    {plan.features.slice(0, 4).map((f, i) => (
                      <li key={i} className="text-xs text-gray-600 flex items-start gap-2 leading-tight">
                        <span className="text-green-500 font-bold">✓</span> {f}
                      </li>
                    ))}
                  </ul>
                </div>
                <button className="mt-auto w-full py-4 rounded-2xl bg-gray-900 text-white font-bold text-sm hover:bg-black transition-colors">
                  Select Plan
                </button>
              </div>
            );
          })}
        </div>
      </section>

      {/* Comparison Matrix Table */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-black text-gray-900 mb-4">Deep Dive Comparison</h2>
          <p className="text-gray-500">See exactly how our plans differ at a glance.</p>
        </div>

        <div className="overflow-x-auto rounded-[32px] border border-gray-100 bg-white shadow-sm">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50">
                <th className="p-6 text-sm font-black uppercase text-gray-400 tracking-wider">Features & Benefits</th>
                {PET_PLANS.map(p => (
                  <th key={p.id} className="p-6 text-center text-sm font-black text-gray-900 border-l border-gray-50">
                    {p.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {comparisonRows.map((row, idx) => (
                <tr key={idx} className="hover:bg-gray-50/30 transition-colors">
                  <td className="p-6 text-sm font-bold text-gray-700">{row.label}</td>
                  {PET_PLANS.map((p, pIdx) => {
                    const value = row.key ? (p as any)[row.key] : (row.val as any[])[pIdx];
                    const isYes = value === 'Yes';
                    const isNo = value === 'No';

                    return (
                      <td key={p.id} className={`p-6 text-center text-sm border-l border-gray-50 ${isNo ? 'text-gray-300' : 'text-gray-600'}`}>
                        {isYes ? (
                          <div className="bg-green-100 text-green-600 w-6 h-6 rounded-full flex items-center justify-center mx-auto">✓</div>
                        ) : isNo ? (
                          <div className="text-gray-300 mx-auto">✕</div>
                        ) : (
                          <span className="font-medium">{value}</span>
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

      {/* Additional Options */}
      <section className="max-w-7xl mx-auto px-4 mt-24 grid md:grid-cols-2 gap-12">
        <div className="bg-white p-10 rounded-[40px] shadow-sm border border-gray-100 flex gap-6 items-start">
          <div className="text-4xl">⏫</div>
          <div>
            <h3 className="text-xl font-bold mb-3">Double Up Option</h3>
            <p className="text-gray-500 leading-relaxed">
              Want more protection? You can double your premium and thereby double your annual benefit limits on any plan.
            </p>
          </div>
        </div>
        <div className="bg-white p-10 rounded-[40px] shadow-sm border border-gray-100 flex gap-6 items-start">
          <div className="text-4xl">🏥</div>
          <div>
            <h3 className="text-xl font-bold mb-3">Direct Payment to Vets</h3>
            <p className="text-gray-500 leading-relaxed">
              By arrangement on pre-authorised procedures, we can pay your vet directly so you aren't out of pocket.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PlansPage;


import React, { useState, useEffect, useMemo } from 'react';
import { PET_PLANS } from '../constants';

const QuotePage: React.FC<{ onBack: () => void; selectedPlanId: string | null }> = ({ onBack, selectedPlanId }) => {
  const [step, setStep] = useState(1);
  const [localPlanId, setLocalPlanId] = useState(selectedPlanId || 'comp-plus');
  const [isChangingPlan, setIsChangingPlan] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);
  
  const [formData, setFormData] = useState({
    // Identity
    petName: '',
    species: 'Dog',
    // Medical
    healthCondition: '',
    additionalHealth: '',
    vaccinations: 'Yes',
    commercial: 'No',
    commercialExplain: '',
    vetPermission: 'Yes',
    // Detailed Profile
    gender: 'M',
    colour: '',
    weight: '',
    dob: '',
    age: '',
    chipNo: '',
    breed: '',
    email: '',
    // Add-ons
    routineCare: false,
    // Banking
    accHolder: '',
    accNo: '',
    bank: 'FNB',
    accType: 'Cheque',
    deductionAmount: '',
    debitDay: '1',
    authorise: false
  });

  const selectedPlan = useMemo(() => 
    PET_PLANS.find(p => p.id === localPlanId) || PET_PLANS[0]
  , [localPlanId]);

  // Reactive total price calculation
  const totalPrice = useMemo(() => {
    const basePrice = formData.species === 'Dog' ? selectedPlan.priceDog : selectedPlan.priceCat;
    return (basePrice + (formData.routineCare ? 85 : 0)).toFixed(2);
  }, [selectedPlan, formData.species, formData.routineCare]);

  useEffect(() => {
    setFormData(prev => ({ ...prev, deductionAmount: totalPrice }));
  }, [totalPrice]);

  useEffect(() => {
    if (formData.dob) {
      const birthDate = new Date(formData.dob);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const m = today.getMonth() - birthDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) age--;
      setFormData(prev => ({ ...prev, age: age >= 0 ? age.toString() : '0' }));
    }
  }, [formData.dob]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as any;
    const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
    setFormData(prev => ({ ...prev, [name]: val }));
  };

  const handleToggle = (name: string, value: any) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const captureLead = async () => {
    setIsCapturing(true);
    const leadId = `LEAD-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
    const timestamp = new Date().toISOString();

    const leadRecord = {
      id: leadId,
      submittedAt: timestamp,
      petName: formData.petName,
      species: formData.species,
      breed: formData.breed,
      premium: `R${formData.deductionAmount}`,
      contactEmail: formData.email || 'N/A',
      details: formData,
      plan: selectedPlan.name
    };
    
    const existingLeads = JSON.parse(localStorage.getItem('petcovered_leads') || '[]');
    localStorage.setItem('petcovered_leads', JSON.stringify([leadRecord, ...existingLeads]));
    
    const flatPayload = {
      lead_id: leadId,
      source: "petcovered_web_v3",
      pet_name: formData.petName,
      pet_species: formData.species,
      pet_breed: formData.breed,
      pet_age_years: parseInt(formData.age || '0'),
      pet_gender: formData.gender,
      pet_weight_kg: formData.weight,
      pet_dob: formData.dob,
      owner_email: formData.email,
      selected_plan: selectedPlan.name,
      routine_care_included: formData.routineCare,
      monthly_premium: `R${formData.deductionAmount}`,
      health_history: `${formData.healthCondition} | ${formData.additionalHealth}`,
      acc_holder: formData.accHolder,
      bank_name: formData.bank,
      timestamp: timestamp
    };
    
    const webhookSettings = JSON.parse(localStorage.getItem('petcovered_webhook') || '{"enabled": false}');
    if (webhookSettings.enabled && webhookSettings.url) {
      try {
        const payload = webhookSettings.format === 'json' 
          ? JSON.stringify(flatPayload)
          : new URLSearchParams(flatPayload as any).toString();
          
        const headers = webhookSettings.format === 'json'
          ? { 'Content-Type': 'application/json' }
          : { 'Content-Type': 'application/x-www-form-urlencoded' };

        await fetch(webhookSettings.url, {
          method: 'POST',
          mode: 'no-cors',
          headers,
          body: payload
        });
      } catch (err) {
        console.warn("Webhook delivery attempted (Flat).", err);
      }
    }
    
    setIsCapturing(false);
    setStep(4);
    window.scrollTo(0, 0);
  };

  // Fix: Defined finalizeQuote to handle the final submission and display the success state
  const finalizeQuote = () => {
    setSubmitted(true);
    window.scrollTo(0, 0);
  };

  if (submitted) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-4 animate-fade-in">
        <div className="w-20 h-20 bg-green-500 text-white rounded-full flex items-center justify-center text-4xl mb-6 shadow-2xl animate-bounce">✓</div>
        <h2 className="text-3xl font-black text-gray-900 mb-2">Finalized & Secure</h2>
        <p className="text-gray-600 max-w-sm mb-8 text-base">
          Our underwriters at GENRIC will issue your policy document for {selectedPlan.name} within 24 hours.
        </p>
        <button onClick={() => window.location.hash = 'home'} className="bg-primary text-white px-10 py-4 rounded-xl font-black shadow-xl">Return to Home</button>
      </div>
    );
  }

  return (
    <div className="animate-fade-in bg-gray-50 min-h-screen py-8 md:py-12">
      <div className="max-w-2xl mx-auto px-4">
        
        {/* Compact Stepper */}
        <div className="mb-6 relative">
          <div className="flex justify-between items-center relative z-10 px-2">
            {['Start', 'Health', 'Details', 'Bank'].map((label, i) => {
              const stepNum = i + 1;
              const isActive = step === stepNum;
              const isPast = step > stepNum;
              return (
                <div key={i} className="flex flex-col items-center gap-2">
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-black transition-all duration-500 border-2 ${
                    isActive ? 'bg-primary text-white border-primary shadow-lg' : 
                    isPast ? 'bg-green-500 text-white border-green-500' : 'bg-white text-gray-300 border-gray-200'
                  }`}>
                    <span className="text-xs">{isPast ? '✓' : stepNum}</span>
                  </div>
                  <span className={`text-[9px] font-black uppercase tracking-widest ${isActive ? 'text-primary' : 'text-gray-400'}`}>{label}</span>
                </div>
              );
            })}
          </div>
          <div className="absolute top-4 left-0 w-full h-0.5 bg-gray-200 -z-0 rounded-full">
            <div className="h-full bg-primary transition-all duration-700 ease-in-out rounded-full" style={{ width: `${((step - 1) / 3) * 100}%` }}></div>
          </div>
        </div>

        {/* PERSISTENT PLAN SUMMARY BAR */}
        <div className="mb-8 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="flex items-center justify-between p-4 px-6">
            <div className="flex flex-col">
              <span className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Plan Selection</span>
              <div className="flex items-center gap-3">
                <h3 className="font-black text-gray-900">{selectedPlan.name}</h3>
                <button 
                  onClick={() => setIsChangingPlan(!isChangingPlan)}
                  className="text-[10px] font-black text-primary uppercase bg-primary/5 px-2 py-1 rounded hover:bg-primary/10 transition-colors"
                >
                  {isChangingPlan ? 'Close' : 'Change Plan'}
                </button>
              </div>
            </div>
            <div className="text-right">
              <span className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Monthly Total</span>
              <div className="flex items-baseline gap-1">
                <span className="text-xs font-black text-primary">R</span>
                <span className="text-2xl font-black text-primary tracking-tighter">{totalPrice}</span>
              </div>
            </div>
          </div>

          {/* Expanded Plan Switcher */}
          {isChangingPlan && (
            <div className="p-4 bg-gray-50/50 border-t border-gray-100 grid grid-cols-2 sm:grid-cols-3 gap-2 animate-fade-in">
              {PET_PLANS.map(plan => {
                const planPrice = formData.species === 'Dog' ? plan.priceDog : plan.priceCat;
                const isSelected = plan.id === localPlanId;
                return (
                  <button
                    key={plan.id}
                    onClick={() => {
                      setLocalPlanId(plan.id);
                      setIsChangingPlan(false);
                    }}
                    className={`p-3 rounded-xl text-left border-2 transition-all ${
                      isSelected ? 'border-primary bg-white shadow-md' : 'border-transparent bg-white/40 hover:bg-white hover:border-gray-200'
                    }`}
                  >
                    <div className="text-[10px] font-black text-gray-900 truncate mb-1">{plan.name}</div>
                    <div className="text-xs font-bold text-gray-500">R{planPrice.toFixed(0)}</div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        <div className="space-y-6">
          
          {/* Step 1: Identity */}
          {step === 1 && (
            <div className="bg-white rounded-[32px] p-6 md:p-8 shadow-xl border border-gray-100 animate-slide-up">
              <div className="flex items-center gap-3 mb-8 pb-4 border-b border-gray-50">
                <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-xl">👋</div>
                <div>
                  <h2 className="text-xl font-black text-gray-900">Pet Identity</h2>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Basic Information</p>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-5">
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">Name of Pet</label>
                  <input type="text" name="petName" value={formData.petName} onChange={handleChange} placeholder="What do you call them?" className="w-full bg-gray-50 border-2 border-transparent focus:border-primary/50 focus:bg-white rounded-xl px-5 py-3 outline-none transition-all font-bold text-sm" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">Species</label>
                  <div className="flex bg-gray-50 p-1 rounded-xl">
                    {['Dog', 'Cat'].map(s => (
                      <button key={s} onClick={() => handleToggle('species', s)} className={`flex-1 py-2.5 rounded-lg font-black text-xs transition-all ${formData.species === s ? 'bg-white text-primary shadow-sm' : 'text-gray-400'}`}>
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-8 flex justify-end">
                <button 
                  onClick={() => setStep(2)} 
                  disabled={!formData.petName}
                  className="bg-primary text-white px-8 py-3.5 rounded-xl font-black text-base shadow-lg hover:scale-105 transition-all disabled:opacity-50"
                >
                  Continue
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Health Questions */}
          {step === 2 && (
            <div className="bg-white rounded-[32px] p-6 md:p-8 shadow-xl border border-gray-100 animate-slide-up">
              <div className="flex items-center gap-3 mb-8 pb-4 border-b border-gray-50">
                <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-xl">🩺</div>
                <div>
                  <h2 className="text-xl font-black text-gray-900">Health Questions</h2>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">For {formData.petName}</p>
                </div>
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-black text-gray-800 block leading-snug">1. Has your pet suffered from any conditions in the last two years?</label>
                  <textarea name="healthCondition" value={formData.healthCondition} onChange={handleChange} placeholder="Conditions if any..." className="w-full bg-gray-50 border-2 border-transparent focus:border-primary/50 focus:bg-white rounded-xl px-5 py-3 outline-none transition-all font-bold text-sm min-h-[80px]"></textarea>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-gray-800 block leading-snug">2. Additional info about your pet’s health or behavior?</label>
                  <textarea name="additionalHealth" value={formData.additionalHealth} onChange={handleChange} placeholder="Anything else?" className="w-full bg-gray-50 border-2 border-transparent focus:border-primary/50 focus:bg-white rounded-xl px-5 py-3 outline-none transition-all font-bold text-sm min-h-[80px]"></textarea>
                </div>
                {[
                  { label: '3. Vaccinations up to date?', name: 'vaccinations' },
                  { label: '4. Ever used commercially?', name: 'commercial' },
                  { label: '5. Vet record permission?', name: 'vetPermission' }
                ].map(q => (
                  <div key={q.name} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                    <span className="text-xs font-black text-gray-800">{q.label}</span>
                    <div className="flex bg-white p-1 rounded-lg shadow-inner w-fit">
                      {['Yes', 'No'].map(v => (
                        <button key={v} onClick={() => handleToggle(q.name, v)} className={`px-6 py-1.5 rounded-md font-black text-[10px] transition-all ${formData[q.name] === v ? 'bg-primary text-white shadow-sm' : 'text-gray-400'}`}>{v}</button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 flex justify-between items-center">
                <button onClick={() => setStep(1)} className="text-gray-400 font-black uppercase text-[10px]">Back</button>
                <button onClick={() => setStep(3)} className="bg-primary text-white px-8 py-3.5 rounded-xl font-black text-base shadow-lg hover:scale-105 transition-transform">Next Step</button>
              </div>
            </div>
          )}

          {/* Step 3: Physical Details & Add-ons */}
          {step === 3 && (
            <div className="bg-white rounded-[32px] p-6 md:p-8 shadow-xl border border-gray-100 animate-slide-up">
              <div className="flex items-center gap-3 mb-8 pb-4 border-b border-gray-50">
                <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-xl">🐕</div>
                <div>
                  <h2 className="text-xl font-black text-gray-900">Physical Details</h2>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Completing {formData.petName}'s profile</p>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-x-5 gap-y-4 mb-8">
                <div className="space-y-1"><label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Gender</label>
                  <div className="flex bg-gray-50 p-1 rounded-xl">{['M', 'F'].map(g => (<button key={g} onClick={() => handleToggle('gender', g)} className={`flex-1 py-2 rounded-lg font-black text-xs transition-all ${formData.gender === g ? 'bg-white text-primary shadow-sm' : 'text-gray-400'}`}>{g === 'M' ? 'Male' : 'Female'}</button>))}</div>
                </div>
                <div className="space-y-1"><label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Breed</label><input type="text" name="breed" value={formData.breed} onChange={handleChange} placeholder="e.g. Bulldog" className="w-full bg-gray-50 border-2 border-transparent focus:border-primary/50 focus:bg-white rounded-xl px-4 py-2 font-bold text-sm" /></div>
                <div className="space-y-1"><label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Weight (kg)</label><input type="number" name="weight" value={formData.weight} onChange={handleChange} className="w-full bg-gray-50 border-2 border-transparent focus:border-primary/50 rounded-xl px-4 py-2 font-bold text-sm" /></div>
                <div className="space-y-1"><label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Colour</label><input type="text" name="colour" value={formData.colour} onChange={handleChange} className="w-full bg-gray-50 border-2 border-transparent focus:border-primary/50 rounded-xl px-4 py-2 font-bold text-sm" /></div>
                <div className="space-y-1"><label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Date of Birth</label><input type="date" name="dob" value={formData.dob} onChange={handleChange} className="w-full bg-gray-50 border-2 border-transparent focus:border-primary/50 rounded-xl px-4 py-2 font-bold text-sm" /></div>
                <div className="space-y-1"><label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Microchip No.</label><input type="text" name="chipNo" value={formData.chipNo} onChange={handleChange} className="w-full bg-gray-50 border-2 border-transparent focus:border-primary/50 rounded-xl px-4 py-2 font-bold text-sm font-mono" /></div>
                <div className="sm:col-span-2 space-y-1"><label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Contact Email</label><input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email for documents..." className="w-full bg-gray-50 border-2 border-transparent focus:border-primary/50 focus:bg-white rounded-xl px-4 py-2 font-bold text-sm" /></div>
              </div>

              {/* Routine Care Upsell */}
              <div className={`rounded-2xl border-2 transition-all p-5 mb-8 overflow-hidden relative ${formData.routineCare ? 'border-primary bg-primary/[0.02]' : 'border-gray-100 bg-gray-50/50'}`}>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">✨</span>
                    <h3 className="font-black text-gray-900 text-sm">Routine Care Add-on - valued at R1500 per year</h3>
                  </div>
                  <button 
                    onClick={() => handleToggle('routineCare', !formData.routineCare)}
                    className={`px-4 py-1.5 rounded-full text-[10px] font-black transition-all ${formData.routineCare ? 'bg-primary text-white shadow-lg' : 'bg-gray-200 text-gray-500'}`}
                  >
                    {formData.routineCare ? 'ADDED' : 'ADD + R85'}
                  </button>
                </div>
                
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {[
                    'Sterilisation', 'Vaccinations', 'De-worming', 
                    'Grooming', 'Tick/Flea Control', 'Anal Gland Exp',
                    'Dental Polish', 'Microchipping', 'Annual Checkup'
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-1.5">
                      <div className={`w-3 h-3 rounded-full flex items-center justify-center shrink-0 ${formData.routineCare ? 'bg-primary text-white' : 'bg-gray-300'}`}>
                        <svg className="w-2 h-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/></svg>
                      </div>
                      <span className="text-[9px] font-bold text-gray-600 truncate">{item}</span>
                    </div>
                  ))}
                </div>
                
                {formData.routineCare && (
                  <div className="mt-4 pt-3 border-t border-primary/10 flex justify-between items-center animate-fade-in">
                    <span className="text-[10px] font-black text-primary uppercase">Combined Premium:</span>
                    <span className="text-lg font-black text-gray-900">R{totalPrice}<span className="text-[10px] text-gray-400">/mo</span></span>
                  </div>
                )}
              </div>

              <div className="mt-8 flex justify-between items-center">
                <button onClick={() => setStep(2)} className="text-gray-400 font-black uppercase text-[10px]">Back</button>
                <button 
                  onClick={captureLead} 
                  disabled={!formData.email || !formData.dob || isCapturing}
                  className="bg-primary text-white px-8 py-3.5 rounded-xl font-black text-base shadow-lg hover:scale-105 transition-transform disabled:opacity-50 flex items-center gap-2"
                >
                  {isCapturing ? "Processing..." : "Continue to Bank"}
                </button>
              </div>
            </div>
          )}

          {/* Step 4: Banking */}
          {step === 4 && (
            <div className="bg-white rounded-[32px] p-6 md:p-8 shadow-xl border border-gray-100 animate-slide-up">
              <div className="flex items-center gap-3 mb-8 pb-4 border-b border-gray-50">
                <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-xl">🏦</div>
                <div>
                  <h2 className="text-xl font-black text-gray-900">Banking Setup</h2>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Final Step</p>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-5 mb-8">
                <div className="space-y-1"><label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Account Holder</label><input type="text" name="accHolder" value={formData.accHolder} onChange={handleChange} className="w-full bg-gray-50 border-2 border-transparent focus:border-primary/50 rounded-xl px-5 py-3 font-bold text-sm" /></div>
                <div className="space-y-1"><label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Account Number</label><input type="text" name="accNo" value={formData.accNo} onChange={handleChange} className="w-full bg-gray-50 border-2 border-transparent focus:border-primary/50 rounded-xl px-5 py-3 font-bold text-sm font-mono" /></div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Bank</label>
                  <select name="bank" value={formData.bank} onChange={handleChange} className="w-full bg-gray-50 border-2 border-transparent focus:border-primary/50 rounded-xl px-5 py-3 font-black text-sm">
                    <option>Standard Bank</option><option>ABSA</option><option>FNB</option><option>Nedbank</option><option>Other</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Debit Day</label>
                  <select name="debitDay" value={formData.debitDay} onChange={handleChange} className="w-full bg-gray-50 border-2 border-transparent focus:border-primary/50 rounded-xl px-5 py-3 font-black text-sm">
                    {[1, 5, 15, 25, 30].map(d => <option key={d} value={d}>{d}{d === 1 ? 'st' : d === 2 ? 'nd' : d === 3 ? 'rd' : 'th'}</option>)}
                  </select>
                </div>
              </div>

              <div className="bg-gray-900 rounded-2xl p-5 text-white mb-8 border border-primary/20">
                <div className="flex items-start gap-3">
                  <input type="checkbox" name="authorise" checked={formData.authorise} onChange={handleChange} className="mt-1 w-5 h-5 rounded border-gray-700 bg-gray-800 text-primary" />
                  <p className="text-[11px] font-bold leading-tight text-gray-300">
                    I authorise <span className="text-white">GENRIC Pet Insurance</span> to debit <span className="text-primary font-black text-sm">R{totalPrice}</span> for the {selectedPlan.name} plan {formData.routineCare && 'including Routine Care'}.
                  </p>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <button onClick={() => setStep(3)} className="text-gray-400 font-black uppercase text-[10px]">Back</button>
                <button 
                  disabled={!formData.authorise || !formData.accNo}
                  onClick={finalizeQuote}
                  className="bg-primary text-white px-10 py-4 rounded-xl font-black text-lg shadow-xl hover:scale-105 transition-all disabled:opacity-50"
                >
                  Finalize Authorization
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default QuotePage;

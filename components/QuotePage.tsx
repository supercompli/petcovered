
import React, { useState, useEffect } from 'react';
import { PET_PLANS } from '../constants';

const QuotePage: React.FC<{ onBack: () => void; selectedPlanId: string | null }> = ({ onBack, selectedPlanId }) => {
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
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
    // Banking
    accHolder: '',
    accNo: '',
    bank: 'FNB',
    accType: 'Cheque',
    deductionAmount: '',
    debitDay: '1',
    authorise: false
  });

  const selectedPlan = PET_PLANS.find(p => p.id === (selectedPlanId || 'comp-plus'));

  // Sync deduction amount with plan price initially
  useEffect(() => {
    if (selectedPlan && !formData.deductionAmount) {
      setFormData(prev => ({ 
        ...prev, 
        deductionAmount: (formData.species === 'Dog' ? selectedPlan.priceDog : selectedPlan.priceCat).toFixed(2)
      }));
    }
  }, [selectedPlan, formData.species]);

  // Age calculation
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

  const handleToggle = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const captureLead = () => {
    // Save lead to localStorage (Leads section in Admin)
    const existingLeads = JSON.parse(localStorage.getItem('petcovered_leads') || '[]');
    const newLead = {
      id: `LEAD-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
      submittedAt: new Date().toISOString(),
      petName: formData.petName,
      species: formData.species,
      breed: formData.breed,
      premium: `R${formData.deductionAmount}`,
      contactEmail: formData.email || 'N/A',
      details: formData,
      plan: selectedPlan?.name || 'Unknown'
    };
    
    localStorage.setItem('petcovered_leads', JSON.stringify([newLead, ...existingLeads]));
    
    // Webhook Simulation
    const webhookSettings = JSON.parse(localStorage.getItem('petcovered_webhook') || '{"enabled": false}');
    if (webhookSettings.enabled && webhookSettings.url) {
      console.log(`[OUTBOUND WEBHOOK] Type: ${webhookSettings.format}, URL: ${webhookSettings.url}`, newLead);
    }
    
    setStep(4);
    window.scrollTo(0, 0);
  };

  const finalizeQuote = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    window.scrollTo(0, 0);
  };

  if (submitted) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center p-4 animate-fade-in">
        <div className="w-24 h-24 bg-green-500 text-white rounded-full flex items-center justify-center text-5xl mb-8 shadow-2xl animate-bounce">✓</div>
        <h2 className="text-4xl font-black text-gray-900 mb-4">Finalized & Secure</h2>
        <p className="text-gray-600 max-w-md mb-10 text-lg">
          Your banking authorization for {selectedPlan?.name} is successful. Our underwriters at GENRIC will issue your policy document within 24 hours.
        </p>
        <button onClick={() => window.location.hash = 'home'} className="bg-primary text-white px-12 py-4 rounded-2xl font-black shadow-xl">Return to Home</button>
      </div>
    );
  }

  return (
    <div className="animate-fade-in bg-gray-50 min-h-screen py-12 md:py-20">
      <div className="max-w-4xl mx-auto px-4">
        
        {/* Modern Stepper */}
        <div className="mb-12 relative">
          <div className="flex justify-between items-center relative z-10">
            {['Start', 'Health', 'Details', 'Banking'].map((label, i) => {
              const stepNum = i + 1;
              const isActive = step === stepNum;
              const isPast = step > stepNum;
              return (
                <div key={i} className="flex flex-col items-center gap-3">
                  <div className={`w-10 h-10 md:w-12 md:h-12 rounded-2xl flex items-center justify-center font-black transition-all duration-500 border-4 ${
                    isActive ? 'bg-primary text-white border-primary shadow-xl scale-110' : 
                    isPast ? 'bg-green-500 text-white border-green-500' : 'bg-white text-gray-300 border-gray-200'
                  }`}>
                    {isPast ? '✓' : stepNum}
                  </div>
                  <span className={`text-[10px] font-black uppercase tracking-widest ${isActive ? 'text-primary' : 'text-gray-400'}`}>{label}</span>
                </div>
              );
            })}
          </div>
          <div className="absolute top-5 md:top-6 left-0 w-full h-1 bg-gray-200 -z-0 rounded-full">
            <div className="h-full bg-primary transition-all duration-700 ease-in-out rounded-full" style={{ width: `${((step - 1) / 3) * 100}%` }}></div>
          </div>
        </div>

        <div className="space-y-8">
          
          {/* Step 1: Identity & Plan Reflect */}
          {step === 1 && (
            <div className="bg-white rounded-[40px] p-8 md:p-12 shadow-2xl border border-gray-100 animate-slide-up">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 pb-6 border-b border-gray-50">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center text-3xl">👋</div>
                  <div>
                    <h2 className="text-2xl font-black text-gray-900">Let's Get Started</h2>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Initial Selection</p>
                  </div>
                </div>
                <div className="bg-primary/[0.03] border border-primary/10 px-6 py-3 rounded-2xl flex flex-col items-end">
                   <span className="text-[9px] font-black text-primary uppercase tracking-[0.2em]">Selected Plan</span>
                   <span className="text-lg font-black text-gray-900">{selectedPlan?.name}</span>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-1">
                  <label className="text-[11px] font-black uppercase text-gray-400 tracking-widest ml-1">Name of Pet</label>
                  <input type="text" name="petName" value={formData.petName} onChange={handleChange} placeholder="What do you call them?" className="w-full bg-gray-50 border-2 border-transparent focus:border-primary/50 focus:bg-white rounded-2xl px-6 py-4 outline-none transition-all font-bold" />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-black uppercase text-gray-400 tracking-widest ml-1">Species</label>
                  <div className="flex bg-gray-50 p-1 rounded-2xl">
                    {['Dog', 'Cat'].map(s => (
                      <button key={s} onClick={() => handleToggle('species', s)} className={`flex-1 py-3 rounded-xl font-black text-sm transition-all ${formData.species === s ? 'bg-white text-primary shadow-md' : 'text-gray-400'}`}>
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-12 flex justify-end">
                <button 
                  onClick={() => setStep(2)} 
                  disabled={!formData.petName}
                  className="bg-primary text-white px-12 py-5 rounded-3xl font-black text-lg shadow-xl hover:scale-105 transition-all disabled:opacity-50"
                >
                  Continue to Health Questions
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Questions */}
          {step === 2 && (
            <div className="bg-white rounded-[40px] p-8 md:p-12 shadow-2xl border border-gray-100 animate-slide-up">
              <div className="flex items-center gap-4 mb-10 pb-6 border-b border-gray-50">
                <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center text-3xl">🩺</div>
                <div>
                  <h2 className="text-2xl font-black text-gray-900">Health Questions</h2>
                  <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">For {formData.petName}</p>
                </div>
              </div>

              <div className="space-y-8">
                <div className="space-y-3">
                  <label className="text-sm font-black text-gray-800 block">1. Has your pet suffered from any conditions in the last two years?</label>
                  <textarea name="healthCondition" value={formData.healthCondition} onChange={handleChange} placeholder="Please list the conditions if any..." className="w-full bg-gray-50 border-2 border-transparent focus:border-primary/50 focus:bg-white rounded-2xl px-6 py-4 outline-none transition-all font-bold min-h-[100px]"></textarea>
                </div>
                <div className="space-y-3">
                  <label className="text-sm font-black text-gray-800 block">2. Please provide any additional information about your pet’s health, physical condition or behaviour.</label>
                  <textarea name="additionalHealth" value={formData.additionalHealth} onChange={handleChange} placeholder="Anything else we should know?" className="w-full bg-gray-50 border-2 border-transparent focus:border-primary/50 focus:bg-white rounded-2xl px-6 py-4 outline-none transition-all font-bold min-h-[100px]"></textarea>
                </div>
                {[
                  { label: '3. Are vaccinations up to date?', name: 'vaccinations' },
                  { label: '4. Ever used for commercial purposes?', name: 'commercial' },
                  { label: '5. Permission to ask Vet for records?', name: 'vetPermission' }
                ].map(q => (
                  <div key={q.name} className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 bg-gray-50 rounded-3xl border border-gray-100">
                    <span className="text-sm font-black text-gray-800">{q.label}</span>
                    <div className="flex bg-white p-1 rounded-xl shadow-inner w-fit">
                      {['Yes', 'No'].map(v => (
                        <button key={v} onClick={() => handleToggle(q.name, v)} className={`px-10 py-2 rounded-lg font-black text-xs transition-all ${formData[q.name] === v ? 'bg-primary text-white shadow-md' : 'text-gray-400'}`}>{v}</button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-12 flex justify-between items-center">
                <button onClick={() => setStep(1)} className="text-gray-400 font-black uppercase text-xs">Back</button>
                <button onClick={() => setStep(3)} className="bg-primary text-white px-12 py-5 rounded-3xl font-black text-lg shadow-xl hover:scale-105 transition-transform">Next: Pet Details</button>
              </div>
            </div>
          )}

          {/* Step 3: Details & Lead Capture */}
          {step === 3 && (
            <div className="bg-white rounded-[40px] p-8 md:p-12 shadow-2xl border border-gray-100 animate-slide-up">
              <div className="flex items-center gap-4 mb-10 pb-6 border-b border-gray-50">
                <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center text-3xl">🐕</div>
                <div>
                  <h2 className="text-2xl font-black text-gray-900">Physical Details</h2>
                  <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Finalizing the profile for {formData.petName}</p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-1"><label className="text-[11px] font-black uppercase text-gray-400 tracking-widest">Gender</label>
                  <div className="flex bg-gray-50 p-1 rounded-2xl">{['M', 'F'].map(g => (<button key={g} onClick={() => handleToggle('gender', g)} className={`flex-1 py-3 rounded-xl font-black text-sm transition-all ${formData.gender === g ? 'bg-white text-primary shadow-md' : 'text-gray-400'}`}>{g === 'M' ? 'Male' : 'Female'}</button>))}</div>
                </div>
                <div className="space-y-1"><label className="text-[11px] font-black uppercase text-gray-400 tracking-widest">Breed</label><input type="text" name="breed" value={formData.breed} onChange={handleChange} placeholder="e.g. Bulldog" className="w-full bg-gray-50 border-2 border-transparent focus:border-primary/50 focus:bg-white rounded-2xl px-6 py-4 font-bold" /></div>
                <div className="space-y-1"><label className="text-[11px] font-black uppercase text-gray-400 tracking-widest">Weight (kg)</label><input type="number" name="weight" value={formData.weight} onChange={handleChange} className="w-full bg-gray-50 border-2 border-transparent focus:border-primary/50 rounded-2xl px-6 py-4 font-bold" /></div>
                <div className="space-y-1"><label className="text-[11px] font-black uppercase text-gray-400 tracking-widest">Colour</label><input type="text" name="colour" value={formData.colour} onChange={handleChange} className="w-full bg-gray-50 border-2 border-transparent focus:border-primary/50 rounded-2xl px-6 py-4 font-bold" /></div>
                <div className="space-y-1"><label className="text-[11px] font-black uppercase text-gray-400 tracking-widest">Date of Birth</label><input type="date" name="dob" value={formData.dob} onChange={handleChange} className="w-full bg-gray-50 border-2 border-transparent focus:border-primary/50 rounded-2xl px-6 py-4 font-bold" /></div>
                <div className="space-y-1"><label className="text-[11px] font-black uppercase text-gray-400 tracking-widest">Microchip No. (Optional)</label><input type="text" name="chipNo" value={formData.chipNo} onChange={handleChange} className="w-full bg-gray-50 border-2 border-transparent focus:border-primary/50 rounded-2xl px-6 py-4 font-bold font-mono" /></div>
                <div className="md:col-span-2 space-y-1"><label className="text-[11px] font-black uppercase text-gray-400 tracking-widest">Your Contact Email</label><input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Where should we send your docs?" className="w-full bg-gray-50 border-2 border-transparent focus:border-primary/50 focus:bg-white rounded-2xl px-6 py-4 font-bold" /></div>
              </div>

              <div className="mt-12 flex justify-between items-center">
                <button onClick={() => setStep(2)} className="text-gray-400 font-black uppercase text-xs">Back</button>
                <button 
                  onClick={captureLead} 
                  disabled={!formData.email || !formData.dob}
                  className="bg-primary text-white px-12 py-5 rounded-3xl font-black text-lg shadow-xl hover:scale-105 transition-transform disabled:opacity-50"
                >
                  Capture Quote & Proceed
                </button>
              </div>
            </div>
          )}

          {/* Step 4: Banking */}
          {step === 4 && (
            <div className="bg-white rounded-[40px] p-8 md:p-12 shadow-2xl border border-gray-100 animate-slide-up">
              <div className="flex items-center gap-4 mb-10 pb-6 border-b border-gray-50">
                <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center text-3xl">🏦</div>
                <div>
                  <h2 className="text-2xl font-black text-gray-900">Banking Details</h2>
                  <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Final Step for {selectedPlan?.name}</p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-8 mb-10">
                <div className="space-y-1"><label className="text-[11px] font-black uppercase text-gray-400 tracking-widest">Account Holder</label><input type="text" name="accHolder" value={formData.accHolder} onChange={handleChange} className="w-full bg-gray-50 border-2 border-transparent focus:border-primary/50 rounded-2xl px-6 py-4 font-bold" /></div>
                <div className="space-y-1"><label className="text-[11px] font-black uppercase text-gray-400 tracking-widest">Account Number</label><input type="text" name="accNo" value={formData.accNo} onChange={handleChange} className="w-full bg-gray-50 border-2 border-transparent focus:border-primary/50 rounded-2xl px-6 py-4 font-bold font-mono" /></div>
                <div className="space-y-1">
                  <label className="text-[11px] font-black uppercase text-gray-400 tracking-widest">Bank</label>
                  <select name="bank" value={formData.bank} onChange={handleChange} className="w-full bg-gray-50 border-2 border-transparent focus:border-primary/50 rounded-2xl px-6 py-4 font-black">
                    <option>Standard Bank</option><option>ABSA</option><option>FNB</option><option>Nedbank</option><option>Other</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-black uppercase text-gray-400 tracking-widest">Debit Day</label>
                  <select name="debitDay" value={formData.debitDay} onChange={handleChange} className="w-full bg-gray-50 border-2 border-transparent focus:border-primary/50 rounded-2xl px-6 py-4 font-black">
                    {[1, 5, 15, 25, 30].map(d => <option key={d} value={d}>{d}{d === 1 ? 'st' : d === 2 ? 'nd' : d === 3 ? 'rd' : 'th'} of month</option>)}
                  </select>
                </div>
              </div>

              <div className="bg-gray-900 rounded-[32px] p-8 text-white mb-10 shadow-2xl border-2 border-primary/20">
                <div className="flex items-start gap-4 mb-6">
                  <input type="checkbox" name="authorise" checked={formData.authorise} onChange={handleChange} className="mt-1 w-6 h-6 rounded border-gray-700 bg-gray-800 text-primary" />
                  <p className="text-xs font-bold leading-relaxed text-gray-300">
                    I hereby authorise <span className="text-white">GENRIC Pet Insurance</span> to draw from my account the premium of <span className="text-primary font-black">R{formData.deductionAmount}</span> for the <span className="text-primary font-black">{selectedPlan?.name}</span> plan, inclusive of VAT.
                  </p>
                </div>
                <p className="text-[10px] text-gray-500 italic">If a pet is accepted for cover on standard terms, we will issue the policy and proceed with the debit. Otherwise, we will contact you for permission.</p>
              </div>

              <div className="flex justify-between items-center">
                <button onClick={() => setStep(3)} className="text-gray-400 font-black uppercase text-xs">Back</button>
                <button 
                  disabled={!formData.authorise || !formData.accNo}
                  onClick={finalizeQuote}
                  className="bg-primary text-white px-16 py-6 rounded-[28px] font-black text-xl shadow-2xl hover:scale-105 transition-all disabled:opacity-50 disabled:scale-100"
                >
                  Finalize My Quote
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

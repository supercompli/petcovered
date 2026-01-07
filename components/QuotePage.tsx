
import React, { useState, useEffect } from 'react';

const QuotePage: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    // Step 1: Profile
    petName: '',
    gender: 'M',
    species: 'Dog',
    colour: '',
    weight: '',
    dob: '',
    age: '',
    chipNo: '',
    breed: '',
    email: '',
    // Step 2: Questions
    healthCondition: '',
    additionalHealth: '',
    vaccinations: 'Yes',
    commercial: 'No',
    commercialExplain: '',
    vetPermission: 'Yes',
    // Step 3: Banking
    accHolder: '',
    accNo: '',
    bank: 'FNB',
    accType: 'Cheque',
    deductionAmount: '',
    debitDay: '1',
    authorise: false
  });

  // Calculate age when DOB changes
  useEffect(() => {
    if (formData.dob) {
      const birthDate = new Date(formData.dob);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const m = today.getMonth() - birthDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Save lead to localStorage
    const existingLeads = JSON.parse(localStorage.getItem('petcovered_leads') || '[]');
    const newLead = {
      id: `LEAD-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
      submittedAt: new Date().toISOString(),
      petName: formData.petName,
      species: formData.species,
      breed: formData.breed,
      premium: `R${formData.deductionAmount}`,
      contactEmail: formData.email || 'N/A',
      details: formData
    };
    
    localStorage.setItem('petcovered_leads', JSON.stringify([newLead, ...existingLeads]));
    
    // Simulate Webhook dispatch
    const webhookSettings = JSON.parse(localStorage.getItem('petcovered_webhook') || '{"enabled": false}');
    if (webhookSettings.enabled && webhookSettings.url) {
      console.log(`[OUTBOUND WEBHOOK] Type: ${webhookSettings.format}, URL: ${webhookSettings.url}`, newLead);
    }

    setSubmitted(true);
    window.scrollTo(0, 0);
  };

  if (submitted) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center p-4 animate-fade-in">
        <div className="w-24 h-24 bg-green-500 text-white rounded-full flex items-center justify-center text-5xl mb-8 shadow-2xl animate-bounce">
          ✓
        </div>
        <h2 className="text-4xl font-black text-gray-900 mb-4">Quote Successfully Submitted</h2>
        <p className="text-gray-600 max-w-md mb-10 text-lg">
          Thank you, {formData.accHolder || 'there'}! Your details have been sent to our underwriters at GENRIC. A consultant will be in touch within 24 hours.
        </p>
        <button 
          onClick={() => window.location.hash = 'home'}
          className="bg-primary text-white px-12 py-4 rounded-2xl font-black shadow-xl hover:scale-105 transition-transform"
        >
          Return to Home
        </button>
      </div>
    );
  }

  return (
    <div className="animate-fade-in bg-gray-50 min-h-screen py-12 md:py-20">
      <div className="max-w-4xl mx-auto px-4">
        
        {/* Modern Stepper */}
        <div className="mb-12 relative">
          <div className="flex justify-between items-center relative z-10">
            {['Pet Profile', 'Pet Health', 'Banking'].map((label, i) => {
              const stepNum = i + 1;
              const isActive = step === stepNum;
              const isPast = step > stepNum;
              return (
                <div key={i} className="flex flex-col items-center gap-3">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black transition-all duration-500 border-4 ${
                    isActive ? 'bg-primary text-white border-primary shadow-xl scale-110' : 
                    isPast ? 'bg-green-500 text-white border-green-500' : 'bg-white text-gray-300 border-gray-200'
                  }`}>
                    {isPast ? '✓' : stepNum}
                  </div>
                  <span className={`text-[10px] font-black uppercase tracking-widest ${isActive ? 'text-primary' : 'text-gray-400'}`}>
                    {label}
                  </span>
                </div>
              );
            })}
          </div>
          <div className="absolute top-6 left-0 w-full h-1 bg-gray-200 -z-0 rounded-full">
            <div 
              className="h-full bg-primary transition-all duration-700 ease-in-out rounded-full"
              style={{ width: `${((step - 1) / 2) * 100}%` }}
            ></div>
          </div>
        </div>

        <div className="space-y-8">
          
          {/* Step 1: Pet Profile */}
          {step === 1 && (
            <div className="bg-white rounded-[40px] p-8 md:p-12 shadow-2xl shadow-primary/5 border border-gray-100 animate-slide-up">
              <div className="flex items-center gap-4 mb-10 pb-6 border-b border-gray-50">
                <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center text-3xl">🐾</div>
                <div>
                  <h2 className="text-2xl font-black text-gray-900">Pet Profile</h2>
                  <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">The furry details</p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-1">
                  <label className="text-[11px] font-black uppercase text-gray-400 tracking-widest ml-1">Name of Pet</label>
                  <input type="text" name="petName" value={formData.petName} onChange={handleChange} placeholder="e.g. Bella" className="w-full bg-gray-50 border-2 border-transparent focus:border-primary/50 focus:bg-white rounded-2xl px-6 py-4 outline-none transition-all font-bold" />
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
                <div className="space-y-1">
                  <label className="text-[11px] font-black uppercase text-gray-400 tracking-widest ml-1">Gender</label>
                  <div className="flex bg-gray-50 p-1 rounded-2xl">
                    {['M', 'F'].map(g => (
                      <button key={g} onClick={() => handleToggle('gender', g)} className={`flex-1 py-3 rounded-xl font-black text-sm transition-all ${formData.gender === g ? 'bg-white text-primary shadow-md' : 'text-gray-400'}`}>
                        {g === 'M' ? 'Male' : 'Female'}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-black uppercase text-gray-400 tracking-widest ml-1">Breed</label>
                  <input type="text" name="breed" value={formData.breed} onChange={handleChange} placeholder="e.g. German Shepherd" className="w-full bg-gray-50 border-2 border-transparent focus:border-primary/50 focus:bg-white rounded-2xl px-6 py-4 outline-none transition-all font-bold" />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-black uppercase text-gray-400 tracking-widest ml-1">Colour</label>
                  <input type="text" name="colour" value={formData.colour} onChange={handleChange} placeholder="e.g. Brindle" className="w-full bg-gray-50 border-2 border-transparent focus:border-primary/50 focus:bg-white rounded-2xl px-6 py-4 outline-none transition-all font-bold" />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-black uppercase text-gray-400 tracking-widest ml-1">Weight (kg)</label>
                  <input type="number" name="weight" value={formData.weight} onChange={handleChange} placeholder="Approximate weight" className="w-full bg-gray-50 border-2 border-transparent focus:border-primary/50 focus:bg-white rounded-2xl px-6 py-4 outline-none transition-all font-bold" />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-black uppercase text-gray-400 tracking-widest ml-1">Date of Birth</label>
                  <input type="date" name="dob" value={formData.dob} onChange={handleChange} className="w-full bg-gray-50 border-2 border-transparent focus:border-primary/50 focus:bg-white rounded-2xl px-6 py-4 outline-none transition-all font-bold" />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-black uppercase text-gray-400 tracking-widest ml-1">Age (Full Years)</label>
                  <div className="w-full bg-gray-100 border-2 border-transparent rounded-2xl px-6 py-4 font-black text-gray-500 cursor-not-allowed">
                    {formData.age ? `${formData.age} Years Old` : 'Select DOB first'}
                  </div>
                </div>
                <div className="space-y-1 md:col-span-2">
                  <label className="text-[11px] font-black uppercase text-gray-400 tracking-widest ml-1">Microchip No. (Optional)</label>
                  <input type="text" name="chipNo" value={formData.chipNo} onChange={handleChange} placeholder="15-digit microchip number" className="w-full bg-gray-50 border-2 border-transparent focus:border-primary/50 focus:bg-white rounded-2xl px-6 py-4 outline-none transition-all font-bold font-mono" />
                </div>
                <div className="space-y-1 md:col-span-2">
                  <label className="text-[11px] font-black uppercase text-gray-400 tracking-widest ml-1">Owner Contact Email</label>
                  <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="For quote delivery" className="w-full bg-gray-50 border-2 border-transparent focus:border-primary/50 focus:bg-white rounded-2xl px-6 py-4 outline-none transition-all font-bold" />
                </div>
              </div>
              <div className="mt-12 flex justify-end">
                <button 
                  onClick={() => setStep(2)} 
                  disabled={!formData.petName || !formData.email}
                  className="bg-primary text-white px-12 py-5 rounded-3xl font-black text-lg shadow-xl hover:scale-105 transition-all disabled:opacity-50 disabled:scale-100"
                >
                  Next: Pet Health
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Health History */}
          {step === 2 && (
            <div className="bg-white rounded-[40px] p-8 md:p-12 shadow-2xl border border-gray-100 animate-slide-up">
              <div className="flex items-center gap-4 mb-10 pb-6 border-b border-gray-50">
                <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center text-3xl">🩺</div>
                <div>
                  <h2 className="text-2xl font-black text-gray-900">Pet Health History</h2>
                  <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">GENRIC Medical Questionnaire</p>
                </div>
              </div>

              <div className="space-y-8">
                <div className="space-y-3">
                  <label className="text-sm font-black text-gray-800 block">1. Has your pet suffered from any conditions in the last two years?</label>
                  <textarea name="healthCondition" value={formData.healthCondition} onChange={handleChange} placeholder="Please list the conditions if any..." className="w-full bg-gray-50 border-2 border-transparent focus:border-primary/50 focus:bg-white rounded-2xl px-6 py-4 outline-none transition-all font-bold min-h-[100px]"></textarea>
                </div>

                <div className="space-y-3">
                  <label className="text-sm font-black text-gray-800 block">2. Please provide any additional information about your pet’s health, physical condition or behaviour.</label>
                  <textarea name="additionalHealth" value={formData.additionalHealth} onChange={handleChange} placeholder="e.g. Special diet, allergies..." className="w-full bg-gray-50 border-2 border-transparent focus:border-primary/50 focus:bg-white rounded-2xl px-6 py-4 outline-none transition-all font-bold min-h-[100px]"></textarea>
                </div>

                {[
                  { label: '3. Are your pet’s vaccinations up to date?', name: 'vaccinations' },
                  { label: '4. Has your pet ever been used for commercial purposes?', name: 'commercial' },
                  { label: '5. Permission to ask your Vet for medical records?', name: 'vetPermission' }
                ].map(q => (
                  <div key={q.name} className="flex flex-col md:flex-row md:items-center justify-between gap-6 p-6 bg-gray-50 rounded-3xl border border-gray-100">
                    <span className="text-sm font-black text-gray-800 max-w-md">{q.label}</span>
                    <div className="flex bg-white p-1 rounded-xl shadow-inner w-fit">
                      {['Yes', 'No'].map(v => (
                        <button key={v} onClick={() => handleToggle(q.name, v)} className={`px-10 py-2 rounded-lg font-black text-xs transition-all ${formData[q.name] === v ? 'bg-primary text-white shadow-md' : 'text-gray-400'}`}>
                          {v}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}

                {formData.commercial === 'Yes' && (
                  <div className="space-y-3 animate-slide-up bg-amber-50 p-6 rounded-3xl border border-amber-100">
                    <label className="text-sm font-black text-amber-900 block">Please explain commercial use</label>
                    <textarea name="commercialExplain" value={formData.commercialExplain} onChange={handleChange} placeholder="e.g. Breeding, security, tracking..." className="w-full bg-white border-2 border-amber-200 focus:border-primary rounded-2xl px-6 py-4 outline-none font-bold min-h-[100px]"></textarea>
                  </div>
                )}
              </div>
              
              <div className="mt-12 flex justify-between items-center">
                <button onClick={() => setStep(1)} className="text-gray-400 font-black uppercase text-xs hover:text-primary transition-colors">Previous Step</button>
                <button onClick={() => setStep(3)} className="bg-primary text-white px-12 py-5 rounded-3xl font-black text-lg shadow-xl hover:scale-105 transition-transform">
                  Next: Banking Details
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Banking Details */}
          {step === 3 && (
            <div className="bg-white rounded-[40px] p-8 md:p-12 shadow-2xl border border-gray-100 animate-slide-up">
              <div className="flex items-center gap-4 mb-10 pb-6 border-b border-gray-50">
                <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center text-3xl">🏦</div>
                <div>
                  <h2 className="text-2xl font-black text-gray-900">Banking Details</h2>
                  <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Secure Payment Authorization</p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-8 mb-10">
                <div className="space-y-1">
                  <label className="text-[11px] font-black uppercase text-gray-400 tracking-widest ml-1">Name of Account Holder</label>
                  <input type="text" name="accHolder" value={formData.accHolder} onChange={handleChange} className="w-full bg-gray-50 border-2 border-transparent focus:border-primary/50 focus:bg-white rounded-2xl px-6 py-4 outline-none transition-all font-bold" />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-black uppercase text-gray-400 tracking-widest ml-1">Account No.</label>
                  <input type="text" name="accNo" value={formData.accNo} onChange={handleChange} className="w-full bg-gray-50 border-2 border-transparent focus:border-primary/50 focus:bg-white rounded-2xl px-6 py-4 outline-none transition-all font-bold font-mono" />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-black uppercase text-gray-400 tracking-widest ml-1">Bank</label>
                  <select name="bank" value={formData.bank} onChange={handleChange} className="w-full bg-gray-50 border-2 border-transparent focus:border-primary/50 focus:bg-white rounded-2xl px-6 py-4 outline-none transition-all font-black">
                    <option>Standard Bank</option><option>ABSA</option><option>FNB</option><option>Nedbank</option><option>Other</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-black uppercase text-gray-400 tracking-widest ml-1">Account Type</label>
                  <select name="accType" value={formData.accType} onChange={handleChange} className="w-full bg-gray-50 border-2 border-transparent focus:border-primary/50 focus:bg-white rounded-2xl px-6 py-4 outline-none transition-all font-black">
                    <option>Cheque</option><option>Savings</option><option>Transmission</option><option>Other</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-black uppercase text-gray-400 tracking-widest ml-1">Deduction Amount (R)</label>
                  <div className="relative">
                    <span className="absolute left-6 top-1/2 -translate-y-1/2 font-black text-gray-400">R</span>
                    <input type="number" name="deductionAmount" value={formData.deductionAmount} onChange={handleChange} placeholder="0.00" className="w-full bg-gray-50 border-2 border-transparent focus:border-primary/50 focus:bg-white rounded-2xl px-12 py-4 outline-none transition-all font-black" />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-black uppercase text-gray-400 tracking-widest ml-1">Debit Day</label>
                  <select name="debitDay" value={formData.debitDay} onChange={handleChange} className="w-full bg-gray-50 border-2 border-transparent focus:border-primary/50 focus:bg-white rounded-2xl px-6 py-4 outline-none transition-all font-black">
                    {[1, 5, 15, 25, 30].map(d => <option key={d} value={d}>{d}{d === 1 ? 'st' : d === 2 ? 'nd' : d === 3 ? 'rd' : 'th'} of month</option>)}
                  </select>
                </div>
              </div>

              <div className="bg-gray-900 rounded-[32px] p-8 text-white mb-10 border-4 border-primary/20 shadow-2xl">
                <div className="flex items-start gap-4 mb-6">
                  <input 
                    type="checkbox" 
                    name="authorise" 
                    checked={formData.authorise} 
                    onChange={handleChange} 
                    className="mt-1 w-6 h-6 rounded border-gray-700 bg-gray-800 text-primary focus:ring-primary cursor-pointer" 
                  />
                  <p className="text-xs font-bold leading-relaxed text-gray-300">
                    I hereby authorise <span className="text-white">GENRIC Pet Insurance</span> to draw from my account the premium due in terms of the cover I have chosen, inclusive of VAT at the ruling rate.
                  </p>
                </div>
                <p className="text-[10px] text-gray-500 italic leading-relaxed">
                  If a pet is accepted for cover on standard terms and conditions, we will issue the policy and proceed with the debit as indicated. However, if we apply special terms and conditions, we will first inform you thereof and ask your permission to proceed with issuing the policy and debit your account subject thereto.
                </p>
              </div>

              <div className="flex justify-between items-center">
                <button onClick={() => setStep(2)} className="text-gray-400 font-black uppercase text-xs hover:text-primary transition-colors">Previous Step</button>
                <button 
                  disabled={!formData.authorise || !formData.accNo || !formData.deductionAmount}
                  onClick={handleSubmit}
                  className="bg-primary text-white px-16 py-6 rounded-[28px] font-black text-xl shadow-2xl shadow-primary/30 hover:scale-105 transition-all transform disabled:opacity-50 disabled:scale-100 disabled:shadow-none"
                >
                  Finalize Quote
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

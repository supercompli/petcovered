
import React, { useState, useEffect } from 'react';

const QuotePage: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    petName: '',
    gender: 'M',
    species: 'Dog',
    colour: '',
    weight: '',
    dob: '',
    age: '',
    chipNo: '',
    breed: '',
    healthCondition: '',
    additionalHealth: '',
    vaccinations: 'Yes',
    commercial: 'No',
    commercialExplain: '',
    vetPermission: 'Yes',
    accHolder: '',
    accNo: '',
    bank: 'FNB',
    accType: 'Cheque',
    deductionAmount: '',
    debitDay: '1',
    authorise: false,
    email: '' // Added for admin lead visibility
  });

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
    
    // Save to leads in localStorage
    const existingLeads = JSON.parse(localStorage.getItem('petcovered_leads') || '[]');
    const newLead = {
      id: Math.random().toString(36).substr(2, 9),
      submittedAt: new Date().toISOString(),
      petName: formData.petName,
      species: formData.species,
      breed: formData.breed,
      premium: `R${formData.deductionAmount}`,
      contactEmail: formData.email || 'N/A',
      details: formData
    };
    
    localStorage.setItem('petcovered_leads', JSON.stringify([newLead, ...existingLeads]));
    
    // Trigger "Webhook" simulation
    const webhookSettings = JSON.parse(localStorage.getItem('petcovered_webhook') || '{"enabled": false}');
    if (webhookSettings.enabled && webhookSettings.url) {
      console.log(`[Simulated Webhook] Sending to ${webhookSettings.url} in ${webhookSettings.format} format`, newLead);
    }

    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center p-4 animate-fade-in">
        <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-5xl mb-8 animate-bounce">
          ✓
        </div>
        <h2 className="text-4xl font-black text-gray-900 mb-4">Quote Submitted!</h2>
        <p className="text-gray-600 max-w-md mb-10">
          Thank you for choosing Petcovered®. One of our consultants will review your details and contact you shortly.
        </p>
        <button 
          onClick={() => window.location.hash = 'home'}
          className="bg-primary text-white px-10 py-4 rounded-2xl font-bold shadow-xl"
        >
          Return Home
        </button>
      </div>
    );
  }

  return (
    <div className="animate-fade-in bg-gray-50 min-h-screen py-12 md:py-20">
      <div className="max-w-4xl mx-auto px-4">
        
        {/* Progress Bar */}
        <div className="mb-12">
          <div className="flex justify-between mb-4">
            {['Pet Profile', 'Medical History', 'Banking'].map((label, i) => (
              <div key={i} className={`flex flex-col items-center gap-2 transition-all ${step >= i + 1 ? 'text-primary' : 'text-gray-300'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-xs ${step >= i + 1 ? 'bg-primary text-white' : 'bg-gray-200 text-gray-400'}`}>
                  {i + 1}
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest">{label}</span>
              </div>
            ))}
          </div>
          <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-primary transition-all duration-500"
              style={{ width: `${(step / 3) * 100}%` }}
            ></div>
          </div>
        </div>

        <div className="space-y-8">
          
          {/* Step 1: Pet Profile */}
          {step === 1 && (
            <div className="bg-white rounded-[40px] p-8 md:p-12 shadow-xl border border-gray-100 animate-slide-up">
              <div className="flex items-center gap-4 mb-10 pb-6 border-b border-gray-50">
                <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-2xl">🐾</div>
                <h2 className="text-2xl font-black text-gray-900">Pet Profile</h2>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-1">
                  <label className="text-[11px] font-black uppercase text-gray-400 tracking-widest ml-1">Name of Pet</label>
                  <input type="text" name="petName" value={formData.petName} onChange={handleChange} placeholder="e.g. Bella" className="w-full bg-gray-50 border-2 border-transparent focus:border-primary/50 focus:bg-white rounded-2xl px-6 py-4 outline-none transition-all font-bold" />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-black uppercase text-gray-400 tracking-widest ml-1">Your Email</label>
                  <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="owner@email.com" className="w-full bg-gray-50 border-2 border-transparent focus:border-primary/50 focus:bg-white rounded-2xl px-6 py-4 outline-none transition-all font-bold" />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-black uppercase text-gray-400 tracking-widest ml-1">Species</label>
                  <div className="flex bg-gray-50 p-1 rounded-2xl">
                    {['Dog', 'Cat'].map(s => (
                      <button key={s} onClick={() => handleToggle('species', s)} className={`flex-1 py-3 rounded-xl font-black text-sm transition-all ${formData.species === s ? 'bg-white text-primary shadow-md' : 'text-gray-400'}`}>
                        {s === 'Dog' ? '🐕 Dog' : '🐈 Cat'}
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
                  <input type="text" name="breed" value={formData.breed} onChange={handleChange} placeholder="e.g. Bulldog" className="w-full bg-gray-50 border-2 border-transparent focus:border-primary/50 focus:bg-white rounded-2xl px-6 py-4 outline-none transition-all font-bold" />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-black uppercase text-gray-400 tracking-widest ml-1">Date of Birth</label>
                  <input type="date" name="dob" value={formData.dob} onChange={handleChange} className="w-full bg-gray-50 border-2 border-transparent focus:border-primary/50 focus:bg-white rounded-2xl px-6 py-4 outline-none transition-all font-bold" />
                </div>
              </div>
              <div className="mt-12 flex justify-end">
                <button onClick={() => setStep(2)} className="bg-primary text-white px-10 py-4 rounded-2xl font-black shadow-lg hover:scale-105 transition-transform">
                  Next: Medical History
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Medical History */}
          {step === 2 && (
            <div className="bg-white rounded-[40px] p-8 md:p-12 shadow-xl border border-gray-100 animate-slide-up">
              <div className="flex items-center gap-4 mb-10 pb-6 border-b border-gray-50">
                <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-2xl">🩺</div>
                <h2 className="text-2xl font-black text-gray-900">Health History</h2>
              </div>

              <div className="space-y-6">
                <div className="space-y-3">
                  <label className="text-sm font-black text-gray-800 block">1. Has your pet suffered from any conditions in the last two years?</label>
                  <textarea name="healthCondition" value={formData.healthCondition} onChange={handleChange} placeholder="Please list the conditions if any..." className="w-full bg-gray-50 border-2 border-transparent focus:border-primary/50 focus:bg-white rounded-2xl px-6 py-4 outline-none transition-all font-bold min-h-[100px]"></textarea>
                </div>

                {[
                  { label: '3. Are your pet’s vaccinations up to date?', name: 'vaccinations' },
                  { label: '4. Has your pet ever been used for commercial purposes?', name: 'commercial' },
                  { label: '5. Permission to ask your Vet for medical records?', name: 'vetPermission' }
                ].map(q => (
                  <div key={q.name} className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 bg-gray-50 rounded-3xl">
                    <span className="text-sm font-black text-gray-800">{q.label}</span>
                    <div className="flex bg-white p-1 rounded-xl shadow-inner w-fit">
                      {['Yes', 'No'].map(v => (
                        <button key={v} onClick={() => handleToggle(q.name, v)} className={`px-8 py-2 rounded-lg font-black text-xs transition-all ${formData[q.name] === v ? 'bg-primary text-white shadow-md' : 'text-gray-400'}`}>
                          {v}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-12 flex justify-between">
                <button onClick={() => setStep(1)} className="text-gray-400 font-black uppercase text-xs">Back</button>
                <button onClick={() => setStep(3)} className="bg-primary text-white px-10 py-4 rounded-2xl font-black shadow-lg">
                  Next: Banking Details
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Banking Details */}
          {step === 3 && (
            <div className="bg-white rounded-[40px] p-8 md:p-12 shadow-xl border border-gray-100 animate-slide-up">
              <div className="flex items-center gap-4 mb-10 pb-6 border-b border-gray-50">
                <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-2xl">🏦</div>
                <h2 className="text-2xl font-black text-gray-900">Banking Details</h2>
              </div>

              <div className="grid md:grid-cols-2 gap-8 mb-10">
                <div className="space-y-1">
                  <label className="text-[11px] font-black uppercase text-gray-400 tracking-widest ml-1">Account Holder Name</label>
                  <input type="text" name="accHolder" value={formData.accHolder} onChange={handleChange} className="w-full bg-gray-50 border-2 border-transparent focus:border-primary/50 focus:bg-white rounded-2xl px-6 py-4 outline-none transition-all font-bold" />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-black uppercase text-gray-400 tracking-widest ml-1">Account Number</label>
                  <input type="text" name="accNo" value={formData.accNo} onChange={handleChange} className="w-full bg-gray-50 border-2 border-transparent focus:border-primary/50 focus:bg-white rounded-2xl px-6 py-4 outline-none transition-all font-bold" />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-black uppercase text-gray-400 tracking-widest ml-1">Bank</label>
                  <select name="bank" value={formData.bank} onChange={handleChange} className="w-full bg-gray-50 border-2 border-transparent focus:border-primary/50 focus:bg-white rounded-2xl px-6 py-4 outline-none transition-all font-black">
                    <option>Standard Bank</option><option>ABSA</option><option>FNB</option><option>Nedbank</option><option>Other</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-black uppercase text-gray-400 tracking-widest ml-1">Deduction Amount (R)</label>
                  <input type="number" name="deductionAmount" value={formData.deductionAmount} onChange={handleChange} className="w-full bg-gray-50 border-2 border-transparent focus:border-primary/50 focus:bg-white rounded-2xl px-6 py-4 outline-none transition-all font-black" />
                </div>
              </div>

              <div className="bg-gray-900 rounded-[32px] p-8 text-white mb-8">
                <div className="flex items-start gap-4 mb-4">
                  <input type="checkbox" name="authorise" checked={formData.authorise} onChange={handleChange} className="mt-1 w-6 h-6 rounded border-gray-700 bg-gray-800 text-primary" />
                  <p className="text-xs font-bold text-gray-300">
                    I hereby authorise GENRIC Pet Insurance to draw from my account the premium due in terms of the cover I have chosen, inclusive of VAT at the ruling rate.
                  </p>
                </div>
                <p className="text-[10px] text-gray-500 italic">
                  If a pet is accepted for cover on standard terms, we will issue the policy and proceed with the debit. Otherwise, we will contact you for permission.
                </p>
              </div>

              <div className="flex justify-between items-center">
                <button onClick={() => setStep(2)} className="text-gray-400 font-black uppercase text-xs">Back</button>
                <button 
                  disabled={!formData.authorise}
                  onClick={handleSubmit}
                  className="bg-primary text-white px-16 py-6 rounded-[28px] font-black text-xl shadow-2xl disabled:opacity-50"
                >
                  Submit Quote
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

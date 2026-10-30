
import React, { useState, useEffect, useMemo } from 'react';
import { PET_PLANS, ROUTINE_CARE_ANNUAL_VALUE, ROUTINE_CARE_ITEMS, ROUTINE_CARE_PRICE } from '../constants';
import type { ApplicationRequest } from '../types';

interface QuotePageProps {
  onBack: () => void;
  onNavigate: (view: any) => void;
  selectedPlanId: string | null;
}

const STEPS = ['Start', 'Health', 'Details', 'Bank'];

const labelCls = 'block text-[11px] font-semibold text-gray-500 mb-1';
const inputCls = 'w-full bg-gray-50 border border-transparent focus:border-primary/50 focus:bg-white rounded-lg px-3 py-2 outline-none transition-colors font-medium text-sm';
const cardCls = 'bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-gray-100 animate-slide-up';
const primaryBtnCls = 'bg-primary text-white px-5 py-2.5 rounded-lg font-semibold text-sm shadow-sm hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed';
const backBtnCls = 'text-gray-400 hover:text-gray-600 font-semibold text-xs transition-colors';

const Field: React.FC<{ label: string; className?: string; children: React.ReactNode }> = ({ label, className = '', children }) => (
  <label className={`block ${className}`}>
    <span className={labelCls}>{label}</span>
    {children}
  </label>
);

const Segmented: React.FC<{
  options: { value: string; label: string }[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
}> = ({ options, value, onChange, className = '' }) => (
  <div className={`flex bg-gray-100 p-0.5 rounded-lg ${className}`}>
    {options.map(o => (
      <button
        key={o.value}
        type="button"
        aria-pressed={value === o.value}
        onClick={() => onChange(o.value)}
        className={`flex-1 px-4 rounded-md font-semibold text-xs transition-colors ${value === o.value ? 'bg-white text-primary shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
      >
        {o.label}
      </button>
    ))}
  </div>
);

const StepHeader: React.FC<{ icon: string; title: string; subtitle: string }> = ({ icon, title, subtitle }) => (
  <div className="flex items-center gap-2.5 mb-4 pb-3 border-b border-gray-100">
    <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center text-base">{icon}</div>
    <div>
      <h2 className="text-base font-bold text-gray-900 leading-tight">{title}</h2>
      <p className="text-[11px] text-gray-400 font-medium">{subtitle}</p>
    </div>
  </div>
);

const QuotePage: React.FC<QuotePageProps> = ({ onBack, onNavigate, selectedPlanId }) => {
  const [step, setStep] = useState(1);
  const [localPlanId, setLocalPlanId] = useState(selectedPlanId || 'comp-plus');
  const [isChangingPlan, setIsChangingPlan] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);
  const [leadId, setLeadId] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [confirmation, setConfirmation] = useState<{ reference: string; emailSent: boolean } | null>(null);

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
    return (basePrice + (formData.routineCare ? ROUTINE_CARE_PRICE : 0)).toFixed(2);
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
    setLeadId(leadId);

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

  const finalizeQuote = async () => {
    setIsSubmitting(true);
    setSubmitError('');

    // Prices are not sent: the server recomputes them from the plan, species and add-on.
    const application: ApplicationRequest = {
      reference: leadId,
      planId: selectedPlan.id,
      routineCare: formData.routineCare,
      authorise: formData.authorise,
      email: formData.email,
      pet: {
        name: formData.petName,
        species: formData.species,
        breed: formData.breed,
        gender: formData.gender,
        colour: formData.colour,
        weight: formData.weight,
        dob: formData.dob,
        chipNo: formData.chipNo,
      },
      health: {
        conditions: formData.healthCondition,
        additional: formData.additionalHealth,
        vaccinations: formData.vaccinations,
        commercial: formData.commercial,
        vetPermission: formData.vetPermission,
      },
      banking: {
        accHolder: formData.accHolder,
        bank: formData.bank,
        accNo: formData.accNo,
        debitDay: formData.debitDay,
      },
    };

    try {
      const res = await fetch('/api/quote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(application),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok || !data?.ok) {
        throw new Error(data?.error || "We couldn't submit your application right now. Please try again, or call us on 087 655 0525.");
      }
      setConfirmation({ reference: data.reference, emailSent: data.customerEmailSent });
      setSubmitted(true);
      window.scrollTo(0, 0);
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "We couldn't submit your application right now. Please try again, or call us on 087 655 0525.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center text-center p-4 animate-fade-in">
        <div className="w-14 h-14 bg-green-500 text-white rounded-full flex items-center justify-center text-2xl mb-4 shadow-lg">✓</div>
        <h2 className="text-2xl font-bold text-gray-900 mb-1.5">Finalized & Secure</h2>
        <p className="text-gray-600 max-w-sm mb-4 text-sm">
          Our underwriters at GENRIC will issue your policy document for {selectedPlan.name} within 24 hours.
        </p>
        {confirmation && (
          <div className="max-w-sm mb-6 space-y-1">
            <p className="text-xs font-semibold text-gray-400">Reference <span className="text-gray-900 tabular-nums">{confirmation.reference}</span></p>
            <p className="text-xs text-gray-500">
              {confirmation.emailSent
                ? `We've emailed a confirmation to ${formData.email}.`
                : `We couldn't email your confirmation. Please keep your reference and contact hello@petcovered.co.za if you don't hear from us.`}
            </p>
          </div>
        )}
        <button onClick={() => onNavigate('home')} className={primaryBtnCls}>Return to Home</button>
      </div>
    );
  }

  return (
    <div className="animate-fade-in bg-gray-50 min-h-screen py-4 md:py-6">
      <div className="max-w-xl mx-auto px-4">

        {/* Progress */}
        <div className="mb-3" role="progressbar" aria-label="Quote progress" aria-valuemin={1} aria-valuemax={STEPS.length} aria-valuenow={step}>
          <div className="flex items-center justify-between mb-1.5 text-[11px] font-semibold">
            <span className="text-primary">{STEPS[step - 1]}</span>
            <span className="text-gray-400">Step {step} of {STEPS.length}</span>
          </div>
          <div className="flex gap-1">
            {STEPS.map((label, i) => (
              <div key={label} className={`h-1 flex-1 rounded-full transition-colors duration-500 ${i < step ? 'bg-primary' : 'bg-gray-200'}`} />
            ))}
          </div>
        </div>

        {/* Persistent plan summary */}
        <div className="mb-3 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="flex items-center justify-between gap-3 px-4 py-2.5">
            <div className="min-w-0">
              <span className="block text-[11px] font-semibold text-gray-400">Plan</span>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-sm text-gray-900 truncate">{selectedPlan.name}</h3>
                <button
                  onClick={() => setIsChangingPlan(!isChangingPlan)}
                  className="text-[11px] font-semibold text-primary hover:underline shrink-0"
                >
                  {isChangingPlan ? 'Close' : 'Change plan'}
                </button>
              </div>
            </div>
            <div className="text-right shrink-0">
              <span className="block text-[11px] font-semibold text-gray-400">Monthly total</span>
              <div className="text-xl font-bold text-primary tabular-nums leading-tight">R{totalPrice}</div>
            </div>
          </div>

          {isChangingPlan && (
            <div className="p-3 bg-gray-50/50 border-t border-gray-100 grid grid-cols-2 sm:grid-cols-3 gap-1.5 animate-fade-in">
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
                    className={`px-3 py-2 rounded-lg text-left border transition-colors ${
                      isSelected ? 'border-primary bg-white shadow-sm' : 'border-transparent bg-white/50 hover:bg-white hover:border-gray-200'
                    }`}
                  >
                    <div className="text-[11px] font-bold text-gray-900 truncate">{plan.name}</div>
                    <div className="text-xs font-medium text-gray-500">R{planPrice.toFixed(0)}</div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Step 1: Identity */}
        {step === 1 && (
          <div className={cardCls}>
            <StepHeader icon="👋" title="Pet Identity" subtitle="Basic information" />

            <div className="grid sm:grid-cols-2 gap-3">
              <Field label="Name of pet">
                <input type="text" name="petName" value={formData.petName} onChange={handleChange} placeholder="What do you call them?" className={inputCls} />
              </Field>
              <div>
                <span className={labelCls}>Species</span>
                <Segmented
                  className="h-[38px]"
                  value={formData.species}
                  onChange={v => handleToggle('species', v)}
                  options={[{ value: 'Dog', label: 'Dog' }, { value: 'Cat', label: 'Cat' }]}
                />
              </div>
            </div>

            <div className="mt-4 flex justify-end">
              <button onClick={() => setStep(2)} disabled={!formData.petName} className={primaryBtnCls}>Continue</button>
            </div>
          </div>
        )}

        {/* Step 2: Health Questions */}
        {step === 2 && (
          <div className={cardCls}>
            <StepHeader icon="🩺" title="Health Questions" subtitle={`For ${formData.petName}`} />

            <div className="space-y-3">
              <label className="block">
                <span className="block text-xs font-semibold text-gray-800 mb-1 leading-snug">1. Has your pet suffered from any conditions in the last two years?</span>
                <textarea name="healthCondition" value={formData.healthCondition} onChange={handleChange} rows={2} placeholder="Conditions if any..." className={`${inputCls} resize-none`}></textarea>
              </label>
              <label className="block">
                <span className="block text-xs font-semibold text-gray-800 mb-1 leading-snug">2. Additional info about your pet’s health or behavior?</span>
                <textarea name="additionalHealth" value={formData.additionalHealth} onChange={handleChange} rows={2} placeholder="Anything else?" className={`${inputCls} resize-none`}></textarea>
              </label>
              <div className="space-y-1.5">
                {[
                  { label: '3. Vaccinations up to date?', name: 'vaccinations' },
                  { label: '4. Ever used commercially?', name: 'commercial' },
                  { label: '5. Vet record permission?', name: 'vetPermission' }
                ].map(q => (
                  <div key={q.name} className="flex items-center justify-between gap-3 px-3 py-1.5 bg-gray-50 rounded-lg">
                    <span className="text-xs font-semibold text-gray-800">{q.label}</span>
                    <Segmented
                      className="w-28 shrink-0 h-8"
                      value={formData[q.name]}
                      onChange={v => handleToggle(q.name, v)}
                      options={[{ value: 'Yes', label: 'Yes' }, { value: 'No', label: 'No' }]}
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-4 flex justify-between items-center">
              <button onClick={() => setStep(1)} className={backBtnCls}>← Back</button>
              <button onClick={() => setStep(3)} className={primaryBtnCls}>Next step</button>
            </div>
          </div>
        )}

        {/* Step 3: Physical Details & Add-ons */}
        {step === 3 && (
          <div className={cardCls}>
            <StepHeader icon="🐕" title="Physical Details" subtitle={`Completing ${formData.petName}'s profile`} />

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-3 gap-y-2.5 mb-4">
              <div>
                <span className={labelCls}>Gender</span>
                <Segmented
                  className="h-[38px]"
                  value={formData.gender}
                  onChange={v => handleToggle('gender', v)}
                  options={[{ value: 'M', label: 'Male' }, { value: 'F', label: 'Female' }]}
                />
              </div>
              <Field label="Breed"><input type="text" name="breed" value={formData.breed} onChange={handleChange} placeholder="e.g. Bulldog" className={inputCls} /></Field>
              <Field label="Weight (kg)"><input type="number" name="weight" value={formData.weight} onChange={handleChange} className={inputCls} /></Field>
              <Field label="Colour"><input type="text" name="colour" value={formData.colour} onChange={handleChange} className={inputCls} /></Field>
              <Field label="Date of birth"><input type="date" name="dob" value={formData.dob} onChange={handleChange} className={inputCls} /></Field>
              <Field label="Microchip no."><input type="text" name="chipNo" value={formData.chipNo} onChange={handleChange} className={`${inputCls} tabular-nums`} /></Field>
              <Field label="Contact email" className="col-span-2 sm:col-span-3"><input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email for documents..." className={inputCls} /></Field>
            </div>

            {/* Routine Care Upsell */}
            <div className={`rounded-xl border transition-colors p-3 ${formData.routineCare ? 'border-primary bg-primary/[0.03]' : 'border-gray-200 bg-gray-50/50'}`}>
              <div className="flex items-center justify-between gap-3 mb-2">
                <h3 className="font-bold text-gray-900 text-xs leading-snug">✨ Routine Care add-on <span className="font-medium text-gray-500">· valued at R{ROUTINE_CARE_ANNUAL_VALUE} per year</span></h3>
                <button
                  type="button"
                  aria-pressed={formData.routineCare}
                  onClick={() => handleToggle('routineCare', !formData.routineCare)}
                  className={`shrink-0 px-3 py-1 rounded-full text-[11px] font-semibold transition-colors ${formData.routineCare ? 'bg-primary text-white' : 'bg-gray-200 text-gray-600 hover:bg-gray-300'}`}
                >
                  {formData.routineCare ? 'Added ✓' : `Add +R${ROUTINE_CARE_PRICE}`}
                </button>
              </div>

              <div className="grid grid-cols-3 gap-x-2 gap-y-1">
                {ROUTINE_CARE_ITEMS.map(item => (
                  <div key={item} className="flex items-center gap-1">
                    <svg className={`w-3 h-3 shrink-0 ${formData.routineCare ? 'text-primary' : 'text-gray-300'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    <span className="text-[11px] font-medium text-gray-600 truncate">{item}</span>
                  </div>
                ))}
              </div>

              {formData.routineCare && (
                <div className="mt-2 pt-2 border-t border-primary/10 flex justify-between items-center animate-fade-in">
                  <span className="text-[11px] font-semibold text-primary">Combined premium</span>
                  <span className="text-sm font-bold text-gray-900 tabular-nums">R{totalPrice}<span className="text-[11px] font-medium text-gray-400">/mo</span></span>
                </div>
              )}
            </div>

            <div className="mt-4 flex justify-between items-center">
              <button onClick={() => setStep(2)} className={backBtnCls}>← Back</button>
              <button
                onClick={captureLead}
                disabled={!formData.email || !formData.dob || isCapturing}
                className={primaryBtnCls}
              >
                {isCapturing ? "Processing..." : "Continue to bank"}
              </button>
            </div>
          </div>
        )}

        {/* Step 4: Banking */}
        {step === 4 && (
          <div className={cardCls}>
            <StepHeader icon="🏦" title="Banking Setup" subtitle="Final step" />

            <div className="grid grid-cols-2 gap-x-3 gap-y-2.5 mb-4">
              <Field label="Account holder"><input type="text" name="accHolder" value={formData.accHolder} onChange={handleChange} className={inputCls} /></Field>
              <Field label="Account number"><input type="text" name="accNo" value={formData.accNo} onChange={handleChange} className={`${inputCls} tabular-nums`} /></Field>
              <Field label="Bank">
                <select name="bank" value={formData.bank} onChange={handleChange} className={inputCls}>
                  <option>Standard Bank</option><option>ABSA</option><option>FNB</option><option>Nedbank</option><option>Other</option>
                </select>
              </Field>
              <Field label="Debit day">
                <select name="debitDay" value={formData.debitDay} onChange={handleChange} className={inputCls}>
                  {[1, 5, 15, 25, 30].map(d => <option key={d} value={d}>{d}{d === 1 ? 'st' : d === 2 ? 'nd' : d === 3 ? 'rd' : 'th'}</option>)}
                </select>
              </Field>
            </div>

            <label className="flex items-start gap-2.5 bg-gray-900 rounded-xl p-3 text-white mb-4 cursor-pointer">
              <input type="checkbox" name="authorise" checked={formData.authorise} onChange={handleChange} className="mt-0.5 w-4 h-4 shrink-0 accent-primary" />
              <span className="text-xs font-medium leading-snug text-gray-300">
                I authorise <span className="text-white font-semibold">GENRIC Pet Insurance</span> to debit <span className="text-white font-bold tabular-nums">R{totalPrice}</span> for the {selectedPlan.name} plan {formData.routineCare && 'including Routine Care'}.
              </span>
            </label>

            {submitError && (
              <p role="alert" className="mb-3 rounded-lg bg-red-50 px-3 py-2 text-xs font-medium text-red-700">{submitError}</p>
            )}

            <div className="flex justify-between items-center">
              <button onClick={() => setStep(3)} disabled={isSubmitting} className={backBtnCls}>← Back</button>
              <button
                disabled={!formData.authorise || !formData.accNo || isSubmitting}
                onClick={finalizeQuote}
                className={primaryBtnCls}
              >
                {isSubmitting ? 'Submitting...' : 'Finalize authorization'}
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default QuotePage;

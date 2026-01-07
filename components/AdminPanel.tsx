
import React, { useState, useEffect } from 'react';
import { QuoteLead, WebhookSettings } from '../types';
import Logo from './Logo';

interface AdminPanelProps {
  onExit: () => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ onExit }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState<'leads' | 'settings'>('leads');
  const [leads, setLeads] = useState<QuoteLead[]>([]);
  const [selectedLead, setSelectedLead] = useState<QuoteLead | null>(null);
  const [webhook, setWebhook] = useState<WebhookSettings>({
    url: '',
    format: 'json',
    enabled: false
  });

  useEffect(() => {
    const savedLeads = JSON.parse(localStorage.getItem('petcovered_leads') || '[]');
    const savedWebhook = JSON.parse(localStorage.getItem('petcovered_webhook') || '{"url": "", "format": "json", "enabled": false}');
    setLeads(savedLeads);
    setWebhook(savedWebhook);
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'Supercom@80') {
      setIsLoggedIn(true);
    } else {
      alert('Unauthorized access. Please check credentials.');
    }
  };

  const handleSaveWebhook = () => {
    localStorage.setItem('petcovered_webhook', JSON.stringify(webhook));
    alert('Automation configuration updated successfully.');
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-[#0c161c] flex items-center justify-center p-4">
        <div className="bg-white rounded-[40px] p-10 md:p-16 max-w-md w-full shadow-2xl text-center border-t-8 border-primary">
          <Logo className="mb-10 justify-center" />
          <h2 className="text-2xl font-black mb-2 text-gray-900">Admin Login</h2>
          <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mb-8">Lead Management Console</p>
          <form onSubmit={handleLogin} className="space-y-6">
            <input 
              type="password" 
              placeholder="System Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl px-6 py-4 outline-none focus:border-primary font-bold text-center"
            />
            <button className="w-full bg-primary text-white py-5 rounded-2xl font-black shadow-xl hover:scale-105 transition-transform active:scale-95">
              Secure Login
            </button>
            <button type="button" onClick={onExit} className="text-gray-400 text-xs font-bold uppercase tracking-widest hover:text-primary transition-colors">Return to Site</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      {/* Sidebar */}
      <div className="w-full md:w-72 bg-[#0c161c] text-white flex flex-col">
        <div className="p-8 pb-12">
          <Logo variant="light" />
        </div>
        <nav className="flex-1 px-4 space-y-2">
          <button 
            onClick={() => setActiveTab('leads')}
            className={`w-full text-left px-6 py-4 rounded-2xl font-black text-sm transition-all flex items-center gap-3 ${activeTab === 'leads' ? 'bg-primary shadow-lg' : 'text-gray-500 hover:text-gray-300 hover:bg-white/5'}`}
          >
            <span className="text-lg">📋</span> Leads Queue
          </button>
          <button 
            onClick={() => setActiveTab('settings')}
            className={`w-full text-left px-6 py-4 rounded-2xl font-black text-sm transition-all flex items-center gap-3 ${activeTab === 'settings' ? 'bg-primary shadow-lg' : 'text-gray-500 hover:text-gray-300 hover:bg-white/5'}`}
          >
            <span className="text-lg">⚙️</span> Webhook Integrations
          </button>
        </nav>
        <div className="p-8 border-t border-white/5">
          <button onClick={onExit} className="w-full text-center text-[10px] font-black text-gray-500 hover:text-red-400 uppercase tracking-[0.2em] transition-colors">Terminte Session</button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto p-6 md:p-12">
        <div className="max-w-6xl mx-auto">
          {activeTab === 'leads' ? (
            <div className="animate-fade-in">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
                <div>
                  <h1 className="text-3xl font-black text-gray-900 mb-2 tracking-tighter uppercase">Leads Repository</h1>
                  <p className="text-gray-500 font-bold text-sm">Reviewing {leads.length} total lead captures.</p>
                </div>
                <div className="bg-white px-6 py-3 rounded-2xl border border-gray-200 font-black text-xs text-primary shadow-sm flex items-center gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  Real-time Sync Active
                </div>
              </div>

              {selectedLead ? (
                <div className="bg-white rounded-[40px] p-8 md:p-12 shadow-xl border border-gray-100 animate-slide-up relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-8">
                    <button onClick={() => setSelectedLead(null)} className="text-gray-400 hover:text-gray-900 font-black text-xs uppercase tracking-widest flex items-center gap-2">
                       <span className="text-lg">✕</span> Close Detail
                    </button>
                  </div>
                  <div className="flex items-center gap-6 mb-12">
                    <div className="w-20 h-20 bg-primary/10 rounded-[28px] flex items-center justify-center text-4xl">
                      {selectedLead.species === 'Dog' ? '🐕' : '🐈'}
                    </div>
                    <div>
                      <h2 className="text-3xl font-black text-gray-900">{selectedLead.petName}</h2>
                      <p className="text-primary font-black uppercase tracking-widest text-xs">{selectedLead.breed}</p>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-3 gap-8 mb-12">
                    <div className="bg-gray-50 p-6 rounded-3xl">
                      <span className="text-[10px] font-black uppercase text-gray-400 block mb-2">Quoted Premium</span>
                      <p className="text-2xl font-black text-gray-900">{selectedLead.premium}<span className="text-xs text-gray-400">/mo</span></p>
                    </div>
                    <div className="bg-gray-50 p-6 rounded-3xl">
                      <span className="text-[10px] font-black uppercase text-gray-400 block mb-2">Submission Date</span>
                      <p className="text-lg font-black text-gray-900">{new Date(selectedLead.submittedAt).toLocaleDateString()}</p>
                    </div>
                    <div className="bg-gray-50 p-6 rounded-3xl">
                      <span className="text-[10px] font-black uppercase text-gray-400 block mb-2">Contact Email</span>
                      <p className="text-sm font-black text-blue-600 underline truncate">{selectedLead.contactEmail}</p>
                    </div>
                  </div>

                  <div className="space-y-8">
                    <div>
                      <h3 className="text-lg font-black text-gray-900 mb-4 border-l-4 border-primary pl-4">Banking & Authorization</h3>
                      <div className="grid md:grid-cols-2 gap-4 text-sm font-medium text-gray-600">
                        <div className="flex justify-between p-3 bg-gray-50 rounded-xl"><span>Acc Holder:</span> <span className="font-bold">{selectedLead.details.accHolder}</span></div>
                        <div className="flex justify-between p-3 bg-gray-50 rounded-xl"><span>Account No:</span> <span className="font-bold font-mono">{selectedLead.details.accNo}</span></div>
                        <div className="flex justify-between p-3 bg-gray-50 rounded-xl"><span>Bank Name:</span> <span className="font-bold">{selectedLead.details.bank}</span></div>
                        <div className="flex justify-between p-3 bg-gray-50 rounded-xl"><span>Debit Day:</span> <span className="font-bold">{selectedLead.details.debitDay}th</span></div>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-black text-gray-900 mb-4 border-l-4 border-primary pl-4">Health Declarations</h3>
                      <div className="bg-gray-900 text-gray-300 p-8 rounded-[32px] text-xs space-y-4 font-bold leading-relaxed">
                        <p><span className="text-primary uppercase tracking-tighter mr-2">Condition History:</span> {selectedLead.details.healthCondition || 'None disclosed'}</p>
                        <p><span className="text-primary uppercase tracking-tighter mr-2">Additional Health:</span> {selectedLead.details.additionalHealth || 'None'}</p>
                        <p><span className="text-primary uppercase tracking-tighter mr-2">Vaccinated:</span> {selectedLead.details.vaccinations}</p>
                        <p><span className="text-primary uppercase tracking-tighter mr-2">Commercial Use:</span> {selectedLead.details.commercial} {selectedLead.details.commercialExplain && `(${selectedLead.details.commercialExplain})`}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-[40px] shadow-sm border border-gray-100 overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-gray-50/50 border-b border-gray-100">
                          <th className="px-8 py-6 text-[10px] font-black uppercase text-gray-400 tracking-widest">Lead Source</th>
                          <th className="px-8 py-6 text-[10px] font-black uppercase text-gray-400 tracking-widest">Pet Profile</th>
                          <th className="px-8 py-6 text-[10px] font-black uppercase text-gray-400 tracking-widest text-right">Quoted Value</th>
                          <th className="px-8 py-6 text-[10px] font-black uppercase text-gray-400 tracking-widest text-center">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50">
                        {leads.length > 0 ? leads.map((lead) => (
                          <tr key={lead.id} className="hover:bg-primary/[0.02] group transition-all">
                            <td className="px-8 py-6">
                              <span className="text-xs font-mono text-gray-400 block mb-1">{lead.id}</span>
                              <span className="text-[10px] font-black text-gray-500 uppercase">{new Date(lead.submittedAt).toLocaleDateString()}</span>
                            </td>
                            <td className="px-8 py-6">
                              <div className="flex items-center gap-3">
                                <span className="text-2xl">{lead.species === 'Dog' ? '🐕' : '🐈'}</span>
                                <div>
                                  <span className="font-black text-gray-900 block">{lead.petName}</span>
                                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tight">{lead.breed}</span>
                                </div>
                              </div>
                            </td>
                            <td className="px-8 py-6 text-right">
                              <span className="text-lg font-black text-primary">{lead.premium}</span>
                            </td>
                            <td className="px-8 py-6 text-center">
                              <button 
                                onClick={() => setSelectedLead(lead)}
                                className="px-6 py-2 rounded-xl bg-gray-900 text-white text-[10px] font-black uppercase tracking-widest hover:bg-primary transition-all shadow-md active:scale-95"
                              >
                                View Details
                              </button>
                            </td>
                          </tr>
                        )) : (
                          <tr>
                            <td colSpan={4} className="px-8 py-24 text-center">
                              <p className="text-gray-300 font-bold text-lg italic">No leads captured in current period.</p>
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="animate-fade-in max-w-3xl">
              <h1 className="text-3xl font-black text-gray-900 mb-2 tracking-tighter uppercase">Inbound Lead Automation</h1>
              <p className="text-gray-500 font-bold mb-10 text-sm">Configure where your Petcovered® leads are dispatched.</p>
              
              <div className="bg-white rounded-[40px] p-8 md:p-12 shadow-xl border border-gray-100 space-y-10">
                <div className="flex items-center justify-between p-8 bg-gray-900 rounded-[32px] text-white">
                  <div>
                    <h4 className="font-black text-lg mb-1">Automation Engine</h4>
                    <p className="text-xs text-gray-400 font-medium">Toggle all external API integrations</p>
                  </div>
                  <button 
                    onClick={() => setWebhook({...webhook, enabled: !webhook.enabled})}
                    className={`w-16 h-9 rounded-full transition-all relative ${webhook.enabled ? 'bg-green-500' : 'bg-gray-700'}`}
                  >
                    <div className={`absolute top-1.5 w-6 h-6 bg-white rounded-full transition-all shadow-sm ${webhook.enabled ? 'left-8.5' : 'left-1.5'}`}></div>
                  </button>
                </div>

                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[11px] font-black uppercase text-gray-400 tracking-widest ml-2">Webhook Endpoint (HTTPS Only)</label>
                    <input 
                      type="url" 
                      value={webhook.url}
                      onChange={(e) => setWebhook({...webhook, url: e.target.value})}
                      placeholder="https://your-crm.com/webhooks/petcovered" 
                      className="w-full bg-gray-50 border-2 border-gray-100 focus:border-primary/50 focus:bg-white rounded-[24px] px-8 py-5 outline-none transition-all font-bold text-gray-800"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[11px] font-black uppercase text-gray-400 tracking-widest ml-2">Payload Content-Type</label>
                    <div className="flex bg-gray-50 p-1.5 rounded-[24px] border-2 border-gray-100">
                      {['json', 'form'].map(f => (
                        <button 
                          key={f} 
                          onClick={() => setWebhook({...webhook, format: f as any})}
                          className={`flex-1 py-4 rounded-[18px] font-black text-xs uppercase tracking-[0.2em] transition-all ${webhook.format === f ? 'bg-white text-primary shadow-xl' : 'text-gray-400 hover:text-gray-600'}`}
                        >
                          {f === 'json' ? 'application/json' : 'x-www-form-urlencoded'}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="bg-[#0c161c] rounded-[32px] p-10 relative group">
                  <div className="absolute top-6 right-8 flex items-center gap-2">
                    <span className="w-2 h-2 bg-primary rounded-full animate-pulse"></span>
                    <span className="text-[10px] font-black uppercase text-primary tracking-widest">Standard Schema v2.1</span>
                  </div>
                  <pre className="overflow-x-auto font-mono text-[11px] text-gray-500 leading-relaxed custom-scrollbar pt-6">
{`{
  "lead_id": "string",
  "source": "petcovered_web_v1",
  "pet_data": {
    "name": "string",
    "species": "Dog|Cat",
    "breed": "string",
    "age_years": "integer"
  },
  "quote_summary": {
    "monthly_premium": "float",
    "currency": "ZAR"
  },
  "authorization": {
    "account_holder": "string",
    "timestamp": "ISO-8601"
  }
}`}
                  </pre>
                  <div className="mt-8 pt-8 border-t border-white/5">
                    <p className="text-[10px] text-gray-600 font-bold leading-relaxed">
                      * Notes: Webhooks use retry-backoff logic. Authentication headers can be added in advanced settings. 
                      JSON is recommended for modern CRM integrations like Salesforce or Hubspot.
                    </p>
                  </div>
                </div>

                <button 
                  onClick={handleSaveWebhook}
                  className="w-full bg-primary text-white py-6 rounded-[28px] font-black text-lg shadow-2xl shadow-primary/30 hover:scale-[1.02] active:scale-[0.98] transition-all"
                >
                  Apply Integration Settings
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      
      <style dangerouslySetInnerHTML={{ __html: `
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #374151; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #a94694; }
      `}} />
    </div>
  );
};

export default AdminPanel;

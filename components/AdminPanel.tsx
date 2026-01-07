
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
  const [webhook, setWebhook] = useState<WebhookSettings>({
    url: '',
    format: 'json',
    enabled: false
  });

  useEffect(() => {
    // Load leads and webhook from localStorage
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
      alert('Incorrect password');
    }
  };

  const handleSaveWebhook = () => {
    localStorage.setItem('petcovered_webhook', JSON.stringify(webhook));
    alert('Webhook settings saved');
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
        <div className="bg-white rounded-[40px] p-10 md:p-16 max-w-md w-full shadow-2xl text-center">
          <Logo className="mb-10 justify-center" />
          <h2 className="text-2xl font-black mb-6 text-gray-900">Admin Console</h2>
          <form onSubmit={handleLogin} className="space-y-6">
            <input 
              type="password" 
              placeholder="Enter Access Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl px-6 py-4 outline-none focus:border-primary font-bold text-center"
            />
            <button className="w-full bg-primary text-white py-4 rounded-2xl font-bold shadow-xl hover:scale-105 transition-transform">
              Access Dashboard
            </button>
            <button type="button" onClick={onExit} className="text-gray-400 text-xs font-bold uppercase tracking-widest">Exit</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      {/* Sidebar */}
      <div className="w-full md:w-64 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-8">
          <Logo />
        </div>
        <nav className="flex-1 px-4 space-y-2">
          <button 
            onClick={() => setActiveTab('leads')}
            className={`w-full text-left px-6 py-4 rounded-2xl font-black text-sm transition-all ${activeTab === 'leads' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-gray-500 hover:bg-gray-50'}`}
          >
            📋 Leads Queue
          </button>
          <button 
            onClick={() => setActiveTab('settings')}
            className={`w-full text-left px-6 py-4 rounded-2xl font-black text-sm transition-all ${activeTab === 'settings' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-gray-500 hover:bg-gray-50'}`}
          >
            ⚙️ Webhook Settings
          </button>
        </nav>
        <div className="p-6 border-t">
          <button onClick={onExit} className="w-full text-center text-xs font-black text-gray-400 hover:text-red-500">Log Out</button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto p-6 md:p-12">
        <div className="max-w-6xl mx-auto">
          {activeTab === 'leads' ? (
            <div className="animate-fade-in">
              <div className="flex justify-between items-end mb-10">
                <div>
                  <h1 className="text-3xl font-black text-gray-900 mb-2 tracking-tighter">Quotes & Leads</h1>
                  <p className="text-gray-500 font-medium">Real-time submissions from your pet owners.</p>
                </div>
                <div className="bg-white px-4 py-2 rounded-xl border border-gray-200 font-black text-xs text-primary shadow-sm">
                  {leads.length} Active Leads
                </div>
              </div>

              <div className="bg-white rounded-[32px] shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-100">
                      <th className="px-6 py-4 text-[10px] font-black uppercase text-gray-400 tracking-widest">Date</th>
                      <th className="px-6 py-4 text-[10px] font-black uppercase text-gray-400 tracking-widest">Pet Name</th>
                      <th className="px-6 py-4 text-[10px] font-black uppercase text-gray-400 tracking-widest">Breed</th>
                      <th className="px-6 py-4 text-[10px] font-black uppercase text-gray-400 tracking-widest">Premium</th>
                      <th className="px-6 py-4 text-[10px] font-black uppercase text-gray-400 tracking-widest">Contact</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {leads.length > 0 ? leads.map((lead) => (
                      <tr key={lead.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-5 text-xs text-gray-500 font-mono">{new Date(lead.submittedAt).toLocaleDateString()}</td>
                        <td className="px-6 py-5 font-bold text-gray-900">{lead.petName} <span className="text-[10px] opacity-40 ml-1">{lead.species === 'Dog' ? '🐕' : '🐈'}</span></td>
                        <td className="px-6 py-5 text-xs text-gray-600">{lead.breed}</td>
                        <td className="px-6 py-5 font-black text-primary">{lead.premium}</td>
                        <td className="px-6 py-5 text-xs font-bold text-blue-500 underline">{lead.contactEmail}</td>
                      </tr>
                    )) : (
                      <tr>
                        <td colSpan={5} className="px-6 py-20 text-center text-gray-300 font-bold italic">No leads found in the system yet.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="animate-fade-in max-w-2xl">
              <h1 className="text-3xl font-black text-gray-900 mb-2 tracking-tighter">External Integrations</h1>
              <p className="text-gray-500 font-medium mb-10">Configure how and where your leads are sent automatically.</p>
              
              <div className="bg-white rounded-[40px] p-8 md:p-12 shadow-sm border border-gray-100 space-y-8">
                <div className="flex items-center justify-between p-6 bg-gray-50 rounded-3xl">
                  <div>
                    <h4 className="font-black text-gray-900">Enable Automation</h4>
                    <p className="text-xs text-gray-500">Push leads to your external CRM or API.</p>
                  </div>
                  <button 
                    onClick={() => setWebhook({...webhook, enabled: !webhook.enabled})}
                    className={`w-14 h-8 rounded-full transition-colors relative ${webhook.enabled ? 'bg-green-500' : 'bg-gray-300'}`}
                  >
                    <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all ${webhook.enabled ? 'left-7' : 'left-1'}`}></div>
                  </button>
                </div>

                <div className="space-y-2">
                  <label className="text-[11px] font-black uppercase text-gray-400 tracking-widest ml-1">Webhook Endpoint URL</label>
                  <input 
                    type="url" 
                    value={webhook.url}
                    onChange={(e) => setWebhook({...webhook, url: e.target.value})}
                    placeholder="https://your-crm.com/api/leads" 
                    className="w-full bg-gray-50 border-2 border-transparent focus:border-primary/50 focus:bg-white rounded-2xl px-6 py-4 outline-none transition-all font-bold"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[11px] font-black uppercase text-gray-400 tracking-widest ml-1">Payload Format</label>
                  <div className="flex bg-gray-50 p-1 rounded-2xl">
                    {['json', 'form'].map(f => (
                      <button 
                        key={f} 
                        onClick={() => setWebhook({...webhook, format: f as any})}
                        className={`flex-1 py-3 rounded-xl font-black text-sm uppercase transition-all ${webhook.format === f ? 'bg-white text-primary shadow-md' : 'text-gray-400'}`}
                      >
                        {f}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="bg-gray-900 rounded-[28px] p-6 text-xs text-gray-400 space-y-3">
                  <p className="font-black uppercase text-[10px] tracking-widest text-primary">Webhook Schema Preview</p>
                  <pre className="overflow-x-auto font-mono text-[10px]">
{`{
  "id": "string",
  "pet_name": "string",
  "breed": "string",
  "premium": "currency",
  "details": {
    "medical_history": "array",
    "banking": "object"
  }
}`}
                  </pre>
                </div>

                <button 
                  onClick={handleSaveWebhook}
                  className="w-full bg-primary text-white py-4 rounded-2xl font-bold shadow-xl hover:shadow-2xl transition-all"
                >
                  Save Integration Settings
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;

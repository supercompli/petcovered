
import React, { useState, useEffect } from 'react';
import { QuoteLead, WebhookSettings } from '../types';
import Logo from './Logo';
import { exportProjectContent } from '../services/cmsService';

interface AdminPanelProps {
  onExit: () => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ onExit }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState<'leads' | 'settings' | 'cms'>('leads');
  const [leads, setLeads] = useState<QuoteLead[]>([]);
  const [selectedLead, setSelectedLead] = useState<QuoteLead | null>(null);
  const [editMode, setEditMode] = useState(localStorage.getItem('petcovered_edit_mode') === 'true');
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

  const toggleEditMode = () => {
    const newMode = !editMode;
    setEditMode(newMode);
    localStorage.setItem('petcovered_edit_mode', newMode.toString());
    window.dispatchEvent(new Event('cms_mode_change'));
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'Supercom@80') {
      setIsLoggedIn(true);
    } else {
      alert('Unauthorized access. Please check credentials.');
    }
  };

  const saveWebhookSettings = () => {
    localStorage.setItem('petcovered_webhook', JSON.stringify(webhook));
    alert('Settings saved successfully!');
  };

  const clearLeads = () => {
    if (confirm('Are you sure you want to clear all leads? This cannot be undone.')) {
      localStorage.removeItem('petcovered_leads');
      setLeads([]);
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-[#0c161c] flex items-center justify-center p-4">
        <div className="bg-white rounded-[40px] p-10 md:p-16 max-w-md w-full shadow-2xl text-center border-t-8 border-primary">
          <Logo className="mb-10 justify-center" />
          <h2 className="text-2xl font-black mb-2 text-gray-900">Admin Login</h2>
          <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mb-8">Management Console</p>
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
          <button onClick={() => setActiveTab('leads')} className={`w-full text-left px-6 py-4 rounded-2xl font-black text-sm transition-all flex items-center gap-3 ${activeTab === 'leads' ? 'bg-primary shadow-lg' : 'text-gray-500 hover:text-gray-300 hover:bg-white/5'}`}>
            <span>📋</span> Leads Queue
          </button>
          <button onClick={() => setActiveTab('cms')} className={`w-full text-left px-6 py-4 rounded-2xl font-black text-sm transition-all flex items-center gap-3 ${activeTab === 'cms' ? 'bg-primary shadow-lg' : 'text-gray-500 hover:text-gray-300 hover:bg-white/5'}`}>
            <span>✍️</span> Content Manager
          </button>
          <button onClick={() => setActiveTab('settings')} className={`w-full text-left px-6 py-4 rounded-2xl font-black text-sm transition-all flex items-center gap-3 ${activeTab === 'settings' ? 'bg-primary shadow-lg' : 'text-gray-500 hover:text-gray-300 hover:bg-white/5'}`}>
            <span>⚙️</span> Integrations
          </button>
        </nav>
        <div className="p-8 border-t border-white/5">
          <button onClick={onExit} className="w-full text-center text-[10px] font-black text-gray-500 hover:text-red-400 uppercase tracking-[0.2em] transition-colors">Exit Console</button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 md:p-12">
        <div className="max-w-6xl mx-auto">
          {activeTab === 'leads' && (
            <div className="animate-fade-in">
              <div className="flex justify-between items-start mb-10">
                <div>
                  <h1 className="text-3xl font-black text-gray-900 mb-2 uppercase">Leads Queue</h1>
                  <p className="text-gray-500 font-bold text-sm">Reviewing {leads.length} captures.</p>
                </div>
                {leads.length > 0 && (
                  <button 
                    onClick={clearLeads}
                    className="text-[10px] font-black text-red-500 border border-red-200 px-4 py-2 rounded-xl hover:bg-red-50 transition-colors"
                  >
                    CLEAR ALL DATA
                  </button>
                )}
              </div>

              {leads.length === 0 ? (
                <div className="bg-white p-20 rounded-[40px] text-center border-2 border-dashed border-gray-100">
                  <span className="text-6xl block mb-6">🏜️</span>
                  <h3 className="text-xl font-black text-gray-900 mb-2">Queue is empty</h3>
                  <p className="text-gray-400 font-bold text-xs uppercase tracking-widest">No new quotes captured yet.</p>
                </div>
              ) : (
                <div className="grid gap-4">
                  {leads.map(lead => (
                    <div 
                      key={lead.id} 
                      onClick={() => setSelectedLead(selectedLead?.id === lead.id ? null : lead)}
                      className={`bg-white p-6 rounded-[32px] border-2 transition-all cursor-pointer ${selectedLead?.id === lead.id ? 'border-primary shadow-xl scale-[1.01]' : 'border-white hover:border-gray-200 shadow-sm'}`}
                    >
                      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-xl">
                            {lead.species === 'Dog' ? '🐕' : '🐈'}
                          </div>
                          <div>
                            <h3 className="font-black text-gray-900">{lead.petName}</h3>
                            <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">{lead.breed} • {lead.details?.age} yrs</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-8">
                          <div className="text-right">
                            <div className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1">Premium</div>
                            <div className="font-black text-primary">{lead.premium}</div>
                          </div>
                          <div className="text-right">
                            <div className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1">Submitted</div>
                            <div className="text-xs font-bold text-gray-900">{new Date(lead.submittedAt).toLocaleDateString()}</div>
                          </div>
                        </div>
                      </div>

                      {selectedLead?.id === lead.id && (
                        <div className="mt-8 pt-8 border-t border-gray-50 grid md:grid-cols-2 gap-8 animate-slide-up">
                          <div className="space-y-4">
                            <h4 className="text-[10px] font-black text-primary uppercase tracking-widest">Owner Information</h4>
                            <div className="bg-gray-50 p-4 rounded-2xl space-y-2">
                              <p className="text-xs font-bold text-gray-600">Email: <span className="text-gray-900">{lead.contactEmail}</span></p>
                              <p className="text-xs font-bold text-gray-600">Acc Holder: <span className="text-gray-900">{lead.details?.accHolder}</span></p>
                              <p className="text-xs font-bold text-gray-600">Bank: <span className="text-gray-900">{lead.details?.bank}</span></p>
                            </div>
                          </div>
                          <div className="space-y-4">
                            <h4 className="text-[10px] font-black text-primary uppercase tracking-widest">Health & Plan</h4>
                            <div className="bg-gray-50 p-4 rounded-2xl space-y-2">
                              <p className="text-xs font-bold text-gray-600">Plan: <span className="text-gray-900">{lead.details?.selectedPlan}</span></p>
                              <p className="text-xs font-bold text-gray-600">Routine Care: <span className="text-gray-900">{lead.details?.routineCare ? 'Yes' : 'No'}</span></p>
                              <p className="text-xs font-bold text-gray-600 italic">" {lead.details?.healthCondition || 'No conditions reported'} "</p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'cms' && (
            <div className="animate-fade-in space-y-8">
              <h1 className="text-3xl font-black text-gray-900 mb-2 uppercase">Content Management</h1>
              <p className="text-gray-500 font-bold mb-10 text-sm">Modify site text and images in real-time.</p>

              <div className="grid md:grid-cols-2 gap-8">
                <div className="bg-white p-8 rounded-[40px] shadow-sm border border-gray-100">
                  <h3 className="text-lg font-black mb-4">Live Edit Toggle</h3>
                  <p className="text-sm text-gray-500 mb-6">Enabling this will allow you to edit content directly on the website pages.</p>
                  <button 
                    onClick={toggleEditMode}
                    className={`w-full py-4 rounded-2xl font-black text-white transition-all ${editMode ? 'bg-green-500 shadow-green-500/20 shadow-xl' : 'bg-gray-400'}`}
                  >
                    {editMode ? 'LIVE EDIT: ON' : 'LIVE EDIT: OFF'}
                  </button>
                </div>

                <div className="bg-white p-8 rounded-[40px] shadow-sm border border-gray-100">
                  <h3 className="text-lg font-black mb-4">Export Changes</h3>
                  <p className="text-sm text-gray-500 mb-6">Generate a content bundle to apply these changes to the source code for permanent deployment.</p>
                  <button 
                    onClick={exportProjectContent}
                    className="w-full py-4 rounded-2xl font-black bg-gray-900 text-white hover:bg-primary transition-all shadow-xl"
                  >
                    GENERATE CONTENT JSON
                  </button>
                </div>
              </div>

              <div className="bg-primary/5 p-8 rounded-[40px] border border-primary/10">
                <h4 className="font-black text-primary mb-2 uppercase text-xs">Developer Instructions</h4>
                <ul className="text-xs font-bold text-gray-600 space-y-2">
                  <li>1. Use the "Live Edit" mode to update your content visually.</li>
                  <li>2. Click "Generate Content JSON" to download your changes.</li>
                  <li>3. Place any new images into the <code>/src/assets</code> folder using kebab-case.</li>
                  <li>4. Update your <code>site-content.json</code> in the project root to permanently apply changes.</li>
                </ul>
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
             <div className="animate-fade-in">
                <h1 className="text-3xl font-black text-gray-900 mb-2 uppercase">Integration Settings</h1>
                <p className="text-gray-500 font-bold mb-10 text-sm">Configure outbound lead automation.</p>

                <div className="bg-white p-10 rounded-[40px] shadow-sm border border-gray-100 max-w-2xl">
                  <div className="space-y-8">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-black text-gray-900">Lead Webhook</h3>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Connect to Zapier or CRM</p>
                      </div>
                      <button 
                        onClick={() => setWebhook(prev => ({ ...prev, enabled: !prev.enabled }))}
                        className={`w-14 h-8 rounded-full p-1 transition-all ${webhook.enabled ? 'bg-primary' : 'bg-gray-200'}`}
                      >
                        <div className={`w-6 h-6 bg-white rounded-full transition-transform ${webhook.enabled ? 'translate-x-6' : 'translate-x-0'}`}></div>
                      </button>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Destination URL</label>
                      <input 
                        type="text" 
                        value={webhook.url}
                        onChange={(e) => setWebhook(prev => ({ ...prev, url: e.target.value }))}
                        placeholder="https://hooks.zapier.com/..."
                        className="w-full bg-gray-50 border-2 border-transparent focus:border-primary/50 rounded-xl px-5 py-3 font-bold text-sm"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Payload Format</label>
                      <div className="flex bg-gray-50 p-1 rounded-xl">
                        {['json', 'form'].map(f => (
                          <button 
                            key={f}
                            onClick={() => setWebhook(prev => ({ ...prev, format: f as any }))}
                            className={`flex-1 py-3 rounded-lg font-black text-xs transition-all ${webhook.format === f ? 'bg-white text-primary shadow-sm' : 'text-gray-400'}`}
                          >
                            {f.toUpperCase()}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="pt-4">
                      <button 
                        onClick={saveWebhookSettings}
                        className="w-full bg-gray-900 text-white py-4 rounded-xl font-black hover:bg-black transition-all"
                      >
                        Update Configuration
                      </button>
                    </div>
                  </div>
                </div>

                <div className="mt-8 bg-amber-50 border border-amber-200 p-6 rounded-3xl max-w-2xl">
                   <div className="flex gap-4">
                      <span className="text-2xl">⚠️</span>
                      <div>
                        <h4 className="text-amber-900 font-black text-sm uppercase mb-1">Security Note</h4>
                        <p className="text-amber-800 text-xs font-medium leading-relaxed">
                          Webhooks send data in real-time as users complete their quotes. Ensure your endpoint is secure. We currently use <code>no-cors</code> mode for maximum compatibility with low-code tools.
                        </p>
                      </div>
                   </div>
                </div>
             </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;

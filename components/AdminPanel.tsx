
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
              <h1 className="text-3xl font-black text-gray-900 mb-2 uppercase">Leads Queue</h1>
              <p className="text-gray-500 font-bold mb-10 text-sm">Reviewing {leads.length} captures.</p>
              {/* Existing leads table logic would remain here */}
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
                <h1 className="text-3xl font-black text-gray-900 mb-10 uppercase">Integration Settings</h1>
                {/* Existing webhook logic */}
             </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;

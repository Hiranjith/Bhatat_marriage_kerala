import React, { useState } from 'react';

export default function SystemSetting() {
  const [activeTab, setActiveTab] = useState('general'); // 'general', 'limits', 'security'
  
  // Settings States
  const [settings, setSettings] = useState({
    siteName: "Bharath Marriage",
    supportEmail: "support@bharathmarriage.com",
    contactPhone: "+91 98450 12345",
    copyright: "© 2026 Bharath Marriage. All rights reserved.",
    minBrideAge: 18,
    minGroomAge: 21,
    maxPhotos: 5,
    autoVerifyProfiles: false,
    sessionExpiry: 60, // minutes
    enableCaptcha: true,
    maintenanceMode: false
  });

  const handleChange = (field, value) => {
    setSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    alert("Website configurations and settings saved successfully!");
  };

  return (
    <div className="space-y-6 text-left">
      {/* Header section */}
      <div>
        <h2 className="text-lg sm:text-xl font-bold text-slate-800 flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-deep-maroon"></span>
          System Settings
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          Configure global site metadata, registration age limits, and platform security flags.
        </p>
      </div>

      {/* Tabs list */}
      <div className="flex border-b border-slate-200 text-xs font-bold text-slate-500 gap-4">
        <button
          onClick={() => setActiveTab('general')}
          className={`pb-2.5 px-1 cursor-pointer transition-all border-b-2 ${
            activeTab === 'general' 
              ? 'border-deep-maroon text-deep-maroon' 
              : 'border-transparent hover:text-slate-750'
          }`}
        >
          General Settings
        </button>
        <button
          onClick={() => setActiveTab('limits')}
          className={`pb-2.5 px-1 cursor-pointer transition-all border-b-2 ${
            activeTab === 'limits' 
              ? 'border-deep-maroon text-deep-maroon' 
              : 'border-transparent hover:text-slate-750'
          }`}
        >
          Matrimonial Limits
        </button>
        <button
          onClick={() => setActiveTab('security')}
          className={`pb-2.5 px-1 cursor-pointer transition-all border-b-2 ${
            activeTab === 'security' 
              ? 'border-deep-maroon text-deep-maroon' 
              : 'border-transparent hover:text-slate-750'
          }`}
        >
          Security & Maintenance
        </button>
      </div>

      {/* Form Card */}
      <form onSubmit={handleSave} className="bg-white rounded-2xl border border-slate-200/60 p-6 shadow-xs max-w-2xl">
        <div className="text-xs font-semibold text-slate-700 space-y-5">
          
          {/* General Tab */}
          {activeTab === 'general' && (
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase text-slate-450 font-bold">Website Title</label>
                <input
                  type="text"
                  value={settings.siteName}
                  onChange={(e) => handleChange('siteName', e.target.value)}
                  className="w-full border border-slate-200 rounded-lg p-2 font-medium bg-slate-50/50 focus:outline-none focus:ring-1 focus:ring-deep-maroon focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase text-slate-450 font-bold">Support Email</label>
                  <input
                    type="email"
                    value={settings.supportEmail}
                    onChange={(e) => handleChange('supportEmail', e.target.value)}
                    className="w-full border border-slate-200 rounded-lg p-2 font-medium bg-slate-50/50 focus:outline-none focus:ring-1 focus:ring-deep-maroon focus:bg-white"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase text-slate-450 font-bold">Contact Phone</label>
                  <input
                    type="text"
                    value={settings.contactPhone}
                    onChange={(e) => handleChange('contactPhone', e.target.value)}
                    className="w-full border border-slate-200 rounded-lg p-2 font-medium bg-slate-50/50 focus:outline-none focus:ring-1 focus:ring-deep-maroon focus:bg-white"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] uppercase text-slate-450 font-bold">Footer Copyright Notice</label>
                <input
                  type="text"
                  value={settings.copyright}
                  onChange={(e) => handleChange('copyright', e.target.value)}
                  className="w-full border border-slate-200 rounded-lg p-2 font-medium bg-slate-50/50 focus:outline-none focus:ring-1 focus:ring-deep-maroon focus:bg-white"
                />
              </div>
            </div>
          )}

          {/* Limits Tab */}
          {activeTab === 'limits' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase text-slate-455 font-bold">Min Age Limit (Bride)</label>
                  <input
                    type="number"
                    value={settings.minBrideAge}
                    onChange={(e) => handleChange('minBrideAge', parseInt(e.target.value) || 18)}
                    className="w-full border border-slate-200 rounded-lg p-2 font-medium bg-slate-50/50 focus:outline-none focus:ring-1 focus:ring-deep-maroon focus:bg-white"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase text-slate-455 font-bold">Min Age Limit (Groom)</label>
                  <input
                    type="number"
                    value={settings.minGroomAge}
                    onChange={(e) => handleChange('minGroomAge', parseInt(e.target.value) || 21)}
                    className="w-full border border-slate-200 rounded-lg p-2 font-medium bg-slate-50/50 focus:outline-none focus:ring-1 focus:ring-deep-maroon focus:bg-white"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] uppercase text-slate-455 font-bold">Max Photos Upload Limit</label>
                <input
                  type="number"
                  value={settings.maxPhotos}
                  onChange={(e) => handleChange('maxPhotos', parseInt(e.target.value) || 1)}
                  className="w-full border border-slate-200 rounded-lg p-2 font-medium bg-slate-50/50 focus:outline-none focus:ring-1 focus:ring-deep-maroon focus:bg-white"
                />
              </div>

              {/* Automatic Profile verification Toggle Switch */}
              <div className="flex items-center justify-between p-3 rounded-xl border border-slate-100 bg-slate-50/50">
                <div>
                  <span className="font-bold text-slate-700 block">Auto-Verify Profiles</span>
                  <span className="text-[10px] text-slate-400 font-medium">Verify profiles automatically upon email verification.</span>
                </div>
                <button
                  type="button"
                  onClick={() => handleChange('autoVerifyProfiles', !settings.autoVerifyProfiles)}
                  className={`w-10 h-5 rounded-full p-0.5 transition-colors cursor-pointer ${
                    settings.autoVerifyProfiles ? 'bg-deep-maroon' : 'bg-slate-300'
                  }`}
                >
                  <div className={`w-4 h-4 rounded-full bg-white transition-transform ${
                    settings.autoVerifyProfiles ? 'translate-x-5' : 'translate-x-0'
                  }`}></div>
                </button>
              </div>
            </div>
          )}

          {/* Security & Maintenance Tab */}
          {activeTab === 'security' && (
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase text-slate-455 font-bold">Session Expiry (Minutes)</label>
                <input
                  type="number"
                  value={settings.sessionExpiry}
                  onChange={(e) => handleChange('sessionExpiry', parseInt(e.target.value) || 60)}
                  className="w-full border border-slate-200 rounded-lg p-2 font-medium bg-slate-50/50 focus:outline-none focus:ring-1 focus:ring-deep-maroon focus:bg-white"
                />
              </div>

              {/* Toggles */}
              <div className="flex items-center justify-between p-3 rounded-xl border border-slate-100 bg-slate-50/50">
                <div>
                  <span className="font-bold text-slate-700 block">Enable Google Captcha</span>
                  <span className="text-[10px] text-slate-400 font-medium">Show captcha validation on signup and logins.</span>
                </div>
                <button
                  type="button"
                  onClick={() => handleChange('enableCaptcha', !settings.enableCaptcha)}
                  className={`w-10 h-5 rounded-full p-0.5 transition-colors cursor-pointer ${
                    settings.enableCaptcha ? 'bg-deep-maroon' : 'bg-slate-300'
                  }`}
                >
                  <div className={`w-4 h-4 rounded-full bg-white transition-transform ${
                    settings.enableCaptcha ? 'translate-x-5' : 'translate-x-0'
                  }`}></div>
                </button>
              </div>

              {/* Maintenance Mode */}
              <div className="flex items-center justify-between p-3 rounded-xl border border-rose-100 bg-rose-50/20">
                <div>
                  <span className="font-bold text-rose-800 block">Website Maintenance Mode</span>
                  <span className="text-[10px] text-slate-400 font-medium">Temporarily disable front-end user access.</span>
                </div>
                <button
                  type="button"
                  onClick={() => handleChange('maintenanceMode', !settings.maintenanceMode)}
                  className={`w-10 h-5 rounded-full p-0.5 transition-colors cursor-pointer ${
                    settings.maintenanceMode ? 'bg-rose-600' : 'bg-slate-300'
                  }`}
                >
                  <div className={`w-4 h-4 rounded-full bg-white transition-transform ${
                    settings.maintenanceMode ? 'translate-x-5' : 'translate-x-0'
                  }`}></div>
                </button>
              </div>
            </div>
          )}

          {/* Form Actions Footer */}
          <div className="pt-4 border-t border-slate-100 flex justify-end">
            <button
              type="submit"
              className="px-5 py-2 bg-deep-maroon hover:bg-primary text-white rounded-xl font-bold cursor-pointer shadow-md transition-all active:scale-95 flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-sm">save</span>
              Save Settings
            </button>
          </div>

        </div>
      </form>
    </div>
  );
}

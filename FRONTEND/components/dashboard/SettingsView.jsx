import React, { useState } from 'react';

export default function SettingsView() {
  const [settings, setSettings] = useState({
    email: 'arjun.reddy@gmail.com',
    phone: '+91 9876543210',
    visibility: 'visible',
    matchAlerts: true,
    weeklyDigest: false,
  });

  const [isSaved, setIsSaved] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="w-full flex flex-col gap-6">
      <section className="rounded-none md:rounded-xl border-none md:border md:border-slate-200/60 bg-transparent md:bg-white p-0 md:p-6 shadow-none md:shadow-sm text-left">
        <div className="mb-6 border-b border-slate-100 pb-4 flex justify-between items-center">
          <div>
            <h2 className="text-base font-bold text-charcoal-text uppercase tracking-wide flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-deep-maroon"></span>
              Account Settings
            </h2>
            <p className="text-[11px] text-soft-gray mt-1">Manage credentials, privacy options, and notification settings.</p>
          </div>
          {isSaved && (
            <div className="text-[11px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-200/60 px-3 py-1 rounded-full flex items-center gap-1 animate-fade-in">
              <span className="material-symbols-outlined text-[13px]">check_circle</span>
              Settings Updated!
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Section 1: Security & Credentials */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-deep-maroon">Credentials</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] text-slate-400 font-semibold mb-1">Email Address</label>
                <input
                  type="email"
                  value={settings.email}
                  onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                  className="w-full border border-slate-200 rounded-lg py-2 px-3 text-xs bg-slate-50/50 text-charcoal-text focus:outline-none focus:ring-1 focus:ring-deep-maroon"
                  required
                />
              </div>
              <div>
                <label className="block text-[10px] text-slate-400 font-semibold mb-1">Mobile Number</label>
                <input
                  type="text"
                  value={settings.phone}
                  onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                  className="w-full border border-slate-200 rounded-lg py-2 px-3 text-xs bg-slate-50/50 text-charcoal-text focus:outline-none focus:ring-1 focus:ring-deep-maroon"
                  required
                />
              </div>
            </div>
          </div>

          <hr className="border-slate-100" />

          {/* Section 2: Profile Visibility */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-deep-maroon">Privacy & Visibility</h3>
            <div className="space-y-3">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="radio"
                  name="visibility"
                  value="visible"
                  checked={settings.visibility === 'visible'}
                  onChange={(e) => setSettings({ ...settings, visibility: e.target.value })}
                  className="mt-1 h-4 w-4 text-deep-maroon focus:ring-deep-maroon cursor-pointer"
                />
                <div>
                  <span className="text-xs font-bold text-charcoal-text block">Visible to All Members</span>
                  <span className="text-[10px] text-soft-gray block mt-0.5">Your profile is visible in match feeds and public search.</span>
                </div>
              </label>

              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="radio"
                  name="visibility"
                  value="hidden"
                  checked={settings.visibility === 'hidden'}
                  onChange={(e) => setSettings({ ...settings, visibility: e.target.value })}
                  className="mt-1 h-4 w-4 text-deep-maroon focus:ring-deep-maroon cursor-pointer"
                />
                <div>
                  <span className="text-xs font-bold text-charcoal-text block">Hidden / Keep Private</span>
                  <span className="text-[10px] text-soft-gray block mt-0.5">Your profile won't appear in public feeds. Only people you connect with can view details.</span>
                </div>
              </label>
            </div>
          </div>

          <hr className="border-slate-100" />

          {/* Section 3: Notification Alerts */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-deep-maroon">Email Notifications</h3>
            <div className="space-y-3">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.matchAlerts}
                  onChange={(e) => setSettings({ ...settings, matchAlerts: e.target.checked })}
                  className="h-4 w-4 text-deep-maroon rounded focus:ring-deep-maroon cursor-pointer"
                />
                <div>
                  <span className="text-xs font-bold text-charcoal-text block">Daily Match Alerts</span>
                  <span className="text-[10px] text-soft-gray block mt-0.5">Send daily notifications containing personalized profile matches.</span>
                </div>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.weeklyDigest}
                  onChange={(e) => setSettings({ ...settings, weeklyDigest: e.target.checked })}
                  className="h-4 w-4 text-deep-maroon rounded focus:ring-deep-maroon cursor-pointer"
                />
                <div>
                  <span className="text-xs font-bold text-charcoal-text block">Weekly Newsletter Digest</span>
                  <span className="text-[10px] text-soft-gray block mt-0.5">Send a weekly summary of new registrations and success stories.</span>
                </div>
              </label>
            </div>
          </div>

          <div className="pt-4 text-right">
            <button
              type="submit"
              className="bg-deep-maroon hover:bg-primary text-white font-semibold py-2.5 px-6 rounded-lg shadow-md hover:shadow-lg transition-all active:scale-[0.98] cursor-pointer text-xs uppercase tracking-wider"
            >
              Update Settings
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}

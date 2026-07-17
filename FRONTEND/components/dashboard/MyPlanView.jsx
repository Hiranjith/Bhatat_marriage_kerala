import React from 'react';

export default function MyPlanView() {
  return (
    <div className="w-full flex flex-col gap-6">
      <section className="rounded-none md:rounded-xl border-none md:border md:border-slate-200/60 bg-transparent md:bg-white p-0 md:p-5 shadow-none md:shadow-sm text-left">
        {/* Header */}
        <div className="mb-6 border-b border-slate-100 pb-4">
          <h2 className="text-base font-bold text-charcoal-text uppercase tracking-wide flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-deep-maroon"></span>
            My Subscription Plan
          </h2>
          <p className="text-[11px] text-soft-gray mt-1">Review your current plan privileges or upgrade to access exclusive matching features.</p>
        </div>

        {/* Plans Grid */}
        <div className="grid gap-6 sm:grid-cols-2">
          {/* Card 1: Current Plan */}
          <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-5 flex flex-col justify-between relative overflow-hidden">
            <div className="absolute right-0 top-0 bg-slate-200/70 text-slate-700 text-[9px] font-bold py-1 px-3 rounded-bl-lg uppercase tracking-wider">
              Current Plan
            </div>
            
            <div>
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Standard Access</span>
              <h3 className="text-lg font-bold text-charcoal-text">Free Silver Plan</h3>
              <p className="text-2xl font-black text-slate-800 mt-2">₹0</p>
              
              <ul className="mt-5 space-y-2.5 text-xs text-slate-600">
                <li className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-emerald-600 text-sm">check_circle</span>
                  Create Profile & Upload Photos
                </li>
                <li className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-emerald-600 text-sm">check_circle</span>
                  Search & Browse Profiles
                </li>
                <li className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-emerald-600 text-sm">check_circle</span>
                  Send Express Interest Alerts
                </li>
                <li className="flex items-center gap-2 text-slate-400 line-through">
                  <span className="material-symbols-outlined text-slate-300 text-sm">cancel</span>
                  View Direct Contact Numbers
                </li>
                <li className="flex items-center gap-2 text-slate-400 line-through">
                  <span className="material-symbols-outlined text-slate-300 text-sm">cancel</span>
                  Initiate Direct Messaging/Chat
                </li>
              </ul>
            </div>
            
            <div className="mt-6 pt-4 border-t border-slate-200/60 text-[10px] text-slate-500">
              Status: <span className="font-semibold text-emerald-600">Active</span> &bull; Expires: <span className="font-medium">Never</span>
            </div>
          </div>

          {/* Card 2: Premium Plan Upgrade */}
          <div className="rounded-xl border border-heritage-gold/30 bg-gradient-to-br from-amber-50/20 via-rose-50/10 to-white p-5 flex flex-col justify-between relative overflow-hidden shadow-xs">
            <div className="absolute right-0 top-0 bg-heritage-gold text-white text-[9px] font-bold py-1 px-3 rounded-bl-lg uppercase tracking-wider animate-pulse">
              Highly Recommended
            </div>
            
            <div>
              <span className="text-[9px] font-bold text-heritage-gold uppercase tracking-widest block mb-1">Premium Privileges</span>
              <h3 className="text-lg font-bold text-deep-maroon">Gold Premium Plan</h3>
              <p className="text-2xl font-black text-deep-maroon mt-2">
                ₹2,999 <span className="text-xs font-normal text-slate-500">/ 6 Months</span>
              </p>
              
              <ul className="mt-5 space-y-2.5 text-xs text-slate-700">
                <li className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-heritage-gold text-sm font-bold">workspace_premium</span>
                  <strong>View Direct Mobile Numbers</strong>
                </li>
                <li className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-heritage-gold text-sm font-bold">workspace_premium</span>
                  <strong>Unlimited Chat Messages</strong>
                </li>
                <li className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-heritage-gold text-sm font-bold">workspace_premium</span>
                  Premium Profile Badge & Highlighting
                </li>
                <li className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-heritage-gold text-sm font-bold">workspace_premium</span>
                  Verified Profile Credential Status
                </li>
                <li className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-heritage-gold text-sm font-bold">workspace_premium</span>
                  Direct Astro-Porutham Matches Report
                </li>
              </ul>
            </div>
            
            <button className="mt-6 w-full bg-gradient-to-r from-deep-maroon to-primary hover:from-primary hover:to-deep-maroon text-white text-xs font-bold py-3 px-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 uppercase tracking-wider text-center cursor-pointer active:scale-95 border border-white/20">
              Upgrade to Gold Premium
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

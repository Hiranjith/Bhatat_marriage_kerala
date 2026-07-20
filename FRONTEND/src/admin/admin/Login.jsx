import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function AdminLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const cleanUser = username.trim().toLowerCase();
    
    if (cleanUser === 'userstaff@admin.com' && password === 'password') {
      localStorage.setItem('adminRole', 'User Management Staff');
      localStorage.setItem('isAdminLoggedIn', 'true');
      navigate('/admin/dashboard');
    } else if (cleanUser === 'financestaff@admin.com' && password === 'password') {
      localStorage.setItem('adminRole', 'Finance & Package Staff');
      localStorage.setItem('isAdminLoggedIn', 'true');
      navigate('/admin/dashboard');
    } else {
      alert("Invalid administrator credentials. Try:\n- userstaff@admin.com / password\n- financestaff@admin.com / password");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-rose-50/20 to-amber-50/10 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-slate-200/50 overflow-hidden">
        {/* Header Branding */}
        <div className="bg-gradient-to-r from-deep-maroon to-primary p-6 text-center text-white relative">
          <div className="absolute top-0 inset-x-0 h-1.5 bg-heritage-gold"></div>
          <div className="flex justify-center mb-2 mt-2">
            <span className="material-symbols-outlined text-4xl text-heritage-gold" style={{ fontVariationSettings: "'FILL' 1" }}>
              admin_panel_settings
            </span>
          </div>
          <h2 className="text-xl font-bold tracking-wide">Staff Admin Portal</h2>
          <p className="text-xs text-white/80 mt-1">Bharath Marriage Management Desk</p>
        </div>

        <div className="p-6 sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-4 text-left">
            <div>
              <label className="block text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                Staff Email
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg">
                  mail
                </span>
                <input
                  type="email"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full border border-slate-200 rounded-xl py-2 pl-10 pr-4 text-xs bg-slate-50/50 text-charcoal-text focus:outline-none focus:ring-1 focus:ring-deep-maroon placeholder-soft-gray/40 font-semibold"
                  placeholder="Enter staff email"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                Password
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg">
                  lock
                </span>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full border border-slate-200 rounded-xl py-2 pl-10 pr-10 text-xs bg-slate-50/50 text-charcoal-text focus:outline-none focus:ring-1 focus:ring-deep-maroon placeholder-soft-gray/40 font-semibold"
                  placeholder="Enter password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg hover:text-slate-600 transition-colors cursor-pointer"
                >
                  {showPassword ? "visibility_off" : "visibility"}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-deep-maroon to-primary hover:from-primary hover:to-deep-maroon text-white text-xs font-bold py-3 px-4 rounded-xl shadow-md transition-all duration-300 uppercase tracking-wider text-center cursor-pointer active:scale-98 flex items-center justify-center gap-2"
            >
              <span>Login Securely</span>
            </button>
          </form>

          {/* Quick Tips */}
          <div className="mt-6 p-4 rounded-xl bg-slate-50 border border-slate-150/60 text-left space-y-2 text-[10px] text-slate-550 font-semibold">
            <p className="font-bold text-slate-700 uppercase tracking-wide">Demo Accounts:</p>
            <div className="space-y-1">
              <p>👤 <span className="font-bold text-charcoal-text">User Staff:</span> userstaff@admin.com (pwd: password)</p>
              <p>💳 <span className="font-bold text-charcoal-text">Finance Staff:</span> financestaff@admin.com (pwd: password)</p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

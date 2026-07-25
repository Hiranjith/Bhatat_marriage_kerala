import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function SuperAdminLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    if (username === 'superadmin@gmail.com' && password === 'superadmin') {
      localStorage.setItem('adminRole', 'superadmin');
      localStorage.setItem('isAdminLoggedIn', 'true');
      navigate('/super-admin/dashboard');
    } else {
      setError('Invalid username or password');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-rose-50/20 to-amber-50/10 px-4">
      <div className="w-full max-w-md bg-paper-white rounded-2xl shadow-xl border border-surface-variant/40 overflow-hidden">
        {/* Header Branding */}
        <div className="bg-gradient-to-r from-deep-maroon to-primary p-6 text-center text-white relative">
          <div className="absolute top-0 inset-x-0 h-1.5 bg-heritage-gold"></div>
          <div className="flex justify-center mb-2 mt-2">
            <span className="material-symbols-outlined text-4xl text-heritage-gold" style={{ fontVariationSettings: "'FILL' 1" }}>
              admin_panel_settings
            </span>
          </div>
          <h2 className="text-xl font-display-lg font-bold tracking-wide">Super Admin Portal</h2>
          <p className="text-xs text-white/80 font-body-sm mt-1">Bharath Marriage Control Desk</p>
        </div>

        <div className="p-6 sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-4 text-left">
            {error && (
              <div className="text-red-600 bg-red-50 text-xs font-bold p-2 rounded-lg text-center border border-red-100">
                {error}
              </div>
            )}
            <div>
              <label className="block text-[10px] sm:text-xs font-bold uppercase tracking-wider text-charcoal-text/70 mb-1.5">
                Username / Email
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-soft-gray text-lg">
                  person
                </span>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full border border-surface-variant rounded-xl py-2 pl-10 pr-4 text-xs font-body-sm bg-white text-charcoal-text focus:outline-none focus:ring-1 focus:ring-deep-maroon focus:border-deep-maroon placeholder-soft-gray/40"
                  placeholder="Enter username"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] sm:text-xs font-bold uppercase tracking-wider text-charcoal-text/70 mb-1.5">
                Password
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-soft-gray text-lg">
                  lock
                </span>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full border border-surface-variant rounded-xl py-2 pl-10 pr-10 text-xs font-body-sm bg-white text-charcoal-text focus:outline-none focus:ring-1 focus:ring-deep-maroon focus:border-deep-maroon placeholder-soft-gray/40"
                  placeholder="Enter password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-soft-gray text-lg hover:text-charcoal-text transition-colors cursor-pointer"
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
        </div>
      </div>
    </div>
  );
}

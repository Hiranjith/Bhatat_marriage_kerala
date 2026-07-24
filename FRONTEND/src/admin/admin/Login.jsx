import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../utils/axiosInstance';

export default function AdminLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const cleanUser = username.trim().toLowerCase();
    
    setIsLoading(true);
    try {
      const response = await axiosInstance.post('/admin/staff/login', {
        email: cleanUser,
        password: password
      });
      
      const staff = response.data.staff;
      
      let mappedRole = 'User Management Staff';
      if (staff.role === 'FINANCE & PACKAGE') mappedRole = 'Finance & Package Staff';
      
      localStorage.setItem('adminRole', mappedRole);
      localStorage.setItem('adminFranchise', staff.franchise || '');
      localStorage.setItem('isAdminLoggedIn', 'true');
      navigate('/admin/dashboard');
      
    } catch (error) {
      console.warn("API login failed", error);
      alert(error.response?.data?.error || "Invalid administrator credentials.");
    } finally {
      setIsLoading(false);
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
              disabled={isLoading}
              className={`w-full bg-gradient-to-r from-deep-maroon to-primary hover:from-primary hover:to-deep-maroon text-white text-xs font-bold py-3 px-4 rounded-xl shadow-md transition-all duration-300 uppercase tracking-wider text-center flex items-center justify-center gap-2 ${isLoading ? 'opacity-70 cursor-not-allowed' : 'cursor-pointer active:scale-98'}`}
            >
              <span>{isLoading ? 'Logging In...' : 'Login Securely'}</span>
            </button>
          </form>



        </div>
      </div>
    </div>
  );
}

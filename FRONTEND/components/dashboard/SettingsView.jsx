import React, { useState, useEffect } from 'react';
import { useAuth } from '../../src/context/AuthContext';
import axiosInstance from '../../src/utils/axiosInstance';
import { useNavigate } from 'react-router-dom';

export default function SettingsView() {
  const { user, updateUser, logout } = useAuth();
  const navigate = useNavigate();
  const [settings, setSettings] = useState({
    email: user?.email_address || '',
    phone: user?.mobile_number || '',
    visibility: 'visible',
    matchAlerts: true,
    weeklyDigest: false,
  });

  const [isSaved, setIsSaved] = useState(false);
  const [error, setError] = useState(null);

  // Password Reset States
  const [passwordData, setPasswordData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [passwordError, setPasswordError] = useState(null);
  const [confirmPasswordError, setConfirmPasswordError] = useState(null);
  const [isResetSaved, setIsResetSaved] = useState(false);

  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    if (user) {
      setSettings(prev => ({
        ...prev,
        email: user.email_address || '',
        phone: user.mobile_number || '',
      }));
    }
  }, [user]);

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    setPasswordError(null);
    setConfirmPasswordError(null);

    if (passwordData.oldPassword === passwordData.newPassword) {
      setPasswordError("New password cannot be the same.");
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setConfirmPasswordError("Passwords do not match");
      return;
    }

    try {
      await axiosInstance.put(`/users/profile/${user.profile_id}/reset-password`, {
        oldPassword: passwordData.oldPassword,
        newPassword: passwordData.newPassword
      });
      setIsResetSaved(true);
      
      // Perform logout and redirect after a short delay
      setTimeout(async () => {
        try {
          await axiosInstance.post('/auth/logout');
        } catch (err) {
          console.error('Error calling logout API', err);
        }
        logout();
        navigate('/login');
      }, 3500);
      
    } catch (err) {
      console.error('Error resetting password:', err);
      if (err.response?.data?.field === 'oldPassword' || err.response?.data?.error === 'Incorrect old password') {
        setPasswordError('Incorrect password');
      } else {
        setPasswordError(err.response?.data?.error || 'Failed to reset password');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      await axiosInstance.put(`/users/profile/${user.profile_id}/settings`, {
        email: settings.email,
        phone: settings.phone,
      });
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 3000);
      if (updateUser) {
        updateUser({ ...user, email_address: settings.email, mobile_number: settings.phone });
      }
    } catch (err) {
      console.error('Error updating settings:', err);
      setError(err.response?.data?.error || 'Failed to update settings');
    }
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
          {error && (
            <div className="text-[11px] font-bold text-red-600 bg-red-50 border border-red-200/60 px-3 py-1 rounded-full flex items-center gap-1 animate-fade-in">
              <span className="material-symbols-outlined text-[13px]">error</span>
              {error}
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

            {/* Password Reset Sub-section */}
            <div className="mt-6 pt-6 border-t border-slate-100">
              <h4 className="text-[11px] font-bold uppercase tracking-wider text-charcoal-text mb-3">Change Password</h4>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-start">
                <div>
                  <label className="block text-[10px] text-slate-400 font-semibold mb-1">Old Password</label>
                  <div className="relative">
                    <input
                      type={showOldPassword ? "text" : "password"}
                      value={passwordData.oldPassword}
                      onChange={(e) => {
                        setPasswordData({ ...passwordData, oldPassword: e.target.value });
                        setPasswordError(null);
                      }}
                      className={`w-full border ${passwordError ? 'border-red-400 focus:ring-red-500 bg-red-50/30' : 'border-slate-200 focus:ring-deep-maroon bg-slate-50/50'} rounded-lg py-2 pl-3 pr-10 text-xs text-charcoal-text focus:outline-none focus:ring-1`}
                      placeholder="Enter old password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowOldPassword(!showOldPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none flex items-center justify-center"
                    >
                      <span className="material-symbols-outlined text-[16px]">{showOldPassword ? 'visibility_off' : 'visibility'}</span>
                    </button>
                  </div>
                  {passwordError && <p className="text-[10px] text-red-500 mt-1 font-semibold">{passwordError}</p>}
                </div>
                <div>
                  <label className="block text-[10px] text-slate-400 font-semibold mb-1">New Password</label>
                  <input
                    type="password"
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                    className="w-full border border-slate-200 rounded-lg py-2 px-3 text-xs bg-slate-50/50 text-charcoal-text focus:outline-none focus:ring-1 focus:ring-deep-maroon"
                    placeholder="Enter new password"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-slate-400 font-semibold mb-1">Confirm New Password</label>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <div className="relative flex-1">
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        value={passwordData.confirmPassword}
                        onChange={(e) => {
                          setPasswordData({ ...passwordData, confirmPassword: e.target.value });
                          setConfirmPasswordError(null);
                        }}
                        className={`w-full border ${confirmPasswordError ? 'border-red-400 focus:ring-red-500 bg-red-50/30' : 'border-slate-200 focus:ring-deep-maroon bg-slate-50/50'} rounded-lg py-2 pl-3 pr-10 text-xs text-charcoal-text focus:outline-none focus:ring-1`}
                        placeholder="Confirm new password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none flex items-center justify-center"
                      >
                        <span className="material-symbols-outlined text-[16px]">{showConfirmPassword ? 'visibility_off' : 'visibility'}</span>
                      </button>
                    </div>
                    <button
                      type="button"
                      onClick={handlePasswordReset}
                      disabled={!passwordData.oldPassword || !passwordData.newPassword || !passwordData.confirmPassword || isResetSaved}
                      className="bg-deep-maroon disabled:bg-slate-300 disabled:cursor-not-allowed hover:bg-primary text-white font-semibold py-2 px-4 rounded-lg shadow-sm transition-all active:scale-[0.98] text-[11px] whitespace-nowrap"
                    >
                      Reset
                    </button>
                  </div>
                  {confirmPasswordError && <p className="text-[10px] text-red-500 mt-1 font-semibold">{confirmPasswordError}</p>}
                </div>
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

      {/* Shadcn-style Toast Notification */}
      {isResetSaved && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 animate-in slide-in-from-top-5 fade-in duration-300">
          <div className="bg-white border border-slate-200 shadow-xl rounded-xl p-4 flex items-start gap-3 w-[320px]">
            <span className="material-symbols-outlined text-emerald-500 mt-0.5">check_circle</span>
            <div>
              <h4 className="text-sm font-semibold text-slate-900">Password Changed</h4>
              <p className="text-xs text-slate-500 mt-1">Your password has been successfully updated. Please login again.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

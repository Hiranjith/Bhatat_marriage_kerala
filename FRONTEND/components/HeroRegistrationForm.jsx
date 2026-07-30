import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../src/utils/axiosInstance';

export default function HeroRegistrationForm({ onClose } = {}) {
  const navigate = useNavigate();
  const [toast, setToast] = useState({ isVisible: false, message: '', type: 'success' });
  const [fullName, setFullName] = useState('');
  const [gender, setGender] = useState('Male');
  const [community, setCommunity] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [district, setDistrict] = useState('');
  const [loading, setLoading] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);

  // Date of Birth states
  const [dobDay, setDobDay] = useState('');
  const [dobMonth, setDobMonth] = useState('');
  const [dobYear, setDobYear] = useState('');
  const [showDobPicker, setShowDobPicker] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!dobDay || !dobMonth || !dobYear) {
      setToast({ isVisible: true, message: 'Please select your Date of Birth', type: 'error' });
      setTimeout(() => setToast({ isVisible: false, message: '', type: 'success' }), 3000);
      return;
    }

    const dobString = `${dobDay} ${dobMonth} ${dobYear}`;

    const payload = {
      full_name: fullName,
      country_code: '+91',
      mobile_number: phone,
      email_address: email,
      religion: community,
      district: district,
      dob: dobString,
      gender: gender
    };

    try {
      setLoading(true);
      const response = await axiosInstance.post('/auth/register', payload);
      setToast({ isVisible: true, message: 'Registration successful!', type: 'success' });

      // Clear form
      setFullName('');
      setGender('Male');
      setCommunity('');
      setPhone('');
      setEmail('');
      setDistrict('');
      setDobDay('');
      setDobMonth('');
      setDobYear('');
      setTermsAccepted(false);

      setTimeout(() => {
        setToast({ isVisible: false, message: '', type: 'success' });
        if (onClose) onClose();
        navigate('/login');
      }, 2000);
    } catch (error) {
      console.error('Registration failed:', error);
      setToast({ isVisible: true, message: error.response?.data?.error || 'Registration failed. Please try again.', type: 'error' });
      setTimeout(() => setToast({ isVisible: false, message: '', type: 'success' }), 3000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={
        onClose
          ? 'bg-paper-white p-4 w-full'
          : 'bg-paper-white p-3 sm:p-4 md:p-5 rounded-xl shadow-lg border border-surface-variant/40 border-t-4 border-t-deep-maroon fade-in w-full max-w-[290px] sm:max-w-[340px] md:max-w-[370px] md:justify-self-end md:translate-x-6 md:-translate-y-8 mx-auto'
      }
      style={onClose ? {} : { animationDelay: '0.2s' }}
    >
      <div className="mb-2 sm:mb-3">
        <h3 className="font-semibold text-xs sm:text-sm text-charcoal-text leading-snug">
          Find Your Partner From <span className="text-deep-maroon font-bold">5 Lakh+</span> Profiles
        </h3>
        <p className="text-[9px] sm:text-[10px] text-soft-gray mt-0.5">
          100% Free matrimonial services
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-2 sm:space-y-2.5 text-left">
        {/* Full Name & Phone */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-2.5">
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full border border-surface-variant rounded-lg py-1.5 px-2.5 text-[11px] font-body-sm bg-white text-charcoal-text focus:outline-none focus:ring-1 focus:ring-deep-maroon focus:border-deep-maroon placeholder-soft-gray/60"
            placeholder="Full Name"
            required
          />
          <div className="flex items-center border border-surface-variant rounded-lg bg-white overflow-hidden focus-within:ring-1 focus-within:ring-deep-maroon focus-within:border-deep-maroon">
            <div className="flex items-center gap-0.5 px-2 py-1 bg-white select-none border-r border-surface-variant/60 cursor-pointer">
              <span className="text-xs">🇮🇳</span>
              <span className="text-[10px] text-charcoal-text font-medium ml-0.5">+91</span>
              <span className="material-symbols-outlined text-[10px] text-soft-gray leading-none">
                keyboard_arrow_down
              </span>
            </div>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full border-none py-1.5 px-2 text-[11px] font-body-sm bg-white text-charcoal-text placeholder-soft-gray/60 focus:ring-0 focus:outline-none"
              placeholder="Mobile Number"
              required
            />
          </div>
        </div>

        {/* Email & District */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-2.5">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-surface-variant rounded-lg py-1.5 px-2.5 text-[11px] font-body-sm bg-white text-charcoal-text focus:outline-none focus:ring-1 focus:ring-deep-maroon focus:border-deep-maroon placeholder-soft-gray/60"
            placeholder="Email Address"
            required
          />
          <select
            value={district}
            onChange={(e) => setDistrict(e.target.value)}
            className="w-full border border-surface-variant rounded-lg py-1.5 px-2 text-[11px] bg-white text-charcoal-text focus:outline-none focus:ring-1 focus:ring-deep-maroon focus:border-deep-maroon"
          >
            <option value="">District</option>
            <option value="01- Thiruvananthapuram">01- Thiruvananthapuram</option>
            <option value="02- Kollam">02- Kollam</option>
            <option value="03- Pathanamthitta">03- Pathanamthitta</option>
            <option value="04- Alappuzha">04- Alappuzha</option>
            <option value="05- Kottayam">05- Kottayam</option>
            <option value="06- Idukki">06- Idukki</option>
            <option value="07- Ernakulam">07- Ernakulam</option>
            <option value="08- Thrissur">08- Thrissur</option>
            <option value="09- Palakkad">09- Palakkad</option>
            <option value="10- Malappuram">10- Malappuram</option>
            <option value="11- Kozhikode">11- Kozhikode</option>
            <option value="12- Wayanad">12- Wayanad</option>
            <option value="13- Kannur">13- Kannur</option>
            <option value="14- Kasaragod">14- Kasaragod</option>
          </select>
        </div>

        {/* Religion & DOB */}
        <div className="grid grid-cols-2 gap-2 sm:gap-2.5">
          <select
            value={community}
            onChange={(e) => setCommunity(e.target.value)}
            className="w-full border border-surface-variant rounded-lg py-1.5 px-2 text-[11px] bg-white text-charcoal-text focus:outline-none focus:ring-1 focus:ring-deep-maroon focus:border-deep-maroon"
          >
            <option value="">Religion</option>
            <option value="Hindu">Hindu</option>
            <option value="Christian">Christian</option>
            <option value="Muslim">Muslim</option>
            <option value="Other">Other</option>
          </select>

          {/* DOB Picker */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowDobPicker(!showDobPicker)}
              className={`w-full flex items-center justify-between gap-1 border rounded-lg py-1.5 px-2 text-[10px] bg-white text-charcoal-text hover:bg-slate-50 cursor-pointer h-full min-h-[32px] ${dobDay && dobMonth && dobYear
                ? 'border-deep-maroon font-semibold text-deep-maroon'
                : 'border-surface-variant text-soft-gray'
                }`}
            >
              <span className="flex items-center gap-1 overflow-hidden truncate">
                <span className="material-symbols-outlined text-[13px] text-soft-gray">calendar_month</span>
                <span className="truncate">
                  {dobDay && dobMonth && dobYear ? `${dobDay} ${dobMonth} ${dobYear}` : 'DOB'}
                </span>
              </span>
              <span className="material-symbols-outlined text-[12px] text-soft-gray">keyboard_arrow_down</span>
            </button>

            {showDobPicker && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setShowDobPicker(false)}></div>
                <div className="absolute right-0 top-full mt-1.5 z-50 bg-white border border-slate-200/80 shadow-xl rounded-xl p-3.5 w-[250px] animate-fade-in text-left">
                  <div className="text-[11px] font-semibold text-charcoal-text mb-2 flex justify-between items-center">
                    <span>Select Date of Birth</span>
                    <button
                      type="button"
                      onClick={() => setShowDobPicker(false)}
                      className="text-soft-gray hover:text-charcoal-text text-[10px] font-bold p-1"
                    >
                      ✕
                    </button>
                  </div>

                  <div className="grid grid-cols-3 gap-1.5 mb-3">
                    {/* Day */}
                    <select
                      value={dobDay}
                      onChange={(e) => setDobDay(e.target.value)}
                      className="w-full border border-slate-200 rounded-md py-1 px-1.5 text-[10px] bg-slate-50 text-charcoal-text focus:outline-none focus:ring-1 focus:ring-deep-maroon"
                    >
                      <option value="">Day</option>
                      {Array.from({ length: 31 }, (_, i) => i + 1).map((d) => (
                        <option key={d} value={d < 10 ? `0${d}` : `${d}`}>{d}</option>
                      ))}
                    </select>

                    {/* Month */}
                    <select
                      value={dobMonth}
                      onChange={(e) => setDobMonth(e.target.value)}
                      className="w-full border border-slate-200 rounded-md py-1 px-1.5 text-[10px] bg-slate-50 text-charcoal-text focus:outline-none focus:ring-1 focus:ring-deep-maroon"
                    >
                      <option value="">Month</option>
                      {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map((m) => (
                        <option key={m} value={m}>{m}</option>
                      ))}
                    </select>

                    {/* Year */}
                    <select
                      value={dobYear}
                      onChange={(e) => setDobYear(e.target.value)}
                      className="w-full border border-slate-200 rounded-md py-1 px-1.5 text-[10px] bg-slate-50 text-charcoal-text focus:outline-none focus:ring-1 focus:ring-deep-maroon"
                    >
                      <option value="">Year</option>
                      {Array.from({ length: 58 }, (_, i) => 2008 - i).map((y) => (
                        <option key={y} value={y}>{y}</option>
                      ))}
                    </select>
                  </div>

                  <button
                    type="button"
                    onClick={() => { if (dobDay && dobMonth && dobYear) setShowDobPicker(false); }}
                    disabled={!dobDay || !dobMonth || !dobYear}
                    className="w-full bg-deep-maroon text-white font-semibold py-1.5 rounded-lg text-[10px] uppercase tracking-wider hover:bg-primary transition-all disabled:opacity-50 disabled:cursor-not-allowed text-center cursor-pointer"
                  >
                    Confirm
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Gender: Male / Female toggle */}
        <div className="grid grid-cols-2 gap-2 sm:gap-2.5">
          <button
            type="button"
            onClick={() => setGender('Male')}
            className={`flex items-center justify-center gap-1 border rounded-lg py-1.5 px-1 text-[10px] cursor-pointer transition-all ${gender === 'Male'
              ? 'border-deep-maroon text-deep-maroon bg-deep-maroon/5 font-semibold'
              : 'border-surface-variant text-soft-gray bg-white hover:bg-slate-50'
              }`}
          >
            <span
              className="material-symbols-outlined text-[14px] leading-none"
              style={{ fontVariationSettings: gender === 'Male' ? "'FILL' 1" : "'FILL' 0" }}
            >
              account_circle
            </span>
            Male
          </button>
          <button
            type="button"
            onClick={() => setGender('Female')}
            className={`flex items-center justify-center gap-1 border rounded-lg py-1.5 px-1 text-[10px] cursor-pointer transition-all ${gender === 'Female'
              ? 'border-deep-maroon text-deep-maroon bg-deep-maroon/5 font-semibold'
              : 'border-surface-variant text-soft-gray bg-white hover:bg-slate-50'
              }`}
          >
            <span
              className="material-symbols-outlined text-[14px] leading-none"
              style={{ fontVariationSettings: gender === 'Female' ? "'FILL' 1" : "'FILL' 0" }}
            >
              account_circle
            </span>
            Female
          </button>
        </div>

        {/* Terms */}
        <div className="flex items-start gap-1.5 pt-0.5">
          <input
            type="checkbox"
            id="agreeTermsHero"
            checked={termsAccepted}
            onChange={(e) => setTermsAccepted(e.target.checked)}
            required
            className="mt-0.5 h-3 w-3 rounded border-surface-variant text-deep-maroon focus:ring-deep-maroon cursor-pointer"
          />
          <label htmlFor="agreeTermsHero" className="font-body-sm text-[9px] text-soft-gray leading-tight select-none cursor-pointer">
            I have read and agree to the{' '}
            <span className="font-semibold text-charcoal-text hover:underline">Terms of Use &amp; Privacy Policy</span>
          </label>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading || !termsAccepted}
          className="w-full bg-deep-maroon hover:bg-primary text-white font-semibold py-2 rounded-lg mt-0.5 shadow-md hover:shadow-lg transition-all active:scale-[0.98] cursor-pointer text-center text-[10px] tracking-wider uppercase disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {loading ? 'Registering...' : 'Register Free'}
        </button>

        {/* Support Links */}
        <div className="flex justify-center gap-6 mt-2.5 pt-2 border-t border-surface-variant/40">
          <a href="#support" className="flex items-center gap-1 text-soft-gray hover:text-deep-maroon transition-colors text-[10px] font-body-sm">
            <span className="material-symbols-outlined text-[13px] leading-none">support_agent</span>
            Support
          </a>
          <a href="#chat" className="flex items-center gap-1 text-soft-gray hover:text-deep-maroon transition-colors text-[10px] font-body-sm">
            <span className="material-symbols-outlined text-[13px] leading-none">chat</span>
            Chat for assistance
          </a>
        </div>
      </form>

      {/* Toast Notification */}
      {toast.isVisible && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[100] animate-fade-in flex items-center gap-3 px-5 py-3.5 rounded-xl shadow-xl border bg-slate-800 border-slate-700 text-white min-w-[280px] justify-center">
          <span className={`material-symbols-outlined ${toast.type === 'success' ? 'text-emerald-400' : 'text-rose-400'}`}>
            {toast.type === 'success' ? 'check_circle' : 'error'}
          </span>
          <span className="text-sm font-bold tracking-wide">{toast.message}</span>
        </div>
      )}
    </div>
  );
}

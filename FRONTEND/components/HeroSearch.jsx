import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const religionOptions = [
  { value: '', label: 'All Religions' },
  { value: 'Hindu', label: 'Hindu' },
  { value: 'Christian', label: 'Christian' },
  { value: 'Muslim', label: 'Muslim' },
  { value: 'Sikh', label: 'Sikh' }
];

const casteOptions = [
  { value: 'Open to all', label: 'All Castes' },
  { value: 'Brahmin', label: 'Brahmin' },
  { value: 'Reddy', label: 'Reddy' }
];

const lookingForOptions = [
  { value: 'Bride', label: 'Female' },
  { value: 'Groom', label: 'Male' }
];

const districtOptions = [
  { value: '', label: 'All Districts' },
  { value: 'Kochi', label: 'Kochi' },
  { value: 'Bangalore', label: 'Bangalore' },
  { value: 'Chennai', label: 'Chennai' },
  { value: 'Delhi', label: 'Delhi' },
  { value: 'Hyderabad', label: 'Hyderabad' }
];

const maritalStatusOptions = [
  { value: 'Never Married', label: 'Never Married' },
  { value: 'Second Marriage', label: 'Second Marriage' }
];

const ageRangeOptions = [
  { value: '', label: 'Any Age' },
  { value: '18-25', label: '18 - 25' },
  { value: '26-30', label: '26 - 30' },
  { value: '31-35', label: '31 - 35' },
  { value: '36-40', label: '36 - 40' }
];


export default function HeroSearch() {
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  const [religion, setReligion] = useState('Hindu');
  const [caste, setCaste] = useState('Open to all');
  const [lookingFor, setLookingFor] = useState('Bride');
  const [location, setLocation] = useState('');
  
  // Advanced filters state
  const [maritalStatus, setMaritalStatus] = useState('Never Married');
  const [ageRange, setAgeRange] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);

  const [activeDropdown, setActiveDropdown] = useState(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleQuickSearch = () => {
    navigate(`/search?gender=${lookingFor}&religion=${religion}&caste=${caste}&location=${location}&maritalStatus=${maritalStatus}&age=${ageRange}`);
  };

  return (
    <div ref={dropdownRef} className="relative z-30 w-full max-w-[320px] sm:max-w-2xl lg:max-w-3xl mx-auto glass-search-card rounded-xl sm:rounded-xl p-2 sm:p-3 md:p-3.5 shadow-2xl border border-white/25 animate-slide-up-fade">
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-1.5 sm:gap-2.5 items-center w-full">
        
        {/* Religion Dropdown */}
        <div className="relative w-full">
          <button
            type="button"
            onClick={() => setActiveDropdown(activeDropdown === 'religion' ? null : 'religion')}
            className="relative border border-white/30 rounded-lg py-1 px-2 sm:py-1.5 sm:px-2.5 bg-transparent text-left w-full hover:bg-white/10 transition-all cursor-pointer flex flex-col justify-center min-h-[34px] sm:min-h-[40px]"
          >
            <span className="block text-[6.5px] sm:text-[9px] text-white/70 font-semibold leading-none mb-0.5 select-none uppercase tracking-wider">Religion</span>
            <span className="block font-bold text-white text-[10px] sm:text-xs leading-none">
              {religionOptions.find(o => o.value === religion)?.label || 'All Religions'}
            </span>
            <span className={`absolute right-1.5 sm:right-2.5 top-1/2 -translate-y-1/2 material-symbols-outlined text-[11px] sm:text-[15px] text-white/80 transition-transform duration-200 pointer-events-none ${activeDropdown === 'religion' ? 'rotate-180' : ''}`}>
              keyboard_arrow_down
            </span>
          </button>
          {activeDropdown === 'religion' && (
            <div className="absolute left-0 right-0 mt-1 w-full bg-white rounded-lg shadow-xl border border-slate-100 py-1 z-55 animate-fade-in text-left max-h-60 overflow-y-auto">
              {religionOptions.map(option => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => {
                    setReligion(option.value);
                    setActiveDropdown(null);
                  }}
                  className={`w-full text-left px-3 py-2 text-[10px] sm:text-xs font-semibold hover:bg-slate-50 transition-colors flex justify-between items-center ${
                    religion === option.value ? 'text-deep-maroon bg-deep-maroon/5 font-bold' : 'text-charcoal-text font-medium'
                  }`}
                >
                  <span>{option.label}</span>
                  {religion === option.value && (
                    <span className="material-symbols-outlined text-sm text-deep-maroon">check</span>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Caste Dropdown */}
        <div className="relative w-full">
          <button
            type="button"
            onClick={() => setActiveDropdown(activeDropdown === 'caste' ? null : 'caste')}
            className="relative border border-white/30 rounded-lg py-1 px-2 sm:py-1.5 sm:px-2.5 bg-transparent text-left w-full hover:bg-white/10 transition-all cursor-pointer flex flex-col justify-center min-h-[34px] sm:min-h-[40px]"
          >
            <span className="block text-[6.5px] sm:text-[9px] text-white/70 font-semibold leading-none mb-0.5 select-none uppercase tracking-wider">Caste</span>
            <span className="block font-bold text-white text-[10px] sm:text-xs leading-none">
              {casteOptions.find(o => o.value === caste)?.label || 'All Castes'}
            </span>
            <span className={`absolute right-1.5 sm:right-2.5 top-1/2 -translate-y-1/2 material-symbols-outlined text-[11px] sm:text-[15px] text-white/80 transition-transform duration-200 pointer-events-none ${activeDropdown === 'caste' ? 'rotate-180' : ''}`}>
              keyboard_arrow_down
            </span>
          </button>
          {activeDropdown === 'caste' && (
            <div className="absolute left-0 right-0 mt-1 w-full bg-white rounded-lg shadow-xl border border-slate-100 py-1 z-55 animate-fade-in text-left max-h-60 overflow-y-auto">
              {casteOptions.map(option => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => {
                    setCaste(option.value);
                    setActiveDropdown(null);
                  }}
                  className={`w-full text-left px-3 py-2 text-[10px] sm:text-xs font-semibold hover:bg-slate-50 transition-colors flex justify-between items-center ${
                    caste === option.value ? 'text-deep-maroon bg-deep-maroon/5 font-bold' : 'text-charcoal-text font-medium'
                  }`}
                >
                  <span>{option.label}</span>
                  {caste === option.value && (
                    <span className="material-symbols-outlined text-sm text-deep-maroon">check</span>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Looking For Dropdown */}
        <div className="relative w-full">
          <button
            type="button"
            onClick={() => setActiveDropdown(activeDropdown === 'lookingFor' ? null : 'lookingFor')}
            className="relative border border-white/30 rounded-lg py-1 px-2 sm:py-1.5 sm:px-2.5 bg-transparent text-left w-full hover:bg-white/10 transition-all cursor-pointer flex flex-col justify-center min-h-[34px] sm:min-h-[40px]"
          >
            <span className="block text-[6.5px] sm:text-[9px] text-white/70 font-semibold leading-none mb-0.5 select-none uppercase tracking-wider">I'm looking for a</span>
            <span className="block font-bold text-white text-[10px] sm:text-xs leading-none">
              {lookingForOptions.find(o => o.value === lookingFor)?.label || 'Female'}
            </span>
            <span className={`absolute right-1.5 sm:right-2.5 top-1/2 -translate-y-1/2 material-symbols-outlined text-[11px] sm:text-[15px] text-white/80 transition-transform duration-200 pointer-events-none ${activeDropdown === 'lookingFor' ? 'rotate-180' : ''}`}>
              keyboard_arrow_down
            </span>
          </button>
          {activeDropdown === 'lookingFor' && (
            <div className="absolute left-0 right-0 mt-1 w-full bg-white rounded-lg shadow-xl border border-slate-100 py-1 z-55 animate-fade-in text-left max-h-60 overflow-y-auto">
              {lookingForOptions.map(option => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => {
                    setLookingFor(option.value);
                    setActiveDropdown(null);
                  }}
                  className={`w-full text-left px-3 py-2 text-[10px] sm:text-xs font-semibold hover:bg-slate-50 transition-colors flex justify-between items-center ${
                    lookingFor === option.value ? 'text-deep-maroon bg-deep-maroon/5 font-bold' : 'text-charcoal-text font-medium'
                  }`}
                >
                  <span>{option.label}</span>
                  {lookingFor === option.value && (
                    <span className="material-symbols-outlined text-sm text-deep-maroon">check</span>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* District Dropdown */}
        <div className="relative w-full">
          <button
            type="button"
            onClick={() => setActiveDropdown(activeDropdown === 'district' ? null : 'district')}
            className="relative border border-white/30 rounded-lg py-1 px-2 sm:py-1.5 sm:px-2.5 bg-transparent text-left w-full hover:bg-white/10 transition-all cursor-pointer flex flex-col justify-center min-h-[34px] sm:min-h-[40px]"
          >
            <span className="block text-[6.5px] sm:text-[9px] text-white/70 font-semibold leading-none mb-0.5 select-none uppercase tracking-wider">District</span>
            <span className="block font-bold text-white text-[10px] sm:text-xs leading-none">
              {districtOptions.find(o => o.value === location)?.label || 'All Districts'}
            </span>
            <span className={`absolute right-1.5 sm:right-2.5 top-1/2 -translate-y-1/2 material-symbols-outlined text-[11px] sm:text-[15px] text-white/80 transition-transform duration-200 pointer-events-none ${activeDropdown === 'district' ? 'rotate-180' : ''}`}>
              keyboard_arrow_down
            </span>
          </button>
          {activeDropdown === 'district' && (
            <div className="absolute left-0 right-0 mt-1 w-full bg-white rounded-lg shadow-xl border border-slate-100 py-1 z-55 animate-fade-in text-left max-h-60 overflow-y-auto">
              {districtOptions.map(option => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => {
                    setLocation(option.value);
                    setActiveDropdown(null);
                  }}
                  className={`w-full text-left px-3 py-2 text-[10px] sm:text-xs font-semibold hover:bg-slate-50 transition-colors flex justify-between items-center ${
                    location === option.value ? 'text-deep-maroon bg-deep-maroon/5 font-bold' : 'text-charcoal-text font-medium'
                  }`}
                >
                  <span>{option.label}</span>
                  {location === option.value && (
                    <span className="material-symbols-outlined text-sm text-deep-maroon">check</span>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Search Button */}
        <button
          onClick={handleQuickSearch}
          className="col-span-2 lg:col-span-1 flex items-center justify-center gap-1 bg-deep-maroon hover:bg-primary text-white font-bold rounded-lg transition-all active:scale-95 cursor-pointer text-[10px] sm:text-xs shrink-0 w-full h-[28px] sm:h-[38px] lg:h-[40px] shadow-lg hover:shadow-xl hover:-translate-y-0.5 duration-200"
        >
          <span className="material-symbols-outlined text-[14px] sm:text-[20px]">search</span>
          Search
        </button>
      </div>

      {/* Advanced Filters Section */}
      {showAdvanced && (
        <div className="grid grid-cols-2 gap-2 md:gap-3.5 mt-2.5 pt-2.5 border-t border-white/20 animate-slide-up-fade">
          
          {/* Marital Status Dropdown */}
          <div className="relative w-full">
            <button
              type="button"
              onClick={() => setActiveDropdown(activeDropdown === 'maritalStatus' ? null : 'maritalStatus')}
              className="relative border border-white/30 rounded-lg py-1 px-2 sm:py-1.5 sm:px-2.5 bg-transparent text-left w-full hover:bg-white/10 transition-all cursor-pointer flex flex-col justify-center min-h-[34px] sm:min-h-[40px]"
            >
              <span className="block text-[6.5px] sm:text-[9px] text-white/70 font-semibold leading-none mb-0.5 select-none uppercase tracking-wider">Marital Status</span>
              <span className="block font-bold text-white text-[10px] sm:text-xs leading-none">
                {maritalStatusOptions.find(o => o.value === maritalStatus)?.label || 'Never Married'}
              </span>
              <span className={`absolute right-1.5 sm:right-2.5 top-1/2 -translate-y-1/2 material-symbols-outlined text-[11px] sm:text-[15px] text-white/80 transition-transform duration-200 pointer-events-none ${activeDropdown === 'maritalStatus' ? 'rotate-180' : ''}`}>
                keyboard_arrow_down
              </span>
            </button>
            {activeDropdown === 'maritalStatus' && (
              <div className="absolute left-0 right-0 mt-1 w-full bg-white rounded-lg shadow-xl border border-slate-100 py-1 z-55 animate-fade-in text-left max-h-60 overflow-y-auto">
                {maritalStatusOptions.map(option => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => {
                      setMaritalStatus(option.value);
                      setActiveDropdown(null);
                    }}
                    className={`w-full text-left px-3 py-2 text-[10px] sm:text-xs font-semibold hover:bg-slate-50 transition-colors flex justify-between items-center ${
                      maritalStatus === option.value ? 'text-deep-maroon bg-deep-maroon/5 font-bold' : 'text-charcoal-text font-medium'
                    }`}
                  >
                    <span>{option.label}</span>
                    {maritalStatus === option.value && (
                      <span className="material-symbols-outlined text-sm text-deep-maroon">check</span>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Age Range Dropdown */}
          <div className="relative w-full">
            <button
              type="button"
              onClick={() => setActiveDropdown(activeDropdown === 'ageRange' ? null : 'ageRange')}
              className="relative border border-white/30 rounded-lg py-1 px-2 sm:py-1.5 sm:px-2.5 bg-transparent text-left w-full hover:bg-white/10 transition-all cursor-pointer flex flex-col justify-center min-h-[34px] sm:min-h-[40px]"
            >
              <span className="block text-[6.5px] sm:text-[9px] text-white/70 font-semibold leading-none mb-0.5 select-none uppercase tracking-wider">Age Range</span>
              <span className="block font-bold text-white text-[10px] sm:text-xs leading-none">
                {ageRangeOptions.find(o => o.value === ageRange)?.label || 'Any Age'}
              </span>
              <span className={`absolute right-1.5 sm:right-2.5 top-1/2 -translate-y-1/2 material-symbols-outlined text-[11px] sm:text-[15px] text-white/80 transition-transform duration-200 pointer-events-none ${activeDropdown === 'ageRange' ? 'rotate-180' : ''}`}>
                keyboard_arrow_down
              </span>
            </button>
            {activeDropdown === 'ageRange' && (
              <div className="absolute left-0 right-0 mt-1 w-full bg-white rounded-lg shadow-xl border border-slate-100 py-1 z-55 animate-fade-in text-left max-h-60 overflow-y-auto">
                {ageRangeOptions.map(option => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => {
                      setAgeRange(option.value);
                      setActiveDropdown(null);
                    }}
                    className={`w-full text-left px-3 py-2 text-[10px] sm:text-xs font-semibold hover:bg-slate-50 transition-colors flex justify-between items-center ${
                      ageRange === option.value ? 'text-deep-maroon bg-deep-maroon/5 font-bold' : 'text-charcoal-text font-medium'
                    }`}
                  >
                    <span>{option.label}</span>
                    {ageRange === option.value && (
                      <span className="material-symbols-outlined text-sm text-deep-maroon">check</span>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

        </div>
      )}

      {/* Advanced Filters Toggle Button */}
      <div className="mt-2.5 flex justify-center lg:justify-end pr-0.5">
        <button
          type="button"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="text-white/80 hover:text-white font-semibold text-[9px] sm:text-xs flex items-center gap-1 cursor-pointer transition-colors duration-200 select-none animate-fade-in"
        >
          <span>Advanced Filters</span>
          <span className={`material-symbols-outlined text-[12px] sm:text-[16px] transition-transform duration-200 ${showAdvanced ? 'rotate-180' : ''}`}>
            keyboard_arrow_down
          </span>
        </button>
      </div>

    </div>
  );
}

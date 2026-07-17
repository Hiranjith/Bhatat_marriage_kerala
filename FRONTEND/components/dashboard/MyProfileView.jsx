import React, { useState, useEffect } from 'react';
import HoroscopeChartsProfile from '../HoroscopeChartsProfile';
import { useAuth } from '../../src/context/AuthContext';
import axiosInstance from '../../src/utils/axiosInstance';
import * as kollavarshamPkg from 'kollavarsham';

const Kollavarsham = kollavarshamPkg.Kollavarsham || kollavarshamPkg.default || kollavarshamPkg;
const kollavarshamInstance = new Kollavarsham();

export default function MyProfileView() {
  const { user, login } = useAuth();
  
  const [profileData, setProfileData] = useState({
    name: '',
    gender: '',
    age: '',
    maritalStatus: '',
    height: '',
    profileCreatedFor: '',
    education: '',
    profession: '',
    country: '',
    state: '',
    district: '',
    city: '',
    birthTime: '',
    janmaSistaDasa: '',
    endDasa: '',
    dobMalayalam: '',
    dobEnglish: '',
    starRasi: '',
    fathersName: '',
    fathersJob: '',
    mothersName: '',
    mothersJob: '',
    siblingDetails: '',
    aboutMe: '',
  });

  useEffect(() => {
    if (user?.profile_id) {
      axiosInstance.get(`/users/profile/${user.profile_id}`)
        .then(res => {
          const fetchedProfile = res.data.user;
          if (fetchedProfile) {
            setProfileData({
              name: fetchedProfile.name || '',
              gender: fetchedProfile.gender || '',
              age: fetchedProfile.age || '',
              maritalStatus: fetchedProfile.marital_status || '',
              height: fetchedProfile.height || '',
              profileCreatedFor: fetchedProfile.profile_created_for || '',
              education: fetchedProfile.education || '',
              profession: fetchedProfile.profession || '',
              country: fetchedProfile.country || '',
              state: fetchedProfile.state || '',
              district: fetchedProfile.district || '',
              city: fetchedProfile.place || '',
              birthTime: fetchedProfile.birth_time || '',
              janmaSistaDasa: '', // Not in DB schema
              endDasa: '', // Not in DB schema
              dobMalayalam: fetchedProfile.date_of_birth_malayalam ? (() => {
                const parts = fetchedProfile.date_of_birth_malayalam.split(' ');
                if (parts.length === 3) return `${parts[2]}/${parts[1]}/${parts[0]}`;
                return fetchedProfile.date_of_birth_malayalam;
              })() : '',
              dobEnglish: fetchedProfile.date_of_birth ? (() => {
                const d = new Date(fetchedProfile.date_of_birth);
                return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;
              })() : '',
              starRasi: (fetchedProfile.nakshatra || '') + (fetchedProfile.rasi ? ` / ${fetchedProfile.rasi}` : ''),
              fathersName: fetchedProfile.fathers_name || '',
              fathersJob: fetchedProfile.fathers_job || '',
              mothersName: fetchedProfile.mothers_name || '',
              mothersJob: fetchedProfile.mothers_job || '',
              siblingDetails: fetchedProfile.sibling_details || '',
              aboutMe: fetchedProfile.about_me || '',
            });
          }
        })
        .catch(err => console.error('Failed to fetch profile', err));

      axiosInstance.get(`/users/profile/${user.profile_id}/planetary-positions`)
        .then(res => {
          const positions = res.data.positions || [];
          const newGrahanila = {};
          const newNavamsakam = {};
          
          const englishToPlanet = {
            'Lagna': 'ല',
            'Sun': 'സൂ',
            'Moon': 'ച',
            'Mars': 'ചൊ',
            'Mercury': 'ബു',
            'Jupiter': 'ഗു',
            'Venus': 'ശു',
            'Saturn': 'ശ',
            'Rahu': 'രാ',
            'Ketu': 'കെ'
          };

          positions.forEach(pos => {
            const malPlanet = englishToPlanet[pos.planet_name] || pos.planet_name;
            if (pos.chart_type === 'grahanila') {
              if (!newGrahanila[pos.house_number]) newGrahanila[pos.house_number] = [];
              newGrahanila[pos.house_number].push(malPlanet);
            } else if (pos.chart_type === 'navamsakam') {
              if (!newNavamsakam[pos.house_number]) newNavamsakam[pos.house_number] = [];
              newNavamsakam[pos.house_number].push(malPlanet);
            }
          });
          
          setGrahanila(newGrahanila);
          setNavamsakam(newNavamsakam);
        })
        .catch(err => console.error('Failed to fetch planetary positions', err));
    }
  }, [user?.profile_id]);

  const [grahanila, setGrahanila] = useState({});
  const [navamsakam, setNavamsakam] = useState({});
  const [isSaved, setIsSaved] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prev) => {
      const newData = { ...prev, [name]: value };
      if (name === 'dobEnglish') {
        if (value && value.includes('/')) {
          const parts = value.split('/');
          if (parts.length === 3 && parts[0].length === 2 && parts[1].length === 2 && parts[2].length === 4) {
            const d = new Date(`${parts[2]}-${parts[1]}-${parts[0]}`);
            if (!isNaN(d.getTime())) {
              // Calculate Age
              const today = new Date();
              let age = today.getFullYear() - d.getFullYear();
              const m = today.getMonth() - d.getMonth();
              if (m < 0 || (m === 0 && today.getDate() < d.getDate())) {
                age--;
              }
              newData.age = age;

              // Calculate Malayalam DOB if Hindu
              if (user?.religion === 'Hindu') {
                const result = kollavarshamInstance.fromGregorianDate(d);
                newData.dobMalayalam = `${String(result.date).padStart(2, '0')}/${String(result.month).padStart(2, '0')}/${String(result.year).padStart(4, '0')}`;
              }
            }
          }
        }
      }
      return newData;
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!user?.profile_id) return;

    const submitData = { ...profileData };
    if (submitData.dobEnglish && submitData.dobEnglish.includes('/')) {
      const parts = submitData.dobEnglish.split('/');
      if (parts.length === 3) {
        submitData.dobEnglish = `${parts[2]}-${parts[1]}-${parts[0]}`;
      }
    }

    const planetToEnglish = {
      'ല': 'Lagna',
      'സൂ': 'Sun',
      'ച': 'Moon',
      'ചൊ': 'Mars',
      'ബു': 'Mercury',
      'ഗു': 'Jupiter',
      'ശു': 'Venus',
      'ശ': 'Saturn',
      'രാ': 'Rahu',
      'കെ': 'Ketu'
    };

    const positions = [];
    Object.keys(grahanila).forEach(house => {
      grahanila[house].forEach(planet => {
        const enPlanet = planetToEnglish[planet] || planet;
        positions.push({ chart_type: 'grahanila', planet_name: enPlanet, house_number: Number(house) });
      });
    });
    Object.keys(navamsakam).forEach(house => {
      navamsakam[house].forEach(planet => {
        const enPlanet = planetToEnglish[planet] || planet;
        positions.push({ chart_type: 'navamsakam', planet_name: enPlanet, house_number: Number(house) });
      });
    });

    const updateProfilePromise = axiosInstance.put(`/users/profile/${user.profile_id}`, submitData);
    const updatePositionsPromise = axiosInstance.put(`/users/profile/${user.profile_id}/planetary-positions`, { positions });

    Promise.all([updateProfilePromise, updatePositionsPromise])
      .then(() => {
        setIsSaved(true);
        setIsEditing(false);
        // Sync the updated name to the global AuthContext so the sidebar/header updates instantly
        if (profileData.name && user.full_name !== profileData.name) {
          login({ ...user, full_name: profileData.name });
        }
        setTimeout(() => setIsSaved(false), 3000);
      })
      .catch(err => {
        console.error('Failed to update profile or planetary positions', err);
      });
  };

  return (
    <div className="w-full flex flex-col gap-6">
      <section className="rounded-none md:rounded-xl border-none md:border md:border-slate-200/60 bg-transparent md:bg-white p-0 md:p-6 shadow-none md:shadow-sm text-left">
        <div className="mb-4 md:mb-6 border-b border-slate-100 pb-3 md:pb-4 flex justify-between items-center">
          <div>
            <h2 className="text-sm md:text-base font-bold text-charcoal-text uppercase tracking-wide flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-deep-maroon"></span>
              My Profile
            </h2>
            <p className="text-[10px] md:text-[11px] text-soft-gray mt-0.5">Keep your profile updated to receive higher match quality.</p>
          </div>
          <div className="flex items-center gap-3">
            {isSaved && (
              <div className="text-[10px] md:text-[11px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-200/60 px-2.5 py-0.5 rounded-full flex items-center gap-1 animate-fade-in">
                <span className="material-symbols-outlined text-[12px] md:text-[13px]">check_circle</span>
                Saved!
              </div>
            )}
            {!isEditing && (
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="bg-slate-100 hover:bg-slate-200 text-charcoal-text font-semibold py-1.5 px-3 md:py-2 md:px-4 rounded-lg shadow-sm transition-all cursor-pointer text-[10px] md:text-xs uppercase tracking-wider flex items-center gap-1.5"
              >
                <span className="material-symbols-outlined text-[14px]">edit</span>
                Edit Profile
              </button>
            )}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
          {/* Section 1: About Me */}
          <div className="space-y-2">
            <h3 className="text-[10px] md:text-xs font-bold uppercase tracking-wider text-deep-maroon">About Me</h3>
            <textarea
              name="aboutMe"
              value={profileData.aboutMe}
              onChange={handleChange} disabled={!isEditing}
              rows={3}
              className="w-full border border-slate-200 rounded-lg p-2.5 text-[11px] md:text-xs bg-slate-50/50 text-charcoal-text disabled:opacity-60 disabled:bg-slate-100/50 disabled:cursor-not-allowed disabled:border-slate-100 focus:outline-none focus:ring-1 focus:ring-deep-maroon focus:border-deep-maroon placeholder-soft-gray/60 leading-relaxed"
              placeholder="Tell prospective matches about your personality, interests, and family..."
            />
          </div>

          <hr className="border-slate-100" />

          {/* Section 2: Personal Details */}
          <div className="space-y-3">
            <h3 className="text-[10px] md:text-xs font-bold uppercase tracking-wider text-deep-maroon">Personal Details</h3>
            <div className="grid grid-cols-2 gap-3 md:gap-4">
              <div className="col-span-2 md:col-span-1">
                <label className="block text-[9px] md:text-[10px] text-slate-400 font-semibold mb-0.5">Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={profileData.name}
                  onChange={handleChange} disabled={!isEditing}
                  className="w-full border border-slate-200 rounded-lg py-1.5 px-2.5 text-[11px] md:text-xs bg-slate-50/50 text-charcoal-text disabled:opacity-60 disabled:bg-slate-100/50 disabled:cursor-not-allowed disabled:border-slate-100 focus:outline-none focus:ring-1 focus:ring-deep-maroon"
                />
              </div>

              <div className="col-span-1">
                <label className="block text-[9px] md:text-[10px] text-slate-400 font-semibold mb-0.5">Gender</label>
                <select
                  name="gender"
                  value={profileData.gender}
                  onChange={handleChange} disabled={!isEditing}
                  className="w-full border border-slate-200 rounded-lg py-1.5 px-2.5 text-[11px] md:text-xs bg-slate-50/50 text-charcoal-text disabled:opacity-60 disabled:bg-slate-100/50 disabled:cursor-not-allowed disabled:border-slate-100 focus:outline-none focus:ring-1 focus:ring-deep-maroon"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>

              <div className="col-span-1">
                <label className="block text-[9px] md:text-[10px] text-slate-400 font-semibold mb-0.5">Height</label>
                <input
                  type="text"
                  name="height"
                  value={profileData.height}
                  onChange={handleChange} disabled={!isEditing}
                  className="w-full border border-slate-200 rounded-lg py-1.5 px-2.5 text-[11px] md:text-xs bg-slate-50/50 text-charcoal-text disabled:opacity-60 disabled:bg-slate-100/50 disabled:cursor-not-allowed disabled:border-slate-100 focus:outline-none focus:ring-1 focus:ring-deep-maroon"
                />
              </div>

              <div className="col-span-1">
                <label className="block text-[9px] md:text-[10px] text-slate-400 font-semibold mb-0.5">Age</label>
                <input
                  type="text"
                  name="age"
                  value={profileData.age}
                  onChange={handleChange} disabled={!isEditing}
                  className="w-full border border-slate-200 rounded-lg py-1.5 px-2.5 text-[11px] md:text-xs bg-slate-50/50 text-charcoal-text disabled:opacity-60 disabled:bg-slate-100/50 disabled:cursor-not-allowed disabled:border-slate-100 focus:outline-none focus:ring-1 focus:ring-deep-maroon"
                />
              </div>

              <div className="col-span-1">
                <label className="block text-[9px] md:text-[10px] text-slate-400 font-semibold mb-0.5">Marital Status</label>
                <select
                  name="maritalStatus"
                  value={profileData.maritalStatus}
                  onChange={handleChange} disabled={!isEditing}
                  className="w-full border border-slate-200 rounded-lg py-1.5 px-2.5 text-[11px] md:text-xs bg-slate-50/50 text-charcoal-text disabled:opacity-60 disabled:bg-slate-100/50 disabled:cursor-not-allowed disabled:border-slate-100 focus:outline-none focus:ring-1 focus:ring-deep-maroon"
                >
                  <option value="Never Married">Never Married</option>
                  <option value="Second Marriage">Second Marriage</option>
                </select>
              </div>

              <div className="col-span-1">
                <label className="block text-[9px] md:text-[10px] text-slate-400 font-semibold mb-0.5">Profile Created For</label>
                <select
                  name="profileCreatedFor"
                  value={profileData.profileCreatedFor}
                  onChange={handleChange} disabled={!isEditing}
                  className="w-full border border-slate-200 rounded-lg py-1.5 px-2.5 text-[11px] md:text-xs bg-slate-50/50 text-charcoal-text disabled:opacity-60 disabled:bg-slate-100/50 disabled:cursor-not-allowed disabled:border-slate-100 focus:outline-none focus:ring-1 focus:ring-deep-maroon"
                >
                  <option value="Myself">Myself</option>
                  <option value="Son">Son</option>
                  <option value="Daughter">Daughter</option>
                  <option value="Brother">Brother</option>
                  <option value="Sister">Sister</option>
                  <option value="Relative">Relative</option>
                  <option value="Friend">Friend</option>
                </select>
              </div>
            </div>
          </div>

          <hr className="border-slate-100" />

          {/* Section 3: Professional Info */}
          <div className="space-y-3">
            <h3 className="text-[10px] md:text-xs font-bold uppercase tracking-wider text-deep-maroon">Professional & Academic Details</h3>
            <div className="grid grid-cols-2 gap-3 md:gap-4">
              <div className="col-span-1">
                <label className="block text-[9px] md:text-[10px] text-slate-400 font-semibold mb-0.5">Education Level</label>
                <input
                  type="text"
                  name="education"
                  value={profileData.education}
                  onChange={handleChange} disabled={!isEditing}
                  className="w-full border border-slate-200 rounded-lg py-1.5 px-2.5 text-[11px] md:text-xs bg-slate-50/50 text-charcoal-text disabled:opacity-60 disabled:bg-slate-100/50 disabled:cursor-not-allowed disabled:border-slate-100 focus:outline-none focus:ring-1 focus:ring-deep-maroon"
                />
              </div>

              <div className="col-span-1">
                <label className="block text-[9px] md:text-[10px] text-slate-400 font-semibold mb-0.5">Occupation / Profession</label>
                <input
                  type="text"
                  name="profession"
                  value={profileData.profession}
                  onChange={handleChange} disabled={!isEditing}
                  className="w-full border border-slate-200 rounded-lg py-1.5 px-2.5 text-[11px] md:text-xs bg-slate-50/50 text-charcoal-text disabled:opacity-60 disabled:bg-slate-100/50 disabled:cursor-not-allowed disabled:border-slate-100 focus:outline-none focus:ring-1 focus:ring-deep-maroon"
                />
              </div>

            </div>
          </div>

          <hr className="border-slate-100" />

          {/* Section: Location Details */}
          <div className="space-y-3">
            <h3 className="text-[10px] md:text-xs font-bold uppercase tracking-wider text-deep-maroon">Location Details</h3>
            <div className="grid grid-cols-2 gap-3 md:gap-4">
              <div className="col-span-1">
                <label className="block text-[9px] md:text-[10px] text-slate-400 font-semibold mb-0.5">Country</label>
                <input
                  type="text"
                  name="country"
                  value={profileData.country}
                  onChange={handleChange} disabled={!isEditing}
                  className="w-full border border-slate-200 rounded-lg py-1.5 px-2.5 text-[11px] md:text-xs bg-slate-50/50 text-charcoal-text disabled:opacity-60 disabled:bg-slate-100/50 disabled:cursor-not-allowed disabled:border-slate-100 focus:outline-none focus:ring-1 focus:ring-deep-maroon"
                />
              </div>

              <div className="col-span-1">
                <label className="block text-[9px] md:text-[10px] text-slate-400 font-semibold mb-0.5">State</label>
                <input
                  type="text"
                  name="state"
                  value={profileData.state}
                  onChange={handleChange} disabled={!isEditing}
                  className="w-full border border-slate-200 rounded-lg py-1.5 px-2.5 text-[11px] md:text-xs bg-slate-50/50 text-charcoal-text disabled:opacity-60 disabled:bg-slate-100/50 disabled:cursor-not-allowed disabled:border-slate-100 focus:outline-none focus:ring-1 focus:ring-deep-maroon"
                />
              </div>

              <div className="col-span-1">
                <label className="block text-[9px] md:text-[10px] text-slate-400 font-semibold mb-0.5">District</label>
                <input
                  type="text"
                  name="district"
                  value={profileData.district}
                  onChange={handleChange} disabled={!isEditing}
                  className="w-full border border-slate-200 rounded-lg py-1.5 px-2.5 text-[11px] md:text-xs bg-slate-50/50 text-charcoal-text disabled:opacity-60 disabled:bg-slate-100/50 disabled:cursor-not-allowed disabled:border-slate-100 focus:outline-none focus:ring-1 focus:ring-deep-maroon"
                />
              </div>

              <div className="col-span-1">
                <label className="block text-[9px] md:text-[10px] text-slate-400 font-semibold mb-0.5">City</label>
                <input
                  type="text"
                  name="city"
                  value={profileData.city}
                  onChange={handleChange} disabled={!isEditing}
                  className="w-full border border-slate-200 rounded-lg py-1.5 px-2.5 text-[11px] md:text-xs bg-slate-50/50 text-charcoal-text disabled:opacity-60 disabled:bg-slate-100/50 disabled:cursor-not-allowed disabled:border-slate-100 focus:outline-none focus:ring-1 focus:ring-deep-maroon"
                />
              </div>
            </div>
          </div>

          <hr className="border-slate-100" />

         

          {/* Section: Family Details */}
          <div className="space-y-3">
            <h3 className="text-[10px] md:text-xs font-bold uppercase tracking-wider text-deep-maroon">Family details</h3>
            <div className="grid grid-cols-2 gap-3 md:gap-4">
              <div className="col-span-1">
                <label className="block text-[9px] md:text-[10px] text-slate-400 font-semibold mb-0.5">Father's Name</label>
                <input type="text" name="fathersName" value={profileData.fathersName} onChange={handleChange} disabled={!isEditing} className="w-full border border-slate-200 rounded-lg py-1.5 px-2.5 text-[11px] md:text-xs bg-slate-50/50 text-charcoal-text disabled:opacity-60 disabled:bg-slate-100/50 disabled:cursor-not-allowed disabled:border-slate-100 focus:outline-none focus:ring-1 focus:ring-deep-maroon" />
              </div>
              <div className="col-span-1">
                <label className="block text-[9px] md:text-[10px] text-slate-400 font-semibold mb-0.5">Father's Job</label>
                <input type="text" name="fathersJob" value={profileData.fathersJob} onChange={handleChange} disabled={!isEditing} className="w-full border border-slate-200 rounded-lg py-1.5 px-2.5 text-[11px] md:text-xs bg-slate-50/50 text-charcoal-text disabled:opacity-60 disabled:bg-slate-100/50 disabled:cursor-not-allowed disabled:border-slate-100 focus:outline-none focus:ring-1 focus:ring-deep-maroon" />
              </div>
              <div className="col-span-1">
                <label className="block text-[9px] md:text-[10px] text-slate-400 font-semibold mb-0.5">Mother's Name</label>
                <input type="text" name="mothersName" value={profileData.mothersName} onChange={handleChange} disabled={!isEditing} className="w-full border border-slate-200 rounded-lg py-1.5 px-2.5 text-[11px] md:text-xs bg-slate-50/50 text-charcoal-text disabled:opacity-60 disabled:bg-slate-100/50 disabled:cursor-not-allowed disabled:border-slate-100 focus:outline-none focus:ring-1 focus:ring-deep-maroon" />
              </div>
              <div className="col-span-1">
                <label className="block text-[9px] md:text-[10px] text-slate-400 font-semibold mb-0.5">Mother's Job</label>
                <input type="text" name="mothersJob" value={profileData.mothersJob} onChange={handleChange} disabled={!isEditing} className="w-full border border-slate-200 rounded-lg py-1.5 px-2.5 text-[11px] md:text-xs bg-slate-50/50 text-charcoal-text disabled:opacity-60 disabled:bg-slate-100/50 disabled:cursor-not-allowed disabled:border-slate-100 focus:outline-none focus:ring-1 focus:ring-deep-maroon" />
              </div>
              <div className="col-span-2">
                <label className="block text-[9px] md:text-[10px] text-slate-400 font-semibold mb-0.5">Sibling Details</label>
                <textarea name="siblingDetails" value={profileData.siblingDetails} onChange={handleChange} disabled={!isEditing} rows={2} className="w-full border border-slate-200 rounded-lg py-1.5 px-2.5 text-[11px] md:text-xs bg-slate-50/50 text-charcoal-text disabled:opacity-60 disabled:bg-slate-100/50 disabled:cursor-not-allowed disabled:border-slate-100 focus:outline-none focus:ring-1 focus:ring-deep-maroon" />
              </div>
            </div>
          </div>
          {/* Section: Horoscope Details */}
          {user?.religion === 'Hindu' && (
            <div className="space-y-3">
              <h3 className="text-[10px] md:text-xs font-bold uppercase tracking-wider text-deep-maroon">Horoscope Details</h3>
              <div className="grid grid-cols-2 gap-3 md:gap-4">
                <div className="col-span-1">
                  <label className="block text-[9px] md:text-[10px] text-slate-400 font-semibold mb-0.5">Birth Time</label>
                  <input type="time" name="birthTime" value={profileData.birthTime} onChange={handleChange} disabled={!isEditing} className="w-full border border-slate-200 rounded-lg py-1.5 px-2.5 text-[11px] md:text-xs bg-slate-50/50 text-charcoal-text disabled:opacity-60 disabled:bg-slate-100/50 disabled:cursor-not-allowed disabled:border-slate-100 focus:outline-none focus:ring-1 focus:ring-deep-maroon" />
                </div>
                {/* <div className="col-span-1">
                  <label className="block text-[9px] md:text-[10px] text-slate-400 font-semibold mb-0.5">Janma Sista Dasa</label>
                  <input type="text" name="janmaSistaDasa" value={profileData.janmaSistaDasa} onChange={handleChange} disabled={!isEditing} className="w-full border border-slate-200 rounded-lg py-1.5 px-2.5 text-[11px] md:text-xs bg-slate-50/50 text-charcoal-text disabled:opacity-60 disabled:bg-slate-100/50 disabled:cursor-not-allowed disabled:border-slate-100 focus:outline-none focus:ring-1 focus:ring-deep-maroon" />
                </div> */}
                <div className="col-span-1">
                  <label className="block text-[9px] md:text-[10px] text-slate-400 font-semibold mb-0.5">End Dasa</label>
                  <input type="text" name="endDasa" value={profileData.endDasa} onChange={handleChange} disabled={!isEditing} className="w-full border border-slate-200 rounded-lg py-1.5 px-2.5 text-[11px] md:text-xs bg-slate-50/50 text-charcoal-text disabled:opacity-60 disabled:bg-slate-100/50 disabled:cursor-not-allowed disabled:border-slate-100 focus:outline-none focus:ring-1 focus:ring-deep-maroon" />
                </div>
                <div className="col-span-1">
                  <label className="block text-[9px] md:text-[10px] text-slate-400 font-semibold mb-0.5">Dob (Malayalam)</label>
                  <input type="text" name="dobMalayalam" value={profileData.dobMalayalam} onChange={handleChange} disabled={!isEditing} className="w-full border border-slate-200 rounded-lg py-1.5 px-2.5 text-[11px] md:text-xs bg-slate-50/50 text-charcoal-text disabled:opacity-60 disabled:bg-slate-100/50 disabled:cursor-not-allowed disabled:border-slate-100 focus:outline-none focus:ring-1 focus:ring-deep-maroon" />
                </div>
                <div className="col-span-1">
                  <label className="block text-[9px] md:text-[10px] text-slate-400 font-semibold mb-0.5">Dob (English)</label>
                  <input type="text" placeholder="DD/MM/YYYY" name="dobEnglish" value={profileData.dobEnglish} onChange={handleChange} disabled={!isEditing} className="w-full border border-slate-200 rounded-lg py-1.5 px-2.5 text-[11px] md:text-xs bg-slate-50/50 text-charcoal-text disabled:opacity-60 disabled:bg-slate-100/50 disabled:cursor-not-allowed disabled:border-slate-100 focus:outline-none focus:ring-1 focus:ring-deep-maroon" />
                </div>
                <div className="col-span-1">
                  <label className="block text-[9px] md:text-[10px] text-slate-400 font-semibold mb-0.5">Star / Rasi</label>
                  <input type="text" name="starRasi" value={profileData.starRasi} onChange={handleChange} disabled={!isEditing} className="w-full border border-slate-200 rounded-lg py-1.5 px-2.5 text-[11px] md:text-xs bg-slate-50/50 text-charcoal-text focus:outline-none focus:ring-1 focus:ring-deep-maroon" />
                </div>
              </div>
              <HoroscopeChartsProfile 
                editMode={isEditing} 
                grahanila={grahanila}
                setGrahanila={setGrahanila}
                navamsakam={navamsakam}
                setNavamsakam={setNavamsakam}
              />
            </div>
          )}

          <hr className="border-slate-100" />

          {isEditing && (
            <div className="pt-2 md:pt-4 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="bg-white border border-slate-200 hover:bg-slate-50 text-charcoal-text font-semibold py-2 px-4 md:py-2.5 md:px-6 rounded-lg shadow-sm transition-all cursor-pointer text-[10px] md:text-xs uppercase tracking-wider"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-deep-maroon hover:bg-primary text-white font-semibold py-2 px-4 md:py-2.5 md:px-6 rounded-lg shadow-md hover:shadow-lg transition-all active:scale-[0.98] cursor-pointer text-[10px] md:text-xs uppercase tracking-wider"
              >
                Save Profile Changes
              </button>
            </div>
          )}
        </form>
      </section>
    </div>
  );
}

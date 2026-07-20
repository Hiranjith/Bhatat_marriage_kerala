import React, { useState } from 'react';

const INITIAL_USERS = [
  {
    id: "BKLH000000001",
    name: "Aishwarya R.",
    gender: "Bride",
    age: 26,
    height: "5'4\"",
    religion: "Hindu",
    caste: "Nair",
    education: "M.Tech",
    profession: "Software Engineer",
    location: "Bangalore",
    image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&q=80&w=400&h=500",
    verified: true,
    premium: true,
    status: "Active",
    online: true,
    reported: false,
    reportReason: "",
    bio: "I am a career-oriented, independent Software Engineer based in Bangalore. I value family traditions, enjoy cooking, reading, and traveling. Looking for a compatible partner."
  },
  {
    id: "BKLH000000002",
    name: "Adithya K.",
    gender: "Groom",
    age: 28,
    height: "5'11\"",
    religion: "Hindu",
    caste: "Iyer",
    education: "MBA",
    profession: "Product Manager",
    location: "Chennai",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400&h=500",
    verified: false,
    premium: false,
    status: "Active",
    online: false,
    reported: false,
    reportReason: "",
    bio: "I am a Product Manager currently working in Chennai. I love hiking, photography, and playing music. Looking for someone with a modern yet traditional outlook."
  }
];

export default function UserManagement() {
  const [users, setUsers] = useState(INITIAL_USERS);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [genderFilter, setGenderFilter] = useState('All');
  const [selectedUser, setSelectedUser] = useState(null);

  // Local drawer state for tracking changes before Save
  const [drawerVerified, setDrawerVerified] = useState(false);
  const [drawerStatus, setDrawerStatus] = useState('Active');

  // Filter logic
  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.profession.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.location.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = 
      statusFilter === 'All' ||
      (statusFilter === 'Reported' && user.reported) ||
      (statusFilter === user.status);

    const matchesGender = 
      genderFilter === 'All' || 
      user.gender === genderFilter;

    return matchesSearch && matchesStatus && matchesGender;
  });

  const handleOpenDetails = (user) => {
    setSelectedUser(user);
    setDrawerVerified(user.verified);
    setDrawerStatus(user.status);
  };

  const handleSaveDrawerChanges = () => {
    setUsers(prev => prev.map(u => u.id === selectedUser.id ? { ...u, verified: drawerVerified, status: drawerStatus } : u));
    alert(`Changes for user "${selectedUser.name}" saved successfully!`);
    setSelectedUser(null);
  };

  const handleToggleVerificationInTable = (id) => {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, verified: !u.verified } : u));
  };

  const handleForceLogout = (name) => {
    alert(`Force logged out user "${name}" successfully!`);
  };

  return (
    <div className="space-y-6">
      {/* Header section */}
      <div>
        <h2 className="text-lg sm:text-xl font-bold text-slate-800 flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-deep-maroon"></span>
          User Management
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          Review matrimonial registrations, verify profiles, handle reports, and manage account statuses.
        </p>
      </div>

      {/* Filter and search control board */}
      <div className="bg-white rounded-2xl border border-slate-200/60 p-4 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs font-semibold text-slate-700">
        {/* Search */}
        <div className="relative w-full md:max-w-md">
          <span className="material-symbols-outlined absolute left-3 top-2 text-slate-400 text-lg leading-none">
            search
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full border border-surface-variant rounded-xl py-1.5 pl-10 pr-4 text-xs bg-slate-50/50 text-charcoal-text focus:outline-none focus:ring-1 focus:ring-deep-maroon placeholder-soft-gray/40"
            placeholder="Search by Name, ID, location, or job..."
          />
        </div>

        {/* Dropdown Filters */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <div className="flex items-center gap-1.5 flex-1 min-w-[120px] justify-between sm:justify-start">
            <span className="text-[10px] uppercase text-slate-400 font-bold shrink-0">Gender:</span>
            <select
              value={genderFilter}
              onChange={(e) => setGenderFilter(e.target.value)}
              className="border border-surface-variant rounded-lg py-1 px-2 bg-white text-slate-700 focus:ring-1 focus:ring-deep-maroon focus:outline-none flex-1 sm:flex-initial"
            >
              <option value="All">All Genders</option>
              <option value="Bride">Brides (Female)</option>
              <option value="Groom">Grooms (Male)</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5 flex-1 min-w-[120px] justify-between sm:justify-start">
            <span className="text-[10px] uppercase text-slate-400 font-bold shrink-0">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border border-surface-variant rounded-lg py-1 px-2 bg-white text-slate-700 focus:ring-1 focus:ring-deep-maroon focus:outline-none flex-1 sm:flex-initial"
            >
              <option value="All">All Profiles</option>
              <option value="Active">Active</option>
              <option value="Blocked">Blocked</option>
              <option value="Banned">Banned</option>
              <option value="Reported">Reported Accounts</option>
            </select>
          </div>
        </div>
      </div>

      {/* Users table */}
      <div className="bg-white rounded-2xl border border-slate-200/60 shadow-xs overflow-hidden w-full max-w-full">
        <div className="overflow-x-auto w-full max-w-full [-webkit-overflow-scrolling:touch]">
          <table className="w-full min-w-[800px] text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50/70 border-b border-slate-200 text-slate-400 font-bold uppercase tracking-wider">
                <th className="py-3.5 px-4 font-semibold text-[10px]">User ID</th>
                <th className="py-3.5 px-4 font-semibold text-[10px]">Profile</th>
                <th className="py-3.5 px-4 font-semibold text-[10px]">Details</th>
                <th className="py-3.5 px-4 font-semibold text-[10px]">Verification</th>
                <th className="py-3.5 px-4 font-semibold text-[10px]">Plan</th>
                <th className="py-3.5 px-4 font-semibold text-[10px]">Status</th>
                <th className="py-3.5 px-4 font-semibold text-[10px]">Online</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan="7" className="py-12 text-center text-slate-400 font-semibold">
                    <span className="material-symbols-outlined text-3xl mb-1 block">people_outline</span>
                    No matching users found.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr 
                    key={user.id} 
                    onClick={() => handleOpenDetails(user)}
                    className={`hover:bg-slate-50/50 transition-colors cursor-pointer ${user.reported ? 'bg-amber-50/15' : ''}`}
                    title="Click to view details"
                  >
                    <td className="py-3 px-4 font-bold text-slate-800">{user.id}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={user.image}
                          alt={user.name}
                          className="w-8 h-8 rounded-full object-cover border border-slate-100 shrink-0"
                        />
                        <div>
                          <div className="flex items-center gap-1">
                            <span className="font-bold text-slate-800">{user.name}</span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div>
                        <p>{user.age} Yrs &bull; {user.height}</p>
                        <p className="text-[10px] text-slate-400 mt-0.5">{user.religion} - {user.caste}</p>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleToggleVerificationInTable(user.id);
                        }}
                        className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase flex items-center gap-0.5 cursor-pointer border ${
                          user.verified 
                            ? 'bg-emerald-50 border-emerald-100 text-emerald-700' 
                            : 'bg-slate-50 border-slate-200 text-slate-400 hover:bg-slate-100'
                        }`}
                        title="Toggle verification status"
                      >
                        <span className="material-symbols-outlined text-[10px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                          {user.verified ? 'verified' : 'pending'}
                        </span>
                        {user.verified ? 'Verified' : 'Unverified'}
                      </button>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`inline-block px-2.5 py-0.5 rounded-full text-[9px] font-bold tracking-wide uppercase border ${
                        user.premium
                          ? 'bg-amber-50 border-amber-100 text-amber-700'
                          : 'bg-slate-50 border-slate-200 text-slate-500'
                      }`}>
                        {user.premium ? 'Gold Premium' : 'Free Silver'}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`inline-block px-2.5 py-0.5 rounded-full text-[9px] font-bold tracking-wide uppercase border ${
                        user.status === 'Active'
                          ? 'bg-emerald-50 border-emerald-100 text-emerald-700'
                          : 'bg-rose-50 border-rose-100 text-rose-700'
                      }`}>
                        {user.status}
                      </span>
                      {user.reported && (
                        <span 
                          className="ml-1.5 inline-flex items-center text-[9px] font-bold bg-amber-500 text-white px-1.5 py-0.2 rounded-sm"
                          title={`Reported: ${user.reportReason}`}
                        >
                          ⚠️ Reported
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[9px] font-bold ${
                        user.online 
                          ? 'text-emerald-700' 
                          : 'text-slate-400'
                      }`}>
                        <span className={`w-1 h-1 rounded-full ${user.online ? 'bg-emerald-500 animate-pulse' : 'bg-slate-350'}`}></span>
                        {user.online ? 'Online' : 'Offline'}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Slide-out Drawer Panel */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* Backdrop */}
          <div 
            onClick={() => setSelectedUser(null)}
            className="absolute inset-0 bg-black/30 backdrop-blur-xs transition-opacity"
          ></div>

          {/* Drawer content card */}
          <div className="w-full max-w-full sm:max-w-md md:max-w-lg bg-white h-full relative z-10 shadow-2xl flex flex-col justify-between animate-slide-in overflow-hidden border-l border-slate-200 text-left">
            
            {/* Header */}
            <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50 sticky top-0">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">{selectedUser.id}</span>
                <span className={`inline-block px-1.5 py-0.2 rounded-sm text-[8px] font-black uppercase ${
                  drawerStatus === 'Active' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
                }`}>
                  {drawerStatus}
                </span>
              </div>
              <button 
                onClick={() => setSelectedUser(null)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer flex items-center"
              >
                <span className="material-symbols-outlined text-xl">close</span>
              </button>
            </div>

            {/* Scrollable details */}
            <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-5 sm:space-y-6">
              {/* Profile image and banner */}
              <div className="flex flex-col sm:flex-row gap-4 sm:gap-5 items-start">
                <img
                  src={selectedUser.image}
                  alt={selectedUser.name}
                  className="w-20 h-24 sm:w-24 sm:h-28 object-cover rounded-xl border border-slate-200 shadow-sm shrink-0"
                />
                <div className="space-y-1 sm:space-y-1.5 min-w-0">
                  <h3 className="text-sm sm:text-base font-bold text-slate-800 flex items-center gap-1.5 flex-wrap">
                    {selectedUser.name}
                    {drawerVerified && (
                      <span className="material-symbols-outlined text-emerald-600 text-base" style={{ fontVariationSettings: "'FILL' 1" }}>
                        verified
                      </span>
                    )}
                  </h3>
                  <p className="text-xs text-slate-500 font-semibold">{selectedUser.gender} &bull; {selectedUser.age} Yrs &bull; {selectedUser.height}</p>
                  <p className="text-xs text-slate-500 flex items-center gap-1">
                    <span className="material-symbols-outlined text-slate-400 text-xs">location_on</span>
                    {selectedUser.location}
                  </p>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    <span className={`px-2 py-0.5 rounded-full text-[8px] font-bold border uppercase tracking-wide ${
                      selectedUser.premium
                        ? 'bg-heritage-gold/15 border-heritage-gold/20 text-heritage-gold'
                        : 'bg-slate-50 border-slate-200 text-slate-500'
                    }`}>
                      {selectedUser.premium ? 'Gold Premium' : 'Free Silver'}
                    </span>
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[8px] font-bold border ${
                      selectedUser.online 
                        ? 'bg-emerald-50 border-emerald-100 text-emerald-700' 
                        : 'bg-slate-50 border-slate-200 text-slate-500'
                    }`}>
                      <span className={`w-1 h-1 rounded-full ${selectedUser.online ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`}></span>
                      {selectedUser.online ? 'Online' : 'Offline'}
                    </span>
                  </div>
                </div>
              </div>

              {selectedUser.reported && (
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800 flex gap-2">
                  <span className="material-symbols-outlined text-lg shrink-0">warning</span>
                  <div>
                    <p className="font-bold">Reported Account</p>
                    <p className="text-[11px] text-amber-700/90 mt-0.5">{selectedUser.reportReason}</p>
                  </div>
                </div>
              )}

              <hr className="border-slate-100" />

              {/* Bio */}
              <div className="space-y-1.5">
                <h4 className="text-[10px] font-bold uppercase tracking-wider text-slate-400">About Profile</h4>
                <p className="text-xs text-slate-650 leading-relaxed font-medium bg-slate-50 p-3 rounded-xl border border-slate-100">
                  "{selectedUser.bio}"
                </p>
              </div>

              {/* Personal Details */}
              <div className="space-y-2">
                <h4 className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Personal Details</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="bg-slate-50/50 p-2.5 rounded-lg border border-slate-100">
                    <span className="text-[9px] text-slate-400 block mb-0.5 uppercase tracking-wide">Religion</span>
                    <span className="font-bold text-slate-700">{selectedUser.religion}</span>
                  </div>
                  <div className="bg-slate-50/50 p-2.5 rounded-lg border border-slate-100">
                    <span className="text-[9px] text-slate-400 block mb-0.5 uppercase tracking-wide">Caste</span>
                    <span className="font-bold text-slate-700">{selectedUser.caste}</span>
                  </div>
                </div>
              </div>

              {/* Professional Details */}
              <div className="space-y-2">
                <h4 className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Education & Career</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="bg-slate-50/50 p-2.5 rounded-lg border border-slate-100">
                    <span className="text-[9px] text-slate-400 block mb-0.5 uppercase tracking-wide">Education</span>
                    <span className="font-bold text-slate-700 truncate block">{selectedUser.education}</span>
                  </div>
                  <div className="bg-slate-50/50 p-2.5 rounded-lg border border-slate-100">
                    <span className="text-[9px] text-slate-400 block mb-0.5 uppercase tracking-wide">Profession</span>
                    <span className="font-bold text-slate-700 truncate block">{selectedUser.profession}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions Footer */}
            <div className="p-3 sm:p-4 border-t border-slate-200 bg-slate-50 flex flex-wrap gap-2.5 justify-end items-center">
              <button
                onClick={() => setDrawerVerified(!drawerVerified)}
                className={`w-full sm:w-auto px-3 py-1.5 border rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  drawerVerified
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                    : 'bg-white border-slate-200 text-slate-650 hover:bg-slate-50'
                }`}
              >
                {drawerVerified ? 'Remove Verification' : 'Verify Profile'}
              </button>

              {selectedUser.online && (
                <button
                  onClick={() => handleForceLogout(selectedUser.name)}
                  className="w-full sm:w-auto px-3 py-1.5 bg-slate-150 hover:bg-slate-200 border border-slate-250 rounded-xl text-xs font-bold text-slate-700 transition-all cursor-pointer"
                >
                  Force Logout
                </button>
              )}

              <div className="w-full sm:w-auto">
                <select
                  value={drawerStatus}
                  onChange={(e) => setDrawerStatus(e.target.value)}
                  className="w-full border border-slate-350 rounded-xl py-1.5 px-3 bg-white text-xs font-bold text-slate-700 focus:outline-none"
                >
                  <option value="Active">Set Active</option>
                  <option value="Blocked">Block Profile</option>
                  <option value="Banned">Ban Profile</option>
                </select>
              </div>

              <button
                onClick={handleSaveDrawerChanges}
                className="w-full sm:w-auto px-4 py-1.5 bg-deep-maroon hover:bg-primary text-xs font-bold text-white rounded-xl cursor-pointer shadow-md transition-all active:scale-95 flex items-center justify-center gap-1.5"
              >
                <span className="material-symbols-outlined text-xs">save</span>
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

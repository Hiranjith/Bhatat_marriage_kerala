import React, { useState, useEffect } from 'react';
import axiosInstance from '../../utils/axiosInstance';
import AddUserModal from '../../../components/admin/AddUserModal';

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [genderFilter, setGenderFilter] = useState('All');
  const [selectedUser, setSelectedUser] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);

  // Local drawer state for tracking changes before Save
  const [drawerVerified, setDrawerVerified] = useState(false);
  const [drawerStatus, setDrawerStatus] = useState('');
  const [alertModal, setAlertModal] = useState({ isOpen: false, type: '', title: '', message: '', onConfirm: null });
  const [toast, setToast] = useState({ isVisible: false, message: '', type: 'success' });

  const [showAddUserModal, setShowAddUserModal] = useState(false);

  const showToast = (message, type = 'success') => {
    setToast({ isVisible: true, message, type });
    setTimeout(() => setToast(prev => ({ ...prev, isVisible: false })), 3000);
  };

  const getStatusBadge = (status) => {
    const s = (status || 'ACTIVE').toUpperCase();
    switch (s) {
      case 'ACTIVE': return { color: 'bg-emerald-50 border-emerald-100 text-emerald-700', icon: 'check_circle' };
      case 'BLOCKED': return { color: 'bg-amber-50 border-amber-100 text-amber-700', icon: 'block' };
      case 'BANNED': return { color: 'bg-rose-50 border-rose-100 text-rose-700', icon: 'cancel' };
      case 'FREEZED': return { color: 'bg-sky-50 border-sky-100 text-sky-700', icon: 'ac_unit' };
      case 'REPORTED': return { color: 'bg-orange-50 border-orange-100 text-orange-700', icon: 'warning' };
      default: return { color: 'bg-slate-50 border-slate-200 text-slate-500', icon: 'help' };
    }
  };

  const calculateAge = (dob) => {
    if (!dob) return 'N/A';
    const diff_ms = Date.now() - new Date(dob).getTime();
    const age_dt = new Date(diff_ms);
    return Math.abs(age_dt.getUTCFullYear() - 1970);
  };

  const fetchCustomers = async (isPolling = false) => {
    try {
      if (!isPolling) setLoading(true);
      if (!isPolling) setError(null);
      
      const params = new URLSearchParams();
      if (searchQuery) params.append('search', searchQuery);
      if (genderFilter !== 'All') params.append('gender', genderFilter);
      if (statusFilter !== 'All') params.append('status', statusFilter);
      params.append('page', currentPage);
      params.append('limit', 10);
      
      const adminFranchise = localStorage.getItem('adminFranchise');
      if (adminFranchise) params.append('franchise_id', adminFranchise);
      
      const response = await axiosInstance.get(`/admin/customers?${params.toString()}`);
      
      const mappedUsers = response.data.customers.map(user => {
        const locationParts = [user.place, user.district, user.state].filter(Boolean);
        const locationStr = locationParts.length > 0 ? locationParts.join(', ') : "Location Not Provided";

        return {
          id: user.profile_id,
          name: user.full_name,
          gender: user.gender === 'Female' ? 'Bride' : user.gender === 'Male' ? 'Groom' : user.gender,
          age: calculateAge(user.dob),
          height: user.height || "N/A",
          religion: user.religion || "N/A",
          caste: "N/A", 
          education: user.education || "N/A",
          profession: user.profession || "N/A",
          location: locationStr,
          image: user.photo_1 || "https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&q=80&w=400&h=500",
          verified: user.verification === 'VERIFIED',
          premium: user.plan && user.plan !== 'FREE',
          planName: user.plan || "FREE",
          status: user.status || "Active",
          online: !!user.is_online,
          hasActiveSession: !!user.has_active_session,
          reported: user.status === 'Reported',
          reportReason: user.status === 'Reported' ? "User reported by community" : "",
          bio: "Bio information is currently not fetched."
        };
      });
      
      setUsers(mappedUsers.sort((a, b) => a.name.localeCompare(b.name)));
      
      if (response.data.pagination) {
        setTotalPages(response.data.pagination.totalPages);
        setTotalUsers(response.data.pagination.total);
      }
      
      setSelectedUser(prevSelected => {
        if (prevSelected) {
          const updated = mappedUsers.find(u => u.id === prevSelected.id);
          if (updated) {
            // Only update if there's an actual change to prevent unnecessary re-renders
            if (updated.hasActiveSession !== prevSelected.hasActiveSession || updated.online !== prevSelected.online) {
              return { ...prevSelected, online: updated.online, hasActiveSession: updated.hasActiveSession };
            }
          }
        }
        return prevSelected;
      });
    } catch (err) {
      console.error('Error fetching customers:', err);
      setError('Failed to load users.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchCustomers();
    }, 300);
    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery, statusFilter, genderFilter, currentPage]);

  useEffect(() => {
    const pollInterval = setInterval(() => {
      fetchCustomers(true);
    }, 15000);
    return () => clearInterval(pollInterval);
  }, [searchQuery, statusFilter, genderFilter, currentPage]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter, genderFilter]);

  const handleOpenDetails = (user) => {
    setSelectedUser(user);
    setDrawerVerified(user.verified);
    setDrawerStatus('');
  };

  const handleSaveDrawerChanges = async () => {
    try {
      const statusToSave = drawerStatus || (selectedUser.reported ? 'Reported' : selectedUser.status);
      await axiosInstance.put(`/admin/customers/${selectedUser.id}`, {
        verification: drawerVerified,
        status: statusToSave
      });
      setUsers(prev => prev.map(u => u.id === selectedUser.id ? { ...u, verified: drawerVerified, status: statusToSave } : u));
      setSelectedUser(null);
      showToast('Changes saved');
    } catch (err) {
      console.error('Failed to save user changes:', err);
      setAlertModal({
        isOpen: true,
        type: 'error',
        title: 'Error',
        message: 'Failed to save changes. Please try again.',
        onConfirm: null
      });
    }
  };

  const handleToggleVerificationInTable = async (id, currentVerified) => {
    try {
      const newVerifiedStatus = !currentVerified;
      // Optimistic update
      setUsers(prev => prev.map(u => u.id === id ? { ...u, verified: newVerifiedStatus } : u));
      await axiosInstance.put(`/admin/customers/${id}`, {
        verification: newVerifiedStatus
      });
    } catch (err) {
      console.error('Failed to toggle verification:', err);
      // Revert optimistic update
      setUsers(prev => prev.map(u => u.id === id ? { ...u, verified: currentVerified } : u));
      setAlertModal({
        isOpen: true,
        type: 'error',
        title: 'Verification Failed',
        message: 'Failed to update verification status. Please try again.',
        onConfirm: null
      });
    }
  };

  const handleForceLogout = (id, name) => {
    setAlertModal({
      isOpen: true,
      type: 'confirm',
      title: 'Force Logout',
      message: `Are you sure you want to forcefully log out ${name}? This will instantly end their active session.`,
      onConfirm: async () => {
        setAlertModal({ isOpen: false });
        try {
          await axiosInstance.post(`/admin/customers/force-logout/${id}`);
          setUsers(prev => prev.map(u => u.id === id ? { ...u, online: false, hasActiveSession: false } : u));
          if (selectedUser && selectedUser.id === id) {
            setSelectedUser({ ...selectedUser, online: false, hasActiveSession: false });
          }
          showToast('User logged out.');
        } catch (err) {
          console.error('Failed to force logout:', err);
          setAlertModal({
            isOpen: true,
            type: 'error',
            title: 'Error',
            message: 'Failed to force log out user. Please try again.',
            onConfirm: null
          });
        }
      }
    });
  };

  const handleOpenAddUserModal = () => {
    setShowAddUserModal(true);
  };

  return (
    <div className="space-y-6">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-slate-800 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-deep-maroon"></span>
            User Management
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Review matrimonial registrations, verify profiles, handle reports, and manage account statuses.
          </p>
        </div>
        <button
          onClick={handleOpenAddUserModal}
          className="bg-deep-maroon hover:bg-primary text-white text-xs font-bold py-2 px-4 rounded-xl shadow-md transition-all cursor-pointer flex items-center gap-1.5 self-start active:scale-95 border border-white/10 select-none"
        >
          <span className="material-symbols-outlined text-sm">add</span>
          Add New User
        </button>
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
              <option value="Banned">Banned</option>
              <option value="Freezed">Freezed</option>
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
              {loading && users.length === 0 ? (
                <tr>
                  <td colSpan="7" className="py-12 text-center text-slate-400 font-semibold">
                    <span className="material-symbols-outlined animate-spin text-3xl mb-1 block">autorenew</span>
                    Loading users...
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan="7" className="py-12 text-center text-rose-500 font-semibold">
                    {error}
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan="7" className="py-12 text-center text-slate-400 font-semibold">
                    <span className="material-symbols-outlined text-3xl mb-1 block">people_outline</span>
                    No matching users found.
                  </td>
                </tr>
              ) : (
                users.map((user) => (
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
                          handleToggleVerificationInTable(user.id, user.verified);
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
                      {(() => {
                        const badge = getStatusBadge(user.status);
                        return (
                          <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9px] font-bold tracking-wide uppercase border ${badge.color}`}>
                            <span className="material-symbols-outlined text-[10px]" style={{ fontVariationSettings: "'FILL' 1" }}>{badge.icon}</span>
                            {user.status}
                          </span>
                        );
                      })()}
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

        {/* Pagination Controls */}
        <div className="p-4 border-t border-slate-200/60 flex items-center justify-between bg-slate-50/30 rounded-b-2xl">
          <span className="text-xs text-deep-maroon font-semibold">
            Showing <span className="font-bold">{users.length > 0 ? (currentPage - 1) * 10 + 1 : 0}</span> to <span className="font-bold">{Math.min(currentPage * 10, totalUsers)}</span> of <span className="font-bold">{totalUsers}</span> users
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1.5 text-xs font-bold rounded-lg text-white bg-deep-maroon hover:bg-primary disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Previous
            </button>
            <span className="text-xs font-bold text-deep-maroon px-2">Page {currentPage} of {totalPages || 1}</span>
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages || totalPages === 0}
              className="px-3 py-1.5 text-xs font-bold rounded-lg text-white bg-deep-maroon hover:bg-primary disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Next
            </button>
          </div>
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
                {(() => {
                  const currentStatus = drawerStatus || (selectedUser.reported ? 'Reported' : selectedUser.status);
                  const badge = getStatusBadge(currentStatus);
                  return (
                    <span className={`inline-flex items-center gap-1 px-1.5 py-0.2 rounded-sm text-[8px] font-black uppercase border ${badge.color}`}>
                      <span className="material-symbols-outlined text-[9px]" style={{ fontVariationSettings: "'FILL' 1" }}>{badge.icon}</span>
                      {currentStatus}
                    </span>
                  );
                })()}
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

              {selectedUser.hasActiveSession && (
                <button
                  onClick={() => handleForceLogout(selectedUser.id, selectedUser.name)}
                  className="w-full sm:w-auto px-3 py-1.5 bg-slate-150 hover:bg-slate-200 border border-slate-250 rounded-xl text-xs font-bold text-slate-700 transition-all cursor-pointer"
                >
                  Force Logout
                </button>
              )}

              <div className="w-full sm:w-auto">
                {(() => {
                  const actualStatus = selectedUser.reported ? 'Reported' : selectedUser.status;
                  const getOptionClass = (val) => actualStatus === val ? "text-slate-400 italic bg-slate-50" : "";
                  return (
                    <select
                      value={drawerStatus}
                      onChange={(e) => setDrawerStatus(e.target.value)}
                      className="w-full border border-slate-350 rounded-xl py-1.5 px-3 bg-white text-xs font-bold text-slate-700 focus:outline-none"
                    >
                      <option value="" disabled className="hidden">Action</option>
                      <option value="Active" disabled={actualStatus === 'Active'} className={getOptionClass('Active')}>Activate</option>
                      <option value="Banned" disabled={actualStatus === 'Banned'} className={getOptionClass('Banned')}>Ban</option>
                      <option value="Freezed" disabled={actualStatus === 'Freezed'} className={getOptionClass('Freezed')}>Freezed</option>
                    </select>
                  );
                })()}
              </div>

              <button
                onClick={handleSaveDrawerChanges}
                disabled={!(drawerVerified !== selectedUser.verified || (drawerStatus !== '' && drawerStatus !== (selectedUser.reported ? 'Reported' : selectedUser.status)))}
                className={`w-full sm:w-auto px-4 py-1.5 text-xs font-bold text-white rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5 ${
                  (drawerVerified !== selectedUser.verified || (drawerStatus !== '' && drawerStatus !== (selectedUser.reported ? 'Reported' : selectedUser.status)))
                    ? 'bg-deep-maroon hover:bg-primary cursor-pointer active:scale-95'
                    : 'bg-slate-300 cursor-not-allowed opacity-70'
                }`}
              >
                <span className="material-symbols-outlined text-xs">save</span>
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Custom Alert/Confirm Modal */}
      {alertModal.isOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" 
            onClick={() => setAlertModal({ ...alertModal, isOpen: false })}
          ></div>
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm relative z-10 animate-scale-up overflow-hidden border border-slate-100">
            <div className="p-6 text-center">
              {alertModal.type === 'confirm' && (
                <div className="mx-auto flex items-center justify-center h-14 w-14 rounded-full bg-rose-50 mb-4 border border-rose-100">
                  <span className="material-symbols-outlined text-rose-500 text-3xl">warning</span>
                </div>
              )}
              {alertModal.type === 'success' && (
                <div className="mx-auto flex items-center justify-center h-14 w-14 rounded-full bg-emerald-50 mb-4 border border-emerald-100">
                  <span className="material-symbols-outlined text-emerald-500 text-3xl">check_circle</span>
                </div>
              )}
              {alertModal.type === 'error' && (
                <div className="mx-auto flex items-center justify-center h-14 w-14 rounded-full bg-amber-50 mb-4 border border-amber-100">
                  <span className="material-symbols-outlined text-amber-500 text-3xl">error</span>
                </div>
              )}
              <h3 className="text-lg font-bold text-slate-800 mb-2">{alertModal.title}</h3>
              <p className="text-sm text-slate-500 font-medium leading-relaxed">{alertModal.message}</p>
            </div>
            <div className="px-6 py-4 bg-slate-50 flex justify-center gap-3 border-t border-slate-100/60">
              {alertModal.type === 'confirm' ? (
                <>
                  <button
                    onClick={() => setAlertModal({ ...alertModal, isOpen: false })}
                    className="flex-1 px-4 py-2 bg-white border border-slate-200 text-slate-650 rounded-xl text-xs font-bold hover:bg-slate-50 transition-colors shadow-sm"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={alertModal.onConfirm}
                    className="flex-1 px-4 py-2 bg-rose-500 text-white rounded-xl text-xs font-bold shadow-md hover:bg-rose-600 transition-colors shadow-rose-500/20"
                  >
                    Confirm Logout
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setAlertModal({ ...alertModal, isOpen: false })}
                  className="px-8 py-2 bg-deep-maroon text-white rounded-xl text-xs font-bold shadow-md hover:bg-primary transition-colors shadow-deep-maroon/20"
                >
                  OK
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Add User Modal */}
      <AddUserModal 
        isOpen={showAddUserModal} 
        onClose={() => setShowAddUserModal(false)} 
        onSuccess={(msg) => {
          showToast(msg);
          fetchCustomers();
        }}
        onError={(msg) => {
          setAlertModal({
            isOpen: true,
            type: 'error',
            title: 'Error',
            message: msg,
            onConfirm: null
          });
        }}
      />

      {/* Toast Notification */}
      {toast.isVisible && (
        <div className="fixed bottom-6 right-6 z-[70] animate-slide-up flex items-center gap-3 px-5 py-3.5 rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border bg-slate-800 border-slate-700 text-white">
          <span className={`material-symbols-outlined ${toast.type === 'success' ? 'text-emerald-400' : 'text-rose-400'}`}>
            {toast.type === 'success' ? 'check_circle' : 'error'}
          </span>
          <span className="text-sm font-bold tracking-wide">{toast.message}</span>
        </div>
      )}
    </div>
  );
}

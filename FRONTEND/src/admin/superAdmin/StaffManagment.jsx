import React, { useState } from 'react';

// Same franchise source used in FranchiseManagement / HeadFranchise.
// In production this should come from shared/lifted state or an API call
// so the list always matches actual registered franchises.
const FRANCHISE_OPTIONS = [
  { id: 'HEAD_OFFICE', name: 'Head Office' },
  { id: 'FRN0001', name: 'BM-Kochi' },
  { id: 'FRN0002', name: 'BM-Kollam' }
];

const getFranchiseName = (id) => {
  const match = FRANCHISE_OPTIONS.find(f => f.id === id);
  return match ? match.name : id;
};

const INITIAL_STAFF = [
  {
    id: 'STF0001',
    name: 'Shanu V. R.',
    role: 'User Management Staff',
    email: 'shanu@bharathmarriage.com',
    phone: '+91 9876543210',
    status: 'Active',
    lastLogin: '10 mins ago',
    franchiseId: 'FRN0001'
  },
  {
    id: 'STF0002',
    name: 'Anjali Krishna',
    role: 'Finance & Package Staff',
    email: 'anjali@bharathmarriage.com',
    phone: '+91 8765432109',
    status: 'Active',
    lastLogin: '2 hours ago',
    franchiseId: 'FRN0002'
  }
];

export default function StaffManagment() {
  const [staffList, setStaffList] = useState(INITIAL_STAFF);
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingStaffId, setEditingStaffId] = useState(null);
  const [franchiseFilter, setFranchiseFilter] = useState('All');

  // Form States
  const [name, setName] = useState('');
  const [role, setRole] = useState('User Management Staff');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [status, setStatus] = useState('Active');
  const [franchiseId, setFranchiseId] = useState('HEAD_OFFICE');

  const handleOpenAddModal = () => {
    setIsEditing(false);
    setEditingStaffId(null);
    setName('');
    setRole('User Management Staff');
    setEmail('');
    setPhone('');
    setStatus('Active');
    setFranchiseId('HEAD_OFFICE');
    setShowModal(true);
  };

  const handleOpenEditModal = (staff) => {
    setIsEditing(true);
    setEditingStaffId(staff.id);
    setName(staff.name);
    setRole(staff.role);
    setEmail(staff.email);
    setPhone(staff.phone);
    setStatus(staff.status);
    setFranchiseId(staff.franchiseId || 'HEAD_OFFICE');
    setShowModal(true);
  };

  const handleDeleteStaff = (id) => {
    if (window.confirm('Are you sure you want to remove this staff member?')) {
      setStaffList(prev => prev.filter(item => item.id !== id));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (isEditing) {
      // Update
      setStaffList(prev => prev.map(item => {
        if (item.id === editingStaffId) {
          return {
            ...item,
            name,
            role,
            email,
            phone,
            status,
            franchiseId
          };
        }
        return item;
      }));
    } else {
      // Add new
      const nextIdNum = staffList.length > 0
        ? Math.max(...staffList.map(s => parseInt(s.id.replace('STF', '')))) + 1
        : 1;
      const formattedId = `STF${String(nextIdNum).padStart(4, '0')}`;

      const newStaff = {
        id: formattedId,
        name,
        role,
        email,
        phone,
        status,
        franchiseId,
        lastLogin: 'Never'
      };

      setStaffList(prev => [...prev, newStaff]);
    }

    setShowModal(false);
  };

  const filteredStaff = staffList.filter(staff =>
    franchiseFilter === 'All' || staff.franchiseId === franchiseFilter
  );

  return (
    <div className="space-y-6">
      {/* Header Panel */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-slate-800 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-deep-maroon"></span>
            Staff Management
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Create staff credentials, assign them to a franchise, and manage system permissions.
          </p>
        </div>
        <button
          onClick={handleOpenAddModal}
          className="bg-deep-maroon hover:bg-primary text-white text-xs font-bold py-2 px-4 rounded-xl shadow-md transition-all cursor-pointer flex items-center gap-1.5 self-start active:scale-95 border border-white/10 select-none"
        >
          <span className="material-symbols-outlined text-sm">add</span>
          Add Staff Member
        </button>
      </div>

      {/* Franchise Filter */}
      <div className="bg-white rounded-2xl border border-slate-200/60 p-4 shadow-xs flex items-center gap-2 text-xs font-semibold text-slate-700 w-full max-w-full">
        <span className="text-[10px] uppercase text-slate-400 font-bold shrink-0">Franchise:</span>
        <select
          value={franchiseFilter}
          onChange={(e) => setFranchiseFilter(e.target.value)}
          className="border border-surface-variant rounded-lg py-1 px-2 bg-white text-slate-700 focus:ring-1 focus:ring-deep-maroon focus:outline-none w-[180px] text-[11px]"
        >
          <option value="All">All Franchises</option>
          {FRANCHISE_OPTIONS.map((f) => (
            <option key={f.id} value={f.id}>{f.name}</option>
          ))}
        </select>
      </div>

      {/* Table Container */}
      <div className="bg-white rounded-2xl border border-slate-200/60 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[820px] text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50/70 border-b border-slate-200 text-slate-400 font-bold uppercase tracking-wider">
                <th className="py-3.5 px-2.5 font-semibold text-[10px]">Staff ID</th>
                <th className="py-3.5 px-2.5 font-semibold text-[10px]">Name</th>
                <th className="py-3.5 px-2.5 font-semibold text-[10px]">Role</th>
                <th className="py-3.5 px-2.5 font-semibold text-[10px]">Franchise</th>
                <th className="py-3.5 px-2.5 font-semibold text-[10px]">Email</th>
                <th className="py-3.5 px-2.5 font-semibold text-[10px]">Phone</th>
                <th className="py-3.5 px-2.5 font-semibold text-[10px]">Status</th>
                <th className="py-3.5 px-2.5 font-semibold text-[10px]">Last Login</th>
                <th className="py-3.5 px-2.5 font-semibold text-[10px] text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {filteredStaff.length === 0 ? (
                <tr>
                  <td colSpan="9" className="py-12 text-center text-slate-400 font-semibold">
                    <span className="material-symbols-outlined text-3xl mb-1 block">badge</span>
                    No staff members match this filter.
                  </td>
                </tr>
              ) : (
                filteredStaff.map((staff) => (
                  <tr key={staff.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-3 px-2.5 font-bold text-slate-800 whitespace-nowrap">{staff.id}</td>
                    <td className="py-3 px-2.5">
                      <span
                        className="font-bold text-slate-800 block max-w-[130px] truncate"
                        title={staff.name}
                      >
                        {staff.name}
                      </span>
                    </td>
                    <td className="py-3 px-2.5">
                      <span className={`inline-block px-2.5 py-0.5 rounded-full text-[9px] font-bold tracking-wide uppercase border max-w-[150px] truncate align-middle ${
                        staff.role === 'User Management Staff'
                          ? 'bg-purple-50 border-purple-100 text-purple-700'
                          : 'bg-amber-50 border-amber-100 text-amber-700'
                      }`} title={staff.role}>
                        {staff.role}
                      </span>
                    </td>
                    <td className="py-3 px-2.5">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase border max-w-[140px] truncate align-middle ${
                          staff.franchiseId === 'HEAD_OFFICE'
                            ? 'bg-slate-100 border-slate-200 text-slate-600'
                            : 'bg-blue-50 border-blue-100 text-blue-700'
                        }`}
                        title={getFranchiseName(staff.franchiseId)}
                      >
                        <span className="material-symbols-outlined text-[12px] leading-none">
                          {staff.franchiseId === 'HEAD_OFFICE' ? 'domain' : 'storefront'}
                        </span>
                        {getFranchiseName(staff.franchiseId)}
                      </span>
                    </td>
                    <td className="py-3 px-2.5 text-slate-500">
                      <span className="block max-w-[170px] truncate" title={staff.email}>
                        {staff.email}
                      </span>
                    </td>
                    <td className="py-3 px-2.5 text-slate-500 whitespace-nowrap">{staff.phone}</td>
                    <td className="py-3 px-2.5">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase border whitespace-nowrap ${
                        staff.status === 'Active'
                          ? 'bg-emerald-50 border-emerald-100 text-emerald-700'
                          : 'bg-slate-100 border-slate-200 text-slate-450'
                      }`}>
                        <span className={`w-1 h-1 rounded-full ${staff.status === 'Active' ? 'bg-emerald-500' : 'bg-slate-400'}`}></span>
                        {staff.status}
                      </span>
                    </td>
                    <td className="py-3 px-2.5 text-slate-400 whitespace-nowrap">{staff.lastLogin}</td>
                    <td className="py-3 px-2.5">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleOpenEditModal(staff)}
                          className="p-1 hover:bg-slate-150 rounded-lg text-slate-500 hover:text-slate-800 cursor-pointer flex items-center transition-colors"
                          title="Edit Staff Member"
                        >
                          <span className="material-symbols-outlined text-base">edit</span>
                        </button>
                        <button
                          onClick={() => handleDeleteStaff(staff.id)}
                          className="p-1 hover:bg-rose-50 rounded-lg text-rose-450 hover:text-rose-700 cursor-pointer flex items-center transition-colors"
                          title="Delete Staff Member"
                        >
                          <span className="material-symbols-outlined text-base">delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Popup Overlay */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          {/* Backdrop */}
          <div
            onClick={() => setShowModal(false)}
            className="absolute inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
          ></div>

          {/* Form Card */}
          <div className="bg-paper-white rounded-2xl shadow-xl border border-surface-variant/40 overflow-hidden w-full max-w-md relative z-10 animate-fade-in text-left max-h-[90vh] flex flex-col">
            <div className="bg-gradient-to-r from-deep-maroon to-primary px-6 py-4 text-white flex items-center justify-between shrink-0">
              <h3 className="font-bold text-sm tracking-wide uppercase">
                {isEditing ? 'Edit Staff Credentials' : 'Add New Staff Member'}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-white/80 hover:text-white cursor-pointer flex items-center"
              >
                <span className="material-symbols-outlined text-xl">close</span>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-charcoal-text/75 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full border border-surface-variant rounded-xl py-2 px-3 text-xs bg-white text-charcoal-text focus:outline-none focus:ring-1 focus:ring-deep-maroon focus:border-deep-maroon placeholder-soft-gray/40"
                  placeholder="Enter staff full name"
                  required
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-charcoal-text/75 mb-1">
                  Assign System Role
                </label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full border border-surface-variant rounded-xl py-2 px-3 text-xs bg-white text-charcoal-text focus:outline-none focus:ring-1 focus:ring-deep-maroon focus:border-deep-maroon"
                >
                  <option value="User Management Staff">User Management Staff</option>
                  <option value="Finance & Package Staff">Finance & Package Staff</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-charcoal-text/75 mb-1">
                  Assign Franchise
                </label>
                <select
                  value={franchiseId}
                  onChange={(e) => setFranchiseId(e.target.value)}
                  className="w-full border border-surface-variant rounded-xl py-2 px-3 text-xs bg-white text-charcoal-text focus:outline-none focus:ring-1 focus:ring-deep-maroon focus:border-deep-maroon"
                >
                  {FRANCHISE_OPTIONS.map((f) => (
                    <option key={f.id} value={f.id}>{f.name}</option>
                  ))}
                </select>
                <p className="text-[10px] text-slate-400 mt-1">
                  Head Office staff can see all franchises. Franchise staff only see their assigned one.
                </p>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-charcoal-text/75 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full border border-surface-variant rounded-xl py-2 px-3 text-xs bg-white text-charcoal-text focus:outline-none focus:ring-1 focus:ring-deep-maroon focus:border-deep-maroon placeholder-soft-gray/40"
                  placeholder="e.g. staffname@bharathmarriage.com"
                  required
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-charcoal-text/75 mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full border border-surface-variant rounded-xl py-2 px-3 text-xs bg-white text-charcoal-text focus:outline-none focus:ring-1 focus:ring-deep-maroon focus:border-deep-maroon placeholder-soft-gray/40"
                  placeholder="e.g. +91 9876543210"
                  required
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-charcoal-text/75 mb-1.5">
                  Account Status
                </label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-1.5 text-xs text-slate-700 cursor-pointer select-none">
                    <input
                      type="radio"
                      name="status"
                      value="Active"
                      checked={status === 'Active'}
                      onChange={() => setStatus('Active')}
                      className="accent-deep-maroon cursor-pointer"
                    />
                    <span>Active</span>
                  </label>
                  <label className="flex items-center gap-1.5 text-xs text-slate-700 cursor-pointer select-none">
                    <input
                      type="radio"
                      name="status"
                      value="Inactive"
                      checked={status === 'Inactive'}
                      onChange={() => setStatus('Inactive')}
                      className="accent-deep-maroon cursor-pointer"
                    />
                    <span>Inactive</span>
                  </label>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-charcoal-text font-bold rounded-xl text-xs cursor-pointer select-none"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-deep-maroon hover:bg-primary text-white font-bold rounded-xl text-xs cursor-pointer select-none"
                >
                  {isEditing ? 'Save Changes' : 'Register Staff'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
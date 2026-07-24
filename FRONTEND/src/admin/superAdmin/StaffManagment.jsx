import React, { useState, useEffect } from 'react';
import axiosInstance from '../../utils/axiosInstance';

const formatFranchiseName = (name) => {
  if (!name || name === 'Head Office') return name;
  const parts = name.split(/[\s,]+/);
  const lastPart = parts[parts.length - 1] || name;
  return `BM-${lastPart}`;
};

export default function StaffManagment() {
  const [staffList, setStaffList] = useState([]);
  const [franchiseOptions, setFranchiseOptions] = useState([{ id: 'HEAD_OFFICE', name: 'Head Office' }]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [staffRes, franchiseRes] = await Promise.all([
        axiosInstance.get('/admin/staff'),
        axiosInstance.get('/admin/franchises')
      ]);
      
      const mappedStaff = staffRes.data.map(s => ({
        id: s.staff_id,
        name: s.name,
        role: s.role,
        email: s.email,
        phone: s.phone_number,
        status: s.account_status,
        lastLogin: 'Never',
        franchiseId: s.franchise || 'HEAD_OFFICE'
      }));
      setStaffList(mappedStaff);

      const mappedFranchises = [
        { id: 'HEAD_OFFICE', name: 'Head Office' },
        ...franchiseRes.data.map(f => ({
          id: f.franchise_id,
          name: formatFranchiseName(f.name)
        }))
      ];
      setFranchiseOptions(mappedFranchises);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const getFranchiseName = (id) => {
    const match = franchiseOptions.find(f => f.id === id);
    return match ? match.name : id;
  };
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingStaffId, setEditingStaffId] = useState(null);
  const [franchiseFilter, setFranchiseFilter] = useState('All');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Custom Dialog States
  const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, title: '', message: '', onConfirm: null });
  const [alertDialog, setAlertDialog] = useState({ isOpen: false, title: '', message: '' });

  // Form States
  const [name, setName] = useState('');
  const [role, setRole] = useState('USER MANAGEMENT');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [status, setStatus] = useState('active');
  const [franchiseId, setFranchiseId] = useState('HEAD_OFFICE');

  const handleOpenAddModal = () => {
    setIsEditing(false);
    setEditingStaffId(null);
    setName('');
    setRole('USER MANAGEMENT');
    setEmail('');
    setPhone('');
    setStatus('active');
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
    setConfirmDialog({
      isOpen: true,
      title: 'Remove Staff Member',
      message: 'Are you sure you want to remove this staff member? This action cannot be undone.',
      onConfirm: async () => {
        try {
          await axiosInstance.delete(`/admin/staff/${id}`);
          fetchData();
        } catch (error) {
          console.error('Error deleting staff:', error);
          setAlertDialog({
            isOpen: true,
            title: 'Error',
            message: 'Failed to delete staff member'
          });
        }
        setConfirmDialog({ isOpen: false, title: '', message: '', onConfirm: null });
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      if (isEditing) {
        await axiosInstance.put(`/admin/staff/${editingStaffId}`, {
          name,
          role,
          email,
          phone_number: phone,
          account_status: status,
          franchise: franchiseId
        });
      } else {
        await axiosInstance.post('/admin/staff', {
          name,
          role,
          email,
          phone_number: phone,
          account_status: status,
          franchise: franchiseId
        });
      }
      setShowModal(false);
      fetchData();
    } catch (error) {
      console.error('Error saving staff:', error);
      setAlertDialog({
        isOpen: true,
        title: 'Error',
        message: error.response?.data?.error || 'Failed to save staff member'
      });
    } finally {
      setIsSubmitting(false);
    }
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
          {franchiseOptions.map((f) => (
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
                        staff.role === 'USER MANAGEMENT'
                          ? 'bg-purple-50 border-purple-100 text-purple-700'
                          : 'bg-amber-50 border-amber-100 text-amber-700'
                      }`} title={staff.role}>
                        {staff.role === 'USER MANAGEMENT' ? 'User Management Staff' : 'Finance & Package Staff'}
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
                        staff.status === 'active'
                          ? 'bg-emerald-50 border-emerald-100 text-emerald-700'
                          : 'bg-slate-100 border-slate-200 text-slate-450'
                      }`}>
                        <span className={`w-1 h-1 rounded-full ${staff.status === 'active' ? 'bg-emerald-500' : 'bg-slate-400'}`}></span>
                        {staff.status === 'active' ? 'Active' : 'Inactive'}
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
                  <option value="USER MANAGEMENT">User Management Staff</option>
                  <option value="FINANCE & PACKAGE">Finance & Package Staff</option>
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
                  {franchiseOptions.map((f) => (
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
                      value="active"
                      checked={status === 'active'}
                      onChange={() => setStatus('active')}
                      className="accent-deep-maroon cursor-pointer"
                    />
                    <span>Active</span>
                  </label>
                  <label className="flex items-center gap-1.5 text-xs text-slate-700 cursor-pointer select-none">
                    <input
                      type="radio"
                      name="status"
                      value="inactive"
                      checked={status === 'inactive'}
                      onChange={() => setStatus('inactive')}
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
                  disabled={isSubmitting}
                  className={`px-4 py-2 bg-deep-maroon hover:bg-primary text-white font-bold rounded-xl text-xs cursor-pointer select-none ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
                >
                  {isSubmitting ? 'Saving...' : (isEditing ? 'Save Changes' : 'Register Staff')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirm Dialog */}
      {confirmDialog.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div onClick={() => setConfirmDialog({ ...confirmDialog, isOpen: false })} className="absolute inset-0 bg-black/40 backdrop-blur-xs transition-opacity"></div>
          <div className="bg-paper-white rounded-2xl shadow-xl border border-surface-variant/40 w-full max-w-sm relative z-10 p-6 animate-fade-in text-center">
            <h3 className="text-lg font-bold text-slate-800 mb-2">{confirmDialog.title}</h3>
            <p className="text-sm text-slate-500 mb-6">{confirmDialog.message}</p>
            <div className="flex justify-center gap-3">
              <button
                onClick={() => setConfirmDialog({ ...confirmDialog, isOpen: false })}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-charcoal-text font-bold rounded-xl text-xs cursor-pointer select-none"
              >
                Cancel
              </button>
              <button
                onClick={confirmDialog.onConfirm}
                className="px-4 py-2 bg-rose-500 hover:bg-rose-600 text-white font-bold rounded-xl text-xs cursor-pointer select-none"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Alert Dialog */}
      {alertDialog.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div onClick={() => setAlertDialog({ ...alertDialog, isOpen: false })} className="absolute inset-0 bg-black/40 backdrop-blur-xs transition-opacity"></div>
          <div className="bg-paper-white rounded-2xl shadow-xl border border-surface-variant/40 w-full max-w-sm relative z-10 p-6 animate-fade-in text-center">
            <h3 className="text-lg font-bold text-slate-800 mb-2">{alertDialog.title}</h3>
            <p className="text-sm text-slate-500 mb-6">{alertDialog.message}</p>
            <button
              onClick={() => setAlertDialog({ ...alertDialog, isOpen: false })}
              className="px-4 py-2 bg-deep-maroon hover:bg-primary text-white font-bold rounded-xl text-xs cursor-pointer select-none w-full"
            >
              Okay
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
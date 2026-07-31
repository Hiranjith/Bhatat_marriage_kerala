import React, { useState, useEffect } from 'react';
import axiosInstance from '../../utils/axiosInstance';

// Simple 6-digit Indian pincode check
const isValidPincode = (val) => /^\d{6}$/.test(val.trim());

export default function FranchiseManagement() {
  const [franchiseList, setFranchiseList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetchFranchises();
  }, []);

  const fetchFranchises = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get('/admin/franchises');
      const formatted = response.data.map(item => ({
        id: item.franchise_id,
        name: item.name,
        owner: item.owner,
        location: item.location,
        phone: item.mobile_number,
        email: item.email,
        pincodes: typeof item.pin_codes === 'string' ? JSON.parse(item.pin_codes) : item.pin_codes,
        status: item.status === 'active' ? 'Active' : 'Inactive',
      }));
      setFranchiseList(formatted);
    } catch (error) {
      console.error('Error fetching franchises:', error);
    } finally {
      setLoading(false);
    }
  };

  // Add / Edit modal state
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);

  // View pincodes modal state
  const [viewingFranchise, setViewingFranchise] = useState(null);

  // Delete confirmation modal state
  const [franchiseToDelete, setFranchiseToDelete] = useState(null);

  // Form States
  const [name, setName] = useState('');
  const [owner, setOwner] = useState('');
  const [location, setLocation] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('Active');
  const [pincodes, setPincodes] = useState([]);
  const [pincodeInput, setPincodeInput] = useState('');
  const [pincodeError, setPincodeError] = useState('');

  const resetForm = () => {
    setName('');
    setOwner('');
    setLocation('');
    setPhone('');
    setEmail('');
    setStatus('Active');
    setPincodes([]);
    setPincodeInput('');
    setPincodeError('');
  };

  const handleOpenAddModal = () => {
    setIsEditing(false);
    setEditingId(null);
    resetForm();
    setShowModal(true);
  };

  const handleOpenEditModal = (franchise) => {
    setIsEditing(true);
    setEditingId(franchise.id);
    setName(franchise.name);
    setOwner(franchise.owner);
    setLocation(franchise.location);
    setPhone(franchise.phone);
    setEmail(franchise.email);
    setStatus(franchise.status);
    setPincodes(franchise.pincodes || []);
    setPincodeInput('');
    setPincodeError('');
    setShowModal(true);
  };

  const handleDeleteFranchise = (id) => {
    setFranchiseToDelete(id);
  };

  const confirmDeleteFranchise = async () => {
    if (!franchiseToDelete) return;
    try {
      await axiosInstance.delete(`/admin/franchises/${franchiseToDelete}`);
      setFranchiseList(prev => prev.filter(item => item.id !== franchiseToDelete));
    } catch (error) {
      console.error('Error deleting franchise:', error);
      alert('Failed to delete franchise');
    } finally {
      setFranchiseToDelete(null);
    }
  };

  const handleAddPincode = () => {
    const val = pincodeInput.trim();
    if (!val) return;

    if (!isValidPincode(val)) {
      setPincodeError('Enter a valid 6-digit pincode.');
      return;
    }
    if (pincodes.includes(val)) {
      setPincodeError('This pincode is already added to this franchise.');
      return;
    }

    const isAssignedElsewhere = franchiseList.some(f => f.id !== editingId && f.pincodes.includes(val));
    if (isAssignedElsewhere) {
      setPincodeError('This pincode is already assigned to a franchise');
      return;
    }

    setPincodes(prev => [...prev, val]);
    setPincodeInput('');
    setPincodeError('');
  };

  const handlePincodeKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      handleAddPincode();
    }
  };

  const handleRemovePincode = (code) => {
    setPincodes(prev => prev.filter(p => p !== code));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const payload = {
        name,
        owner,
        location,
        mobile_number: phone,
        email,
        pin_codes: pincodes,
        status: status.toLowerCase()
      };

      if (isEditing) {
        await axiosInstance.put(`/admin/franchises/${editingId}`, payload);
      } else {
        await axiosInstance.post('/admin/franchises', payload);
      }
      
      await fetchFranchises();
      setShowModal(false);
    } catch (error) {
      console.error('Error saving franchise:', error);
      alert('Failed to save franchise');
    }
  };

  // Remove a pincode directly from the View modal (updates the live franchise record)
  const handleRemovePincodeFromView = async (franchiseId, code) => {
    try {
      const franchiseToUpdate = franchiseList.find(f => f.id === franchiseId);
      if (!franchiseToUpdate) return;
      
      const newPincodes = franchiseToUpdate.pincodes.filter(p => p !== code);
      
      const payload = {
        pin_codes: newPincodes
      };

      await axiosInstance.patch(`/admin/franchises/${franchiseId}/pincodes`, payload);
      
      setFranchiseList(prev => prev.map(item => {
        if (item.id === franchiseId) {
          return { ...item, pincodes: newPincodes };
        }
        return item;
      }));
      setViewingFranchise(prev => prev ? { ...prev, pincodes: newPincodes } : prev);
    } catch (error) {
      console.error('Error updating pincodes:', error);
      alert('Failed to remove pincode');
    }
  };

  const activeCount = franchiseList.filter(f => f.status === 'Active').length;

  const sortedFranchiseList = [...franchiseList].sort((a, b) => a.name.localeCompare(b.name));
  const totalFranchises = sortedFranchiseList.length;
  const totalPages = Math.ceil(totalFranchises / 10);
  const paginatedFranchises = sortedFranchiseList.slice((currentPage - 1) * 10, currentPage * 10);

  return (
    <div className="space-y-6 min-w-0">
      {/* Header Panel */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-slate-800 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-deep-maroon"></span>
            Franchise Management
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Onboard franchise partners and assign the pincodes they can manage users for.
          </p>
        </div>
        <button
          onClick={handleOpenAddModal}
          className="bg-deep-maroon hover:bg-primary text-white text-xs font-bold py-2 px-4 rounded-xl shadow-md transition-all cursor-pointer flex items-center gap-1.5 self-start active:scale-95 border border-white/10 select-none"
        >
          <span className="material-symbols-outlined text-sm">add</span>
          Add Franchise
        </button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 w-full">
        <div className="bg-white rounded-2xl border border-slate-200/60 p-3 sm:p-4 shadow-xs flex items-center gap-2 sm:gap-4 min-w-0">
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-base sm:text-xl">storefront</span>
          </div>
          <div className="min-w-0">
            <span className="text-[9px] sm:text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Total Franchises</span>
            <span className="text-sm sm:text-xl font-black text-slate-800 truncate block">{franchiseList.length}</span>
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200/60 p-3 sm:p-4 shadow-xs flex items-center gap-2 sm:gap-4 min-w-0">
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-base sm:text-xl">verified</span>
          </div>
          <div className="min-w-0">
            <span className="text-[9px] sm:text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Active Franchises</span>
            <span className="text-sm sm:text-xl font-black text-slate-800 truncate block">{activeCount}</span>
          </div>
        </div>
      </div>

      {/* Table Container */}
      <div className="bg-white rounded-2xl border border-slate-200/60 shadow-xs overflow-hidden w-full max-w-full">
        <div className="overflow-x-auto w-full">
          <table className="w-full min-w-[850px] text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50/70 border-b border-slate-200 text-slate-400 font-bold uppercase tracking-wider">
                <th className="py-3.5 px-2.5 font-semibold text-[10px]">Franchise ID</th>
                <th className="py-3.5 px-2.5 font-semibold text-[10px]">Name</th>
                <th className="py-3.5 px-2.5 font-semibold text-[10px]">Owner</th>
                <th className="py-3.5 px-2.5 font-semibold text-[10px]">Location</th>
                <th className="py-3.5 px-2.5 font-semibold text-[10px]">Contact</th>
                <th className="py-3.5 px-2.5 font-semibold text-[10px]">Pin Codes</th>
                <th className="py-3.5 px-2.5 font-semibold text-[10px]">Status</th>
                <th className="py-3.5 px-2.5 font-semibold text-[10px] text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {franchiseList.length === 0 ? (
                <tr>
                  <td colSpan="8" className="py-12 text-center text-slate-400 font-semibold">
                    <span className="material-symbols-outlined text-3xl mb-1 block">storefront</span>
                    No franchises registered. Click "Add Franchise" to onboard one.
                  </td>
                </tr>
              ) : (
                paginatedFranchises.map((franchise) => (
                  <tr key={franchise.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-3 px-2.5 font-bold text-slate-800 whitespace-nowrap">{franchise.id}</td>
                    <td className="py-3 px-2.5">
                      <span className="font-bold text-slate-800 block max-w-[150px] truncate" title={franchise.name}>
                        {franchise.name}
                      </span>
                    </td>
                    <td className="py-3 px-2.5">
                      <span className="block max-w-[120px] truncate" title={franchise.owner}>
                        {franchise.owner}
                      </span>
                    </td>
                    <td className="py-3 px-2.5 text-slate-500">
                      <span className="block max-w-[130px] truncate" title={franchise.location}>
                        {franchise.location}
                      </span>
                    </td>
                    <td className="py-3 px-2.5 text-slate-500">
                      <div className="min-w-0">
                        <p className="truncate max-w-[140px]" title={franchise.phone}>{franchise.phone}</p>
                        <p className="text-[10px] text-slate-400 truncate max-w-[140px]" title={franchise.email}>{franchise.email}</p>
                      </div>
                    </td>
                    <td className="py-3 px-2.5">
                      <div className="flex items-center gap-1.5 whitespace-nowrap">
                        <span className="inline-block px-2 py-0.5 rounded-full text-[9px] font-bold bg-blue-50 text-blue-700 border border-blue-100">
                          {franchise.pincodes.length} {franchise.pincodes.length === 1 ? 'Code' : 'Codes'}
                        </span>
                        <button
                          onClick={() => setViewingFranchise(franchise)}
                          className="px-2 py-0.5 rounded-full text-[9px] font-bold uppercase border border-slate-200 text-slate-600 hover:bg-slate-100 cursor-pointer transition-colors"
                        >
                          View
                        </button>
                      </div>
                    </td>
                    <td className="py-3 px-2.5">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase border whitespace-nowrap ${
                        franchise.status === 'Active'
                          ? 'bg-emerald-50 border-emerald-100 text-emerald-700'
                          : 'bg-slate-100 border-slate-200 text-slate-450'
                      }`}>
                        <span className={`w-1 h-1 rounded-full ${franchise.status === 'Active' ? 'bg-emerald-500' : 'bg-slate-400'}`}></span>
                        {franchise.status}
                      </span>
                    </td>
                    <td className="py-3 px-2.5">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleOpenEditModal(franchise)}
                          className="p-1 hover:bg-slate-150 rounded-lg text-slate-500 hover:text-slate-800 cursor-pointer flex items-center transition-colors"
                          title="Edit Franchise"
                        >
                          <span className="material-symbols-outlined text-base">edit</span>
                        </button>
                        <button
                          onClick={() => handleDeleteFranchise(franchise.id)}
                          className="p-1 hover:bg-rose-50 rounded-lg text-rose-450 hover:text-rose-700 cursor-pointer flex items-center transition-colors"
                          title="Delete Franchise"
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

        {/* Pagination Controls */}
        <div className="p-4 border-t border-slate-200/60 flex items-center justify-between bg-slate-50/30 rounded-b-2xl">
          <span className="text-xs text-deep-maroon font-semibold">
            Showing <span className="font-bold">{paginatedFranchises.length > 0 ? (currentPage - 1) * 10 + 1 : 0}</span> to <span className="font-bold">{Math.min(currentPage * 10, totalFranchises)}</span> of <span className="font-bold">{totalFranchises}</span> franchises
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

      {/* Add / Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div
            onClick={() => setShowModal(false)}
            className="absolute inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
          ></div>

          <div className="bg-paper-white rounded-2xl shadow-xl border border-surface-variant/40 overflow-hidden w-full max-w-md relative z-10 animate-fade-in text-left max-h-[90vh] flex flex-col">
            <div className="bg-gradient-to-r from-deep-maroon to-primary px-6 py-4 text-white flex items-center justify-between shrink-0">
              <h3 className="font-bold text-sm tracking-wide uppercase">
                {isEditing ? 'Edit Franchise Details' : 'Add New Franchise'}
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
                  Franchise Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full border border-surface-variant rounded-xl py-2 px-3 text-xs bg-white text-charcoal-text focus:outline-none focus:ring-1 focus:ring-deep-maroon focus:border-deep-maroon placeholder-soft-gray/40"
                  placeholder="e.g. Bharath Marriage - Trivandrum"
                  required
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-charcoal-text/75 mb-1">
                  Owner / Partner Name
                </label>
                <input
                  type="text"
                  value={owner}
                  onChange={(e) => setOwner(e.target.value)}
                  className="w-full border border-surface-variant rounded-xl py-2 px-3 text-xs bg-white text-charcoal-text focus:outline-none focus:ring-1 focus:ring-deep-maroon focus:border-deep-maroon placeholder-soft-gray/40"
                  placeholder="Enter owner's full name"
                  required
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-charcoal-text/75 mb-1">
                  Location
                </label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full border border-surface-variant rounded-xl py-2 px-3 text-xs bg-white text-charcoal-text focus:outline-none focus:ring-1 focus:ring-deep-maroon focus:border-deep-maroon placeholder-soft-gray/40"
                  placeholder="e.g. Trivandrum, Kerala"
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
                <label className="block text-[10px] font-bold uppercase tracking-wider text-charcoal-text/75 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full border border-surface-variant rounded-xl py-2 px-3 text-xs bg-white text-charcoal-text focus:outline-none focus:ring-1 focus:ring-deep-maroon focus:border-deep-maroon placeholder-soft-gray/40"
                  placeholder="e.g. branch@bharathmarriage.com"
                  required
                />
              </div>

              {/* Pincode Assignment */}
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-charcoal-text/75 mb-1">
                  Assigned Pin Codes
                </label>
                <p className="text-[10px] text-slate-400 mb-1.5">
                  Only users registered under these pincodes will be visible to this franchise.
                </p>
                <div className="flex gap-2">
                  <input
                    type="text"
                    inputMode="numeric"
                    maxLength={6}
                    value={pincodeInput}
                    onChange={(e) => {
                      setPincodeInput(e.target.value.replace(/[^0-9]/g, ''));
                      if (pincodeError) setPincodeError('');
                    }}
                    onKeyDown={handlePincodeKeyDown}
                    className="flex-1 min-w-0 border border-surface-variant rounded-xl py-2 px-3 text-xs bg-white text-charcoal-text focus:outline-none focus:ring-1 focus:ring-deep-maroon focus:border-deep-maroon placeholder-soft-gray/40"
                    placeholder="e.g. 682001"
                  />
                  <button
                    type="button"
                    onClick={handleAddPincode}
                    className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-charcoal-text font-bold rounded-xl text-xs cursor-pointer select-none shrink-0"
                  >
                    Add
                  </button>
                </div>
                {pincodeError && (
                  <p className="text-[10px] text-rose-600 font-semibold mt-1">{pincodeError}</p>
                )}

                {pincodes.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-3 max-h-32 overflow-y-auto p-2 bg-slate-50/60 rounded-xl border border-slate-100">
                    {pincodes.map((code) => (
                      <span
                        key={code}
                        className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-100"
                      >
                        {code}
                        <button
                          type="button"
                          onClick={() => handleRemovePincode(code)}
                          className="hover:text-rose-600 cursor-pointer flex items-center"
                          title="Remove pincode"
                        >
                          <span className="material-symbols-outlined text-[13px] leading-none">close</span>
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-charcoal-text/75 mb-1.5">
                  Status
                </label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-1.5 text-xs text-slate-700 cursor-pointer select-none">
                    <input
                      type="radio"
                      name="fstatus"
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
                      name="fstatus"
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
                  {isEditing ? 'Save Changes' : 'Register Franchise'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Pincodes Modal */}
      {viewingFranchise && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div
            onClick={() => setViewingFranchise(null)}
            className="absolute inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
          ></div>

          <div className="bg-paper-white rounded-2xl shadow-xl border border-surface-variant/40 overflow-hidden w-full max-w-sm relative z-10 animate-fade-in text-left max-h-[80vh] flex flex-col">
            <div className="bg-gradient-to-r from-deep-maroon to-primary px-6 py-4 text-white flex items-center justify-between shrink-0">
              <div className="min-w-0">
                <h3 className="font-bold text-sm tracking-wide uppercase truncate">
                  Assigned Pin Codes
                </h3>
                <p className="text-[10px] text-white/80 truncate">{viewingFranchise.name}</p>
              </div>
              <button
                onClick={() => setViewingFranchise(null)}
                className="text-white/80 hover:text-white cursor-pointer flex items-center shrink-0"
              >
                <span className="material-symbols-outlined text-xl">close</span>
              </button>
            </div>

            <div className="p-6 overflow-y-auto">
              {viewingFranchise.pincodes.length === 0 ? (
                <div className="text-center text-slate-400 py-8">
                  <span className="material-symbols-outlined text-3xl mb-1 block">location_off</span>
                  <p className="text-xs font-semibold">No pincodes assigned yet.</p>
                </div>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {viewingFranchise.pincodes.map((code) => (
                    <span
                      key={code}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-bold bg-blue-50 text-blue-700 border border-blue-100"
                    >
                      <span className="material-symbols-outlined text-[13px] leading-none">location_on</span>
                      {code}
                      <button
                        type="button"
                        onClick={() => handleRemovePincodeFromView(viewingFranchise.id, code)}
                        className="hover:text-rose-600 cursor-pointer flex items-center"
                        title="Remove pincode"
                      >
                        <span className="material-symbols-outlined text-[13px] leading-none">close</span>
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="p-4 border-t border-slate-100 flex justify-end shrink-0">
              <button
                onClick={() => setViewingFranchise(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-charcoal-text font-bold rounded-xl text-xs cursor-pointer select-none"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirm Dialog (Staff Management Design) */}
      {franchiseToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div
            onClick={() => setFranchiseToDelete(null)}
            className="absolute inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
          ></div>
          <div className="bg-paper-white rounded-2xl shadow-xl border border-surface-variant/40 w-full max-w-sm relative z-10 p-6 animate-fade-in text-center">
            <h3 className="text-lg font-bold text-slate-800 mb-2">Remove Franchise</h3>
            <p className="text-sm text-slate-500 mb-6">
              Are you sure you want to remove this franchise? This action cannot be undone.
            </p>
            <div className="flex justify-center gap-3">
              <button
                onClick={() => setFranchiseToDelete(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-charcoal-text font-bold rounded-xl text-xs cursor-pointer select-none"
              >
                Cancel
              </button>
              <button
                onClick={confirmDeleteFranchise}
                className="px-4 py-2 bg-rose-500 hover:bg-rose-600 text-white font-bold rounded-xl text-xs cursor-pointer select-none"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
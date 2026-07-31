import React, { useState, useEffect } from 'react';
import axiosInstance from '../../utils/axiosInstance';

export default function HeadFranchise() {
  const [requests, setRequests] = useState([]);
  const [franchiseOptions, setFranchiseOptions] = useState([]);
  const [assigningRequest, setAssigningRequest] = useState(null);
  const [selectedFranchiseId, setSelectedFranchiseId] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  
  const [toast, setToast] = useState({ isVisible: false, title: '', message: '' });

  const showToast = (title, message) => {
    setToast({ isVisible: true, title, message });
    setTimeout(() => setToast(prev => ({ ...prev, isVisible: false })), 5000);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [reqRes, franRes] = await Promise.all([
        axiosInstance.get('/admin/head-franchise/requests'),
        axiosInstance.get('/admin/franchises')
      ]);
      setRequests(reqRes.data);
      setFranchiseOptions(franRes.data);
    } catch (error) {
      console.error('Error fetching head franchise data:', error);
    }
  };

  const unassignedCount = requests.length;

  const sortedRequests = [...requests].sort((a, b) => a.userName.localeCompare(b.userName));
  const totalPages = Math.ceil(unassignedCount / 10);
  const paginatedRequests = sortedRequests.slice((currentPage - 1) * 10, currentPage * 10);

  const handleOpenAssign = (request) => {
    setAssigningRequest(request);
    setSelectedFranchiseId('');
  };

  const handleConfirmAssign = async () => {
    if (!selectedFranchiseId) return;

    try {
      await axiosInstance.post('/admin/head-franchise/assign', {
        request_id: assigningRequest.requestId || assigningRequest.id,
        franchise_id: selectedFranchiseId
      });
      
      // Refresh data
      fetchData();
      
      const selectedFranchiseName = franchiseOptions.find(f => (f.franchise_id || f.id) === selectedFranchiseId)?.name || 'the selected franchise';
      
      setAssigningRequest(null);
      setSelectedFranchiseId('');
      showToast('Assigned Successfully', `User has been assigned to ${selectedFranchiseName}.`);
    } catch (error) {
      console.error('Error assigning request:', error);
      showToast('Error', 'Failed to assign request. Please try again.');
    }
  };

  return (
    <div className="space-y-6 min-w-0">
      {/* Header */}
      <div>
        <h2 className="text-lg sm:text-xl font-bold text-slate-800 flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-deep-maroon"></span>
          Head Franchise
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          Users who registered with a pincode outside any franchise's coverage land here. Assign their pincode to a franchise to route them.
        </p>
      </div>

      {/* Quick Stats */}
      <div className="w-full max-w-sm">
        <div className="bg-white rounded-2xl border border-slate-200/60 p-3 sm:p-4 shadow-xs flex items-center gap-2 sm:gap-4 min-w-0">
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-base sm:text-xl">pending_actions</span>
          </div>
          <div className="min-w-0">
            <span className="text-[9px] sm:text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Total Pending Requests</span>
            <span className="text-sm sm:text-xl font-black text-slate-800 truncate block">{unassignedCount}</span>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-200/60 shadow-xs overflow-hidden w-full max-w-full">
        <div className="overflow-x-auto w-full">
          <table className="w-full min-w-[800px] text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50/70 border-b border-slate-200 text-slate-400 font-bold uppercase tracking-wider">
                <th className="py-3.5 px-2.5 font-semibold text-[10px]">Request ID</th>
                <th className="py-3.5 px-2.5 font-semibold text-[10px]">User</th>
                <th className="py-3.5 px-2.5 font-semibold text-[10px]">Pincode</th>
                <th className="py-3.5 px-2.5 font-semibold text-[10px]">Contact</th>
                <th className="py-3.5 px-2.5 font-semibold text-[10px]">Registered On</th>
                <th className="py-3.5 px-2.5 font-semibold text-[10px] text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {requests.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-12 text-center text-slate-400 font-semibold">
                    <span className="material-symbols-outlined text-3xl mb-1 block">domain</span>
                    No pending requests.
                  </td>
                </tr>
              ) : (
                paginatedRequests.map((req) => (
                  <tr key={req.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-3 px-2.5 font-bold text-slate-800 whitespace-nowrap">{req.id}</td>
                    <td className="py-3 px-2.5">
                      <div>
                        <p className="font-bold text-slate-800 truncate max-w-[140px]" title={req.userName}>{req.userName}</p>
                        <p className="text-[10px] text-slate-400 mt-0.5">{req.userId}</p>
                      </div>
                    </td>
                    <td className="py-3 px-2.5">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold bg-rose-50 text-rose-700 border border-rose-100">
                        <span className="material-symbols-outlined text-[12px] leading-none">location_on</span>
                        {req.pincode}
                      </span>
                    </td>
                    <td className="py-3 px-2.5 text-slate-500">
                      <p className="truncate max-w-[140px]" title={req.phone}>{req.phone}</p>
                      <p className="text-[10px] text-slate-400 truncate max-w-[140px]" title={req.email}>{req.email}</p>
                    </td>
                    <td className="py-3 px-2.5 text-slate-400 whitespace-nowrap">{req.registeredOn}</td>
                    <td className="py-3 px-2.5 text-center">
                      <button
                        onClick={() => handleOpenAssign(req)}
                        className="px-3 py-1 rounded-lg text-[10px] font-bold uppercase transition-colors bg-deep-maroon text-white hover:bg-primary cursor-pointer"
                      >
                        Assign
                      </button>
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
            Showing <span className="font-bold">{paginatedRequests.length > 0 ? (currentPage - 1) * 10 + 1 : 0}</span> to <span className="font-bold">{Math.min(currentPage * 10, unassignedCount)}</span> of <span className="font-bold">{unassignedCount}</span> requests
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

      {/* Assign Modal */}
      {assigningRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div
            onClick={() => setAssigningRequest(null)}
            className="absolute inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
          ></div>

          <div className="bg-paper-white rounded-2xl shadow-xl border border-surface-variant/40 overflow-hidden w-full max-w-sm relative z-10 animate-fade-in text-left">
            <div className="bg-gradient-to-r from-deep-maroon to-primary px-6 py-4 text-white flex items-center justify-between">
              <h3 className="font-bold text-sm tracking-wide uppercase">Assign Pincode</h3>
              <button
                onClick={() => setAssigningRequest(null)}
                className="text-white/80 hover:text-white cursor-pointer flex items-center"
              >
                <span className="material-symbols-outlined text-xl">close</span>
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="bg-slate-50/60 border border-slate-100 rounded-xl p-3 text-xs">
                <p className="font-bold text-slate-800">{assigningRequest.userName}</p>
                <p className="text-slate-500 mt-0.5">{assigningRequest.userId}</p>
                <div className="flex items-center gap-1 mt-2">
                  <span className="material-symbols-outlined text-rose-600 text-sm leading-none">location_on</span>
                  <span className="font-bold text-rose-700">{assigningRequest.pincode}</span>
                  <span className="text-slate-400">is currently out of coverage</span>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-charcoal-text/75 mb-1">
                  Assign to Franchise
                </label>
                <select
                  value={selectedFranchiseId}
                  onChange={(e) => setSelectedFranchiseId(e.target.value)}
                  className="w-full border border-surface-variant rounded-xl py-2 px-3 text-xs bg-white text-charcoal-text focus:outline-none focus:ring-1 focus:ring-deep-maroon focus:border-deep-maroon"
                >
                  <option value="">Select a franchise...</option>
                  {franchiseOptions.map((f) => (
                    <option key={f.franchise_id || f.id} value={f.franchise_id || f.id}>{f.name}</option>
                  ))}
                </select>
                <p className="text-[10px] text-slate-400 mt-1.5">
                  This adds pincode {assigningRequest.pincode} to the selected franchise's coverage.
                </p>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setAssigningRequest(null)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-charcoal-text font-bold rounded-xl text-xs cursor-pointer select-none"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirmAssign}
                  disabled={!selectedFranchiseId}
                  className={`px-4 py-2 font-bold rounded-xl text-xs select-none ${
                    selectedFranchiseId
                      ? 'bg-deep-maroon hover:bg-primary text-white cursor-pointer'
                      : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  Confirm Assignment
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Shadcn-like Toast */}
      {toast.isVisible && (
        <div className="fixed top-0 z-[100] flex max-h-screen w-full flex-col-reverse p-4 sm:bottom-0 sm:right-0 sm:top-auto sm:flex-col md:max-w-[420px]">
          <div className="pointer-events-auto flex w-full items-center justify-between space-x-4 overflow-hidden rounded-md border border-slate-200 bg-white p-6 shadow-lg relative group animate-in slide-in-from-top-full sm:slide-in-from-bottom-full">
            <div className="grid gap-1">
              {toast.title && <div className="text-sm font-semibold text-slate-900">{toast.title}</div>}
              {toast.message && <div className="text-sm opacity-90 text-slate-600">{toast.message}</div>}
            </div>
            <button
              onClick={() => setToast({ ...toast, isVisible: false })}
              className="absolute right-2 top-2 rounded-md p-1 text-slate-500/50 opacity-0 transition-opacity hover:text-slate-900 group-hover:opacity-100 cursor-pointer"
            >
              <span className="material-symbols-outlined text-sm">close</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
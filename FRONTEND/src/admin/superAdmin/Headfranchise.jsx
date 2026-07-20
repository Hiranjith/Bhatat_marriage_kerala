import React, { useState } from 'react';

// In production this list should come from the same source as
// FranchiseManagement (lifted state or an API call), so that assigning
// a pincode here actually adds it to that franchise's coverage list.
// Kept as local mock data here since FranchiseManagement currently
// manages its own state independently.
const FRANCHISE_OPTIONS = [
  { id: 'FRN0001', name: 'Bharath Marriage - Kochi' },
  { id: 'FRN0002', name: 'Bharath Marriage - Coimbatore' }
];

const INITIAL_UNASSIGNED = [
  {
    id: 'REQ0001',
    userId: 'BKLH000000012',
    userName: 'Divya Nair',
    pincode: '695001',
    phone: '+91 9037012345',
    email: 'divya.n@example.com',
    registeredOn: '2026-07-18',
    status: 'Unassigned',
    assignedTo: null
  },
  {
    id: 'REQ0002',
    userId: 'BKLH000000013',
    userName: 'Arjun Pillai',
    pincode: '673001',
    phone: '+91 9846012345',
    email: 'arjun.p@example.com',
    registeredOn: '2026-07-19',
    status: 'Unassigned',
    assignedTo: null
  },
  {
    id: 'REQ0003',
    userId: 'BKLH000000014',
    userName: 'Sneha Thomas',
    pincode: '682501',
    phone: '+91 9744012345',
    email: 'sneha.t@example.com',
    registeredOn: '2026-07-20',
    status: 'Unassigned',
    assignedTo: null
  }
];

export default function HeadFranchise() {
  const [requests, setRequests] = useState(INITIAL_UNASSIGNED);
  const [assigningRequest, setAssigningRequest] = useState(null);
  const [selectedFranchiseId, setSelectedFranchiseId] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');

  const unassignedCount = requests.filter(r => r.status === 'Unassigned').length;
  const assignedCount = requests.filter(r => r.status === 'Assigned').length;

  const filteredRequests = requests.filter(r =>
    filterStatus === 'All' || r.status === filterStatus
  );

  const handleOpenAssign = (request) => {
    setAssigningRequest(request);
    setSelectedFranchiseId('');
  };

  const handleConfirmAssign = () => {
    if (!selectedFranchiseId) return;

    const franchise = FRANCHISE_OPTIONS.find(f => f.id === selectedFranchiseId);

    setRequests(prev => prev.map(r => {
      if (r.id === assigningRequest.id) {
        return { ...r, status: 'Assigned', assignedTo: franchise.name };
      }
      return r;
    }));

    setAssigningRequest(null);
    setSelectedFranchiseId('');
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
      <div className="grid grid-cols-2 gap-3 sm:gap-4 w-full">
        <div className="bg-white rounded-2xl border border-slate-200/60 p-3 sm:p-4 shadow-xs flex items-center gap-2 sm:gap-4 min-w-0">
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-base sm:text-xl">pending_actions</span>
          </div>
          <div className="min-w-0">
            <span className="text-[9px] sm:text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Unassigned</span>
            <span className="text-sm sm:text-xl font-black text-slate-800 truncate block">{unassignedCount}</span>
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200/60 p-3 sm:p-4 shadow-xs flex items-center gap-2 sm:gap-4 min-w-0">
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-base sm:text-xl">task_alt</span>
          </div>
          <div className="min-w-0">
            <span className="text-[9px] sm:text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Assigned</span>
            <span className="text-sm sm:text-xl font-black text-slate-800 truncate block">{assignedCount}</span>
          </div>
        </div>
      </div>

      {/* Filter */}
      <div className="bg-white rounded-2xl border border-slate-200/60 p-4 shadow-xs flex items-center gap-2 text-xs font-semibold text-slate-700 w-full max-w-full">
        <span className="text-[10px] uppercase text-slate-400 font-bold shrink-0">Status:</span>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="border border-surface-variant rounded-lg py-1 px-2 bg-white text-slate-700 focus:ring-1 focus:ring-deep-maroon focus:outline-none w-[140px] text-[11px]"
        >
          <option value="All">All Requests</option>
          <option value="Unassigned">Unassigned</option>
          <option value="Assigned">Assigned</option>
        </select>
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
                <th className="py-3.5 px-2.5 font-semibold text-[10px]">Status</th>
                <th className="py-3.5 px-2.5 font-semibold text-[10px] text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {filteredRequests.length === 0 ? (
                <tr>
                  <td colSpan="7" className="py-12 text-center text-slate-400 font-semibold">
                    <span className="material-symbols-outlined text-3xl mb-1 block">domain</span>
                    No requests match this filter.
                  </td>
                </tr>
              ) : (
                filteredRequests.map((req) => (
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
                    <td className="py-3 px-2.5">
                      {req.status === 'Assigned' ? (
                        <span className="inline-flex flex-col gap-0.5">
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase border bg-emerald-50 border-emerald-100 text-emerald-700 w-fit">
                            <span className="w-1 h-1 rounded-full bg-emerald-500"></span>
                            Assigned
                          </span>
                          <span className="text-[10px] text-slate-400 truncate max-w-[130px]" title={req.assignedTo}>
                            &rarr; {req.assignedTo}
                          </span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase border bg-amber-50 border-amber-100 text-amber-700">
                          <span className="w-1 h-1 rounded-full bg-amber-500"></span>
                          Unassigned
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-2.5 text-center">
                      <button
                        onClick={() => handleOpenAssign(req)}
                        disabled={req.status === 'Assigned'}
                        className={`px-3 py-1 rounded-lg text-[10px] font-bold uppercase transition-colors ${
                          req.status === 'Assigned'
                            ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                            : 'bg-deep-maroon text-white hover:bg-primary cursor-pointer'
                        }`}
                      >
                        {req.status === 'Assigned' ? 'Assigned' : 'Assign'}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
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
                  {FRANCHISE_OPTIONS.map((f) => (
                    <option key={f.id} value={f.id}>{f.name}</option>
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
    </div>
  );
}
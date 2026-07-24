import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../utils/axiosInstance';
import AdminSidebar from '../../../components/admin/AdminSidebar';
import UserManagement from './UserManagement';
import PackagesManagement from './PackagesManagement';
import PaymentRevenue from './PaymentRevenue';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [role, setRole] = useState('');
  const [metrics, setMetrics] = useState({
    totalUsers: 0,
    activeUsers: 0,
    blockedUsers: 0,
    bannedUsers: 0,
    freezedUsers: 0,
    reportedUsers: 0,
    totalStaffs: 0,
    monthlyRevenue: '₹0'
  });

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isAdminLoggedIn');
    const userRole = localStorage.getItem('adminRole');
    
    if (!isLoggedIn || !userRole || userRole === 'superadmin') {
      // Redirect standard admin back to login if not logged in
      navigate('/admin/login');
      return;
    }
    setRole(userRole);

    const fetchMetrics = async () => {
      try {
        const adminFranchise = localStorage.getItem('adminFranchise');
        let url = '/admin/dashboard/metrics';
        if (adminFranchise) {
          url += `?franchise_id=${adminFranchise}`;
        }
        const response = await axiosInstance.get(url);
        setMetrics(response.data);
      } catch (error) {
        console.error('Error fetching metrics', error);
      }
    };

    if (userRole === 'User Management Staff') {
      fetchMetrics();
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('isAdminLoggedIn');
    localStorage.removeItem('adminRole');
    navigate('/admin/login');
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'dashboard':
        if (role === 'User Management Staff') {
          return (
            <div className="space-y-6 min-w-0 w-full">
              <div className="mb-4">
                <h1 className="text-xl sm:text-2xl font-bold text-slate-800">Welcome, User Team Admin!</h1>
                <p className="text-xs sm:text-sm text-slate-500 mt-1">
                  Matrimonial profiles database controls and account verifications.
                </p>
              </div>

              {/* User Team Stats */}
              <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 min-w-0 w-full">
                <div className="bg-white p-5 rounded-2xl border border-slate-200/60 shadow-xs flex flex-col justify-between min-w-0">
                  <div className="flex items-center justify-between text-slate-400">
                    <span className="text-[10px] font-bold uppercase tracking-wider">Active Users</span>
                    <span className="material-symbols-outlined text-lg">check_circle</span>
                  </div>
                  <p className="text-xl sm:text-2xl font-black text-emerald-600 mt-3">{metrics.activeUsers.toLocaleString()}</p>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-200/60 shadow-xs flex flex-col justify-between min-w-0">
                  <div className="flex items-center justify-between text-slate-400">
                    <span className="text-[10px] font-bold uppercase tracking-wider">Blocked Users</span>
                    <span className="material-symbols-outlined text-lg">block</span>
                  </div>
                  <p className="text-xl sm:text-2xl font-black text-amber-600 mt-3">{metrics.blockedUsers.toLocaleString()}</p>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-200/60 shadow-xs flex flex-col justify-between min-w-0">
                  <div className="flex items-center justify-between text-slate-400">
                    <span className="text-[10px] font-bold uppercase tracking-wider">Banned Users</span>
                    <span className="material-symbols-outlined text-lg">cancel</span>
                  </div>
                  <p className="text-xl sm:text-2xl font-black text-rose-600 mt-3">{metrics.bannedUsers.toLocaleString()}</p>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-200/60 shadow-xs flex flex-col justify-between min-w-0">
                  <div className="flex items-center justify-between text-slate-400">
                    <span className="text-[10px] font-bold uppercase tracking-wider">Freezed Users</span>
                    <span className="material-symbols-outlined text-lg">ac_unit</span>
                  </div>
                  <p className="text-xl sm:text-2xl font-black text-sky-600 mt-3">{metrics.freezedUsers.toLocaleString()}</p>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-200/60 shadow-xs flex flex-col justify-between min-w-0">
                  <div className="flex items-center justify-between text-slate-400">
                    <span className="text-[10px] font-bold uppercase tracking-wider">Reported Profiles</span>
                    <span className="material-symbols-outlined text-lg">report_problem</span>
                  </div>
                  <p className="text-xl sm:text-2xl font-black text-orange-600 mt-3">{metrics.reportedUsers.toLocaleString()}</p>
                </div>
              </div>


            </div>
          );
        } else {
          return (
            <div className="space-y-6 min-w-0 w-full">
              <div className="mb-4">
                <h1 className="text-xl sm:text-2xl font-bold text-slate-800">Welcome, Finance Team Admin!</h1>
                <p className="text-xs sm:text-sm text-slate-500 mt-1">
                  Configure subscription tiers, inspect payment logs, and check transactions.
                </p>
              </div>

              {/* Finance Team Stats */}
              <div className="grid gap-4 sm:grid-cols-2 min-w-0 w-full">
                <div className="bg-white p-5 rounded-2xl border border-slate-200/60 shadow-xs flex flex-col justify-between min-w-0">
                  <div className="flex items-center justify-between text-slate-400">
                    <span className="text-[10px] font-bold uppercase tracking-wider">Active Subscribers</span>
                    <span className="material-symbols-outlined text-lg">workspace_premium</span>
                  </div>
                  <p className="text-2xl font-black text-slate-800 mt-3">4,821</p>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-200/60 shadow-xs flex flex-col justify-between min-w-0">
                  <div className="flex items-center justify-between text-slate-400">
                    <span className="text-[10px] font-bold uppercase tracking-wider">Monthly Revenue</span>
                    <span className="material-symbols-outlined text-lg">payments</span>
                  </div>
                  <p className="text-2xl font-black text-emerald-600 mt-3">₹4,28,500</p>
                </div>
              </div>


            </div>
          );
        }
      case 'users':
        return <UserManagement />;
      case 'packages':
        return <PackagesManagement />;
      case 'payments':
        return <PaymentRevenue />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex w-full overflow-x-hidden">
      {/* Sidebar Component */}
      <AdminSidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onLogout={handleLogout}
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
        role={role}
      />

      {/* Main Workspace Frame */}
      <div className="flex-1 lg:pl-64 flex flex-col min-h-screen min-w-0">
        {/* Top Header */}
        <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between sticky top-0 z-20">
          <div className="flex items-center gap-3">
            {/* Mobile Menu Toggle Button */}
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-1.5 hover:bg-slate-100 rounded-lg text-slate-500 cursor-pointer transition-colors"
            >
              <span className="material-symbols-outlined">menu</span>
            </button>
            <span className="text-xs font-bold text-deep-maroon bg-deep-maroon/5 border border-deep-maroon/10 px-2 py-0.5 rounded-md uppercase tracking-widest hidden sm:inline-block">
              {role === 'User Management Staff' ? 'User Management Desk' : 'Finance Desk'}
            </span>
          </div>

          <div className="px-3 py-1 bg-emerald-50 text-emerald-700 text-[10px] font-bold border border-emerald-200/60 rounded-full flex items-center gap-1.5 select-none">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Live Session</span>
          </div>
        </header>

        {/* Content View Container */}
        <main className="p-6 sm:p-8 flex-1 text-left w-full min-w-0 max-w-full overflow-x-hidden">
          {renderTabContent()}
        </main>
      </div>
    </div>
  );
}

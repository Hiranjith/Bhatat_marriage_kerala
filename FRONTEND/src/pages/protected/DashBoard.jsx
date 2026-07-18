import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import MyHomeView from '../../../components/dashboard/MyHomeView';
import MyProfileView from '../../../components/dashboard/MyProfileView';
import PartnerPreferencesView from '../../../components/dashboard/PartnerPreferencesView';
import ManagePhotosView from '../../../components/dashboard/ManagePhotosView';
import InboxView from '../../../components/dashboard/InboxView';
import ShortlistsView from '../../../components/dashboard/ShortlistsView';
import SettingsView from '../../../components/dashboard/SettingsView';
import MyPlanView from '../../../components/dashboard/MyPlanView';
import { Helmet } from 'react-helmet-async';
import { useAuth } from '../../context/AuthContext';
import axiosInstance from '../../utils/axiosInstance';

const menuItems = [
  { icon: 'dashboard', label: 'My Home' },
  { icon: 'account_circle', label: 'My Profile' },
  { icon: 'diversity_1', label: 'Partner Preferences' },
  { icon: 'photo_library', label: 'Manage Photos' },
  { icon: 'chat', label: 'Inbox Messages' },
  { icon: 'stars', label: 'Favourite' },
  { icon: 'card_membership', label: 'My Plan' },
  { icon: 'settings', label: 'Account Settings' },
];

const formatRegisteredDate = (dateString) => {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
};

const formatMemberSince = (dateString) => {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleDateString('en-GB', { month: 'short', year: 'numeric' });
};

export default function Dashboard() {
  const { user } = useAuth();
  console.log("Current User Object in Dashboard:", user);
  const [searchParams] = useSearchParams();
  const tabParam = searchParams.get('tab');

  const getTabFromParam = (param) => {
    switch (param) {
      case 'profile':
        return 'My Profile';
      case 'preferences':
        return 'Partner Preferences';
      case 'photos':
        return 'Manage Photos';
      case 'inbox':
        return 'Inbox Messages';
      case 'shortlists':
      case 'favourite':
        return 'Favourite';
      case 'plan':
        return 'My Plan';
      case 'settings':
        return 'Account Settings';
      default:
        return 'My Home';
    }
  };

  const [activeItem, setActiveItem] = useState(() => getTabFromParam(tabParam));
  const [completionPercentage, setCompletionPercentage] = useState(0);
  const [updateTrigger, setUpdateTrigger] = useState(0);

  const handleProfileUpdate = () => {
    setUpdateTrigger(prev => prev + 1);
  };

  useEffect(() => {
    if (tabParam) {
      setActiveItem(getTabFromParam(tabParam));
    }
  }, [tabParam]);

  useEffect(() => {
    if (user?.profile_id) {
      axiosInstance.get(`/users/profile/${user.profile_id}/completion`)
        .then(res => {
          setCompletionPercentage(res.data.percentage);
        })
        .catch(err => console.error('Failed to fetch completion percentage', err));
    }
  }, [user?.profile_id, activeItem, updateTrigger]);

  const renderActiveContent = () => {
    switch (activeItem) {
      case 'My Home':
        return <MyHomeView />;
      case 'My Profile':
        return <MyProfileView onProfileUpdate={handleProfileUpdate} />;
      case 'Partner Preferences':
        return <PartnerPreferencesView onProfileUpdate={handleProfileUpdate} />;
      case 'Manage Photos':
        return <ManagePhotosView onProfileUpdate={handleProfileUpdate} />;
      case 'Inbox Messages':
        return <InboxView />;
      case 'Favourite':
        return <ShortlistsView />;
      case 'My Plan':
        return <MyPlanView />;
      case 'Account Settings':
        return <SettingsView />;
      default:
        return <MyHomeView />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#fbfaf9] via-rose-50/20 to-amber-50/10 text-charcoal-text pt-24 md:pt-28 pb-16">
      <Helmet>
                    <title>Verified Bride & Groom Matches in Kerala | Bharath Marriage</title>
                    <meta
                      name="description"
                      content="Browse verified bride and groom profiles and discover compatible matrimonial matches across Kerala."
                    />
                  </Helmet>
      <div className="mx-auto max-w-container-max px-margin-mobile md:px-margin-desktop w-full">
        
        {/* Mobile Horizontal Tabs Selector */}
        <div className="md:hidden flex gap-2 overflow-x-auto pb-3 mb-4 scrollbar-hidden border-b border-slate-100 shrink-0">
          {menuItems.map((item) => (
            <button
              key={item.label}
              onClick={() => setActiveItem(item.label)}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-full whitespace-nowrap transition-all cursor-pointer ${
                activeItem === item.label
                  ? 'bg-deep-maroon text-white shadow-sm'
                  : 'bg-white border border-slate-200 text-charcoal-text/85'
              }`}
            >
              <span className="material-symbols-outlined text-[14px] leading-none">{item.icon}</span>
              {item.label}
            </button>
          ))}
        </div>

        {/* Dashboard Grid */}
        <div className="grid gap-6 md:grid-cols-[280px_1fr]">
          
          {/* LEFT COLUMN: Sidebar (Desktop only) */}
          <aside className="hidden md:flex flex-col gap-6 sticky top-24 self-start">
            
            {/* User Profile Mini-Details Card */}
            <div className="rounded-xl border border-slate-200/60 bg-white p-5 shadow-sm text-center">
              <div className="flex flex-col items-center">
                
                {/* Visual Profile Circular Ring */}
                <div className="relative mb-3 flex items-center justify-center">
                  <svg className="w-24 h-24 transform -rotate-90">
                    <circle 
                      cx="48" 
                      cy="48" 
                      r="42" 
                      className="text-slate-100" 
                      strokeWidth="6" 
                      fill="transparent" 
                      stroke="currentColor"
                    />
                    <circle 
                      cx="48" 
                      cy="48" 
                      r="42" 
                      className="text-deep-maroon" 
                      strokeWidth="6" 
                      fill="transparent" 
                      strokeDasharray="264" 
                      strokeDashoffset={264 - (completionPercentage / 100) * 264}
                      strokeLinecap="round"
                      stroke="currentColor"
                    />
                  </svg>
                  
                  {/* User Avatar Image inside the Ring */}
                  <div className="absolute w-[76px] h-[76px] rounded-full overflow-hidden border-2 border-white shadow-inner bg-slate-50 flex items-center justify-center">
                    <img
                      src={user?.photo_1 || "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23ccc'%3E%3Cpath d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z'/%3E%3C/svg%3E"}
                      alt="Logged in user"
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Percentage Badge */}
                  <span className="absolute -bottom-1 bg-heritage-gold text-white text-[9px] font-bold py-0.5 px-2.5 rounded-full shadow border border-white">
                    {completionPercentage}%
                  </span>
                </div>

                <h2 className="text-base font-bold text-charcoal-text mt-2">{user?.full_name || 'Arjun Reddy'}</h2>
                <p className="text-[10px] font-semibold text-soft-gray uppercase tracking-wider">ID: {user?.profile_id || 'BKLH000000006'}</p>
                
                <div className="mt-2 text-[10px] text-slate-500 space-y-0.5">
                  <p><span className="font-semibold text-slate-400">Registered:</span> {formatRegisteredDate(user?.created_at)}</p>
                  <p><span className="font-semibold text-slate-400">Member Since:</span> {formatMemberSince(user?.created_at)}</p>
                </div>
                
                <div className="mt-4 w-full border-t border-slate-100 pt-3 flex justify-between items-center text-xs">
                  <span className="text-soft-gray font-medium">Profile Strength</span>
                  <button 
                    onClick={() => setActiveItem('My Profile')} 
                    className="font-bold text-deep-maroon hover:text-primary transition-colors flex items-center gap-0.5 cursor-pointer bg-transparent border-none p-0 focus:outline-none"
                  >
                    Edit Profile
                    <span className="material-symbols-outlined text-[14px]">edit</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Sidebar Navigation Options */}
            <div className="rounded-xl border border-slate-200/60 bg-white p-3 shadow-sm">
              <nav className="space-y-1 text-left">
                {menuItems.map((item) => (
                  <button
                    key={item.label}
                    onClick={() => setActiveItem(item.label)}
                    className={`w-full flex items-center gap-3.5 px-4 py-2.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                      activeItem === item.label
                        ? 'bg-deep-maroon/5 text-deep-maroon border-l-4 border-deep-maroon rounded-l-none'
                        : 'text-charcoal-text/80 hover:bg-slate-50 hover:text-deep-maroon'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[18px] leading-none">{item.icon}</span>
                    {item.label}
                  </button>
                ))}
              </nav>
            </div>

            {/* Membership/Upgrade Box */}
            <div className="rounded-xl border border-slate-200/60 bg-gradient-to-br from-amber-50/50 to-orange-50/50 p-5 shadow-sm text-left relative overflow-hidden">
              <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none transform translate-x-4 translate-y-4">
                <span className="material-symbols-outlined text-[120px] text-heritage-gold">stars</span>
              </div>
              <div className="flex items-center gap-2.5 mb-2">
                <span className="material-symbols-outlined text-[24px] text-heritage-gold">workspace_premium</span>
                <span className="text-xs font-bold text-heritage-gold uppercase tracking-wider">Premium Access</span>
              </div>
              <h4 className="text-sm font-bold text-charcoal-text">Upgrade Membership</h4>
              <p className="text-[10px] text-soft-gray leading-normal mt-1 mb-4">
                Unlock matching profiles, view direct phone numbers, initiate direct chat, and highlight your profile.
              </p>
              <button className="w-full bg-gradient-to-r from-deep-maroon to-primary hover:from-primary hover:to-deep-maroon text-white text-[10px] font-bold py-2 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 uppercase tracking-wider text-center cursor-pointer">
                Upgrade Now
              </button>
            </div>

          </aside>

          {/* RIGHT COLUMN: Main Dashboard Content */}
          <main className="min-w-0 flex flex-col text-left">
            {renderActiveContent()}
          </main>
          
        </div>

      </div>

    </div>
  );
}

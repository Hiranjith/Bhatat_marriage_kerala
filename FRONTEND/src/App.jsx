import React, { useEffect } from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import UserLayout from '../layouts/userlayout';
import Home from './pages/Home';
import Search from './pages/Search';
import Login from './pages/login';
import Dashboard from './pages/protected/DashBoard';
import ProfileDetails from './pages/protected/ProfileDetail';
import Porutham from './pages/Porutham';
import Muhurtham from './pages/Muhurtham';
import Contact from './pages/contact';
import Packages from './pages/Packages';
import ForgotPassword from './pages/ForgotPassword';
import PasswordSent from './pages/PasswordSent';

// Admin / Super Admin Page Imports
import SuperAdminLogin from './admin/superAdmin/Login';
import SuperAdminDashboard from './admin/superAdmin/DashBoard';
import AdminLogin from './admin/admin/Login';
import AdminDashboard from './admin/admin/Dashbord';

function ScrollToTop() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (hash) {
      const element = document.getElementById(hash.substring(1));
      if (element) {
        // Delay slightly to allow the DOM to render
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth' });
        }, 100);
        return;
      }
    }
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [pathname, hash]);
  return null;
}

function SuperAdminProtectedRoute({ children }) {
  const isAdminLoggedIn = localStorage.getItem('isAdminLoggedIn') === 'true';
  const adminRole = localStorage.getItem('adminRole');
  
  if (!isAdminLoggedIn || adminRole !== 'superadmin') {
    return <Navigate to="/super-admin/login" replace />;
  }
  return children;
}

function App() {
  const location = useLocation();
  const isAdminPath = location.pathname.startsWith('/super-admin') || location.pathname.startsWith('/admin');

  useEffect(() => {
    // Prevent right-click context menu
    const handleContextMenu = (e) => {
      e.preventDefault();
    };

    // Prevent inspection and source view hotkeys
    const handleKeyDown = (e) => {
      // F12
      if (e.key === 'F12') {
        e.preventDefault();
        return;
      }
      
      // Ctrl+Shift+I / Ctrl+Shift+J / Ctrl+Shift+C (Developer Tools / Console / Inspector)
      if (e.ctrlKey && e.shiftKey && ['I', 'i', 'J', 'j', 'C', 'c'].includes(e.key)) {
        e.preventDefault();
        return;
      }
      
      // Ctrl+U (View Source)
      if (e.ctrlKey && ['U', 'u'].includes(e.key)) {
        e.preventDefault();
        return;
      }
      
      // Ctrl+S (Save Page)
      if (e.ctrlKey && ['S', 's'].includes(e.key)) {
        e.preventDefault();
        return;
      }
    };

    // Prevent dragging images to save them
    const handleDragStart = (e) => {
      if (e.target.tagName === 'IMG') {
        e.preventDefault();
      }
    };

    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('dragstart', handleDragStart);

    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('dragstart', handleDragStart);
    };
  }, []);

  const routeContent = (
    <>
      <ScrollToTop />
      <Routes>
        {/* Public / User Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/search" element={<Search />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/password-sent" element={<PasswordSent />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profile/:profileId" element={<ProfileDetails />} />
        <Route path="/porutham" element={<Porutham />} />
        <Route path="/muhurtham" element={<Muhurtham />} />
        <Route path='/contact-us' element={<Contact/>}/>
        <Route path='/packages' element={<Packages/>}/>

        {/* Super Admin Routes */}
        <Route path="/super-admin/login" element={<SuperAdminLogin />} />
        <Route 
          path="/super-admin/dashboard" 
          element={
            <SuperAdminProtectedRoute>
              <SuperAdminDashboard />
            </SuperAdminProtectedRoute>
          } 
        />

        {/* Standard Admin Routes */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
      </Routes>
    </>
  );

  if (isAdminPath) {
    return routeContent;
  }

  return (
    <UserLayout>
      {routeContent}
    </UserLayout>
  );
}

export default App;

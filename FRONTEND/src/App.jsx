import React, { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
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

function App() {
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

  return (
    <UserLayout>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/search" element={<Search />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profile/:profileId" element={<ProfileDetails />} />
        <Route path="/porutham" element={<Porutham />} />
        <Route path="/muhurtham" element={<Muhurtham />} />
        <Route path='/contact-us' element={<Contact/>}/>
        <Route path='packages' element={<Packages/>}/>
      </Routes>
    </UserLayout>
  );
}

export default App;


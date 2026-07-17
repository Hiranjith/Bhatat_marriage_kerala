import React from 'react';
import Navbar from '../components/navbar';
import Footer from '../components/footer';

export default function UserLayout({ children }) {
  return (
    <div className="w-full min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
    </div>
  );
}
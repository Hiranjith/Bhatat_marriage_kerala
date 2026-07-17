import React, { createContext, useState, useContext, useEffect } from 'react';

// Create Context
const AuthContext = createContext();

// Create Provider Component
export const AuthProvider = ({ children }) => {
  // We can store the entire user object here, not just the profile_id!
  // This saves us from making expensive Axios calls in other components.
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // You can optionally load the user from local storage or an API on initial mount
  useEffect(() => {
    // Example: Check if there's saved user data in localStorage
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  // Update both state and localStorage when user logs in/out
  const login = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the AuthContext easily
export const useAuth = () => {
  return useContext(AuthContext);
};

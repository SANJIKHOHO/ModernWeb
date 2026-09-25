'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { login as apiLogin } from '@/lib/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [name, setName] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedName = localStorage.getItem('name');
    if (savedName) setName(savedName);
    setLoading(false);
  }, []);

  async function login(userName) {
    const data = await apiLogin(userName);
    localStorage.setItem('token', data.token);
    localStorage.setItem('name', userName);
    setName(userName);
  }

  function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('name');
    setName(null);
  }

  return (
    <AuthContext.Provider value={{ name, isAuthenticated: !!name, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
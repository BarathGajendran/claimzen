import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

// Centralized Axios Instance configured for backend API
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://claimzen.onrender.com/api'
});

// Automatically inject JWT Bearer Token into requests if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('claimzen_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState({
    _id: '6a589aa802fdc30ee6e80d51',
    name: 'Barath',
    email: 'barathg122@gmail.com'
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Automatically save demo credentials in localStorage
    localStorage.setItem('claimzen_token', 'mock_jwt_token_for_hackathon_demo');
    localStorage.setItem('claimzen_user', JSON.stringify({
      _id: '6a589aa802fdc30ee6e80d51',
      name: 'Barath',
      email: 'barathg122@gmail.com'
    }));
  }, []);

  // Login handler
  const login = async (email, password) => {
    try {
      const res = await api.post('/auth/login', { email, password });
      const { data } = res;
      
      const userData = { _id: data._id, name: data.name, email: data.email };
      setUser(userData);
      localStorage.setItem('claimzen_token', data.token);
      localStorage.setItem('claimzen_user', JSON.stringify(userData));
      return { success: true };
    } catch (err) {
      console.error('Login request failed', err);
      const errMsg = err.response?.data?.message || 'Invalid credentials. Please try again.';
      return { success: false, error: errMsg };
    }
  };

  // Registration handler
  const register = async (name, email, password) => {
    try {
      const res = await api.post('/auth/register', { name, email, password });
      const { data } = res;
      
      const userData = { _id: data._id, name: data.name, email: data.email };
      setUser(userData);
      localStorage.setItem('claimzen_token', data.token);
      localStorage.setItem('claimzen_user', JSON.stringify(userData));
      return { success: true };
    } catch (err) {
      console.error('Registration request failed', err);
      const errMsg = err.response?.data?.message || 'Network connection failed. Please try again.';
      return { success: false, error: errMsg };
    }
  };

  // Logout handler
  const logout = () => {
    setUser(null);
    localStorage.removeItem('claimzen_token');
    localStorage.removeItem('claimzen_user');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

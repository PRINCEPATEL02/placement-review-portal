import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { getApiUrl } from '../utils/apiConfig';
import Loader from '../components/Loader';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkLoggedIn = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const res = await axios.get(getApiUrl('/auth/profile'), {
            headers: { Authorization: `Bearer ${token}` }
          });
          setUser({ ...res.data, token });
        } catch (error) {
          localStorage.removeItem('token');
          setUser(null);
        }
      }
      // Artificial delay to ensure loader is visible for a moment (smoothness)
      setTimeout(() => setLoading(false), 500);
    };
    checkLoggedIn();
  }, []);

  const login = async (enrollment, password) => {
    const res = await axios.post(getApiUrl('/auth/login'), { enrollment, password });
    localStorage.setItem('token', res.data.token);
    setUser({ ...res.data.user, token: res.data.token });
    return res.data.user;
  };

  const register = async (userData) => {
    await axios.post(getApiUrl('/auth/register'), userData);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  const updateProfile = async (userData) => {
    const token = localStorage.getItem('token');
    const res = await axios.put(getApiUrl('/auth/profile'), userData, {
      headers: { Authorization: `Bearer ${token}` }
    });
    setUser(prev => ({ ...prev, ...userData }));
    return res.data;
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateProfile }}>
      {loading ? <Loader /> : children}
    </AuthContext.Provider>
  );
};

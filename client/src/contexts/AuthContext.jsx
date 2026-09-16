import React, { createContext, useState, useEffect, useContext } from 'react';
import { authApi, getToken, clearAuthData } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(getToken());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const handleExpired = () => {
      setToken(null);
      setUser(null);
    };

    window.addEventListener('auth:expired', handleExpired);
    return () => window.removeEventListener('auth:expired', handleExpired);
  }, []);

  useEffect(() => {
    const fetchUser = async () => {
      const currentToken = getToken();
      if (!currentToken) {
        setUser(null);
        setLoading(false);
        return;
      }
      try {
        const data = await authApi.getMe();
        setUser(data.user);
        setToken(currentToken);
      } catch (error) {
        console.error('Failed to verify session:', error);
        clearAuthData();
        setToken(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [token]);

  const login = async (email, password) => {
    try {
      const data = await authApi.login({ email, password });
      setToken(data.token);
      setUser(data.user);
      return { success: true };
    } catch (error) {
      return { success: false, message: error.message || 'Login failed' };
    }
  };

  const register = async (name, email, password, company) => {
    try {
      const data = await authApi.register({ name, email, password, company });
      setToken(data.token);
      setUser(data.user);
      return { success: true };
    } catch (error) {
      return { success: false, message: error.message || 'Registration failed' };
    }
  };

  const logout = () => {
    clearAuthData();
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { notify } from '@/app/components/ui/NotificationSystem';
import Cookies from 'js-cookie';
import { api } from '@/services/api';

const AuthContext = createContext({});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    try {
      // Check if user is logged in on mount
      const storedUser = localStorage.getItem('user');
      const authCookie = Cookies.get('auth');
      
      if (storedUser && authCookie) {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
      } else {
        // Clear any inconsistent state
        localStorage.removeItem('user');
        Cookies.remove('auth');
        setUser(null);
      }
    } catch (error) {
      console.error('Error initializing auth:', error);
      // Clear any inconsistent state
      localStorage.removeItem('user');
      Cookies.remove('auth');
      setUser(null);
    }
    setLoading(false);
  }, [mounted]);

  // Don't render children until client-side hydration is complete
  if (!mounted) {
    return null;
  }

  const login = async (email, password) => {
    try {
      const { token, walletAddress } = await api.login({ email, password });
      
      // Store auth data
      Cookies.set('auth', token);
      const userData = { email, walletAddress };
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      
      notify({
        title: 'Success',
        message: 'Successfully logged in!',
        type: 'success'
      });
      
      router.push('/bets');
    } catch (error) {
      notify({
        title: 'Error',
        message: error.message || 'Failed to login',
        type: 'error'
      });
      throw error;
    }
  };

  const signup = async (email, password, walletAddress) => {
    try {
      const { token } = await api.signup({ email, password, walletAddress });
      
      // Store auth data
      Cookies.set('auth', token);
      const userData = { email, walletAddress };
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      
      notify({
        title: 'Success',
        message: 'Account created successfully!',
        type: 'success'
      });
      
      router.push('/bets');
    } catch (error) {
      notify({
        title: 'Error',
        message: error.message || 'Failed to create account',
        type: 'error'
      });
      throw error;
    }
  };

  const logout = () => {
    Cookies.remove('auth');
    localStorage.removeItem('user');
    setUser(null);
    router.push('/login');
  };

  const value = {
    user,
    loading,
    login,
    signup,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

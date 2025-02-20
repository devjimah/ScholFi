'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { notify } from '@/app/components/ui/NotificationSystem';
import Cookies from 'js-cookie';

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

  const value = {
    user,
    loading,
    signup: async (email, password, username) => {
      try {
        const existingUsers = JSON.parse(localStorage.getItem('users') || '[]');
        
        if (existingUsers.some(u => u.email === email)) {
          throw new Error('Email already exists');
        }

        const newUser = {
          id: Date.now(),
          email,
          username,
          password,
          createdAt: new Date().toISOString()
        };

        existingUsers.push(newUser);
        localStorage.setItem('users', JSON.stringify(existingUsers));
        localStorage.setItem('user', JSON.stringify(newUser));
        setUser(newUser);
        Cookies.set('auth', 'true', { expires: 7 });

        notify('success', 'Account created successfully!');
        router.push('/bets');
      } catch (error) {
        notify('error', error.message);
        throw error;
      }
    },
    login: async (email, password) => {
      try {
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const user = users.find(u => u.email === email && u.password === password);

        if (!user) {
          throw new Error('Invalid credentials');
        }

        setUser(user);
        localStorage.setItem('user', JSON.stringify(user));
        Cookies.set('auth', 'true', { expires: 7 });

        notify('success', 'Logged in successfully!');
        router.push('/bets');
      } catch (error) {
        notify('error', error.message);
        throw error;
      }
    },
    logout: () => {
      setUser(null);
      localStorage.removeItem('user');
      Cookies.remove('auth');
      notify('success', 'Logged out successfully');
      router.push('/');
    }
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

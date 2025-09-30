"use client";

import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import api from '../lib/api';
import axios from 'axios';

// Define the shape of the user object and context
interface User {
  _id: string; // Expect _id from the API
  id: string;   // But also ensure `id` exists for our components
  username: string;
  email: string;
}


interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  loading: boolean;
  login: (token: string) => void;
  logout: () => void;
}

// Create the context with a default undefined value
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Create the AuthProvider component
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        api.defaults.headers.common['x-auth-token'] = token;
        try {
          const res = await api.get('/api/users/me');
          
          // --- THIS IS THE FIX ---
          // The API returns a user object with `_id`. We create a new
          // object that has both `_id` and `id` for consistency.
          const userData = { ...res.data, id: res.data._id };
          setUser(userData);
          setIsAuthenticated(true);
        } catch (err) {
          // If token is invalid, remove it
          localStorage.removeItem('token');
          setIsAuthenticated(false);
          setUser(null);
        }
      }
      setLoading(false);
    };

    loadUser();
  }, []);

  const login = async (token: string) => { // Make login async
    localStorage.setItem('token', token);
    api.defaults.headers.common['x-auth-token'] = token;

    try {
      // After logging in, immediately fetch the user data
      // to ensure our context is up-to-date.
      const res = await api.get('/api/users/me');
      const userData = { ...res.data, id: res.data._id };
      setUser(userData);
      setIsAuthenticated(true);
      window.location.href="/"; // Redirect using router from next/navigation
    } catch(err) {
      // Handle error if user fetch fails after login
      console.error("Failed to fetch user after login", err);
      logout(); // Log them out if something is wrong
    }
  };
  const logout = () => {
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['x-auth-token'];
    setUser(null);
    setIsAuthenticated(false);
    window.location.href = '/login'; // Redirect to login page
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Create a custom hook for easy access to the context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
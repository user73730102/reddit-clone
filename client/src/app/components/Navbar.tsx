"use client";

import React from 'react';
import Link from 'next/link';
import { useAuth } from '../context/AuthContext';
import ThemeSwitcher from './ThemeSwitcher';

export default function Navbar() {
  const { isAuthenticated, user, logout, loading } = useAuth();

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="text-xl font-bold text-indigo-600">
                RedditClone
              </Link>
              <Link href="/communities" className="ml-6 text-sm font-medium text-gray-500 hover:text-gray-700">
                Communities
              </Link>
            </div>
          </div>
          <div className="flex items-center">
            <div className="flex items-center space-x-4">
              <ThemeSwitcher />
              {/* Don't render buttons until we know the auth state */}
              {!loading && (
                <>
                  {isAuthenticated && user ? ( // Check for user object as well for type safety
                    // Links to show when user IS logged in
                    <>
                      <Link href="/submit" className="px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200">
                        Create Post
                      </Link>
                      
                      {/* --- START OF ADDED CODE --- */}
                      <Link 
                        href={`/user/${user.username}`} 
                        className="px-3 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-50"
                      >
                        My Profile
                      </Link>
                      {/* --- END OF ADDED CODE --- */}
                      
                      <button
                        onClick={logout}
                        className="px-3 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-50"
                      >
                        Logout
                      </button>
                    </>
                  ) : (
                    // Links to show when user IS NOT logged in
                    <>
                      <Link href="/login" className="px-3 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-50">
                        Login
                      </Link>
                      <Link href="/register" className="px-3 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700">
                        Sign Up
                      </Link>
                    </>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
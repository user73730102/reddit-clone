"use client";

import React from 'react';
import Link from 'next/link';
import { useAuth } from '../context/AuthContext';
import ThemeSwitcher from './ThemeSwitcher';
import Image from 'next/image';

export default function Navbar() {
  const { isAuthenticated, user, logout, loading } = useAuth();

  return (
    <div className="bg-white dark:bg-gray-900 rounded-md border border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="flex-shrink-0 flex items-center space-x-2">
              <Image
                src="/logo.svg"
                alt="RedditClone Logo"
                width={35}
                height={35}
              />
              <span className="text-xl font-bold text-gray-800 dark:text-gray-200 hidden sm:block">
                Snappit
              </span>
            </Link>
              <Link href="/communities" className="ml-6 text-sm font-medium text-gray-500 hover:text-gray-700">
                Communities
              </Link>
            </div>
          </div>
          <div className="flex items-center">
            <div className="flex items-center space-x-2"> {/* Reduced spacing slightly */}
              <ThemeSwitcher />
              {!loading && (
                <>
                  {isAuthenticated && user ? (
                    <>
                      <Link href="/submit" className="px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700">
                        Create Post
                      </Link>
                      
                      <Link 
                        href={`/user/${user.username}`} 
                        className="px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-200 dark:hover:bg-gray-800"
                      >
                        My Profile
                      </Link>
                      
                      <button
                        onClick={logout}
                        className="px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-200 dark:hover:bg-gray-800"
                      >
                        Logout
                      </button>
                    </>
                  ) : (
                    <>
                      <Link href="/login" className="px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-200 dark:hover:bg-gray-800">
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
    </div>
  );
}
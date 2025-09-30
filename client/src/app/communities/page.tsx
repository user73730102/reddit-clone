"use client";

import { useState, useEffect, useMemo } from 'react';
import api from '../lib/api';
import Link from 'next/link';

interface Community {
  _id: string;
  name: string;
}

export default function CommunitiesPage() {
  // State for the full list of communities
  const [communities, setCommunities] = useState<Community[]>([]);
  // State for the search term
  const [searchTerm, setSearchTerm] = useState('');
  // State for creating a new community
  const [newCommunityName, setNewCommunityName] = useState('');
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [createError, setCreateError] = useState('');

  const fetchCommunities = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/communities');
      setCommunities(response.data);
    } catch (err) {
      console.error("Failed to fetch communities", err);
      setError('Could not load communities.');
    } finally {
      setLoading(false);
    }
  };

  // Fetch communities on component mount
  useEffect(() => {
    fetchCommunities();
  }, []);

  const handleCreateCommunity = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommunityName.trim()) {
      setCreateError('Community name cannot be empty.');
      return;
    }
    setCreateError('');
    
    try {
      const response = await api.post('/api/communities', { name: newCommunityName.trim() });
      // Add the new community to the top of our list and clear the input
      setCommunities([response.data, ...communities]);
      setNewCommunityName('');
    } catch (err: any) {
      setCreateError(err.response?.data?.msg || 'Failed to create community.');
    }
  };

  // Memoize the filtered results to avoid re-calculating on every render
  const filteredCommunities = useMemo(() => {
    return communities.filter(community =>
      community.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, communities]);

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Main Content: Search and List */}
        <div className="md:col-span-2">
          <h1 className="text-2xl font-bold mb-4">All Communities</h1>
          <input
            type="text"
            placeholder="Search communities..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-2 mb-6 border border-gray-300 rounded-md"
          />
          {loading && <p>Loading...</p>}
          {error && <p className="text-red-500">{error}</p>}
          <div className="space-y-3">
            {filteredCommunities.map(community => (
              <div key={community._id} className="bg-white p-4 rounded-md border border-gray-200 flex justify-between items-center">
                <Link href={`/r/${community.name}`} className="font-bold text-indigo-600 hover:underline">
                  r/{community.name}
                </Link>
                {/* We can add a "Join" button here later */}
              </div>
            ))}
          </div>
        </div>

        {/* Sidebar: Create Community */}
        <div className="md:col-span-1">
          <div className="bg-white p-4 rounded-md border border-gray-200">
            <h2 className="text-lg font-bold mb-4">Create a Community</h2>
            <form onSubmit={handleCreateCommunity} className="space-y-3">
              <input
                type="text"
                placeholder="Community Name"
                value={newCommunityName}
                onChange={(e) => setNewCommunityName(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md"
              />
              {createError && <p className="text-red-500 text-sm">{createError}</p>}
              <button
                type="submit"
                className="w-full bg-indigo-600 text-white p-2 rounded-md hover:bg-indigo-700"
              >
                Create
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
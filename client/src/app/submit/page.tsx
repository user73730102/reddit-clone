"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import api from '../lib/api';
import { useAuth } from '../context/AuthContext';

interface Community {
  _id: string;
  name: string;
}

export default function SubmitPage() {
  const router = useRouter();
  const { user, isAuthenticated, loading: authLoading } = useAuth();

  // Form state
  const [communities, setCommunities] = useState<Community[]>([]);
  const [communityName, setCommunityName] = useState('');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  // UI state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Fetch communities when the component mounts
  useEffect(() => {
    const fetchCommunities = async () => {
      try {
        const response = await api.get('/api/communities');
        setCommunities(response.data);
        // Set a default community if list is not empty
        if (response.data.length > 0) {
          setCommunityName(response.data[0].name);
        }
      } catch (err) {
        console.error("Failed to fetch communities", err);
        setError('Could not load communities.');
      }
    };
    fetchCommunities();
  }, []);

  // Protect the route - redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, authLoading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !communityName) {
      setError('Please select a community and enter a title.');
      return;
    }
    setLoading(true);
    setError('');

    try {
      const payload = {
        title,
        content,
        communityName,
        // We will add imageUrl later
      };
      
      const response = await api.post('/api/posts', payload);
      
      // On success, redirect to the homepage to see the new post
      router.push('/');

    } catch (err: any) {
      console.error("Failed to create post:", err);
      setError(err.response?.data?.msg || 'Failed to create post.');
    } finally {
      setLoading(false);
    }
  };
  
  // Don't render the form until we've checked authentication
  if (authLoading || !isAuthenticated) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="bg-white p-6 rounded-md border border-gray-200">
        <h1 className="text-2xl font-bold border-b pb-4 mb-6">Create a Post</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Community Selector */}
          <div>
            <label htmlFor="community" className="block text-sm font-medium text-gray-700">
              Choose a community
            </label>
            <select
              id="community"
              value={communityName}
              onChange={(e) => setCommunityName(e.target.value)}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            >
              {communities.length === 0 ? (
                <option disabled>Loading communities...</option>
              ) : (
                communities.map(c => <option key={c._id} value={c.name}>r/{c.name}</option>)
              )}
            </select>
          </div>
          
          {/* Title Input */}
          <div>
            <input
              type="text"
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full text-xl font-bold p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              maxLength={300}
            />
          </div>

          {/* Content Textarea */}
          <div>
            <textarea
              placeholder="Text (optional)"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md h-40 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400 disabled:cursor-not-allowed"
            >
              {loading ? 'Posting...' : 'Post'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
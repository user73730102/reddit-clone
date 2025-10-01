"use client";

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import api from '../../lib/api';
import { Post } from '../../types';
import PostCard from '../../components/PostCard';
import { useAuth } from '../../context/AuthContext';
import TimeAgo from 'react-timeago';


export default function ProfilePage() {
    
  const params = useParams();
  const username = params.username as string;
  const router = useRouter();
  const { user: currentUser, logout } = useAuth(); // Get the currently logged in user
  const isOwnProfile = currentUser?.username === username;
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({ username: currentUser?.username || '', email: currentUser?.email || '' });
  const [editError, setEditError] = useState('');

  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // We'll add state for editing later
  useEffect(() => {
    if (!username) return;

    const fetchUserPosts = async () => {
      try {
        setLoading(true);
        setError('');
        const response = await api.get(`/api/posts/user/${username}`);
        setPosts(response.data);
      } catch (err: any) {
        console.error("Failed to fetch user posts:", err);
        setError(err.response?.data?.msg || 'Could not find this user or their posts.');
      } finally {
        setLoading(false);
      }
    };

    fetchUserPosts();
  }, [username]);
    // --- START OF ADDED CODE ---

  // Handlers for deleting/updating posts (reused from homepage)
  const handleDeletePost = async (postId: string) => {
    try {
      await api.delete(`/api/posts/${postId}`);
      // Filter out the deleted post from the state to update the UI
      setPosts(posts.filter(p => p._id !== postId));
    } catch (err) {
      console.error("Failed to delete post:", err);
      alert("Error: Could not delete the post.");
    }
  };
  
  const handleUpdatePost = async (updatedPost: Post) => {
    try {
      const response = await api.put(`/api/posts/${updatedPost._id}`, {
          title: updatedPost.title,
          content: updatedPost.content
      });
      // Update the post in the state to reflect the changes in the UI
      setPosts(posts.map(p => p._id === updatedPost._id ? response.data : p));
    } catch(err) {
      console.error("Failed to update post:", err);
      alert("Error: Could not update the post.");
    }
  };
  
  const handleUpdateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setEditError('');
    if (editForm.username === currentUser?.username && editForm.email === currentUser?.email) {
      setIsEditing(false);
      return;
    }
    
    try {
      const response = await api.put('/api/users/update', editForm);
      alert('Profile updated successfully! You will be redirected.');
      // After a username change, the old URL is invalid, so redirect.
      // A full page reload is best here to update all context.
      window.location.href = `/user/${response.data.username}`;
    } catch (err: any) {
      setEditError(err.response?.data?.msg || 'Failed to update profile.');
    }
  };

  const handleDeleteUser = async () => {
    if (window.confirm('Are you absolutely sure you want to delete your account? This action cannot be undone.')) {
      try {
        await api.delete('/api/users/delete');
        alert('Account deleted successfully.');
        logout(); // Log the user out
        router.push('/');
      } catch (err) {
        alert('Failed to delete account.');
      }
    }
  };
  
  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      {/* Add dark mode classes */}
      <div className="bg-white dark:bg-gray-900 p-6 rounded-md border border-gray-200 dark:border-gray-700 mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">{username}</h1>
      </div>

      {isOwnProfile && (
        <div className="bg-white dark:bg-gray-900 p-6 rounded-md border border-gray-200 dark:border-gray-700 mb-8">
          <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-gray-100">Account Settings</h2>
          
          {!isEditing ? (
            <button 
              onClick={() => setIsEditing(true)}
              // Add dark mode styles
              className="text-sm bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 font-semibold py-2 px-4 rounded"
            >
              Edit Profile
            </button>
          ) : (
            <form onSubmit={handleUpdateUser} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Username</label>
                <input 
                  type="text" 
                  value={editForm.username}
                  onChange={e => setEditForm({...editForm, username: e.target.value})}
                  // Add dark mode styles
                  className="w-full p-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-200 border border-gray-300 dark:border-gray-600 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
                <input 
                  type="email" 
                  value={editForm.email}
                  onChange={e => setEditForm({...editForm, email: e.target.value})}
                  // Add dark mode styles
                  className="w-full p-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-200 border border-gray-300 dark:border-gray-600 rounded-md"
                />
              </div>
              {editError && <p className="text-red-500 text-sm">{editError}</p>}
              <div className="flex gap-4">
                <button type="submit" className="bg-indigo-600 text-white py-2 px-4 rounded hover:bg-indigo-700">Save Changes</button>
                <button type="button" onClick={() => setIsEditing(false)} className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 py-2 px-4 rounded hover:bg-gray-300 dark:hover:bg-gray-600">Cancel</button>
              </div>
            </form>
          )}

    <div className="mt-8 border-t pt-4 border-red-300">
      <h3 className="text-lg font-bold text-red-600">Danger Zone</h3>
      <p className="text-sm text-gray-500 my-2">Deleting your account is permanent. All of your data will be removed.</p>
      <button
        onClick={handleDeleteUser}
        className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
      >
        Delete Account
      </button>
    </div>
  </div>
)}
<h2 className="text-2xl font-bold mb-4">Posts by {username}</h2>
      
      {loading && <p>Loading posts...</p>}
      {error && <p className="text-red-500">{error}</p>}
      
      {!loading && !error && (
        <div className="space-y-4">
          {posts.length > 0 ? (
            posts.map(post => (
              <PostCard 
                key={post._id} 
                post={post}
                // Pass the handlers down to the PostCard
                onDelete={handleDeletePost}
                onUpdate={handleUpdatePost}
              />
            ))
          ) : (
            <p>This user hasn't made any posts yet.</p>
          )}
        </div>
      )}
  </div>
);
}

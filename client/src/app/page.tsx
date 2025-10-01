"use client";

import { useEffect, useState } from 'react';
import api from './lib/api';
import { Post } from './types';
import PostCard from './components/PostCard'; // Import our new component

export default function HomePage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // useEffect hook to fetch data when the component mounts
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const response = await api.get('/api/posts');
        setPosts(response.data);
      } catch (err) {
        console.error("Failed to fetch posts:", err);
        setError('Failed to load the feed. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []); // The empty array [] means this effect runs only once
  const handleDeletePost = async (postId: string) => {
    try {
      await api.delete(`/api/posts/${postId}`);
      // Filter out the deleted post from the state
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
        // Update the post in the state
        setPosts(posts.map(p => p._id === updatedPost._id ? response.data : p));
    } catch(err) {
        console.error("Failed to update post:", err);
        alert("Error: Could not update the post.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">
        Main Feed
      </h1>
      
      {loading && <p>Loading posts...</p>}
      
      {error && <p className="text-red-500">{error}</p>}
      
      {!loading && !error && (
        <div className="space-y-4">
          {posts.length > 0 ? (
            posts.map(post => (
              <PostCard 
              key={post._id} 
              post={post} 
              onDelete={handleDeletePost} // Pass the handler
              onUpdate={handleUpdatePost}
              />
            ))
          ) : (
            <p>No posts yet. Be the first to create one!</p>
          )}
        </div>
      )}
    </div>
  );
}
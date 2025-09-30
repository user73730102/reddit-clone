"use client";

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import api from '../../lib/api';
import { Post } from '../../types';
import PostCard from '../../components/PostCard';

export default function CommunityPage() {
  const params = useParams();
  const communityName = params.communityName as string;

  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!communityName) return;

    const fetchPostsByCommunity = async () => {
      try {
        setLoading(true);
        setError('');
        const response = await api.get(`/api/posts/community/${communityName}`);
        setPosts(response.data);
      } catch (err: any) {
        console.error("Failed to fetch posts:", err);
        setError(err.response?.data?.msg || 'Failed to load posts for this community.');
      } finally {
        setLoading(false);
      }
    };

    fetchPostsByCommunity();
  }, [communityName]); // Re-run this effect if the communityName changes

  // Re-use the delete/update handlers from the homepage
  const handleDeletePost = async (postId: string) => {
    try {
      await api.delete(`/api/posts/${postId}`);
      setPosts(posts.filter(p => p._id !== postId));
    } catch (err) {
      alert("Error: Could not delete the post.");
    }
  };
  
  const handleUpdatePost = async (updatedPost: Post) => {
    try {
        const response = await api.put(`/api/posts/${updatedPost._id}`, {
            title: updatedPost.title,
            content: updatedPost.content
        });
        setPosts(posts.map(p => p._id === updatedPost._id ? response.data : p));
    } catch(err) {
        alert("Error: Could not update the post.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold mb-6 text-gray-900">
        r/{communityName}
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
                onDelete={handleDeletePost}
                onUpdate={handleUpdatePost}
              />
            ))
          ) : (
            <p>No posts in this community yet.</p>
          )}
        </div>
      )}
    </div>
  );
}
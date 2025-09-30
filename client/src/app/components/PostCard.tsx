"use client";

import React,{useState,useEffect} from 'react';
import Link from 'next/link';
import TimeAgo from 'react-timeago';
import { Post } from '../types'; // Corrected the import path to use '@/' alias
import { useAuth } from '../context/AuthContext'; // Import the useAuth hook to get user info

// Define the props the component will accept, including the new event handlers
interface PostCardProps {
  post: Post;
  onDelete?: (postId: string) => void;
  onUpdate?: (post: Post) => void;
}

export default function PostCard({ post, onDelete, onUpdate }: PostCardProps) {
  const { user, isAuthenticated } = useAuth(); // Get the currently logged-in user 
  // --- ROBUSTNESS FIX FOR HYDRATION ---
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);


  // Handler for the delete button
  const handleDelete = () => {
    // Show a confirmation dialog before proceeding
    if (window.confirm('Are you sure you want to delete this post?')) {
      // If the onDelete prop was provided by the parent, call it
      if (onDelete) {
        onDelete(post._id);
      }
    }
  };
  
  // Handler for the update button (using simple prompts for now)
  const handleUpdate = () => {
    const newTitle = prompt("Enter new title:", post.title);
    const newContent = prompt("Enter new content:", post.content || "");
    
    // Check if the user didn't cancel the prompts and a handler exists
    if (newTitle !== null && newContent !== null && onUpdate) {
        onUpdate({ ...post, title: newTitle, content: newContent });
    }
  };
  // Determine if the currently logged-in user is the author of this post
  const isAuthor = isAuthenticated && user?.id === post.author._id;

  return (
    // Removed the hover effect and cursor pointer from the main div as it now contains buttons
    <div className="bg-white border border-gray-200 rounded-md shadow-sm">
      <div className="p-4">
        {/* Post Metadata */}
        <div className="flex items-center text-xs text-gray-500 mb-2">
          <Link href={`/r/${post.community.name}`} className="font-bold text-gray-800 hover:underline">
            r/{post.community.name}
          </Link>
          <span className="mx-1">•</span>
          <span>Posted by u/{post.author.username}</span>
          <span className="mx-1">•</span>
          {/* Conditionally render TimeAgo only after mounting */}
          {hasMounted ? <TimeAgo date={post.createdAt} /> : <span>...</span>}
        </div>
        
        {/* Post Title */}
        <h2 className="text-xl font-bold text-gray-900 mb-2">
          {post.title}
        </h2>
        
        {/* Post Content */}
        {post.content && (
          <p className="text-gray-700 text-sm">
            {post.content}
          </p>
        )}
        {post.imageUrl && (
            <div className="mt-4">
                <img src={post.imageUrl} alt={post.title} className="max-h-96 w-full object-contain rounded-md" />
            </div>
        )}

        {/* Post Actions Section */}
        <div className="flex items-center space-x-4 mt-4 text-sm font-medium text-gray-500">
          {/* We can add a comments button here later */}
          
          {/* Conditionally render Edit and Delete buttons only if the user is the author */}
          {isAuthor && (
            <>
              <button onClick={handleUpdate} className="hover:text-indigo-600">Edit</button>
              <button onClick={handleDelete} className="hover:text-red-600">Delete</button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
"use client";

import React,{useState,useEffect} from 'react';
import Link from 'next/link';
import TimeAgo from 'react-timeago';
import { Post } from '../types'; // Corrected the import path to use '@/' alias
import { useAuth } from '../context/AuthContext'; // Import the useAuth hook to get user info
import { ArrowBigUp, ArrowBigDown, MessageSquare, Edit, Trash2 } from 'lucide-react';
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
    <div className="flex bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg overflow-hidden transition-all duration-200 hover:border-indigo-500 dark:hover:border-indigo-500">
      {/* Vote Section */}
      

      {/* Main Content Section */}
      <div className="p-4 flex-grow">
        {/* Post Metadata */}
        <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 mb-2">
          <Link href={`/r/${post.community.name}`} className="font-bold text-gray-800 dark:text-gray-200 hover:underline">
            r/{post.community.name}
          </Link>
          <span className="mx-1">•</span>
          <span>Posted by 
            <Link href={`/user/${post.author.username}`} className="ml-1 hover:underline">
              u/{post.author.username}
            </Link>
          </span>
          <span className="mx-1">•</span>
          {hasMounted ? <TimeAgo date={post.createdAt} /> : <span>...</span>}
        </div>
        
        {/* Post Title */}
        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          {post.title}
        </h2>
        
        {/* Post Content */}
        {post.content && (
          <p className="text-gray-700 dark:text-gray-300 text-sm max-h-40 overflow-hidden">
            {post.content}
          </p>
        )}
        {post.imageUrl && (
            <div className="mt-4">
                <img src={post.imageUrl} alt={post.title} className="max-h-[500px] w-full object-contain rounded-md bg-gray-100 dark:bg-gray-800" />
            </div>
        )}

        {/* Post Actions Section */}
        <div className="flex items-center space-x-4 mt-4 text-sm font-medium text-gray-500 dark:text-gray-400">
          
          
          {isAuthor && (
            <>
              <button onClick={handleUpdate} className="flex items-center space-x-1 hover:bg-gray-100 dark:hover:bg-gray-800 p-2 rounded-md">
                <Edit size={16} />
                <span>Edit</span>
              </button>
              <button onClick={handleDelete} className="flex items-center space-x-1 text-red-500 hover:bg-red-100 dark:hover:bg-red-900/50 p-2 rounded-md">
                <Trash2 size={16} />
                <span>Delete</span>
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
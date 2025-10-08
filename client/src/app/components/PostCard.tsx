"use client";

import React,{useState,useEffect} from 'react';
import Link from 'next/link';
import TimeAgo from 'react-timeago';
import { Post } from '../types'; // Corrected the import path to use '@/' alias
import { useAuth } from '../context/AuthContext'; // Import the useAuth hook to get user info
import { buildCloudinaryUrl } from '../lib/cloudinary';
import { ArrowBigUp, ArrowBigDown, MessageSquare, Edit, Trash2 } from 'lucide-react';
// Define the props the component will accept, including the new event handlers
interface PostCardProps {
  post: Post;
  onDelete?: (postId: string) => void;
  onUpdate?: (post: Post) => void;
}

// Helper function to construct Cloudinary URLs


export default function PostCard({ post, onDelete, onUpdate }: PostCardProps) {
  const { user, isAuthenticated } = useAuth(); // Get the currently logged-in user 
  // --- ROBUSTNESS FIX FOR HYDRATION ---
  const [hasMounted, setHasMounted] = useState(false);
  
  useEffect(() => {
    setHasMounted(true);
  }, []);
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

  // Pass the cloudName as the FIRST argument to the helper function.
  let finalMediaUrl = buildCloudinaryUrl(
    cloudName,
    post.mediaPublicId,
    post.mediaType,
    post.mediaVersion
  );
  if (!finalMediaUrl) {
    finalMediaUrl = post.mediaUrl || post.imageUrl || null;
  }
  
  console.group(`--- DEBUGGING POST: "${post.title}" ---`);
  console.log("Entire Post Object Received:", post);
  console.log("Cloud Name from process.env:", cloudName);
  console.log("Public ID being used:", post.mediaPublicId);
  console.log("Resource Type being used:", post.mediaType);
  console.log("Version being used:", post.mediaVersion);
  console.log("FINAL Media URL Generated:", finalMediaUrl);
  console.groupEnd();
  // Determine the resource type for rendering.
  const resourceType = post.mediaType || post.mediaType;



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
        {/* --- START OF SIMPLIFIED MEDIA SECTION --- */}
        {finalMediaUrl && (
          <div className="mt-4 max-h-[600px] flex justify-center bg-black rounded-md">
            {resourceType === 'image' ? (
              <img 
                src={finalMediaUrl} 
                alt={post.title} 
                className="max-h-[600px] object-contain" 
              />
            ) : resourceType === 'video' ? (
              <video 
                src={finalMediaUrl} 
                controls 
                preload="metadata"
                playsInline
                className="max-h-[600px] w-full rounded-md"
              >
                Your browser does not support the video tag.
              </video>
            ) : (
              // This is a final fallback for old posts where we only have imageUrl
              // and don't know the resource type. We assume it's an image.
              <img 
                src={finalMediaUrl} 
                alt={post.title} 
                className="max-h-[600px] object-contain" 
              />
            )}
          </div>
        )}
        {/* --- END OF SIMPLIFIED MEDIA SECTION --- */}

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
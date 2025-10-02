export interface Post {
  _id: string;
  title: string;
  content?: string;
  mediaUrl?: string
  mediaPublicId?: string;   // <-- RENAME from imageUrl
  mediaType?: string; 
  mediaVersion?:string; // <-- ADD this field
  imageUrl?: string;
  author: {
    _id: string;
    username: string;
  };
  community: {
    _id: string;
    name: string;
  };
  
  score: number;
  createdAt: string;
}
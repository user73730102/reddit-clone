export interface Post {
  _id: string;
  title: string;
  content?: string;
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
import { Types } from 'mongoose';

export interface BlogPost {
  _id: Types.ObjectId | string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  coverImage: string;
  author: string;
  category: string;
  tags: string[];
  views: number;
  likes: number;
  publishedAt: string;
  isPublished: boolean;
  estimatedReadTime: number;
  relatedTools: Types.ObjectId[];
  createdAt: string;
  updatedAt: string;
} 
import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import BlogPost from '@/lib/models/BlogPost';

export async function POST(request: Request) {
  if (process.env.IS_PRODUCTION === 'true') {
    return new NextResponse('Not authorized', { status: 401 });
  }

  try {
    await connectDB();
    const data = await request.json();

    // Create blog post
    const blogPost = await BlogPost.create(data);

    return NextResponse.json(blogPost);
  } catch (error) {
    console.error('Error creating blog post:', error);
    return new NextResponse(
      JSON.stringify({ error: 'Failed to create blog post' }), 
      { status: 500 }
    );
  }
} 
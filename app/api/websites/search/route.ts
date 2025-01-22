import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { Website } from '@/lib/models';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');
    
    if (!query) {
      return NextResponse.json([]);
    }

    await connectDB();
    
    const websites = await Website.find({
      $or: [
        { name: { $regex: query, $options: 'i' } },
        { URL: { $regex: query, $options: 'i' } }
      ]
    })
    .select('name URL')
    .limit(5)
    .lean();
    
    return NextResponse.json(websites);
  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json([], { status: 500 });
  }
} 
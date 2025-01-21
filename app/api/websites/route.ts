import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Website from '@/lib/models/Website';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET(request: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    
    const category = searchParams.get('category');
    const verified = searchParams.get('verified');
    
    const query: any = {};
    if (category) query.relatedCategory = category;
    if (verified) query.isVerified = verified === 'true';
    
    const websites = await Website.find(query)
      .populate('relatedCategory', 'name')
      .populate('owner', 'name');
    
    return NextResponse.json(websites);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch websites' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    // const session = await getServerSession(authOptions);
    // if (!session) {
    //   return NextResponse.json(
    //     { error: 'Unauthorized' },
    //     { status: 401 }
    //   );
    // }

    const websiteData = await request.json();
    await connectDB();
    
    const website = await Website.create(websiteData);
    
    return NextResponse.json(website);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create website' },
      { status: 500 }
    );
  }
} 
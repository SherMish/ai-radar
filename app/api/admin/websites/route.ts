import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Website from '@/lib/models/Website';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import categoriesData from '@/lib/data/categories.json';

export async function GET() {
  if (process.env.IS_PRODUCTION === 'true') {
    return new NextResponse('Not authorized', { status: 401 });
  }

  try {
    await connectDB();
    const websites = await Website.find()
      .select('name url description shortDescription category logo pricingModel hasFreeTrialPeriod hasAPI launchYear')
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json(websites);
  } catch (error) {
    console.error('Error fetching websites:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function POST(request: Request) {
  if (process.env.IS_PRODUCTION === 'true') {
    return new NextResponse('Not authorized', { status: 401 });
  }

  try {
    await connectDB();
    const { url, name } = await request.json();

    // Check if website already exists
    const existingWebsite = await Website.findOne({ url });
    if (existingWebsite) {
      return new NextResponse(
        JSON.stringify({ error: 'Website already exists' }), 
        { status: 400 }
      );
    }

    // Get current user
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id;

    // Create website with default/temporary values
    const website = await Website.create({
      url,
      name,
      category: categoriesData.categories[0].id,
      createdBy: userId || '000000000000000000000000',
      description: '',
      shortDescription: '',
      isActive: true,
    });

    return NextResponse.json(website);
  } catch (error) {
    console.error('Error creating website:', error);
    return new NextResponse(
      JSON.stringify({ error: 'Failed to create website' }), 
      { status: 500 }
    );
  }
} 
import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Website from '@/lib/models/Website';

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
    const { url } = await request.json();
    if (!url) {
      return new NextResponse('URL is required', { status: 400 });
    }

    await connectDB();
    const website = new Website({ url });
    await website.save();

    return NextResponse.json(website);
  } catch (error) {
    console.error('Error creating website:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
} 
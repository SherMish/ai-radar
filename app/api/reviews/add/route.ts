import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Review from '@/lib/models/Review';
// import { getServerSession } from 'next-auth';
// import { authOptions } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    // Commented out auth check for now
    // const session = await getServerSession(authOptions);
    // if (!session?.user?.id) {
    //   return NextResponse.json(
    //     { error: 'Unauthorized' },
    //     { status: 401 }
    //   );
    // }

    const reviewData = await request.json();
    
    await connectDB();
    
    // Add dummy user ID for now (remove this when auth is implemented)
    const dummyUserId = '65f1f1f1f1f1f1f1f1f1f1f1';
    
    const review = await Review.create({
      ...reviewData,
      relatedUser: dummyUserId, // Will be session.user.id when auth is implemented
      isVerified: false,
    });
    
    return NextResponse.json(review);
  } catch (error) {
    console.error('Error creating review:', error);
    return NextResponse.json(
      { error: 'Failed to create review' },
      { status: 500 }
    );
  }
} 
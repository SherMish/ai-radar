import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  req: Request,
  { params }: { params: { token: string } }
) {
  try {
    const verification = await prisma.verificationRequest.findUnique({
      where: { token: params.token }
    });

    if (!verification || verification.expires < new Date()) {
      return NextResponse.redirect('/business/register?error=invalid_token');
    }

    // Link user and website
    await prisma.website.update({
      where: { url: verification.websiteUrl },
      data: {
        ownerId: verification.userId,
        verifiedAt: new Date()
      }
    });

    return NextResponse.redirect('/business/register?step=pricing');
  } catch (error) {
    return NextResponse.redirect('/business/register?error=verification_failed');
  }
} 
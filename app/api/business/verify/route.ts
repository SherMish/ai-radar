import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendEmail } from '@/lib/email';

export async function POST(req: Request) {
  const { email, websiteUrl } = await req.json();

  try {
    const verificationToken = generateToken();
    
    await prisma.verificationRequest.create({
      data: {
        email,
        token: verificationToken,
        websiteUrl,
        expires: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours
      }
    });

    await sendEmail({
      to: email,
      subject: 'Verify your domain ownership',
      text: `Click here to verify: ${process.env.NEXT_PUBLIC_URL}/api/business/verify/${verificationToken}`
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to send verification email' },
      { status: 500 }
    );
  }
} 
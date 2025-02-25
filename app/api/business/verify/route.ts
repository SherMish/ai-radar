import { NextResponse } from 'next/server';
import { sendEmail } from '@/lib/email';
import { generateToken } from '@/lib/utils';
import connectDB from '@/lib/mongodb';
import User from '@/lib/models/User';

export async function POST(req: Request) {
  const { email, websiteUrl } = await req.json();

  try {
    await connectDB();
    const verificationToken = generateToken();
    const expires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    // Store verification data in user document
    await User.findOneAndUpdate(
      { email },
      {
        $set: {
          'verification.token': verificationToken,
          'verification.expires': expires,
          'verification.websiteUrl': websiteUrl
        }
      }
    );

    await sendEmail({
      to: email,
      subject: 'Verify your domain ownership - AI Radar',
      html: `
        <div style="font-family: sans-serif;">
          <h2>Verify Your Domain Ownership</h2>
          <p>Click the button below to verify your domain ownership for ${websiteUrl}:</p>
          <a 
            href="${process.env.NEXT_PUBLIC_URL}/api/business/verify/${verificationToken}"
            style="display: inline-block; background-color: #0070f3; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; margin: 16px 0;"
          >
            Verify Domain
          </a>
          <p style="color: #666;">If the button doesn't work, copy and paste this link:</p>
          <p style="color: #666; word-break: break-all;">${process.env.NEXT_PUBLIC_URL}/api/business/verify/${verificationToken}</p>
        </div>
      `
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error sending verification:', error);
    return NextResponse.json(
      { error: 'Failed to send verification email' },
      { status: 500 }
    );
  }
} 
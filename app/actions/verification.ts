'use server';

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import connectDB from '@/lib/mongodb';
import User from '@/lib/models/User';
import Website from '@/lib/models/Website';
import { generateToken } from '@/lib/utils';
import { sendEmail } from '@/lib/email';

export async function sendVerificationEmail(email: string, websiteUrl: string) {
  try {
    await connectDB();
    
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      throw new Error('Not authenticated');
    }

    const verificationToken = generateToken();
    const expires = new Date(Date.now() + 24 * 60 * 60 * 1000);

    // Update user with verification token
    const user = await User.findOneAndUpdate(
      { email: session.user.email },
      { 
        $set: {
          'verification.token': verificationToken,
          'verification.expires': expires,
          'verification.websiteUrl': websiteUrl
        }
      },
      { new: true }
    );

    if (!user) {
      throw new Error('User not found');
    }

    // Send verification email
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

    return { success: true };
  } catch (error) {
    console.error('Error in verification process:', error);
    throw error;
  }
}

export async function verifyDomain(token: string) {
  try {
    await connectDB();

    // Find user with this verification token
    const user = await User.findOne({
      'verification.token': token,
      'verification.expires': { $gt: new Date() }
    });

    if (!user) {
      throw new Error('Invalid or expired verification token');
    }

    const websiteUrl = user.verification.websiteUrl;

    // Update the website
    const website = await Website.findOneAndUpdate(
      { url: websiteUrl },
      { 
        $set: {
          isVerified: true,
          owner: user._id,
          verifiedAt: new Date()
        }
      },
      { new: true }
    );

    if (!website) {
      throw new Error('Website not found');
    }

    // Update the user
    await User.findByIdAndUpdate(user._id, {
      $set: {
        isWebsiteOwner: true,
        isVerifiedWebsiteOwner: true,
      },
      $unset: {
        verification: 1
      }
    });

    return { success: true };
  } catch (error) {
    console.error('Error verifying domain:', error);
    throw new Error('Failed to verify domain');
  }
} 
import { NextResponse } from "next/server";
import { Resend } from "resend";
import { randomBytes } from "crypto";
import User from "@/lib/models/User";


const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    const user = await User.findOne({ email });

    if (!user) {
      // Return success even if user doesn't exist for security
      return NextResponse.json({ success: true });
    }

    // Generate reset token
    const resetToken = randomBytes(32).toString("hex");
    const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour from now

    // Save reset token to database
    await User.updateOne(
      { email },
      { 
        resetToken,
        resetTokenExpiry,
      }
    );

    // Send email
    const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${resetToken}`;

    await resend.emails.send({
      from: "noreply@ai-radar.co",
      to: email,
      subject: "Reset Your Password - AI Radar",
      html: `
        <h2>Reset Your Password</h2>
        <p>Click the link below to reset your password. This link will expire in 1 hour.</p>
        <a href="${resetUrl}">Reset Password</a>
        <p>If you didn't request this, please ignore this email.</p>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Password reset error:", error);
    return NextResponse.json(
      { error: "Failed to process password reset" },
      { status: 500 }
    );
  }
} 
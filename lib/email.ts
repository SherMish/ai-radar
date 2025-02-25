import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendEmail({ 
  to, 
  subject, 
  html, 
  text 
}: { 
  to: string; 
  subject: string; 
  html: string; 
  text?: string;
}) {
  console.log("Sending email to:", to);
  console.log("Subject:", subject);
  console.log("HTML:", html);
  console.log("API Key:", process.env.RESEND_API_KEY?.slice(0, 5) + "...");

  return resend.emails.send({
    from: "noreply@ai-radar.com",
    to,
    subject,
    html,
    text,
    react: null
  });
}

export async function sendVerificationEmail(
  to: string,
  token: string,
  websiteName: string
) {
  const verificationUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/verify-ownership?token=${token}`;

  return sendEmail({
    to,
    subject: `Verify ownership of ${websiteName}`,
    html: `
      <h1>Website Ownership Verification</h1>
      <p>Please click the link below to verify your ownership of ${websiteName}:</p>
      <a href="${verificationUrl}">${verificationUrl}</a>
      <p>This link will expire in 24 hours.</p>
    `
  });
} 
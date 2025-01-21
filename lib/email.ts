import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

export async function sendVerificationEmail(
  to: string,
  token: string,
  websiteName: string
) {
  const verificationUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/verify-ownership?token=${token}`;

  const mailOptions = {
    from: process.env.SMTP_FROM,
    to,
    subject: `Verify ownership of ${websiteName}`,
    html: `
      <h1>Website Ownership Verification</h1>
      <p>Please click the link below to verify your ownership of ${websiteName}:</p>
      <a href="${verificationUrl}">${verificationUrl}</a>
      <p>This link will expire in 24 hours.</p>
    `,
  };

  await transporter.sendMail(mailOptions);
} 
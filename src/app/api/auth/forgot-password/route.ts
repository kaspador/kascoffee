import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import crypto from 'crypto';

// In-memory store for reset tokens (in production, use Redis or database)
const resetTokens = new Map<string, { email: string, expires: number }>();

// Clean up expired tokens every hour
setInterval(() => {
  const now = Date.now();
  for (const [token, data] of resetTokens.entries()) {
    if (now > data.expires) {
      resetTokens.delete(token);
    }
  }
}, 60 * 60 * 1000);

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    // Generate a secure reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const expires = Date.now() + (60 * 60 * 1000); // 1 hour expiry

    // Store the token
    resetTokens.set(resetToken, { email, expires });

    const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/auth/reset-password?token=${resetToken}`;

    // Send email with Resend if API key is available
    const resendApiKey = process.env.RESEND_API_KEY;
    if (resendApiKey) {
      try {
        const resend = new Resend(resendApiKey);
        
        await resend.emails.send({
          from: process.env.FROM_EMAIL || 'noreply@kas.coffee',
          to: [email],
          subject: 'Password Reset - kas.coffee',
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
              <div style="text-align: center; margin-bottom: 30px;">
                <h1 style="color: #70C7BA; font-size: 2em; margin: 0;">☕ kas.coffee</h1>
                <p style="color: #666; margin: 10px 0;">Kaspa Donation Platform</p>
              </div>
              
              <div style="background: #f9f9f9; padding: 30px; border-radius: 10px; margin: 20px 0;">
                <h2 style="color: #333; margin-top: 0;">Reset Your Password</h2>
                <p style="color: #666; line-height: 1.6;">
                  We received a request to reset your password for your kas.coffee account.
                </p>
                <p style="color: #666; line-height: 1.6;">
                  Click the button below to reset your password. This link will expire in 1 hour.
                </p>
                
                <div style="text-align: center; margin: 30px 0;">
                  <a href="${resetUrl}" style="background: #70C7BA; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold;">
                    Reset Password
                  </a>
                </div>
                
                <p style="color: #666; line-height: 1.6; font-size: 0.9em;">
                  If the button doesn't work, copy and paste this link into your browser:<br>
                  <a href="${resetUrl}" style="color: #70C7BA; word-break: break-all;">${resetUrl}</a>
                </p>
                
                <p style="color: #666; line-height: 1.6;">
                  If you didn't request this password reset, please ignore this email. Your password will remain unchanged.
                </p>
              </div>
              
              <div style="text-align: center; margin-top: 30px;">
                <p style="color: #999; font-size: 0.9em;">
                  Need help? Contact us at support@kas.coffee
                </p>
              </div>
            </div>
          `,
        });
      } catch {
        // Continue even if email fails
      }
    }

    return NextResponse.json({ 
      success: true, 
      message: 'If an account with that email exists, a password reset link has been sent.'
    });
  } catch {
    return NextResponse.json(
      { error: 'Failed to process password reset request' },
      { status: 500 }
    );
  }
}

// Export the resetTokens for use in reset-password route
export { resetTokens }; 
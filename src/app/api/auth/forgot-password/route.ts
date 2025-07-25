import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    const directusUrl = process.env.NEXT_PUBLIC_DIRECTUS_URL || 'https://directus-production-09ff.up.railway.app';

    // Generate password reset request with Directus
    const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/auth/reset-password`;
    
    const resetResponse = await fetch(`${directusUrl}/auth/password/request`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        reset_url: resetUrl
      }),
    });

    if (!resetResponse.ok) {
      // Don't reveal specific errors to prevent information disclosure
      throw new Error('Failed to process password reset request');
    }

    // Send custom welcome email with Resend if API key is available
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
                <h2 style="color: #333; margin-top: 0;">Password Reset Request</h2>
                <p style="color: #666; line-height: 1.6;">
                  We received a request to reset your password for your kas.coffee account.
                </p>
                <p style="color: #666; line-height: 1.6;">
                  A password reset link has been sent to your email. Please check your inbox and follow the instructions to reset your password.
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
         // Don't fail the request if email fails, Directus will send the default email
       }
    }

    return NextResponse.json({ 
      success: true, 
      message: 'If an account with that email exists, a password reset link has been sent.' 
    });
  } catch (error) {
    // Log error for debugging but don't expose details to client
    console.error('Forgot password error:', error);
    return NextResponse.json(
      { error: 'Failed to process password reset request' },
      { status: 500 }
    );
  }
} 
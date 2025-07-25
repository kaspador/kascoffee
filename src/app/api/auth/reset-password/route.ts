import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { token, password } = await request.json();

    if (!token || !password) {
      return NextResponse.json(
        { error: 'Token and password are required' },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters long' },
        { status: 400 }
      );
    }

    const directusUrl = process.env.NEXT_PUBLIC_DIRECTUS_URL || 'https://directus-production-09ff.up.railway.app';
    
    // Reset password with Directus
    const resetResponse = await fetch(`${directusUrl}/auth/password/reset`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        token,
        password
      }),
    });

    if (!resetResponse.ok) {
      const errorData = await resetResponse.text();
      let errorMessage = 'Failed to reset password';
      
      try {
        const errorJson = JSON.parse(errorData);
        if (errorJson.errors?.[0]?.message) {
          errorMessage = errorJson.errors[0].message;
        }
      } catch {
        // Use default error message if parsing fails
      }

      if (resetResponse.status === 401 || resetResponse.status === 400) {
        errorMessage = 'Invalid or expired reset token. Please request a new password reset.';
      }

      return NextResponse.json(
        { error: errorMessage },
        { status: resetResponse.status }
      );
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Password has been reset successfully. You can now sign in with your new password.' 
    });
  } catch {
    return NextResponse.json(
      { error: 'Failed to process password reset' },
      { status: 500 }
    );
  }
} 
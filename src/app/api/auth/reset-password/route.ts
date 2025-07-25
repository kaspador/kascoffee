import { NextRequest, NextResponse } from 'next/server';
import { resetTokens } from '../forgot-password/route';

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

    // Check if token exists and is valid
    const tokenData = resetTokens.get(token);
    if (!tokenData) {
      return NextResponse.json(
        { error: 'Invalid or expired reset token. Please request a new password reset.' },
        { status: 400 }
      );
    }

    // Check if token has expired
    if (Date.now() > tokenData.expires) {
      resetTokens.delete(token);
      return NextResponse.json(
        { error: 'Reset token has expired. Please request a new password reset.' },
        { status: 400 }
      );
    }

    const directusUrl = process.env.NEXT_PUBLIC_DIRECTUS_URL || 'https://directus-production-09ff.up.railway.app';

    // First, get the user by email to get their ID
    const usersResponse = await fetch(`${directusUrl}/users?filter[email][_eq]=${encodeURIComponent(tokenData.email)}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!usersResponse.ok) {
      throw new Error('Failed to find user');
    }

    const usersData = await usersResponse.json();
    if (!usersData.data || usersData.data.length === 0) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    const userId = usersData.data[0].id;

    // Update the user's password directly in Directus
    const updateResponse = await fetch(`${directusUrl}/users/${userId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        password: password
      }),
    });

    if (!updateResponse.ok) {
      throw new Error('Failed to update password');
    }

    // Remove the used token
    resetTokens.delete(token);

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
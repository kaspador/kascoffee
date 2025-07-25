import { NextRequest, NextResponse } from 'next/server';
import { DirectusAPI } from '@/lib/directus';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();
    
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Login with Directus
    const authData = await DirectusAPI.login(email, password);
    
    if (!authData.access_token) {
      throw new Error('No access token received from Directus');
    }
    
    // Get user details
    const user = await DirectusAPI.getCurrentUser();
    
    const response = NextResponse.json({ 
      success: true, 
      user: {
        id: user.id,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        name: `${user.first_name || ''} ${user.last_name || ''}`.trim()
      },
      token: authData.access_token
    });

    // Set HTTP-only cookie for authentication
    response.cookies.set('directus_token', authData.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/'
    });

    return response;
  } catch (error: unknown) {
    
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Login failed' },
      { status: 401 }
    );
  }
} 
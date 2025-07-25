import { NextRequest, NextResponse } from 'next/server';
import { DirectusAPI } from '@/lib/directus';

export async function GET(request: NextRequest) {
  try {
    // Get token from Authorization header or cookies
    const authHeader = request.headers.get('authorization');
    let token = null;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7);
    } else {
      // Try to get token from cookies
      const cookies = request.cookies;
      token = cookies.get('directus_token')?.value;
    }

    if (!token) {
      return NextResponse.json(
        { error: 'No authentication token provided' },
        { status: 401 }
      );
    }

    // Set token for Directus request
    await DirectusAPI.setToken(token);
    
    // Get current user from Directus
    const user = await DirectusAPI.getCurrentUser();
    
    return NextResponse.json({ 
      success: true, 
      user: {
        id: user.id,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        name: `${user.first_name || ''} ${user.last_name || ''}`.trim() || user.email
      }
    });
  } catch (error: unknown) {
    console.error('Get user error:', error);
    return NextResponse.json(
      { error: 'Not authenticated' },
      { status: 401 }
    );
  }
} 
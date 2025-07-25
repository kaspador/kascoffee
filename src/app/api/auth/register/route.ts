import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { email, password, first_name, last_name } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Use Directus's built-in registration endpoint
    const directusUrl = process.env.NEXT_PUBLIC_DIRECTUS_URL || 'https://directus-production-09ff.up.railway.app';
    
    const response = await fetch(`${directusUrl}/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        password,
        first_name,
        last_name,
        status: 'active',
        role: null // Will use default role
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.errors?.[0]?.message || 'Registration failed');
    }

    const user = await response.json();
    
    return NextResponse.json({ 
      success: true, 
      user: user.data 
    });
  } catch (error: unknown) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Registration failed' },
      { status: 400 }
    );
  }
} 
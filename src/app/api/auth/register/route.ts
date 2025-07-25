import { NextRequest, NextResponse } from 'next/server';
import { DirectusAPI } from '@/lib/directus';

export async function POST(request: NextRequest) {
  try {
    const { email, password, first_name, last_name } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    const user = await DirectusAPI.register(email, password, first_name, last_name);
    
    return NextResponse.json({ 
      success: true, 
      user 
    });
  } catch (error: any) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: error.message || 'Registration failed' },
      { status: 400 }
    );
  }
} 
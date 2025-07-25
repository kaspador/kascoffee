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

    // Use Directus's registration endpoint instead of users endpoint
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
        status: 'active'
      }),
    });

    // Check if response has content before parsing
    const responseText = await response.text();
    console.log('Directus response:', response.status, responseText);

    if (!response.ok) {
      let errorMessage = 'Registration failed';
      try {
        if (responseText) {
          const errorData = JSON.parse(responseText);
          errorMessage = errorData.errors?.[0]?.message || 'Registration failed';
        }
      } catch (parseError) {
        console.error('Error parsing error response:', parseError);
      }
      throw new Error(errorMessage);
    }

    let user = null;
    if (responseText) {
      try {
        const userData = JSON.parse(responseText);
        user = userData.data || userData;
      } catch (parseError) {
        console.error('Error parsing success response:', parseError);
        user = { email }; // Fallback user object
      }
    }
    
    return NextResponse.json({ 
      success: true, 
      user: user 
    });
  } catch (error: unknown) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Registration failed' },
      { status: 400 }
    );
  }
} 
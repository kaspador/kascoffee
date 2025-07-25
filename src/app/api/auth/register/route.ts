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

    const directusUrl = process.env.NEXT_PUBLIC_DIRECTUS_URL || 'https://directus-production-09ff.up.railway.app';
    
    // First, get the "Registered User" role ID
    const rolesResponse = await fetch(`${directusUrl}/roles?filter[name][_eq]=Registered User`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    let roleId = null;
    if (rolesResponse.ok) {
      const rolesData = await rolesResponse.json();
      if (rolesData.data && rolesData.data.length > 0) {
        roleId = rolesData.data[0].id;
      }
    }

    // Create user with role ID
    const userData: Record<string, unknown> = {
      email,
      password,
      first_name,
      last_name,
      status: 'active'
    };
    
    // Add role if found
    if (roleId) {
      userData.role = roleId;
    }

    console.log('Creating user with data:', { ...userData, password: '[HIDDEN]' });

    const response = await fetch(`${directusUrl}/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    // Check if response has content before parsing
    const responseText = await response.text();
    console.log('Directus registration response:', response.status, responseText);

    if (!response.ok) {
      let errorMessage = 'Registration failed';
      try {
        if (responseText) {
          const errorData = JSON.parse(responseText);
          const errorDetail = errorData.errors?.[0]?.message || '';
          
          // Handle specific Directus errors with user-friendly messages
          if (errorDetail.includes('has to be unique') && errorDetail.includes('email')) {
            errorMessage = 'An account with this email already exists. Please sign in instead.';
          } else if (errorDetail.includes('password')) {
            errorMessage = 'Password must be at least 8 characters long.';
          } else if (errorDetail.includes('email')) {
            errorMessage = 'Please enter a valid email address.';
          } else {
            errorMessage = errorDetail || 'Registration failed';
          }
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
        console.log('User created successfully:', user.id);
      } catch (parseError) {
        console.error('Error parsing success response:', parseError);
        user = { email }; // Fallback user object
      }
    }

    // Now automatically log in the user after successful registration
    try {
      const loginResponse = await fetch(`${directusUrl}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      if (loginResponse.ok) {
        const loginData = await loginResponse.json();
        console.log('Auto-login successful after registration');
        
        // Set the token as HTTP-only cookie
        const response = NextResponse.json({ 
          success: true, 
          user: user,
          autoLogin: true,
          token: loginData.data.access_token
        });
        
        response.cookies.set('directus_token', loginData.data.access_token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          maxAge: 60 * 60 * 24 * 7, // 7 days
          path: '/',
        });
        
        return response;
      } else {
        console.log('Auto-login failed, but registration was successful');
      }
    } catch (loginError) {
      console.error('Auto-login error:', loginError);
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
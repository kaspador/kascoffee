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
    
    // First, get the "Registered Users" role ID using admin token
    const rolesResponse = await fetch(`${directusUrl}/roles?filter[name][_eq]=Registered Users`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.DIRECTUS_TOKEN}`,
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

    

    const response = await fetch(`${directusUrl}/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.DIRECTUS_TOKEN}`,
      },
      body: JSON.stringify(userData),
    });

    // Check if response has content before parsing
    const responseText = await response.text();
    

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
              } catch {
          // Error parsing error response - use default message
        }
      throw new Error(errorMessage);
    }

    let user = null;
    if (responseText) {
      try {
        const userData = JSON.parse(responseText);
        user = userData.data || userData;
        
              } catch {
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
        
                // Send welcome email with Resend if API key is available
        const resendApiKey = process.env.RESEND_API_KEY;
        if (resendApiKey && user) {
          try {
            const { Resend } = await import('resend');
            const resend = new Resend(resendApiKey);
            
            await resend.emails.send({
              from: process.env.FROM_EMAIL || 'noreply@kas.coffee',
              to: [email],
              subject: 'Welcome to kas.coffee! ☕',
              html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                  <div style="text-align: center; margin-bottom: 30px;">
                    <h1 style="color: #70C7BA; font-size: 2.5em; margin: 0;">☕ Welcome to kas.coffee!</h1>
                    <p style="color: #666; margin: 10px 0; font-size: 1.1em;">Start receiving Kaspa donations today</p>
                  </div>
                  
                  <div style="background: linear-gradient(135deg, #70C7BA, #49EACB); padding: 30px; border-radius: 15px; margin: 20px 0; color: white;">
                    <h2 style="margin-top: 0; font-size: 1.5em;">🎉 Account Created Successfully!</h2>
                    <p style="line-height: 1.6; margin-bottom: 20px;">
                      Hi ${first_name || 'there'}! Your kas.coffee account is ready. You can now create your personalized donation page and start receiving Kaspa cryptocurrency donations.
                    </p>
                  </div>
                  
                  <div style="background: #f9f9f9; padding: 25px; border-radius: 10px; margin: 20px 0;">
                    <h3 style="color: #333; margin-top: 0;">🚀 Next Steps:</h3>
                    <ol style="color: #666; line-height: 1.8; padding-left: 20px;">
                      <li><strong>Complete your profile</strong> - Add your Kaspa address and personal details</li>
                      <li><strong>Customize your page</strong> - Choose colors and design that represent you</li>
                      <li><strong>Add social links</strong> - Connect your social media for more engagement</li>
                      <li><strong>Share your link</strong> - Start receiving donations!</li>
                    </ol>
                  </div>
                  
                  <div style="text-align: center; margin: 30px 0;">
                    <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/onboarding" 
                       style="background: linear-gradient(135deg, #70C7BA, #49EACB); color: white; padding: 15px 30px; text-decoration: none; border-radius: 25px; font-weight: bold; display: inline-block; transition: transform 0.2s;">
                      Get Started Now →
                    </a>
                  </div>
                  
                  <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
                    <p style="color: #999; font-size: 0.9em;">
                      Need help? Contact us at <a href="mailto:support@kas.coffee" style="color: #70C7BA;">support@kas.coffee</a>
                    </p>
                    <p style="color: #999; font-size: 0.8em; margin-top: 10px;">
                      kas.coffee - Professional Kaspa donation platform
                    </p>
                  </div>
                </div>
              `,
            });
                     } catch {
             // Don't fail registration if email fails
           }
        }
        
        return response;
      } else {
        
      }
    } catch {
      // Auto-login failed, but registration was successful
    }
    
    return NextResponse.json({ 
      success: true, 
      user: user 
    });
  } catch (error: unknown) {
    
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Registration failed' },
      { status: 400 }
    );
  }
} 
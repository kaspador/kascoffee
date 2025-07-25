import { NextRequest, NextResponse } from 'next/server';
import { DirectusAPI } from '@/lib/directus';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ handle: string }> }
) {
  try {
    const { handle: rawHandle } = await params;
    const handle = rawHandle.toLowerCase().trim();
    
    console.log(`TEST: Looking up handle "${handle}"`);

    // Test direct Directus call without token
    const userPage = await DirectusAPI.getUserPage(handle);
    
    console.log(`TEST: Found user page:`, !!userPage);
    
    if (!userPage) {
      return NextResponse.json({ 
        error: 'User page not found',
        handle: handle,
        debug: 'No user page found in database'
      }, { status: 404 });
    }

    console.log(`TEST: User page data:`, {
      id: userPage.id,
      handle: userPage.handle,
      display_name: userPage.display_name,
      is_active: userPage.is_active
    });

    return NextResponse.json({ 
      success: true,
      handle: handle,
      found: true,
      data: {
        id: userPage.id,
        handle: userPage.handle,
        display_name: userPage.display_name,
        short_description: userPage.short_description,
        long_description: userPage.long_description,
        kaspa_address: userPage.kaspa_address,
        is_active: userPage.is_active,
        user_id: userPage.user_id
      }
    });
  } catch (error) {
    console.error('TEST: Error:', error);
    return NextResponse.json({ 
      error: 'Test error: ' + (error instanceof Error ? error.message : 'Unknown error'),
      debug: 'Test endpoint error'
    }, { status: 500 });
  }
} 
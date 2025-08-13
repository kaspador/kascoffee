import { NextRequest, NextResponse } from 'next/server';
import { DirectusAPI, Social } from '@/lib/directus';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ handle: string }> }
) {
  try {
    const { handle: rawHandle } = await params;
    
    // Normalize handle to match how it's stored (lowercase)
    const handle = rawHandle.toLowerCase().trim();
    
    console.log(`[DEBUG] /api/user-page/${handle} - Starting request`);

    // Get user page from Directus
    const userPage = await DirectusAPI.getUserPage(handle);
    
    console.log(`[DEBUG] /api/user-page/${handle} - Directus response:`, userPage ? 'Found user page' : 'No user page found');
    if (userPage) {
      console.log(`[DEBUG] /api/user-page/${handle} - User page data:`, {
        id: userPage.id,
        handle: userPage.handle,
        is_active: userPage.is_active,
        display_name: userPage.display_name
      });
    }

    if (!userPage || !userPage.is_active) {
      console.log(`[DEBUG] /api/user-page/${handle} - Returning 404: userPage=${!!userPage}, is_active=${userPage?.is_active}`);
      return NextResponse.json({ error: 'User page not found' }, { status: 404 });
    }

    // Get user's social links
    let userSocials: Social[] = [];
    try {
      userSocials = await DirectusAPI.getUserSocials(userPage.user_id);
      
    } catch {
      // Socials collection may not exist yet, proceed without socials
      userSocials = [];
      
    }

    // TODO: Implement view count increment in Directus
    // For now, we'll skip this feature until collections are set up

        // Clean image data mapping

    const userData = {
      ...userPage,
      // Map database field names to frontend expected names
      displayName: userPage.display_name,
      shortDescription: userPage.short_description,
      longDescription: userPage.long_description,
      kaspaAddress: userPage.kaspa_address,
      donationGoal: userPage.donation_goal,
      // Simple direct mapping - same as background image that works
      profileImage: userPage.profile_image,
      backgroundImage: userPage.background_image,
      backgroundColor: userPage.background_color || '#0f172a',
      foregroundColor: userPage.foreground_color || '#ffffff',
      isActive: userPage.is_active,
      viewCount: userPage.view_count || 0,
      userId: userPage.user_id,
      // Defensive socials handling
      socials: userSocials.filter(social => social && social.is_visible).map(social => ({
        id: social.id || '',
        platform: social.platform || '',
        url: social.url || '',
        username: social.username || '',
        isVisible: social.is_visible || false
      }))
    };

    
    return NextResponse.json(userData);
      } catch {
      return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
} 
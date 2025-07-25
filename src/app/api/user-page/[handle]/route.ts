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
    
    console.log(`Looking up user page for handle: "${handle}"`);

    // Get user page from Directus
    const userPage = await DirectusAPI.getUserPage(handle);
    
    console.log(`User page found:`, userPage ? 'Yes' : 'No');
    if (userPage) {
      console.log(`User page active:`, userPage.is_active);
    }

    if (!userPage || !userPage.is_active) {
      console.log(`User page not found or inactive for handle: "${handle}"`);
      return NextResponse.json({ error: 'User page not found' }, { status: 404 });
    }

    // Get user's social links
    let userSocials: Social[] = [];
    try {
      userSocials = await DirectusAPI.getUserSocials(userPage.user_id);
      console.log(`Found ${userSocials.length} social links for user`);
    } catch {
      // Socials collection may not exist yet, proceed without socials
      userSocials = [];
      console.log(`No social links found or socials collection doesn't exist`);
    }

    // TODO: Implement view count increment in Directus
    // For now, we'll skip this feature until collections are set up

    const userData = {
      ...userPage,
      backgroundColor: userPage.background_color || '#0f172a',
      foregroundColor: userPage.foreground_color || '#ffffff',
      viewCount: userPage.view_count || 0,
      // Defensive socials handling
      socials: userSocials.filter(social => social && social.is_visible).map(social => ({
        id: social.id || '',
        platform: social.platform || '',
        url: social.url || '',
        username: social.username || '',
        isVisible: social.is_visible || false
      }))
    };

    console.log(`Successfully returning user page data for: "${handle}"`);
    return NextResponse.json(userData);
  } catch (error) {
    console.error('Error fetching user page:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 
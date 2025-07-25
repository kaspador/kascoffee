import { NextRequest, NextResponse } from 'next/server';
import { DirectusAPI } from '@/lib/directus';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ handle: string }> }
) {
  try {
    const { handle } = await params;

    // Get user page from Directus
    const userPage = await DirectusAPI.getUserPage(handle);

    if (!userPage || !userPage.is_active) {
      return NextResponse.json({ error: 'User page not found' }, { status: 404 });
    }

    // Get user's social links
    const userSocials = await DirectusAPI.getUserSocials(userPage.user);

    // TODO: Implement view count increment in Directus
    // For now, we'll skip this feature until collections are set up

    const userData = {
      ...userPage,
      backgroundColor: userPage.background_color || '#0f172a',
      foregroundColor: userPage.foreground_color || '#ffffff',
      viewCount: userPage.view_count || 0,
      socials: userSocials.filter(social => social.is_visible).map(social => ({
        id: social.id,
        platform: social.platform,
        url: social.url,
        username: social.username || '',
        isVisible: social.is_visible
      }))
    };

    return NextResponse.json(userData);
  } catch (error) {
    console.error('Error fetching user page:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 
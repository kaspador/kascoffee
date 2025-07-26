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
    
    

    // Get user page from Directus
    const userPage = await DirectusAPI.getUserPage(handle);
    
    
    if (userPage) {
      
    }

    if (!userPage || !userPage.is_active) {
      
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

    // Clean corrupted image URLs that may have trailing semicolons/commas
    const cleanImageUrl = (url: string | null): string | null => {
      if (!url) return null;
      
      const cleaned = url.toString().trim()
        .replace(/[;,\s]+$/g, '') // Remove trailing semicolons, commas, whitespace
        .replace(/;/g, '') // Remove any internal semicolons
        .replace(/,$/, ''); // Remove trailing commas
      
      // Return the cleaned URL only if it's not empty
      return cleaned || null;
    };

    // Debug image URLs
    console.log(`[USER-PAGE-API] Raw image URLs for ${handle}:`, {
      raw_profile: userPage.profile_image,
      raw_background: userPage.background_image,
      cleaned_profile: cleanImageUrl(userPage.profile_image),
      cleaned_background: cleanImageUrl(userPage.background_image)
    });

    const userData = {
      ...userPage,
      // Map database field names to frontend expected names
      displayName: userPage.display_name,
      shortDescription: userPage.short_description,
      longDescription: userPage.long_description,
      kaspaAddress: userPage.kaspa_address,
      profileImage: cleanImageUrl(userPage.profile_image),
      backgroundImage: cleanImageUrl(userPage.background_image),
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
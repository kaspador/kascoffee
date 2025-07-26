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
      if (typeof url !== 'string') return null;
      
      console.log(`[URL-CLEAN] Original: "${url}"`);
      
      const cleaned = url.trim()
        .replace(/[;,\s]+$/g, '') // Remove trailing semicolons, commas, whitespace
        .replace(/;/g, '') // Remove any internal semicolons
        .replace(/,$/, ''); // Remove trailing commas
      
      console.log(`[URL-CLEAN] Cleaned: "${cleaned}"`);
      
      // Only return null if the cleaned URL is actually empty
      if (cleaned.length === 0) return null;
      
      return cleaned;
    };

    // Debug EVERYTHING that comes from database
    console.log(`[USER-PAGE-API] ===== FULL DATABASE RESPONSE FOR ${handle} =====`);
    console.log(`[USER-PAGE-API] Raw userPage object:`, JSON.stringify(userPage, null, 2));
    console.log(`[USER-PAGE-API] userPage.profile_image specifically:`, userPage.profile_image);
    console.log(`[USER-PAGE-API] userPage.background_image specifically:`, userPage.background_image);
    console.log(`[USER-PAGE-API] All fields present:`, Object.keys(userPage));
    console.log(`[USER-PAGE-API] ===============================================`);

    const userData = {
      ...userPage,
      // Map database field names to frontend expected names
      displayName: userPage.display_name,
      shortDescription: userPage.short_description,
      longDescription: userPage.long_description,
      kaspaAddress: userPage.kaspa_address,
      // TEMPORARILY RETURN RAW VALUES TO DEBUG
      profileImage: userPage.profile_image,
      backgroundImage: userPage.background_image,
      // DEBUG: Include raw database response  
      _DEBUG_RAW_DB_RESPONSE: userPage,
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
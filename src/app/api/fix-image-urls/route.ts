import { NextRequest, NextResponse } from 'next/server';
import { DirectusAPI } from '@/lib/directus';

export async function POST(request: NextRequest) {
  try {
    // Basic security check - require authorization
    const authHeader = request.headers.get('authorization');
    if (!authHeader || authHeader !== `Bearer ${process.env.DIRECTUS_TOKEN}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    console.log('[FIX-IMAGES] Starting image URL cleanup...');

    // Set admin token for operations
    if (!process.env.DIRECTUS_TOKEN) {
      return NextResponse.json({ error: 'DIRECTUS_TOKEN not configured' }, { status: 500 });
    }

    await DirectusAPI.setToken(process.env.DIRECTUS_TOKEN);

    // Get all user pages
    const allUserPages = await DirectusAPI.getAllUserPages();
    console.log(`[FIX-IMAGES] Found ${allUserPages.length} user pages to check`);

    let fixedCount = 0;
    let errorCount = 0;

    // Function to clean image URLs
    const cleanImageUrl = (url: string | null): string | null => {
      if (!url) return null;
      const cleaned = url.toString().trim()
        .replace(/[;,\s]+$/g, '') // Remove trailing semicolons, commas, whitespace
        .replace(/;/g, '') // Remove any internal semicolons  
        .replace(/,$/, '') // Remove trailing commas
        .replace(/^["']|["']$/g, ''); // Remove surrounding quotes
      
      return cleaned || null;
    };

    // Process each user page
    for (const userPage of allUserPages) {
      try {
        const originalProfileImage = userPage.profile_image;
        const originalBackgroundImage = userPage.background_image;
        
        const cleanedProfileImage = cleanImageUrl(originalProfileImage);
        const cleanedBackgroundImage = cleanImageUrl(originalBackgroundImage);
        
        // Check if any cleaning was needed
        const profileChanged = originalProfileImage !== cleanedProfileImage;
        const backgroundChanged = originalBackgroundImage !== cleanedBackgroundImage;
        
        if (profileChanged || backgroundChanged) {
          console.log(`[FIX-IMAGES] Fixing user page ${userPage.id} (${userPage.handle}):`);
          
          if (profileChanged) {
            console.log(`  Profile image: "${originalProfileImage}" → "${cleanedProfileImage}"`);
          }
          if (backgroundChanged) {
            console.log(`  Background image: "${originalBackgroundImage}" → "${cleanedBackgroundImage}"`);
          }
          
          // Update the user page with cleaned URLs
          await DirectusAPI.updateUserPage(userPage.id, {
            profile_image: cleanedProfileImage,
            background_image: cleanedBackgroundImage
          });
          
          fixedCount++;
          console.log(`[FIX-IMAGES] Successfully fixed user page ${userPage.id}`);
        }
      } catch (error) {
        console.error(`[FIX-IMAGES] Error fixing user page ${userPage.id}:`, error);
        errorCount++;
      }
    }

    console.log(`[FIX-IMAGES] Cleanup complete: ${fixedCount} fixed, ${errorCount} errors`);

    return NextResponse.json({
      success: true,
      message: `Image URL cleanup completed`,
      totalPages: allUserPages.length,
      fixedPages: fixedCount,
      errors: errorCount,
      details: fixedCount > 0 ? 'Some corrupted image URLs were cleaned up' : 'No corrupted URLs found'
    });

  } catch (error) {
    console.error('[FIX-IMAGES] Cleanup failed:', error);
    return NextResponse.json({
      success: false,
      error: 'Image cleanup failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
} 
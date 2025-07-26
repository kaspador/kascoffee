import { NextRequest, NextResponse } from 'next/server';
import { DirectusAPI } from '@/lib/directus';

// Simple in-memory cache for tracking IPs (in production, use Redis or database)
const recentViews = new Map<string, Set<string>>();

// Clean up old entries every hour
setInterval(() => {
  const oneHourAgo = Date.now() - 60 * 60 * 1000;
  for (const [key] of recentViews.entries()) {
    if (parseInt(key.split('-')[1]) < oneHourAgo) {
      recentViews.delete(key);
    }
  }
}, 60 * 60 * 1000);

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ handle: string }> }
) {
  try {
    const { handle: rawHandle } = await params;
    const handle = rawHandle.toLowerCase().trim();

    console.log(`[TRACK-VIEW] Tracking view for handle: ${handle}`);

    // Get client IP address
    const forwarded = request.headers.get('x-forwarded-for');
    const realIP = request.headers.get('x-real-ip');
    const clientIP = forwarded ? forwarded.split(',')[0] : realIP || 'unknown';

    console.log(`[TRACK-VIEW] Client IP: ${clientIP}`);

    // Create a unique key for this handle and current hour
    const currentHour = Math.floor(Date.now() / (60 * 60 * 1000));
    const cacheKey = `${handle}-${currentHour}`;

    // Check if this IP has already viewed this handle in the current hour
    if (!recentViews.has(cacheKey)) {
      recentViews.set(cacheKey, new Set());
    }

    const ipSet = recentViews.get(cacheKey)!;
    if (ipSet.has(clientIP)) {
      // IP already viewed this page in the current hour, don't count
      console.log(`[TRACK-VIEW] View already counted for IP ${clientIP} in current hour`);
      return NextResponse.json({ 
        success: true, 
        counted: false, 
        message: 'View already counted for this IP in the current hour' 
      });
    }

    // Mark this IP as having viewed the page
    ipSet.add(clientIP);

    // Get the user page from Directus
    console.log(`[TRACK-VIEW] Fetching user page from Directus for handle: ${handle}`);
    const userPage = await DirectusAPI.getUserPage(handle);
    
    if (!userPage) {
      console.log(`[TRACK-VIEW] User page not found for handle: ${handle}`);
      return NextResponse.json({ 
        error: 'User page not found' 
      }, { status: 404 });
    }

    if (!userPage.is_active) {
      console.log(`[TRACK-VIEW] User page inactive for handle: ${handle}`);
      return NextResponse.json({ 
        error: 'User page inactive' 
      }, { status: 404 });
    }

    const oldViewCount = userPage.view_count || 0;
    const newViewCount = oldViewCount + 1;

    console.log(`[TRACK-VIEW] Updating view count from ${oldViewCount} to ${newViewCount} for handle: ${handle}`);

    // Increment view count in database
    const updatedPage = await DirectusAPI.updateUserPage(userPage.id, {
      view_count: newViewCount
    });

    console.log(`[TRACK-VIEW] Successfully updated view count. New count: ${updatedPage.view_count}`);

    return NextResponse.json({ 
      success: true, 
      counted: true,
      newViewCount: updatedPage.view_count,
      oldViewCount: oldViewCount,
      message: 'View counted successfully'
    });

  } catch (error) {
    console.error('[TRACK-VIEW] Error tracking view:', error);
    return NextResponse.json({ 
      error: 'Failed to track view',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
} 
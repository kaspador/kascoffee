import { NextResponse } from 'next/server';
import { DirectusAPI, UserPage } from '@/lib/directus';

export async function GET() {
  try {
    // This is a debug endpoint - only enable in development
    if (process.env.NODE_ENV === 'production') {
      return NextResponse.json({ error: 'Debug endpoint not available in production' }, { status: 403 });
    }

    console.log('Debug: Fetching all user pages');

    // Get all user pages for debugging
    const pages = await DirectusAPI.getAllUserPages();
    
    console.log(`Debug: Found ${pages.length} total user pages`);
    
    const debugData = pages.map((page: UserPage) => ({
      id: page.id,
      handle: page.handle,
      display_name: page.display_name,
      is_active: page.is_active,
      user_id: page.user_id
    }));

    return NextResponse.json({ 
      total: pages.length,
      pages: debugData
    });
  } catch (error) {
    console.error('Debug: Error fetching user pages:', error);
    return NextResponse.json({ error: 'Debug error: ' + (error instanceof Error ? error.message : 'Unknown error') }, { status: 500 });
  }
} 
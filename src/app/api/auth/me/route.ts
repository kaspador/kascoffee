import { NextRequest, NextResponse } from 'next/server';
import { DirectusAPI } from '@/lib/directus';

export async function GET(request: NextRequest) {
  try {
    const user = await DirectusAPI.getCurrentUser();
    
    return NextResponse.json({ 
      success: true, 
      user 
    });
  } catch (error: any) {
    console.error('Get user error:', error);
    return NextResponse.json(
      { error: 'Not authenticated' },
      { status: 401 }
    );
  }
} 
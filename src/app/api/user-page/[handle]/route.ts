import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { userPages, socials } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ handle: string }> }
) {
  try {
    const { handle } = await params;

    // Get user page from database
    const userPage = await db.query.userPages.findFirst({
      where: eq(userPages.handle, handle),
      with: {
        user: true
      }
    });

    if (!userPage || !userPage.isActive) {
      return NextResponse.json({ error: 'User page not found' }, { status: 404 });
    }

    // Get user's social links
    const userSocials = await db.query.socials.findMany({
      where: eq(socials.userId, userPage.userId)
    });

    // Increment view count
    await db
      .update(userPages)
      .set({ 
        viewCount: (userPage.viewCount || 0) + 1,
        updatedAt: new Date()
      })
      .where(eq(userPages.id, userPage.id));

    const userData = {
      ...userPage,
      backgroundColor: userPage.backgroundColor || '#0f172a',
      foregroundColor: userPage.foregroundColor || '#ffffff',
      viewCount: userPage.viewCount || 0,
      socials: userSocials.filter(social => social.isVisible).map(social => ({
        id: social.id,
        platform: social.platform,
        url: social.url,
        username: social.username || '',
        isVisible: social.isVisible
      }))
    };

    return NextResponse.json(userData);
  } catch (error) {
    console.error('Error fetching user page:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 
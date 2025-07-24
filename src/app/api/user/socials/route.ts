import { NextRequest, NextResponse } from 'next/server';

// Helper function to get mock session from request headers
function getMockSession(request: Request) {
	const authHeader = request.headers.get('authorization');
	if (!authHeader || !authHeader.startsWith('Bearer ')) {
		return null;
	}

	try {
		const sessionData = JSON.parse(authHeader.replace('Bearer ', ''));
		const expires = new Date(sessionData.expires);
		
		if (expires <= new Date()) {
			return null; // Session expired
		}

		return sessionData;
	} catch (error) {
		return null;
	}
}

// GET /api/user/socials - Get user's social links
export async function GET(request: NextRequest) {
	try {
		const session = getMockSession(request);
		
		if (!session?.user?.id) {
			return NextResponse.json(
				{ error: 'Unauthorized' },
				{ status: 401 }
			);
		}

		// Mock data for social links
		const mockSocials = [
			{
				id: 'social-1',
				userId: session.user.id,
				platform: 'twitter',
				url: 'https://twitter.com/example',
				username: 'example',
				isVisible: true,
				createdAt: new Date(),
				updatedAt: new Date()
			}
		];

		return NextResponse.json({ socials: mockSocials });
	} catch (error) {
		console.error('Error fetching socials:', error);
		return NextResponse.json(
			{ error: 'Failed to fetch socials' },
			{ status: 500 }
		);
	}
}

// POST /api/user/socials - Add/update social links
export async function POST(request: NextRequest) {
	try {
		const session = getMockSession(request);
		
		if (!session?.user?.id) {
			return NextResponse.json(
				{ error: 'Unauthorized' },
				{ status: 401 }
			);
		}

		const body = await request.json();
		const { platform, url, username, isVisible }: { 
			platform: string; 
			url: string; 
			username?: string; 
			isVisible: boolean; 
		} = body;

		if (!platform || !url) {
			return NextResponse.json(
				{ error: 'Platform and URL are required' },
				{ status: 400 }
			);
		}

		// Return mock data as if it was saved successfully
		const mockSocial = {
			id: `social-${Date.now()}`,
			userId: session.user.id,
			platform,
			url,
			username: username || null,
			isVisible,
			createdAt: new Date(),
			updatedAt: new Date()
		};

		return NextResponse.json({ social: mockSocial });
	} catch (error) {
		console.error('Error saving social link:', error);
		return NextResponse.json(
			{ error: 'Failed to save social link' },
			{ status: 500 }
		);
	}
} 
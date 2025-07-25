import { NextRequest, NextResponse } from 'next/server';

// Temporarily simplified user profile API - will implement with Directus collections

export async function GET() {
	try {
		// TODO: Implement with Directus authentication and user_pages collection
		// For now, return null to indicate no profile set up yet
		
		return NextResponse.json({ 
			userPage: null // This will hide the donation URL until profile is created
		});
	} catch (error) {
		console.error('Error fetching profile:', error);
		return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
	}
}

export async function PUT(request: NextRequest) {
	try {
		// TODO: Implement with Directus authentication and user_pages collection
		// For now, return success to prevent build errors
		
		const body = await request.json();
		
		return NextResponse.json({ 
			userPage: {
				id: 'temp-id',
				...body,
				updatedAt: new Date().toISOString()
			}
		});
	} catch (error) {
		console.error('Error updating profile:', error);
		return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
	}
} 
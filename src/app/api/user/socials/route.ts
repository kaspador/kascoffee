import { NextRequest, NextResponse } from 'next/server';

// Temporarily simplified user socials API - will implement with Directus collections

export async function GET() {
	try {
		// TODO: Implement with Directus authentication and socials collection
		// For now, return empty array to prevent build errors
		
		return NextResponse.json({ socials: [] });
	} catch (error) {
		console.error('Error fetching social links:', error);
		return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
	}
}

export async function POST(request: NextRequest) {
	try {
		// TODO: Implement with Directus authentication and socials collection
		// For now, return mock response to prevent build errors
		
		const body = await request.json();
		
		return NextResponse.json({ 
			social: {
				id: 'temp-id',
				...body,
				createdAt: new Date().toISOString(),
				updatedAt: new Date().toISOString()
			}
		});
	} catch (error) {
		console.error('Error creating social link:', error);
		return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
	}
}

export async function PUT(request: NextRequest) {
	try {
		// TODO: Implement with Directus authentication and socials collection
		// For now, return mock response to prevent build errors
		
		const body = await request.json();
		
		return NextResponse.json({ 
			social: {
				...body,
				updatedAt: new Date().toISOString()
			}
		});
	} catch (error) {
		console.error('Error updating social link:', error);
		return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
	}
}

export async function DELETE() {
	try {
		// TODO: Implement with Directus authentication and socials collection
		// For now, return success to prevent build errors
		
		return NextResponse.json({ message: 'Social link deleted successfully' });
	} catch (error) {
		console.error('Error deleting social link:', error);
		return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
	}
} 
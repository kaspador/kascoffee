import { NextRequest, NextResponse } from 'next/server';
import { DirectusAPI } from '@/lib/directus';

export async function GET() {
	try {
		// TODO: Get current user from session/auth
		// For now, we'll try to get a user page, but since auth isn't fully set up,
		// we'll return null to indicate no profile exists yet
		
		return NextResponse.json({ 
			userPage: null // Will be replaced when proper auth is implemented
		});
	} catch (error) {
		console.error('Error fetching profile:', error);
		return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
	}
}

export async function PUT(request: NextRequest) {
	try {
		const body = await request.json();
		const { handle, displayName, kaspaAddress, shortDescription, longDescription, profileImage, backgroundImage } = body;
		
		// TODO: Get current user ID from session/auth
		// For now, we'll create a user page with a temporary user ID
		const tempUserId = 'temp-user-id'; // This will be replaced with actual auth
		
		// First check if user page already exists
		let userPage;
		try {
			userPage = await DirectusAPI.getUserPage(handle);
		} catch (error) {
			// User page doesn't exist, that's ok
		}
		
		const userPageData = {
			user: tempUserId,
			handle,
			display_name: displayName,
			short_description: shortDescription || '',
			long_description: longDescription || '',
			kaspa_address: kaspaAddress,
			profile_image: profileImage || null,
			background_image: backgroundImage || null,
			background_color: '#0f172a',
			foreground_color: '#ffffff',
			is_active: true,
			view_count: 0
		};
		
		if (userPage) {
			// Update existing user page
			const updatedPage = await DirectusAPI.updateUserPage(userPage.id, userPageData);
			return NextResponse.json({ 
				userPage: {
					id: updatedPage.id,
					handle: updatedPage.handle,
					displayName: updatedPage.display_name,
					shortDescription: updatedPage.short_description,
					longDescription: updatedPage.long_description,
					kaspaAddress: updatedPage.kaspa_address,
					profileImage: updatedPage.profile_image,
					backgroundImage: updatedPage.background_image,
					backgroundColor: updatedPage.background_color,
					foregroundColor: updatedPage.foreground_color,
					isActive: updatedPage.is_active,
					updatedAt: new Date().toISOString()
				}
			});
		} else {
			// Create new user page
			const newPage = await DirectusAPI.createUserPage(userPageData);
			return NextResponse.json({ 
				userPage: {
					id: newPage.id,
					handle: newPage.handle,
					displayName: newPage.display_name,
					shortDescription: newPage.short_description,
					longDescription: newPage.long_description,
					kaspaAddress: newPage.kaspa_address,
					profileImage: newPage.profile_image,
					backgroundImage: newPage.background_image,
					backgroundColor: newPage.background_color,
					foregroundColor: newPage.foreground_color,
					isActive: newPage.is_active,
					updatedAt: new Date().toISOString()
				}
			});
		}
	} catch (error) {
		console.error('Error updating profile:', error);
		return NextResponse.json({ error: error instanceof Error ? error.message : 'Internal server error' }, { status: 500 });
	}
} 
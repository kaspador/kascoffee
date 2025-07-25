import { NextRequest, NextResponse } from 'next/server';
import { DirectusAPI } from '@/lib/directus';

export async function GET() {
	try {
		// Get current authenticated user
		const user = await DirectusAPI.getCurrentUser();
		if (!user) {
			return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
		}

		// Try to get the user's page
		try {
			const userPages = await DirectusAPI.getUserPageByUserId(user.id);
			if (userPages && userPages.length > 0) {
				const userPage = userPages[0];
				return NextResponse.json({ 
					userPage: {
						id: userPage.id,
						handle: userPage.handle,
						displayName: userPage.display_name,
						shortDescription: userPage.short_description,
						longDescription: userPage.long_description,
						kaspaAddress: userPage.kaspa_address,
						profileImage: userPage.profile_image,
						backgroundImage: userPage.background_image,
						backgroundColor: userPage.background_color,
						foregroundColor: userPage.foreground_color,
						isActive: userPage.is_active,
						viewCount: userPage.view_count
					}
				});
			}
		} catch (error) {
			console.log('No user page found, will show null');
		}
		
		return NextResponse.json({ 
			userPage: null // No profile set up yet
		});
	} catch (error) {
		console.error('Error fetching profile:', error);
		return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
	}
}

export async function PUT(request: NextRequest) {
	try {
		// Get current authenticated user
		const user = await DirectusAPI.getCurrentUser();
		if (!user) {
			return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
		}

		const body = await request.json();
		const { handle, displayName, kaspaAddress, shortDescription, longDescription, profileImage, backgroundImage } = body;
		
		// Check if user page already exists for this user
		let userPage;
		try {
			const userPages = await DirectusAPI.getUserPageByUserId(user.id);
			userPage = userPages && userPages.length > 0 ? userPages[0] : null;
		} catch (error) {
			// User page doesn't exist, that's ok
		}
		
		const userPageData = {
			user: user.id, // Use real user ID
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
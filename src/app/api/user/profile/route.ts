import { NextRequest, NextResponse } from 'next/server';
import { DirectusAPI } from '@/lib/directus';

export async function GET(request: NextRequest) {
	try {
		// Get token from cookies
		const token = request.cookies.get('directus_token')?.value;
		if (!token) {
			return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
		}

		// Set token for Directus request
		await DirectusAPI.setToken(token);

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
						viewCount: userPage.view_count,
						userId: userPage.user_id // Add user_id to response
					}
				});
			}
		} catch {
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
		// Get token from cookies
		const token = request.cookies.get('directus_token')?.value;
		if (!token) {
			return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
		}

		// Set token for Directus request
		await DirectusAPI.setToken(token);

		// Get current authenticated user
		const user = await DirectusAPI.getCurrentUser();
		if (!user) {
			return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
		}

		const body = await request.json();
		const { 
			handle, 
			displayName, 
			kaspaAddress, 
			shortDescription, 
			longDescription, 
			profileImage, 
			backgroundImage,
			backgroundColor,
			foregroundColor
		} = body;
		
		// Only validate handle if it's provided (not just updating colors/other fields)
		if (handle) {
			// Validate handle format
			if (!/^[a-zA-Z0-9-_]+$/.test(handle)) {
				return NextResponse.json({ error: 'Handle can only contain letters, numbers, hyphens, and underscores' }, { status: 400 });
			}
		}

		// Check if user page already exists for this user
		let userPage;
		try {
			const userPages = await DirectusAPI.getUserPageByUserId(user.id);
			userPage = userPages && userPages.length > 0 ? userPages[0] : null;
		} catch {
			// User page doesn't exist, that's ok
		}
		
		// Check handle uniqueness - only if a handle is provided and it's different from current
		if (handle && (!userPage || userPage.handle !== handle)) {
			const existingPage = await DirectusAPI.getUserPage(handle);
			if (existingPage && existingPage.user_id !== user.id) {
				return NextResponse.json({ error: 'This handle is already taken. Please choose a different one.' }, { status: 400 });
			}
		}
		
		// Clean up URLs - remove trailing semicolons and unwanted characters
		const cleanProfileImage = profileImage ? 
			profileImage.toString().trim().replace(/[;,\s]+$/g, '').replace(/;/g, '') : null;
		const cleanBackgroundImage = backgroundImage ? 
			backgroundImage.toString().trim().replace(/[;,\s]+$/g, '').replace(/;/g, '') : null;
		
		const userPageData = {
			user_id: user.id,
			handle: handle ? handle.toLowerCase().trim() : userPage?.handle, // Normalize handle if provided, otherwise keep existing
			display_name: displayName ? displayName.trim() : userPage?.display_name,
			short_description: shortDescription !== undefined ? shortDescription.trim() : userPage?.short_description,
			long_description: longDescription !== undefined ? longDescription.trim() : userPage?.long_description,
			kaspa_address: kaspaAddress ? kaspaAddress.trim() : userPage?.kaspa_address,
			profile_image: cleanProfileImage !== undefined ? cleanProfileImage : userPage?.profile_image,
			background_image: cleanBackgroundImage !== undefined ? cleanBackgroundImage : userPage?.background_image,
			background_color: backgroundColor || userPage?.background_color || '#0f172a',
			foreground_color: foregroundColor || userPage?.foreground_color || '#ffffff',
			is_active: true,
			view_count: userPage ? userPage.view_count : 0 // Preserve existing view count
		};
		
		if (userPage) {
			// Update existing user page
			console.log(`Updating existing user page ${userPage.id} for user ${user.id}`);
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
			console.log(`Creating new user page for user ${user.id} with handle ${handle}`);
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
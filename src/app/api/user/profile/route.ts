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

		console.log('Authenticated user:', { id: user.id, email: user.email });

		const body = await request.json();
		const { handle, displayName, kaspaAddress, shortDescription, longDescription, profileImage, backgroundImage } = body;
		
		console.log('Profile update request:', { handle, displayName, userId: user.id });
		
		// Clean up URLs - remove trailing semicolons and whitespace
		const cleanProfileImage = profileImage ? profileImage.trim().replace(/;+$/, '') : null;
		const cleanBackgroundImage = backgroundImage ? backgroundImage.trim().replace(/;+$/, '') : null;
		
		console.log('URL cleaning:', { 
			originalProfile: profileImage, 
			cleanedProfile: cleanProfileImage,
			originalBackground: backgroundImage,
			cleanedBackground: cleanBackgroundImage
		});
		
		// Check if user page already exists for this user
		let userPage;
		try {
			const userPages = await DirectusAPI.getUserPageByUserId(user.id);
			userPage = userPages && userPages.length > 0 ? userPages[0] : null;
			console.log('Existing user page:', userPage ? userPage.id : 'none');
		} catch {
			// User page doesn't exist, that's ok
			console.log('No existing user page found');
		}
		
		const userPageData = {
			user_id: user.id, // Use different field name to avoid conflicts
			handle,
			display_name: displayName,
			short_description: shortDescription || '',
			long_description: longDescription || '',
			kaspa_address: kaspaAddress,
			profile_image: cleanProfileImage,
			background_image: cleanBackgroundImage,
			background_color: '#0f172a',
			foreground_color: '#ffffff',
			is_active: true,
			view_count: 0
		};
		
		console.log('User page data to save:', userPageData);
		
		if (userPage) {
			// Update existing user page
			console.log('Attempting to UPDATE user page:', userPage.id);
			try {
				const updatedPage = await DirectusAPI.updateUserPage(userPage.id, userPageData);
				console.log('UPDATE successful:', updatedPage.id);
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
			} catch (updateError) {
				console.error('UPDATE failed, falling back to CREATE:', updateError);
				// Update failed, try to create instead
			}
		}
		
		// Create new user page (or fallback from failed update)
		console.log('Attempting to CREATE user page');
		try {
			const newPage = await DirectusAPI.createUserPage(userPageData);
			console.log('CREATE successful:', newPage.id);
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
		} catch (createError) {
			console.error('CREATE failed:', createError);
			return NextResponse.json({ error: createError instanceof Error ? createError.message : 'Internal server error' }, { status: 500 });
		}
	} catch (error) {
		console.error('Error updating profile:', error);
		return NextResponse.json({ error: error instanceof Error ? error.message : 'Internal server error' }, { status: 500 });
	}
} 
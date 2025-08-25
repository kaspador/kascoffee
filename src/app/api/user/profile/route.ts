import { NextRequest, NextResponse } from 'next/server';
import { DirectusAPI, DirectusError } from '@/lib/directus';

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
						donationGoal: userPage.donation_goal,
						donationsPaused: userPage.donations_paused,
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
			// Silent error handling
		}
		
		return NextResponse.json({ 
			userPage: null // No profile set up yet
		});
	} catch {
		return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
	}
}

export async function PUT(request: NextRequest) {
	try {
		console.log(`[DEBUG] /api/user/profile PUT - Starting request`);
		
		// Get token from cookies
		const token = request.cookies.get('directus_token')?.value;
		console.log(`[DEBUG] /api/user/profile PUT - Token found:`, !!token);
		if (!token) {
			return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
		}

		// Set token for Directus request
		try {
			await DirectusAPI.setToken(token);
			console.log(`[DEBUG] /api/user/profile PUT - Token set successfully`);
		} catch (error) {
			console.error(`[ERROR] /api/user/profile PUT - Token set failed:`, error);
			return NextResponse.json({ error: 'Authentication failed' }, { status: 401 });
		}

		// Get current authenticated user
		let user;
		try {
			user = await DirectusAPI.getCurrentUser();
			console.log(`[DEBUG] /api/user/profile PUT - Current user:`, user ? { id: user.id, email: user.email } : 'null');
			if (!user) {
				return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
			}
		} catch (error) {
			console.error(`[ERROR] /api/user/profile PUT - Get current user failed:`, error);
			return NextResponse.json({ error: 'Authentication failed' }, { status: 401 });
		}

		// Parse request body
		let body;
		try {
			body = await request.json();
		} catch {
			return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
		}

		const { 
			handle, 
			displayName, 
			kaspaAddress, 
			donationGoal,
			donationsPaused,
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
			console.log(`[DEBUG] /api/user/profile PUT - Checking existing user page for user ID: ${user.id}`);
			const userPages = await DirectusAPI.getUserPageByUserId(user.id);
			userPage = userPages && userPages.length > 0 ? userPages[0] : null;
			console.log(`[DEBUG] /api/user/profile PUT - Existing user page:`, userPage ? { id: userPage.id, handle: userPage.handle } : 'null');
		} catch (error) {
			console.error(`[ERROR] /api/user/profile PUT - Error checking existing user page:`, error);
			// User page doesn't exist, that's ok for new users
		}
		
		// Check handle uniqueness - only if a handle is provided and it's different from current
		if (handle && (!userPage || userPage.handle !== handle)) {
			try {
				const existingPage = await DirectusAPI.getUserPage(handle);
				if (existingPage && existingPage.user_id !== user.id) {
					return NextResponse.json({ error: 'This handle is already taken. Please choose a different one.' }, { status: 400 });
				}
			} catch {
				// Continue anyway, the error might be that the handle doesn't exist which is fine
			}
		}
		
		// Clean up URLs - remove trailing semicolons and unwanted characters
		const cleanProfileImage = profileImage ? 
			profileImage.toString().trim().replace(/[;,\s]+$/g, '').replace(/;/g, '').replace(/,$/, '') : null;
		const cleanBackgroundImage = backgroundImage ? 
			backgroundImage.toString().trim().replace(/[;,\s]+$/g, '').replace(/;/g, '').replace(/,$/, '') : null;
		
		const userPageData = {
			user_id: user.id,
			handle: handle ? handle.toLowerCase().trim() : userPage?.handle, // Normalize handle if provided, otherwise keep existing
			display_name: displayName ? displayName.trim() : userPage?.display_name,
			short_description: shortDescription !== undefined ? shortDescription.trim() : userPage?.short_description,
			long_description: longDescription !== undefined ? longDescription.trim() : userPage?.long_description,
			kaspa_address: kaspaAddress ? kaspaAddress.trim() : userPage?.kaspa_address,
			donation_goal: donationGoal !== undefined ? donationGoal : userPage?.donation_goal,
			donations_paused: donationsPaused !== undefined ? donationsPaused : userPage?.donations_paused || false,
			profile_image: cleanProfileImage !== undefined ? cleanProfileImage : userPage?.profile_image,
			background_image: cleanBackgroundImage !== undefined ? cleanBackgroundImage : userPage?.background_image,
			background_color: backgroundColor || userPage?.background_color || '#0f172a',
			foreground_color: foregroundColor || userPage?.foreground_color || '#ffffff',
			is_active: true,
			view_count: userPage ? userPage.view_count : 0 // Preserve existing view count
		};

		if (userPage) {
			// Update existing user page
			try {
				// User's token is already set above - no need to switch
				
				const updatedPage = await DirectusAPI.updateUserPage(userPage.id, userPageData);
				
				return NextResponse.json({ 
					userPage: {
						id: updatedPage.id,
						handle: updatedPage.handle,
						displayName: updatedPage.display_name,
						shortDescription: updatedPage.short_description,
						longDescription: updatedPage.long_description,
						kaspaAddress: updatedPage.kaspa_address,
						donationGoal: updatedPage.donation_goal,
						donationsPaused: updatedPage.donations_paused,
						profileImage: updatedPage.profile_image,
						backgroundImage: updatedPage.background_image,
						backgroundColor: updatedPage.background_color,
						foregroundColor: updatedPage.foreground_color,
						isActive: updatedPage.is_active,
						updatedAt: new Date().toISOString()
					}
				});
			} catch (error) {
				// Provide more specific error details
				if (error && typeof error === 'object' && 'response' in error) {
					const directusError = error as DirectusError;
					
					if (directusError.response?.status === 401) {
						return NextResponse.json({ 
							error: 'Authentication failed with Directus. Please check admin token configuration.',
							details: 'The server admin token is invalid or expired.'
						}, { status: 500 });
					}
				}
				
				throw error;
			}
				} else {
			// Create new user page
			try {
				// Ensure required fields are present for new page creation
				if (!userPageData.handle) {
					return NextResponse.json({ error: 'Handle is required for new profiles' }, { status: 400 });
				}
				if (!userPageData.kaspa_address) {
					return NextResponse.json({ error: 'Kaspa address is required for new profiles' }, { status: 400 });
				}
				
				// User's token is already set above for new user creation
				
				const newPage = await DirectusAPI.createUserPage(userPageData);

				return NextResponse.json({ 
					userPage: {
						id: newPage.id,
						handle: newPage.handle,
						displayName: newPage.display_name,
						shortDescription: newPage.short_description,
						longDescription: newPage.long_description,
						kaspaAddress: newPage.kaspa_address,
						donationGoal: newPage.donation_goal,
						donationsPaused: newPage.donations_paused,
						profileImage: newPage.profile_image,
						backgroundImage: newPage.background_image,
						backgroundColor: newPage.background_color,
						foregroundColor: newPage.foreground_color,
						isActive: newPage.is_active,
						updatedAt: new Date().toISOString()
					}
				});
			} catch (error) {
				throw error;
			}
		}
	} catch (error) {
		
		// Provide more detailed error information
		if (error instanceof Error) {
			return NextResponse.json({ 
				error: 'Internal server error',
				details: error.message,
				stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
			}, { status: 500 });
		}
		
		return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
	}
} 
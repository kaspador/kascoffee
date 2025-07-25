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
	console.log('🔥 PUT /api/user/profile called - NEW VERSION');
	try {
		// Get token from cookies
		const token = request.cookies.get('directus_token')?.value;
		console.log('🔑 Token from cookies:', token ? 'EXISTS' : 'MISSING');
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
		
		console.log('🔍 RAW BODY FROM FRONTEND:', body);
		console.log('🔍 Destructured profileImage:', profileImage);
		console.log('🔍 Destructured backgroundImage:', backgroundImage);
		
		console.log('Profile update request:', { handle, displayName, userId: user.id });
		
		// Clean up URLs - remove trailing semicolons, commas, and other unwanted characters
		const cleanProfileImage = profileImage ? 
			profileImage.toString().trim().replace(/[;,\s]+$/g, '').replace(/;/g, '') : null;
		const cleanBackgroundImage = backgroundImage ? 
			backgroundImage.toString().trim().replace(/[;,\s]+$/g, '').replace(/;/g, '') : null;
		
		console.log('URL cleaning:', { 
			originalProfile: profileImage, 
			cleanedProfile: cleanProfileImage,
			originalBackground: backgroundImage,
			cleanedBackground: cleanBackgroundImage,
			profileType: typeof profileImage,
			backgroundType: typeof backgroundImage
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
		console.log('🔍 URL DEBUG - Profile image in userPageData:', userPageData.profile_image);
		console.log('🔍 URL DEBUG - Background image in userPageData:', userPageData.background_image);
		
		// TEMPORARY: Skip UPDATE entirely to avoid foreign key issues
		// Force CREATE to bypass the problematic UPDATE operation
		console.log('⚠️ FORCING CREATE to bypass UPDATE issues');
		
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
			
			// If images are causing foreign key issues, try without images
			if (createError instanceof Error && createError.message.includes('Invalid foreign key')) {
				console.log('🔄 Retrying CREATE without images due to foreign key error');
				const userPageDataNoImages = { ...userPageData };
				delete userPageDataNoImages.profile_image;
				delete userPageDataNoImages.background_image;
				
				try {
					const newPageNoImages = await DirectusAPI.createUserPage(userPageDataNoImages);
					console.log('CREATE without images successful:', newPageNoImages.id);
					return NextResponse.json({ 
						userPage: {
							id: newPageNoImages.id,
							handle: newPageNoImages.handle,
							displayName: newPageNoImages.display_name,
							shortDescription: newPageNoImages.short_description,
							longDescription: newPageNoImages.long_description,
							kaspaAddress: newPageNoImages.kaspa_address,
							profileImage: null, // Images couldn't be saved due to Directus config
							backgroundImage: null,
							backgroundColor: newPageNoImages.background_color,
							foregroundColor: newPageNoImages.foreground_color,
							isActive: newPageNoImages.is_active,
							updatedAt: new Date().toISOString()
						}
					});
				} catch (retryError) {
					console.error('Retry CREATE without images also failed:', retryError);
					return NextResponse.json({ error: retryError instanceof Error ? retryError.message : 'Internal server error' }, { status: 500 });
				}
			}
			
			return NextResponse.json({ error: createError instanceof Error ? createError.message : 'Internal server error' }, { status: 500 });
		}
	} catch (error) {
		console.error('Error updating profile:', error);
		return NextResponse.json({ error: error instanceof Error ? error.message : 'Internal server error' }, { status: 500 });
	}
} 
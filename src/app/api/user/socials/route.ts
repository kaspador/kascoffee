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

		// Get user's socials
		const socials = await DirectusAPI.getUserSocials(user.id);
		
		return NextResponse.json({ socials });
	} catch {
		return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
	}
}

export async function POST(request: NextRequest) {
	try {
		console.log('[DEBUG] /api/user/socials POST - Starting request');
		
		// Get token from cookies
		const token = request.cookies.get('directus_token')?.value;
		if (!token) {
			console.log('[DEBUG] /api/user/socials POST - No token found');
			return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
		}
		console.log('[DEBUG] /api/user/socials POST - Token found:', !!token);

		// Set token for Directus request
		await DirectusAPI.setToken(token);

		// Get current authenticated user
		const user = await DirectusAPI.getCurrentUser();
		if (!user) {
			console.log('[DEBUG] /api/user/socials POST - User not authenticated');
			return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
		}
		console.log('[DEBUG] /api/user/socials POST - Current user:', { id: user.id, email: user.email });

		// Parse request body
		const body = await request.json();
		const { platform, url, username, is_visible = true } = body;
		console.log('[DEBUG] /api/user/socials POST - Request body:', { platform, url, username, is_visible });

		// Validate required fields
		if (!platform || !url) {
			console.log('[DEBUG] /api/user/socials POST - Missing required fields');
			return NextResponse.json({ error: 'Platform and URL are required' }, { status: 400 });
		}

		// Validate platform type
		const validPlatforms = ['twitter', 'discord', 'telegram', 'website'];
		if (!validPlatforms.includes(platform)) {
			console.log('[DEBUG] /api/user/socials POST - Invalid platform:', platform);
			return NextResponse.json({ error: 'Invalid platform' }, { status: 400 });
		}

		console.log('[DEBUG] /api/user/socials POST - About to create social with data:', {
			user: user.id,
			platform,
			url,
			username: username || null,
			is_visible
		});

		// Create social
		const social = await DirectusAPI.createSocial({
			user: user.id,
			platform,
			url,
			username: username || null,
			is_visible
		});
		
		console.log('[DEBUG] /api/user/socials POST - Social created successfully:', social);
		return NextResponse.json({ social });
	} catch (error) {
		console.error('[ERROR] /api/user/socials POST - Error:', error);
		return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
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

		// Parse request body
		const body = await request.json();
		const { id, platform, url, username, is_visible } = body;

		// Validate required fields
		if (!id) {
			return NextResponse.json({ error: 'Social ID is required' }, { status: 400 });
		}

		// Build update data
		const updateData: Partial<{
			platform: 'twitter' | 'discord' | 'telegram' | 'website';
			url: string;
			username?: string;
			is_visible: boolean;
		}> = {};
		if (platform !== undefined) updateData.platform = platform;
		if (url !== undefined) updateData.url = url;
		if (username !== undefined) updateData.username = username || undefined;
		if (is_visible !== undefined) updateData.is_visible = is_visible;

		// Update social
		const social = await DirectusAPI.updateSocial(id, updateData);
		
		return NextResponse.json({ social });
	} catch {
		return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
	}
}

export async function DELETE(request: NextRequest) {
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

		// Get social ID from URL params
		const url = new URL(request.url);
		const id = url.searchParams.get('id');

		if (!id) {
			return NextResponse.json({ error: 'Social ID is required' }, { status: 400 });
		}

		// Delete social
		await DirectusAPI.deleteSocial(id);
		
		return NextResponse.json({ success: true });
	} catch {
		return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
	}
}

 
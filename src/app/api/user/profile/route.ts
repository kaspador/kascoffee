import { NextRequest, NextResponse } from 'next/server';
import { validateKaspaAddress } from '@/lib/utils/kaspa-validation';
import { sanitizeHtml } from '@/lib/utils/sanitization';
import { z } from 'zod';

// Schema for partial profile updates - most fields are optional
const updateProfileSchema = z.object({
	handle: z.string().min(3).max(50).regex(/^[a-z0-9_-]+$/, 'Handle must be lowercase alphanumeric with underscores and hyphens only').optional(),
	displayName: z.string().min(1).max(100).optional(),
	shortDescription: z.string().max(300).optional(),
	longDescription: z.string().optional(),
	kaspaAddress: z.string().refine((val) => !val || validateKaspaAddress(val), 'Invalid Kaspa address').optional(),
	backgroundColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Must be a valid hex color').optional(),
	foregroundColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Must be a valid hex color').optional(),
	profileImage: z.string().url('Must be a valid URL').optional().or(z.literal('')),
	backgroundImage: z.string().url('Must be a valid URL').optional().or(z.literal(''))
});

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

export async function GET(request: NextRequest) {
	try {
		const session = getMockSession(request);

		if (!session?.user?.id) {
			return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
		}

		// Return mock data that matches our localStorage session
		const userPage = {
			id: 'mock-id',
			userId: session.user.id,
			handle: session.user.email?.split('@')[0] || 'user',
			displayName: session.user.name || session.user.email?.split('@')[0] || 'User',
			shortDescription: 'Welcome to my kas.coffee donation page!',
			longDescription: 'Support me with Kaspa cryptocurrency donations.',
			kaspaAddress: 'kaspa:qz8h9w7g6f5d4s3a2q1w9e8r7t6y5u4i3o2p1a9s8d7f6g5h4j3k2l1z0x9c8v7b6n5m4',
			profileImage: session.user.image,
			backgroundImage: null,
			backgroundColor: '#0f172a',
			foregroundColor: '#ffffff',
			isActive: true,
			viewCount: 42,
			createdAt: new Date(),
			updatedAt: new Date()
		};

		return NextResponse.json({ userPage });
	} catch (error) {
		console.error('Error fetching user profile:', error);
		return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
	}
}

export async function PUT(request: NextRequest) {
	try {
		const session = getMockSession(request);

		if (!session?.user?.id) {
			return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
		}

		const body = await request.json();
		
		// Validate the incoming data
		const validationResult = updateProfileSchema.safeParse(body);
		if (!validationResult.success) {
			return NextResponse.json({ 
				error: 'Validation error', 
				details: validationResult.error.issues 
			}, { status: 400 });
		}

		const validatedData = validationResult.data;

		// Sanitize HTML content if provided
		const sanitizedLongDescription = validatedData.longDescription 
			? sanitizeHtml(validatedData.longDescription) 
			: undefined;

		// Get existing user data (mock)
		const existingUserPage = {
			id: 'mock-id',
			userId: session.user.id,
			handle: session.user.email?.split('@')[0] || 'user',
			displayName: session.user.name || session.user.email?.split('@')[0] || 'User',
			shortDescription: 'Welcome to my kas.coffee donation page!',
			longDescription: 'Support me with Kaspa cryptocurrency donations.',
			kaspaAddress: 'kaspa:qz8h9w7g6f5d4s3a2q1w9e8r7t6y5u4i3o2p1a9s8d7f6g5h4j3k2l1z0x9c8v7b6n5m4',
			profileImage: session.user.image,
			backgroundImage: null,
			backgroundColor: '#0f172a',
			foregroundColor: '#ffffff',
			isActive: true,
			viewCount: 42,
			createdAt: new Date(),
			updatedAt: new Date()
		};

		// Merge existing data with new data (only update provided fields)
		const updatedUserPage = {
			...existingUserPage,
			...Object.fromEntries(
				Object.entries(validatedData).filter(([_, value]) => value !== undefined)
			),
			longDescription: sanitizedLongDescription !== undefined ? sanitizedLongDescription : existingUserPage.longDescription,
			updatedAt: new Date()
		};

		return NextResponse.json({ userPage: updatedUserPage });
	} catch (error) {
		console.error('Error updating user profile:', error);
		return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
	}
} 
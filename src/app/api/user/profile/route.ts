import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { validateKaspaAddress } from '@/lib/utils/kaspa-validation';
import { sanitizeHtml } from '@/lib/utils/sanitization';
import { z } from 'zod';
import { db } from '@/lib/db';
import { userPages } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

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

export async function GET(request: NextRequest) {
	try {
		const session = await auth.api.getSession({
			headers: request.headers
		});

		if (!session?.user?.id) {
			return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
		}

		// Get user page from database
		const userPage = await db.query.userPages.findFirst({
			where: eq(userPages.userId, session.user.id)
		});

		if (!userPage) {
			// Create default user page if it doesn't exist
			const newUserPage = await db.insert(userPages).values({
				userId: session.user.id,
				handle: session.user.email?.split('@')[0]?.toLowerCase().replace(/[^a-z0-9]/g, '') || `user-${session.user.id.slice(0, 8)}`,
				displayName: session.user.name || 'New User',
				shortDescription: 'Welcome to my donation page!',
				longDescription: '',
				kaspaAddress: '',
				backgroundColor: '#70C7BA',
				foregroundColor: '#ffffff',
				isActive: true
			}).returning();

			return NextResponse.json({ userPage: newUserPage[0] });
		}

		return NextResponse.json({ userPage });
	} catch (error) {
		console.error('Error fetching profile:', error);
		return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
	}
}

export async function PUT(request: NextRequest) {
	try {
		const session = await auth.api.getSession({
			headers: request.headers
		});

		if (!session?.user?.id) {
			return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
		}

		const body = await request.json();
		const result = updateProfileSchema.safeParse(body);

		if (!result.success) {
			return NextResponse.json(
				{ error: 'Validation error', details: result.error.format() },
				{ status: 400 }
			);
		}

		const validatedData = result.data;

		// Sanitize long description if provided
		const sanitizedLongDescription = validatedData.longDescription 
			? sanitizeHtml(validatedData.longDescription)
			: undefined;

		// Check if handle is unique (if being updated)
		if (validatedData.handle) {
			const existingPage = await db.query.userPages.findFirst({
				where: eq(userPages.handle, validatedData.handle)
			});

			if (existingPage && existingPage.userId !== session.user.id) {
				return NextResponse.json(
					{ error: 'Handle is already taken' },
					{ status: 400 }
				);
			}
		}

		// Update the user page
		const updateData: any = {
			...validatedData,
			...(sanitizedLongDescription !== undefined && { longDescription: sanitizedLongDescription }),
			updatedAt: new Date()
		};

		const updatedUserPage = await db
			.update(userPages)
			.set(updateData)
			.where(eq(userPages.userId, session.user.id))
			.returning();

		if (updatedUserPage.length === 0) {
			return NextResponse.json({ error: 'User page not found' }, { status: 404 });
		}

		return NextResponse.json({ userPage: updatedUserPage[0] });
	} catch (error) {
		console.error('Error updating profile:', error);
		return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
	}
} 
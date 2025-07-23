import 'server-only';

import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import { userPages } from '@/lib/db/schema';
import { validateKaspaAddress } from '@/lib/utils/kaspa-validation';
import { sanitizeHtml } from '@/lib/utils/sanitization';
import { eq } from 'drizzle-orm';
import { headers } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const updateProfileSchema = z.object({
	handle: z.string().min(3).max(50).regex(/^[a-z0-9_-]+$/, 'Handle must be lowercase alphanumeric with underscores and hyphens only'),
	displayName: z.string().min(1).max(100),
	shortDescription: z.string().max(300).optional(),
	longDescription: z.string().optional(),
	kaspaAddress: z.string().refine(validateKaspaAddress, 'Invalid Kaspa address'),
	backgroundColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/).optional(),
	foregroundColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/).optional(),
	profileImage: z.string().url().optional(),
	backgroundImage: z.string().url().optional()
});

export async function GET() {
	try {
		const session = await auth.api.getSession({
			headers: await headers()
		});

		if (!session) {
			return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
		}

		const userPage = await db.query.userPages.findFirst({
			where: eq(userPages.userId, session.user.id)
		});

		return NextResponse.json({ userPage });
	} catch (error) {
		console.error('Error fetching user profile:', error);
		return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
	}
}

export async function PUT(request: NextRequest) {
	try {
		const session = await auth.api.getSession({
			headers: await headers()
		});

		if (!session) {
			return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
		}

		const body = await request.json();
		const validatedData = updateProfileSchema.parse(body);

		// Sanitize HTML content
		const sanitizedLongDescription = validatedData.longDescription 
			? sanitizeHtml(validatedData.longDescription) 
			: null;

		const updatedUserPage = await db
			.update(userPages)
			.set({
				...validatedData,
				longDescription: sanitizedLongDescription,
				updatedAt: new Date()
			})
			.where(eq(userPages.userId, session.user.id))
			.returning();

		return NextResponse.json({ userPage: updatedUserPage[0] });
	} catch (error) {
		if (error instanceof z.ZodError) {
			return NextResponse.json({ error: 'Validation error', details: error.issues }, { status: 400 });
		}
		console.error('Error updating user profile:', error);
		return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
	}
} 
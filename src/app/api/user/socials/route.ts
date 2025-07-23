import 'server-only';

import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import { socials } from '@/lib/db/schema';
import { eq, and } from 'drizzle-orm';
import { headers } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const socialSchema = z.object({
	platform: z.enum(['twitter', 'discord', 'telegram', 'website']),
	url: z.string().url(),
	username: z.string().max(100).optional(),
	isVisible: z.boolean().default(true)
});

const updateSocialsSchema = z.object({
	socials: z.array(socialSchema)
});

export async function GET() {
	try {
		const session = await auth.api.getSession({
			headers: await headers()
		});

		if (!session) {
			return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
		}

		const userSocials = await db.query.socials.findMany({
			where: eq(socials.userId, session.user.id)
		});

		return NextResponse.json({ socials: userSocials });
	} catch (error) {
		console.error('Error fetching user socials:', error);
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
		const { socials: newSocials } = updateSocialsSchema.parse(body);

		// Delete existing socials
		await db.delete(socials).where(eq(socials.userId, session.user.id));

		// Insert new socials
		if (newSocials.length > 0) {
			const socialsToInsert = newSocials.map(social => ({
				...social,
				userId: session.user.id
			}));

			await db.insert(socials).values(socialsToInsert);
		}

		// Fetch updated socials
		const updatedSocials = await db.query.socials.findMany({
			where: eq(socials.userId, session.user.id)
		});

		return NextResponse.json({ socials: updatedSocials });
	} catch (error) {
		if (error instanceof z.ZodError) {
			return NextResponse.json({ error: 'Validation error', details: error.issues }, { status: 400 });
		}
		console.error('Error updating user socials:', error);
		return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
	}
} 
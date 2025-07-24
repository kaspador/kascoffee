import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { z } from 'zod';
import { db } from '@/lib/db';
import { socials } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

const socialLinkSchema = z.object({
	platform: z.enum(['twitter', 'discord', 'telegram', 'website'], {
		errorMap: () => ({ message: 'Platform must be one of: twitter, discord, telegram, website' })
	}),
	url: z.string().url('Must be a valid URL'),
	username: z.string().optional(),
	isVisible: z.boolean().default(true)
});

export async function GET(request: NextRequest) {
	try {
		const session = await auth.api.getSession({
			headers: request.headers
		});

		if (!session?.user?.id) {
			return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
		}

		// Get user's social links from database
		const userSocials = await db.query.socials.findMany({
			where: eq(socials.userId, session.user.id)
		});

		return NextResponse.json({ socials: userSocials });
	} catch (error) {
		console.error('Error fetching social links:', error);
		return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
	}
}

export async function POST(request: NextRequest) {
	try {
		const session = await auth.api.getSession({
			headers: request.headers
		});

		if (!session?.user?.id) {
			return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
		}

		const body = await request.json();
		const result = socialLinkSchema.safeParse(body);

		if (!result.success) {
			return NextResponse.json(
				{ error: 'Validation error', details: result.error.format() },
				{ status: 400 }
			);
		}

		const validatedData = result.data;

		// Create new social link
		const newSocial = await db.insert(socials).values({
			userId: session.user.id,
			platform: validatedData.platform,
			url: validatedData.url,
			username: validatedData.username || '',
			isVisible: validatedData.isVisible
		}).returning();

		return NextResponse.json({ social: newSocial[0] });
	} catch (error) {
		console.error('Error creating social link:', error);
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
		const { id, ...updateData } = body;

		if (!id) {
			return NextResponse.json({ error: 'Social link ID is required' }, { status: 400 });
		}

		const result = socialLinkSchema.partial().safeParse(updateData);

		if (!result.success) {
			return NextResponse.json(
				{ error: 'Validation error', details: result.error.format() },
				{ status: 400 }
			);
		}

		// Update social link (ensure it belongs to the user)
		const updatedSocial = await db
			.update(socials)
			.set({ ...result.data, updatedAt: new Date() })
			.where(eq(socials.id, id) && eq(socials.userId, session.user.id))
			.returning();

		if (updatedSocial.length === 0) {
			return NextResponse.json({ error: 'Social link not found' }, { status: 404 });
		}

		return NextResponse.json({ social: updatedSocial[0] });
	} catch (error) {
		console.error('Error updating social link:', error);
		return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
	}
}

export async function DELETE(request: NextRequest) {
	try {
		const session = await auth.api.getSession({
			headers: request.headers
		});

		if (!session?.user?.id) {
			return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
		}

		const { searchParams } = new URL(request.url);
		const id = searchParams.get('id');

		if (!id) {
			return NextResponse.json({ error: 'Social link ID is required' }, { status: 400 });
		}

		// Delete social link (ensure it belongs to the user)
		const deletedSocial = await db
			.delete(socials)
			.where(eq(socials.id, id) && eq(socials.userId, session.user.id))
			.returning();

		if (deletedSocial.length === 0) {
			return NextResponse.json({ error: 'Social link not found' }, { status: 404 });
		}

		return NextResponse.json({ message: 'Social link deleted successfully' });
	} catch (error) {
		console.error('Error deleting social link:', error);
		return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
	}
} 
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { user, account } from '@/lib/db/schema';
import { eq, and } from 'drizzle-orm';

export async function POST(request: NextRequest) {
	try {
		const { email } = await request.json();
		
		if (!email) {
			return NextResponse.json({ error: 'Email required' }, { status: 400 });
		}

		// Find the user
		const userRecord = await db.select({
			id: user.id,
			email: user.email
		}).from(user).where(eq(user.email, email)).limit(1);

		if (userRecord.length === 0) {
			return NextResponse.json({ error: 'User not found' }, { status: 404 });
		}

		// Delete any credential accounts with NULL passwords for this user
		const deletedAccounts = await db.delete(account)
			.where(
				and(
					eq(account.userId, userRecord[0].id),
					eq(account.providerId, 'credential')
				)
			)
			.returning();

		return NextResponse.json({
			success: true,
			email,
			deletedAccounts: deletedAccounts.length,
			message: `Deleted ${deletedAccounts.length} credential accounts. User can now sign up again.`
		});
	} catch (error) {
		console.error('Fix account error:', error);
		return NextResponse.json({
			error: 'Failed to fix account',
			message: error instanceof Error ? error.message : 'Unknown error'
		}, { status: 500 });
	}
} 
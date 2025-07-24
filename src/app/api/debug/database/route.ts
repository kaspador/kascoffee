import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { user, account, session } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export async function GET(request: NextRequest) {
	try {
		// Check if we can connect to database
		const userCount = await db.select().from(user).limit(5);
		const accountCount = await db.select().from(account).limit(5);
		const sessionCount = await db.select().from(session).limit(5);

		// Check for a specific email (sanitized for security)
		const email = request.nextUrl.searchParams.get('email');
		let specificUser = null;
		let specificAccounts: Array<{
			id: string;
			providerId: string;
			accountId: string;
			userId: string;
			hasPassword: string;
			createdAt: Date | null;
		}> = [];

		if (email) {
			specificUser = await db.select({
				id: user.id,
				email: user.email,
				name: user.name,
				emailVerified: user.emailVerified,
				createdAt: user.createdAt
			}).from(user).where(eq(user.email, email)).limit(1);

			if (specificUser.length > 0) {
				const rawAccounts = await db.select().from(account).where(eq(account.userId, specificUser[0].id));
				
				specificAccounts = rawAccounts.map(acc => ({
					id: acc.id,
					providerId: acc.providerId,
					accountId: acc.accountId,
					userId: acc.userId,
					hasPassword: acc.password ? 'yes' : 'no',
					createdAt: acc.createdAt
				}));
			}
		}

		return NextResponse.json({
			database: {
				connected: true,
				userTableCount: userCount.length,
				accountTableCount: accountCount.length,
				sessionTableCount: sessionCount.length
			},
			query: email ? {
				email,
				userExists: specificUser && specificUser.length > 0,
				userDetails: specificUser?.[0] || null,
				accountCount: specificAccounts.length,
				accountTypes: specificAccounts.map(acc => acc.providerId)
			} : null,
			sampleUsers: userCount.map(u => ({
				id: u.id,
				email: u.email,
				name: u.name,
				createdAt: u.createdAt
			}))
		});
	} catch (error) {
		console.error('Database debug error:', error);
		return NextResponse.json({
			error: 'Database debug failed',
			message: error instanceof Error ? error.message : 'Unknown error',
			connected: false
		}, { status: 500 });
	}
} 
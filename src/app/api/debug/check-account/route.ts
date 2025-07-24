import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { user, account } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export async function GET(request: NextRequest) {
	try {
		const email = request.nextUrl.searchParams.get('email');
		
		if (!email) {
			return NextResponse.json({ error: 'Email parameter required' }, { status: 400 });
		}

		// Check if user exists
		const userRecord = await db.select({
			id: user.id,
			email: user.email,
			name: user.name,
			emailVerified: user.emailVerified,
			createdAt: user.createdAt
		}).from(user).where(eq(user.email, email)).limit(1);

		if (userRecord.length === 0) {
			return NextResponse.json({
				email,
				userExists: false,
				message: 'User not found'
			});
		}

		// Check accounts for this user
		const rawAccounts = await db.select({
			id: account.id,
			providerId: account.providerId,
			accountId: account.accountId,
			password: account.password,
			createdAt: account.createdAt
		}).from(account).where(eq(account.userId, userRecord[0].id));

		const userAccounts = rawAccounts.map(acc => ({
			id: acc.id,
			providerId: acc.providerId,
			accountId: acc.accountId,
			hasPassword: acc.password ? 'yes' : 'no',
			passwordLength: acc.password ? String(acc.password.length) : '0',
			createdAt: acc.createdAt
		}));

		return NextResponse.json({
			email,
			userExists: true,
			user: userRecord[0],
			accounts: userAccounts,
			accountCount: userAccounts.length,
			credentialAccount: userAccounts.find(acc => acc.providerId === 'credential'),
			issue: userAccounts.length === 0 ? 'No accounts found' : 
				  !userAccounts.find(acc => acc.providerId === 'credential') ? 'No credential account' :
				  userAccounts.find(acc => acc.providerId === 'credential')?.hasPassword === 'no' ? 'Password is NULL' : 'Unknown'
		});
	} catch (error) {
		console.error('Debug account check error:', error);
		return NextResponse.json({
			error: 'Debug failed',
			message: error instanceof Error ? error.message : 'Unknown error'
		}, { status: 500 });
	}
} 
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { account } from '@/lib/db/schema';
import { randomUUID } from 'crypto';

export async function POST(request: NextRequest) {
	try {
		const { userId, email, password = "test-password-hash" } = await request.json();
		
		if (!userId || !email) {
			return NextResponse.json({ error: 'userId and email required' }, { status: 400 });
		}

		// Try to create a credential account manually
		const newAccount = await db.insert(account).values({
			id: randomUUID(),
			providerId: 'credential',
			accountId: email,
			userId: userId,
			password: password, // In real scenario this would be hashed
			createdAt: new Date(),
			updatedAt: new Date()
		}).returning();

		return NextResponse.json({
			success: true,
			message: 'Test credential account created successfully',
			account: {
				id: newAccount[0].id,
				providerId: newAccount[0].providerId,
				accountId: newAccount[0].accountId,
				userId: newAccount[0].userId,
				hasPassword: !!newAccount[0].password
			}
		});
	} catch (error) {
		console.error('Test account creation error:', error);
		return NextResponse.json({
			success: false,
			error: 'Failed to create test account',
			message: error instanceof Error ? error.message : 'Unknown error',
			details: error
		}, { status: 500 });
	}
} 
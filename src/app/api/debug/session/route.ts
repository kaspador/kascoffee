import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';

export async function GET(request: NextRequest) {
	try {
		const session = await auth.api.getSession({
			headers: request.headers
		});

		const cookies = request.headers.get('cookie');
		
		return NextResponse.json({
			session: {
				exists: !!session,
				user: session?.user ? {
					id: session.user.id,
					email: session.user.email,
					name: session.user.name
				} : null,
				sessionId: session?.session?.id,
				expiresAt: session?.session?.expiresAt
			},
			cookies: cookies ? 'present' : 'missing',
			headers: {
				userAgent: request.headers.get('user-agent'),
				host: request.headers.get('host'),
				origin: request.headers.get('origin')
			}
		});
	} catch (error) {
		console.error('Debug session error:', error);
		return NextResponse.json({
			error: 'Session debug failed',
			message: error instanceof Error ? error.message : 'Unknown error'
		}, { status: 500 });
	}
} 
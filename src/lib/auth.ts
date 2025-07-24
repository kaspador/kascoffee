import 'server-only';

import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { db } from '@/lib/db';
import * as schema from '@/lib/db/schema';

export const auth = betterAuth({
	database: drizzleAdapter(db, {
		provider: 'pg',
		// Use Better Auth's exact schema requirements
		schema: {
			user: schema.user,
			session: schema.session,
			account: schema.account,
			verification: schema.verification
		}
	}),
	secret: process.env.BETTER_AUTH_SECRET || process.env.AUTH_SECRET || 'fallback-secret-for-development-only-not-for-production',
	baseURL: process.env.BETTER_AUTH_URL || (typeof window !== 'undefined' ? window.location.origin : 'https://kas.coffee'),
	trustedOrigins: [
		'http://localhost:3000', 
		'http://localhost:3001',
		'https://kas.coffee',
		'https://*.kas.coffee'
	],
	session: {
		expiresIn: 60 * 60 * 24 * 7, // 7 days
		updateAge: 60 * 60 * 24 // 1 day
	},
	emailAndPassword: {
		enabled: true,
		requireEmailVerification: false, // Disable for development
		minPasswordLength: 6,
		maxPasswordLength: 128
	},
	socialProviders: {
		github: {
			clientId: process.env.GITHUB_CLIENT_ID || '',
			clientSecret: process.env.GITHUB_CLIENT_SECRET || ''
		},
		google: {
			clientId: process.env.GOOGLE_CLIENT_ID || '',
			clientSecret: process.env.GOOGLE_CLIENT_SECRET || ''
		}
	},
	logger: {
		level: 'error'
	},
	rateLimit: {
		enabled: true,
		window: 60,
		max: 100
	}
});

export type Session = typeof auth.$Infer.Session; 
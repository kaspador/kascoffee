import 'server-only';

import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { db } from '@/lib/db';
import * as schema from '@/lib/db/schema';

export const auth = betterAuth({
	database: drizzleAdapter(db, {
		provider: 'pg',
		schema: {
			user: schema.users,
			session: schema.sessions,
			account: schema.accounts
		}
	}),
	secret: process.env.BETTER_AUTH_SECRET || 'fallback-secret-for-development',
	baseURL: process.env.BETTER_AUTH_URL || 'https://kas.coffee',
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
		requireEmailVerification: false // Disable for development
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
	}
});

export type Session = typeof auth.$Infer.Session; 
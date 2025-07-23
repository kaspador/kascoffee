import 'server-only';

import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { github, google, twitter } from 'better-auth/plugins/oauth';
import { db } from './db';
import * as schema from './db/schema';

export const auth = betterAuth({
	database: drizzleAdapter(db, {
		provider: 'pg',
		schema: {
			user: schema.users,
			session: schema.sessions,
			account: schema.accounts
		}
	}),
	plugins: [
		google({
			clientId: process.env.GOOGLE_CLIENT_ID!,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET!
		}),
		github({
			clientId: process.env.GITHUB_CLIENT_ID!,
			clientSecret: process.env.GITHUB_CLIENT_SECRET!
		}),
		twitter({
			clientId: process.env.TWITTER_CLIENT_ID!,
			clientSecret: process.env.TWITTER_CLIENT_SECRET!
		})
	],
	session: {
		expiresIn: 60 * 60 * 24 * 7, // 7 days
		updateAge: 60 * 60 * 24 // 1 day
	},
	user: {
		additionalFields: {
			handle: {
				type: 'string',
				required: false,
				unique: true
			}
		}
	}
});

export type Session = typeof auth.$Infer.Session; 
import 'server-only';

import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { db } from '@/lib/db';
import * as schema from '@/lib/db/schema';
import { Resend } from 'resend';

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
	baseURL: process.env.BETTER_AUTH_URL || 'https://kas.coffee',
	trustedOrigins: [
		'http://localhost:3000', 
		'http://localhost:3001',
		'https://kas.coffee',
		'https://*.kas.coffee'
	],
	session: {
		expiresIn: 60 * 60 * 24 * 7, // 7 days
		updateAge: 60 * 60 * 24, // 1 day
		cookieCache: {
			enabled: true,
			maxAge: 60 * 5 // 5 minutes
		}
	},
	emailAndPassword: {
		enabled: true,
		requireEmailVerification: false, // Disable for development
		minPasswordLength: 6,
		maxPasswordLength: 128,
		sendResetPassword: async ({ user, url }) => {
			const resend = new Resend(process.env.RESEND_API_KEY);
			
			try {
				await resend.emails.send({
					from: 'kas.coffee <noreply@kas.coffee>',
					to: user.email,
					subject: 'Reset your kas.coffee password',
					html: `
						<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
							<div style="text-align: center; margin-bottom: 30px;">
								<h1 style="color: #70C7BA; font-size: 28px; margin: 0;">kas.coffee</h1>
								<p style="color: #666; margin: 5px 0;">Your Kaspa donation platform</p>
							</div>
							
							<div style="background: #f8f9fa; padding: 30px; border-radius: 10px; border-left: 4px solid #70C7BA;">
								<h2 style="color: #333; margin-bottom: 20px;">Reset Your Password</h2>
								<p style="color: #666; line-height: 1.6; margin-bottom: 25px;">
									Hi ${user.name || 'there'},<br><br>
									You requested to reset your password for your kas.coffee account. Click the button below to create a new password:
								</p>
								
								<div style="text-align: center; margin: 30px 0;">
									<a href="${url}" 
									   style="background: linear-gradient(135deg, #70C7BA 0%, #49EACB 100%); 
									          color: white; 
									          padding: 14px 30px; 
									          text-decoration: none; 
									          border-radius: 8px; 
									          font-weight: bold;
									          display: inline-block;">
										Reset Password
									</a>
								</div>
								
								<p style="color: #666; font-size: 14px; line-height: 1.6;">
									If you didn't request a password reset, you can safely ignore this email. This link will expire in 1 hour for security reasons.
								</p>
								
								<p style="color: #666; font-size: 14px; line-height: 1.6; margin-top: 20px;">
									For security, you can also copy and paste this link into your browser:<br>
									<span style="word-break: break-all; color: #70C7BA;">${url}</span>
								</p>
							</div>
							
							<div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
								<p style="color: #999; font-size: 12px;">
									This email was sent by kas.coffee. If you have questions, please contact our support team.
								</p>
							</div>
						</div>
					`
				});
			} catch (error) {
				console.error('Failed to send password reset email:', error);
				throw new Error('Failed to send password reset email');
			}
		}
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
	},
	advanced: {
		useSecureCookies: process.env.NODE_ENV === 'production',
		crossSubDomainCookies: {
			enabled: false // Keep disabled unless you need subdomain support
		}
	}
});

export type Session = typeof auth.$Infer.Session; 
import { createAuthClient } from 'better-auth/react';

const authClient = createAuthClient({
	baseURL: typeof window !== 'undefined' 
		? window.location.origin 
		: process.env.BETTER_AUTH_URL || 'https://kas.coffee'
});

export const { 
	signIn, 
	signOut, 
	signUp, 
	useSession, 
	getSession,
	resetPassword
} = authClient;

// Access forgetPassword directly from authClient for password reset requests
export const { forgetPassword } = authClient;
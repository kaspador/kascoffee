import { createAuthClient } from 'better-auth/react';

export const { 
	signIn, 
	signOut, 
	signUp, 
	useSession, 
	getSession,
	forgetPassword,
	resetPassword
} = createAuthClient({
	baseURL: typeof window !== 'undefined' 
		? window.location.origin 
		: process.env.BETTER_AUTH_URL || 'https://kas.coffee'
}); 
import { createAuthClient } from 'better-auth/react';

export const { 
	signIn, 
	signOut, 
	signUp, 
	useSession, 
	getSession 
} = createAuthClient({
	baseURL: process.env.BETTER_AUTH_URL || 'http://localhost:3000'
}); 
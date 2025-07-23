'use client';

import { useState } from 'react';
import { signIn } from '@/lib/auth-client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { FaGoogle, FaGithub, FaTwitter } from 'react-icons/fa';
import { Coffee, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const signInSchema = z.object({
	email: z.string().email('Please enter a valid email address'),
	password: z.string().min(6, 'Password must be at least 6 characters')
});

type SignInFormData = z.infer<typeof signInSchema>;

export default function SignInPage() {
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const router = useRouter();

	const {
		register,
		handleSubmit,
		formState: { errors }
	} = useForm<SignInFormData>({
		resolver: zodResolver(signInSchema)
	});

	const handleOAuthSignIn = async (provider: 'google' | 'github' | 'twitter') => {
		try {
			setIsLoading(true);
			setError(null);
			await signIn.social({
				provider,
				callbackURL: '/dashboard'
			});
		} catch (err) {
			setError('Failed to sign in. Please try again.');
			console.error('OAuth sign in error:', err);
		} finally {
			setIsLoading(false);
		}
	};

	const onSubmit = async (data: SignInFormData) => {
		try {
			setIsLoading(true);
			setError(null);
			
			const result = await signIn.email({
				email: data.email,
				password: data.password,
				callbackURL: '/dashboard'
			});

			if (result.error) {
				setError(result.error.message || 'Failed to sign in');
				return;
			}

			router.push('/dashboard');
		} catch (err) {
			setError('Failed to sign in. Please check your credentials.');
			console.error('Email sign in error:', err);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-950 dark:to-amber-950">
			<div className="w-full max-w-md space-y-6">
				<div className="text-center">
					<Link href="/" className="inline-flex items-center gap-2 text-2xl font-bold">
						<Coffee className="h-8 w-8" />
						kas.coffee
					</Link>
					<p className="text-muted-foreground mt-2">Welcome back! Sign in to your account</p>
				</div>

				<Card>
					<CardHeader>
						<CardTitle className="text-center">Sign In</CardTitle>
					</CardHeader>
					<CardContent className="space-y-4">
						{error && (
							<div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md dark:bg-red-950 dark:text-red-400 dark:border-red-800">
								{error}
							</div>
						)}

						{/* OAuth Providers */}
						<div className="grid gap-2">
							<Button
								variant="outline"
								onClick={() => handleOAuthSignIn('google')}
								disabled={isLoading}
								className="w-full"
							>
								<FaGoogle className="mr-2 h-4 w-4" />
								Continue with Google
							</Button>
							<Button
								variant="outline"
								onClick={() => handleOAuthSignIn('github')}
								disabled={isLoading}
								className="w-full"
							>
								<FaGithub className="mr-2 h-4 w-4" />
								Continue with GitHub
							</Button>
							<Button
								variant="outline"
								onClick={() => handleOAuthSignIn('twitter')}
								disabled={isLoading}
								className="w-full"
							>
								<FaTwitter className="mr-2 h-4 w-4" />
								Continue with X
							</Button>
						</div>

						<div className="relative">
							<div className="absolute inset-0 flex items-center">
								<Separator />
							</div>
							<div className="relative flex justify-center text-xs uppercase">
								<span className="bg-background px-2 text-muted-foreground">Or continue with</span>
							</div>
						</div>

						{/* Email/Password Form */}
						<form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
							<div className="space-y-2">
								<Label htmlFor="email">Email</Label>
								<Input
									id="email"
									type="email"
									placeholder="Enter your email"
									{...register('email')}
									disabled={isLoading}
								/>
								{errors.email && (
									<p className="text-sm text-red-600">{errors.email.message}</p>
								)}
							</div>

							<div className="space-y-2">
								<Label htmlFor="password">Password</Label>
								<Input
									id="password"
									type="password"
									placeholder="Enter your password"
									{...register('password')}
									disabled={isLoading}
								/>
								{errors.password && (
									<p className="text-sm text-red-600">{errors.password.message}</p>
								)}
							</div>

							<Button type="submit" className="w-full" disabled={isLoading}>
								{isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
								Sign In
							</Button>
						</form>

						<div className="text-center text-sm">
							<span className="text-muted-foreground">Don't have an account? </span>
							<Link href="/auth/signup" className="text-primary hover:underline">
								Sign up
							</Link>
						</div>
					</CardContent>
				</Card>

				<p className="text-center text-xs text-muted-foreground">
					By signing in, you agree to our{' '}
					<Link href="/terms" className="hover:underline">
						Terms of Service
					</Link>{' '}
					and{' '}
					<Link href="/privacy" className="hover:underline">
						Privacy Policy
					</Link>
				</p>
			</div>
		</div>
	);
} 
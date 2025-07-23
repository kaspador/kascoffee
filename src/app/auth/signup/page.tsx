'use client';

import { useState } from 'react';
import { signIn, signUp } from '@/lib/auth-client';
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

const signUpSchema = z.object({
	name: z.string().min(2, 'Name must be at least 2 characters'),
	email: z.string().email('Please enter a valid email address'),
	password: z.string().min(6, 'Password must be at least 6 characters'),
	confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
	message: "Passwords don't match",
	path: ["confirmPassword"]
});

type SignUpFormData = z.infer<typeof signUpSchema>;

export default function SignUpPage() {
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [success, setSuccess] = useState(false);
	const router = useRouter();

	const {
		register,
		handleSubmit,
		formState: { errors }
	} = useForm<SignUpFormData>({
		resolver: zodResolver(signUpSchema)
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

	const onSubmit = async (data: SignUpFormData) => {
		try {
			setIsLoading(true);
			setError(null);
			
			const result = await signUp.email({
				email: data.email,
				password: data.password,
				name: data.name,
				callbackURL: '/dashboard'
			});

			if (result.error) {
				setError(result.error.message || 'Failed to create account');
				return;
			}

			setSuccess(true);
			// Optional: Auto-redirect after successful registration
			setTimeout(() => {
				router.push('/dashboard');
			}, 2000);
		} catch (err) {
			setError('Failed to create account. Please try again.');
			console.error('Email sign up error:', err);
		} finally {
			setIsLoading(false);
		}
	};

	if (success) {
		return (
			<div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-950 dark:to-amber-950">
				<Card className="w-full max-w-md">
					<CardContent className="text-center py-8">
						<div className="text-6xl mb-4">🎉</div>
						<h2 className="text-2xl font-bold mb-2">Welcome to kas.coffee!</h2>
						<p className="text-muted-foreground mb-4">
							Your account has been created successfully. Redirecting to your dashboard...
						</p>
						<Button asChild>
							<Link href="/dashboard">Go to Dashboard</Link>
						</Button>
					</CardContent>
				</Card>
			</div>
		);
	}

	return (
		<div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-950 dark:to-amber-950">
			<div className="w-full max-w-md space-y-6">
				<div className="text-center">
					<Link href="/" className="inline-flex items-center gap-2 text-2xl font-bold">
						<Coffee className="h-8 w-8" />
						kas.coffee
					</Link>
					<p className="text-muted-foreground mt-2">Create your account and start receiving support</p>
				</div>

				<Card>
					<CardHeader>
						<CardTitle className="text-center">Create Account</CardTitle>
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
								<Label htmlFor="name">Full Name</Label>
								<Input
									id="name"
									type="text"
									placeholder="Enter your full name"
									{...register('name')}
									disabled={isLoading}
								/>
								{errors.name && (
									<p className="text-sm text-red-600">{errors.name.message}</p>
								)}
							</div>

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

							<div className="space-y-2">
								<Label htmlFor="confirmPassword">Confirm Password</Label>
								<Input
									id="confirmPassword"
									type="password"
									placeholder="Confirm your password"
									{...register('confirmPassword')}
									disabled={isLoading}
								/>
								{errors.confirmPassword && (
									<p className="text-sm text-red-600">{errors.confirmPassword.message}</p>
								)}
							</div>

							<Button type="submit" className="w-full" disabled={isLoading}>
								{isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
								Create Account
							</Button>
						</form>

						<div className="text-center text-sm">
							<span className="text-muted-foreground">Already have an account? </span>
							<Link href="/auth/signin" className="text-primary hover:underline">
								Sign in
							</Link>
						</div>
					</CardContent>
				</Card>

				<p className="text-center text-xs text-muted-foreground">
					By creating an account, you agree to our{' '}
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
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Coffee, Mail, Lock, User, ArrowLeft, AlertCircle } from "lucide-react";
// Removed Better Auth import - now using Directus API

export default function SignUpPage() {
	const [isLoading, setIsLoading] = useState(false);
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");
	const router = useRouter();

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError("");
		setIsLoading(true);

		try {
			const [firstName, ...lastNameParts] = name.split(' ');
			const lastName = lastNameParts.join(' ');

			const response = await fetch('/api/auth/register', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					email,
					password,
					first_name: firstName,
					last_name: lastName,
				}),
			});

			const data = await response.json();

			if (!response.ok) {
				throw new Error(data.error || 'Registration failed');
			}

			// Always redirect to onboarding for new users (whether auto-login worked or not)
			// The onboarding page will handle authentication check
			console.log('Registration successful, redirecting to onboarding. Auto-login:', data.autoLogin);
			router.push('/onboarding');
		} catch (error: unknown) {
			console.error('Registration error:', error);
			setError(error instanceof Error ? error.message : 'Registration failed');
		} finally {
			setIsLoading(false);
		}
	};

	// Social auth functions removed - focusing on Directus email authentication

	return (
		<div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 relative overflow-hidden flex items-center justify-center p-6">
			{/* Animated background */}
			<div className="absolute inset-0 bg-gradient-to-r from-[#70C7BA]/10 via-[#49EACB]/10 to-[#70C7BA]/10 animate-pulse"></div>
			<div className="absolute top-20 left-20 w-72 h-72 bg-[#70C7BA]/20 rounded-full blur-3xl animate-pulse"></div>
			<div className="absolute bottom-20 right-20 w-96 h-96 bg-[#49EACB]/20 rounded-full blur-3xl animate-pulse delay-1000"></div>

			<div className="relative z-10 w-full max-w-md">
				{/* Back to home */}
				<div className="mb-8">
					<Button variant="ghost" asChild className="text-white/80 hover:text-[#70C7BA] hover:bg-[#70C7BA]/10 rounded-full">
						<Link href="/" className="flex items-center gap-2">
							<ArrowLeft className="w-4 h-4" />
							Back to Home
						</Link>
					</Button>
				</div>

				<Card className="bg-white/5 backdrop-blur-xl border border-white/20 shadow-2xl">
					<CardHeader className="text-center space-y-4">
						{/* Logo */}
						<div className="flex items-center justify-center gap-3 mb-4">
							<div className="relative">
								<Coffee className="h-10 w-10 text-[#70C7BA]" />
								<div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-[#49EACB] to-[#70C7BA] rounded-full animate-pulse"></div>
							</div>
							<span className="text-2xl font-bold bg-gradient-to-r from-[#70C7BA] to-[#49EACB] bg-clip-text text-transparent">
								kas.coffee
							</span>
						</div>
						
						<CardTitle className="text-2xl font-bold text-white">Create Your Account</CardTitle>
						<CardDescription className="text-gray-400">
							Start accepting Kaspa donations with your personalized page
						</CardDescription>
					</CardHeader>

					<CardContent className="space-y-6">
						{/* Error Message */}
						{error && (
							<div className="bg-red-500/10 border border-red-500/30 rounded-xl p-3 flex items-center gap-2">
								<AlertCircle className="w-4 h-4 text-red-400" />
								<span className="text-red-400 text-sm">{error}</span>
							</div>
						)}

						{/* Note: Social login disabled for now - focusing on Directus email auth */}

						{/* Email/Password Form */}
						<form className="space-y-4" onSubmit={handleSubmit}>
							<div className="space-y-2">
								<Label htmlFor="name" className="text-white font-medium">Full Name</Label>
								<div className="relative">
									<User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
									<Input
										id="name"
										placeholder="Enter your full name"
										value={name}
										onChange={(e) => setName(e.target.value)}
										className="pl-10 bg-white/5 border-white/20 text-white placeholder:text-gray-400 rounded-xl h-12 focus:border-[#70C7BA] focus:ring-[#70C7BA]"
										required
										disabled={isLoading}
									/>
								</div>
							</div>

							<div className="space-y-2">
								<Label htmlFor="email" className="text-white font-medium">Email</Label>
								<div className="relative">
									<Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
									<Input
										id="email"
										type="email"
										placeholder="Enter your email"
										value={email}
										onChange={(e) => setEmail(e.target.value)}
										className="pl-10 bg-white/5 border-white/20 text-white placeholder:text-gray-400 rounded-xl h-12 focus:border-[#70C7BA] focus:ring-[#70C7BA]"
										required
										disabled={isLoading}
									/>
								</div>
							</div>

							<div className="space-y-2">
								<Label htmlFor="password" className="text-white font-medium">Password</Label>
								<div className="relative">
									<Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
									<Input
										id="password"
										type="password"
										placeholder="Create a password"
										value={password}
										onChange={(e) => setPassword(e.target.value)}
										className="pl-10 bg-white/5 border-white/20 text-white placeholder:text-gray-400 rounded-xl h-12 focus:border-[#70C7BA] focus:ring-[#70C7BA]"
										required
										minLength={6}
										disabled={isLoading}
									/>
								</div>
							</div>

							<Button
								type="submit"
								className="w-full bg-gradient-to-r from-[#70C7BA] to-[#49EACB] hover:from-[#49EACB] hover:to-[#70C7BA] text-white font-semibold rounded-xl h-12 shadow-lg hover:shadow-[#70C7BA]/25 transition-all duration-300"
								disabled={isLoading || !name || !email || !password}
							>
								{isLoading ? "Creating Account..." : "Create Account"}
							</Button>
						</form>

						<div className="text-center">
							<p className="text-gray-400 text-sm">
								Already have an account?{" "}
								<Link href="/auth/signin" className="text-[#70C7BA] hover:text-[#49EACB] font-medium transition-colors">
									Sign in here
								</Link>
							</p>
						</div>

						<div className="text-center text-xs text-gray-500">
							By creating an account, you agree to our{" "}
							<Link href="/terms" className="text-[#70C7BA] hover:underline">Terms of Service</Link>
							{" "}and{" "}
							<Link href="/privacy" className="text-[#70C7BA] hover:underline">Privacy Policy</Link>
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	);
} 
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Coffee, Mail, Lock, ArrowLeft, Github, AlertCircle } from "lucide-react";
import { FaGoogle } from "react-icons/fa";

// Mock user data for demo
const DEMO_USERS = [
	{
		email: "demo@kas.coffee",
		password: "demo123",
		name: "Demo User",
		id: "demo-user-1"
	},
	{
		email: "test@example.com",
		password: "password",
		name: "Test User", 
		id: "test-user-1"
	}
];

export default function SignInPage() {
	const [isLoading, setIsLoading] = useState(false);
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");
	const router = useRouter();

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError("");
		setIsLoading(true);

		// Simulate API delay
		await new Promise(resolve => setTimeout(resolve, 1000));

		try {
			// Mock authentication logic
			const user = DEMO_USERS.find(u => u.email === email && u.password === password);
			
			if (!user) {
				setError("Invalid email or password");
				return;
			}

			// Store mock session in localStorage
			const mockSession = {
				user: {
					id: user.id,
					email: user.email,
					name: user.name,
					image: null
				},
				expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() // 7 days
			};
			
			localStorage.setItem('kas-coffee-session', JSON.stringify(mockSession));
			
			// Redirect to dashboard on successful login
			router.push("/dashboard");
		} catch (err) {
			setError("An unexpected error occurred. Please try again.");
			console.error("Sign in error:", err);
		} finally {
			setIsLoading(false);
		}
	};

	const handleGoogleSignIn = async () => {
		setIsLoading(true);
		try {
			// Mock Google login
			await new Promise(resolve => setTimeout(resolve, 1500));
			
			const mockSession = {
				user: {
					id: "google-user-1",
					email: "google@example.com",
					name: "Google User",
					image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face"
				},
				expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
			};
			
			localStorage.setItem('kas-coffee-session', JSON.stringify(mockSession));
			router.push("/dashboard");
		} catch (err) {
			setError("Failed to sign in with Google");
			console.error("Google sign in error:", err);
		} finally {
			setIsLoading(false);
		}
	};

	const handleGithubSignIn = async () => {
		setIsLoading(true);
		try {
			// Mock GitHub login
			await new Promise(resolve => setTimeout(resolve, 1500));
			
			const mockSession = {
				user: {
					id: "github-user-1",
					email: "github@example.com",
					name: "GitHub User",
					image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=32&h=32&fit=crop&crop=face"
				},
				expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
			};
			
			localStorage.setItem('kas-coffee-session', JSON.stringify(mockSession));
			router.push("/dashboard");
		} catch (err) {
			setError("Failed to sign in with GitHub");
			console.error("GitHub sign in error:", err);
		} finally {
			setIsLoading(false);
		}
	};

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
						
						<CardTitle className="text-2xl font-bold text-white">Welcome Back</CardTitle>
						<CardDescription className="text-gray-400">
							Sign in to manage your donation page
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

						{/* Social Login Buttons */}
						<div className="space-y-3">
							<Button
								variant="outline"
								className="w-full border-white/20 bg-white/5 hover:bg-white/10 text-white rounded-xl h-12"
								disabled={isLoading}
								onClick={handleGoogleSignIn}
							>
								<FaGoogle className="w-5 h-5 mr-3" />
								Continue with Google
							</Button>
							<Button
								variant="outline"
								className="w-full border-white/20 bg-white/5 hover:bg-white/10 text-white rounded-xl h-12"
								disabled={isLoading}
								onClick={handleGithubSignIn}
							>
								<Github className="w-5 h-5 mr-3" />
								Continue with GitHub
							</Button>
						</div>

						<div className="relative">
							<div className="absolute inset-0 flex items-center">
								<Separator className="w-full bg-white/20" />
							</div>
							<div className="relative flex justify-center text-xs uppercase">
								<span className="bg-gradient-to-r from-slate-950 to-slate-900 px-2 text-gray-400">
									Or continue with email
								</span>
							</div>
						</div>

						{/* Email/Password Form */}
						<form className="space-y-4" onSubmit={handleSubmit}>
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
										placeholder="Enter your password"
										value={password}
										onChange={(e) => setPassword(e.target.value)}
										className="pl-10 bg-white/5 border-white/20 text-white placeholder:text-gray-400 rounded-xl h-12 focus:border-[#70C7BA] focus:ring-[#70C7BA]"
										required
										disabled={isLoading}
									/>
								</div>
							</div>

							<div className="flex items-center justify-between">
								<div className="text-sm">
									<Link href="/auth/forgot-password" className="text-[#70C7BA] hover:text-[#49EACB] transition-colors">
										Forgot password?
									</Link>
								</div>
							</div>

							<Button
								type="submit"
								className="w-full bg-gradient-to-r from-[#70C7BA] to-[#49EACB] hover:from-[#49EACB] hover:to-[#70C7BA] text-white font-semibold rounded-xl h-12 shadow-lg hover:shadow-[#70C7BA]/25 transition-all duration-300"
								disabled={isLoading || !email || !password}
							>
								{isLoading ? "Signing In..." : "Sign In"}
							</Button>
						</form>

						{/* Demo Account Info */}
						<div className="bg-[#70C7BA]/10 border border-[#70C7BA]/30 rounded-xl p-4">
							<h4 className="text-[#70C7BA] font-semibold text-sm mb-2">Demo Accounts</h4>
							<p className="text-gray-400 text-xs mb-2">Try the app with these credentials:</p>
							<div className="space-y-1 text-gray-300 text-xs">
								<p><strong>Email:</strong> demo@kas.coffee<br/><strong>Password:</strong> demo123</p>
								<p><strong>Email:</strong> test@example.com<br/><strong>Password:</strong> password</p>
							</div>
							<p className="text-gray-400 text-xs mt-2">Or try the social login buttons above!</p>
						</div>

						<div className="text-center">
							<p className="text-gray-400 text-sm">
								Don&apos;t have an account?{" "}
								<Link href="/auth/signup" className="text-[#70C7BA] hover:text-[#49EACB] font-medium transition-colors">
									Sign up here
								</Link>
							</p>
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	);
} 
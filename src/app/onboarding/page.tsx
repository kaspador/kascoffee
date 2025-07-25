'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Circle, Coffee, Palette, Link as LinkIcon, Rocket, ArrowLeft, User, Sparkles } from 'lucide-react';
import Link from 'next/link';

const onboardingSteps = [
	{
		id: 'profile',
		title: 'Set Up Your Profile',
		description: 'Choose your unique handle and add your Kaspa address',
		icon: User,
		href: '/dashboard?tab=profile'
	},
	{
		id: 'theme',
		title: 'Customize Your Page',
		description: 'Pick colors and design that represent your brand',
		icon: Palette,
		href: '/dashboard?tab=theme'
	},
	{
		id: 'social',
		title: 'Add Social Links',
		description: 'Connect your social media for more engagement',
		icon: LinkIcon,
		href: '/dashboard?tab=socials'
	}
];

interface AuthUser {
	id: string;
	email: string;
	first_name?: string;
	last_name?: string;
	name: string;
}

export default function OnboardingPage() {
	const [completedSteps, setCompletedSteps] = useState<string[]>([]);
	const [authUser, setAuthUser] = useState<AuthUser | null>(null);
	const [authLoading, setAuthLoading] = useState(true);
	const router = useRouter();

	// Check authentication on component mount
	useEffect(() => {
		const checkAuth = async () => {
			try {
				setAuthLoading(true);
				const response = await fetch('/api/auth/me', {
					credentials: 'include',
				});

				if (response.ok) {
					const data = await response.json();
					setAuthUser(data.user);
				} else {
					router.push('/auth/signin');
					return;
				}
			} catch (error) {
				console.error('Auth check failed:', error);
				router.push('/auth/signin');
				return;
			} finally {
				setAuthLoading(false);
			}
		};

		checkAuth();
	}, [router]);

	if (authLoading) {
		return (
			<div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
				<div className="text-center">
					<div className="w-16 h-16 border-4 border-[#70C7BA] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
					<p className="text-[#70C7BA] text-lg font-kaspa-header font-semibold">Loading...</p>
				</div>
			</div>
		);
	}

	if (!authUser) {
		return null;
	}

	const toggleStep = (stepId: string) => {
		setCompletedSteps(prev => 
			prev.includes(stepId) 
				? prev.filter(id => id !== stepId)
				: [...prev, stepId]
		);
	};

	const allStepsCompleted = completedSteps.length === onboardingSteps.length;

	return (
		<div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 relative overflow-hidden">
			{/* Animated background with Kaspa colors */}
			<div className="absolute inset-0 bg-gradient-to-r from-[#70C7BA]/5 via-[#49EACB]/5 to-[#70C7BA]/5 animate-pulse"></div>
			<div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#70C7BA]/10 rounded-full blur-3xl animate-bounce-gentle"></div>
			<div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#49EACB]/10 rounded-full blur-3xl animate-bounce-gentle delay-1000"></div>

			{/* Header */}
			<header className="relative z-10 border-b border-[#70C7BA]/20 bg-slate-900/80 backdrop-blur-xl">
				<div className="container mx-auto px-6 py-4">
					<div className="flex items-center justify-between">
						<Link href="/" className="flex items-center gap-3 font-kaspa-header font-bold text-xl group">
							<div className="relative coffee-container">
								<Coffee className="h-8 w-8 text-[#70C7BA] coffee-icon group-hover:text-[#49EACB] transition-all duration-300" />
								<div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-[#49EACB] to-[#70C7BA] rounded-full animate-pulse"></div>
							</div>
							<span className="bg-gradient-to-r from-[#70C7BA] to-[#49EACB] bg-clip-text text-transparent">
								kas.coffee
							</span>
						</Link>
						<div className="flex items-center gap-4">
							<Button variant="ghost" asChild className="text-gray-400 hover:text-white hover:bg-white/10 rounded-full font-kaspa-body transition-all duration-300">
								<Link href="/dashboard" className="flex items-center gap-2">
									<ArrowLeft className="w-4 h-4" />
									<span className="hidden md:inline">Dashboard</span>
								</Link>
							</Button>
						</div>
					</div>
				</div>
			</header>

			{/* Main Content */}
			<main className="relative z-10 container mx-auto px-6 py-16">
				<div className="max-w-2xl mx-auto space-y-8">
					{/* Header */}
					<div className="text-center space-y-6">
						<div className="inline-flex items-center gap-3 bg-gradient-to-r from-[#70C7BA]/20 to-[#49EACB]/20 backdrop-blur-xl border border-[#70C7BA]/30 rounded-full px-6 py-3 mb-6">
							<Sparkles className="w-5 h-5 text-[#49EACB]" />
							<span className="text-[#70C7BA] font-kaspa-subheader font-bold text-sm">WELCOME</span>
						</div>
						<div className="text-6xl mb-4">🎉</div>
						<h1 className="text-4xl md:text-5xl font-kaspa-header font-black text-white mb-4">
							Welcome to <span className="bg-gradient-to-r from-[#70C7BA] to-[#49EACB] bg-clip-text text-transparent">kas.coffee</span>!
						</h1>
						<p className="text-gray-300 text-lg font-kaspa-body max-w-xl mx-auto leading-relaxed">
							Let&apos;s set up your personalized donation page. Follow these steps to get started and begin receiving Kaspa donations
						</p>
					</div>

					{/* Progress */}
					<div className="flex items-center justify-center gap-2">
						<Badge className="bg-gradient-to-r from-[#70C7BA]/20 to-[#49EACB]/20 text-[#70C7BA] border-[#70C7BA]/30 backdrop-blur-xl font-kaspa-subheader font-bold">
							{completedSteps.length}/{onboardingSteps.length} Complete
						</Badge>
					</div>

					{/* Steps */}
					<div className="space-y-4">
						{onboardingSteps.map((step, index) => {
							const isCompleted = completedSteps.includes(step.id);
							const Icon = step.icon;

							return (
								<Card key={step.id} className={`transition-all duration-300 ${
									isCompleted 
										? 'bg-gradient-to-r from-[#70C7BA]/15 to-[#49EACB]/10 border-[#70C7BA]/40 shadow-lg hover:shadow-[#70C7BA]/20' 
										: 'bg-white/5 border-white/20 hover:border-[#70C7BA]/30 hover:bg-white/10'
								} backdrop-blur-xl shadow-xl`}>
									<CardContent className="p-6">
										<div className="flex items-center justify-between">
											<div className="flex items-center gap-4">
												<div className="flex items-center gap-3">
													<button
														onClick={() => toggleStep(step.id)}
														className="text-[#70C7BA] hover:text-[#49EACB] transition-colors"
													>
														{isCompleted ? (
															<CheckCircle className="h-6 w-6" />
														) : (
															<Circle className="h-6 w-6" />
														)}
													</button>
													<div className={`p-3 rounded-2xl transition-all duration-300 ${
														isCompleted 
															? 'bg-[#70C7BA]/20' 
															: 'bg-slate-700/50'
													}`}>
														<Icon className={`h-6 w-6 ${
															isCompleted 
																? 'text-[#70C7BA]' 
																: 'text-gray-400'
														}`} />
													</div>
												</div>
												<div>
													<h3 className="font-kaspa-header font-bold text-white text-lg">
														{index + 1}. {step.title}
													</h3>
													<p className="text-gray-400 font-kaspa-body">
														{step.description}
													</p>
												</div>
											</div>
											<Button 
												asChild 
												className={`${
													isCompleted 
														? 'bg-slate-700/50 hover:bg-slate-700/70 text-gray-300' 
														: 'bg-gradient-to-r from-[#70C7BA] to-[#49EACB] hover:from-[#5ba8a0] hover:to-[#3dd4b4] text-white shadow-lg hover:shadow-[#70C7BA]/25'
												} font-kaspa-subheader font-bold rounded-xl transition-all duration-300`}
											>
												<Link href={step.href}>
													{isCompleted ? 'Edit' : 'Set Up'}
												</Link>
											</Button>
										</div>
									</CardContent>
								</Card>
							);
						})}
					</div>

					{/* Completion CTA */}
					{allStepsCompleted && (
						<Card className="bg-gradient-to-r from-[#70C7BA] to-[#49EACB] border-0 shadow-2xl">
							<CardContent className="text-center py-12">
								<Rocket className="h-16 w-16 mx-auto mb-6 text-white" />
								<h2 className="text-3xl font-kaspa-header font-black mb-4 text-white">You&apos;re All Set! 🚀</h2>
								<p className="mb-8 text-white/90 text-lg font-kaspa-body max-w-md mx-auto">
									Your kas.coffee page is ready! Share your unique link with supporters and start receiving donations.
								</p>
								<div className="flex flex-col sm:flex-row gap-4 justify-center">
									<Button 
										asChild 
										size="lg" 
										className="bg-white/20 hover:bg-white/30 text-white border border-white/30 backdrop-blur-sm font-kaspa-subheader font-bold rounded-xl shadow-lg transition-all duration-300"
									>
										<Link href="/dashboard">
											Go to Dashboard
										</Link>
									</Button>
									<Button 
										asChild 
										size="lg" 
										className="bg-white text-[#70C7BA] hover:bg-white/90 font-kaspa-subheader font-bold rounded-xl shadow-lg transition-all duration-300"
									>
										<Link href={`/${authUser.email?.split('@')[0] || 'preview'}`} target="_blank">
											View Your Page
										</Link>
									</Button>
								</div>
							</CardContent>
						</Card>
					)}

					{/* Help */}
					<div className="text-center">
						<p className="text-gray-400 font-kaspa-body">
							Need help? Check out our{' '}
							<Link href="/about" className="text-[#70C7BA] hover:text-[#49EACB] font-medium transition-colors">
								getting started guide
							</Link>
						</p>
					</div>
				</div>
			</main>
		</div>
	);
} 
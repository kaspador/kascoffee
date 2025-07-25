'use client';

import { useState } from 'react';
// Temporarily disabled - will implement with Directus auth
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Circle, Coffee, Palette, Link as LinkIcon, Rocket } from 'lucide-react';
import Link from 'next/link';

const onboardingSteps = [
	{
		id: 'profile',
		title: 'Set Up Your Profile',
		description: 'Choose your unique handle and add your Kaspa address',
		icon: Coffee,
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

export default function OnboardingPage() {
	const [completedSteps, setCompletedSteps] = useState<string[]>([]);

	// Temporarily skip auth check - will implement with Directus
	const session = { user: { name: 'User', email: 'user@example.com' } };

	if (false) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
			</div>
		);
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
		<div className="min-h-screen bg-gradient-to-br from-kaspa-primary/5 to-kaspa-secondary/5 dark:from-kaspa-primary/10 dark:to-kaspa-secondary/10">
			<div className="container mx-auto px-4 py-16">
				<div className="max-w-2xl mx-auto space-y-8">
					{/* Header */}
					<div className="text-center space-y-4">
						<div className="text-6xl mb-4">🎉</div>
						<h1 className="text-3xl font-kaspa-header font-bold text-kaspa-primary">Welcome to kas.coffee!</h1>
						<p className="text-muted-foreground">
							Let&apos;s set up your personalized donation page. Follow these steps to get started:
						</p>
					</div>

					{/* Progress */}
					<div className="flex items-center justify-center gap-2">
						<Badge variant="secondary">
							{completedSteps.length}/{onboardingSteps.length} Complete
						</Badge>
					</div>

					{/* Steps */}
					<div className="space-y-4">
						{onboardingSteps.map((step, index) => {
							const isCompleted = completedSteps.includes(step.id);
							const Icon = step.icon;

							return (
								<Card key={step.id} className={isCompleted ? 'border-[#70C7BA]/30 bg-[#70C7BA]/10 dark:bg-[#70C7BA]/10' : ''}>
									<CardContent className="p-6">
										<div className="flex items-center justify-between">
											<div className="flex items-center gap-4">
												<div className="flex items-center gap-3">
													<button
														onClick={() => toggleStep(step.id)}
														className="text-[#70C7BA] hover:text-[#5ba8a0] transition-colors"
													>
														{isCompleted ? (
															<CheckCircle className="h-6 w-6" />
														) : (
															<Circle className="h-6 w-6" />
														)}
													</button>
													<div className="p-2 bg-primary/10 rounded-lg">
														<Icon className="h-5 w-5 text-primary" />
													</div>
												</div>
												<div>
													<h3 className="font-semibold">
														{index + 1}. {step.title}
													</h3>
													<p className="text-sm text-muted-foreground">
														{step.description}
													</p>
												</div>
											</div>
											<Button asChild variant={isCompleted ? 'secondary' : 'default'}>
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
						<Card className="bg-gradient-to-r from-kaspa-primary to-kaspa-secondary text-white border-0">
							<CardContent className="text-center py-8">
								<Rocket className="h-12 w-12 mx-auto mb-4" />
								<h2 className="text-2xl font-kaspa-header font-bold mb-2">You&apos;re All Set! 🚀</h2>
								<p className="mb-6 text-white/90">
									Your kas.coffee page is ready! Share your unique link with supporters.
								</p>
								<div className="flex flex-col sm:flex-row gap-3 justify-center">
									<Button asChild size="lg" variant="secondary">
										<Link href="/dashboard">
											Go to Dashboard
										</Link>
									</Button>
									<Button asChild size="lg" variant="outline" className="text-white border-white hover:bg-white/10">
										<Link href={`/${session.user.email?.split('@')[0] || 'preview'}`} target="_blank">
											View Your Page
										</Link>
									</Button>
								</div>
							</CardContent>
						</Card>
					)}

					{/* Help */}
					<div className="text-center">
						<p className="text-sm text-muted-foreground">
							Need help? Check out our{' '}
							<Link href="/about" className="text-primary hover:underline">
								getting started guide
							</Link>
						</p>
					</div>
				</div>
			</div>
		</div>
	);
} 
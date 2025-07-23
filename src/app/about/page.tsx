import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Coffee, Heart, Zap } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
	title: 'About | kas.coffee',
	description: 'Learn about kas.coffee and our mission to support creators with Kaspa cryptocurrency.'
};

export default function AboutPage() {
	return (
		<div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-950 dark:to-amber-950">
			<div className="container mx-auto px-4 py-16">
				<div className="max-w-4xl mx-auto space-y-8">
					{/* Hero Section */}
					<div className="text-center space-y-4">
						<div className="text-6xl mb-4">☕</div>
						<h1 className="text-4xl font-bold">About kas.coffee</h1>
						<p className="text-xl text-muted-foreground max-w-2xl mx-auto">
							Supporting creators and building community through fast, low-fee Kaspa cryptocurrency donations.
						</p>
					</div>

					{/* Mission Section */}
					<Card>
						<CardHeader>
							<CardTitle className="flex items-center gap-2">
								<Heart className="h-5 w-5 text-red-500" />
								Our Mission
							</CardTitle>
						</CardHeader>
						<CardContent className="space-y-4">
							<p>
								kas.coffee was created to provide creators, artists, developers, and community builders 
								with a simple, effective way to receive support from their audience using Kaspa cryptocurrency.
							</p>
							<div className="grid md:grid-cols-3 gap-4">
								<div className="text-center p-4">
									<Zap className="h-8 w-8 mx-auto mb-2 text-yellow-500" />
									<h3 className="font-semibold">Lightning Fast</h3>
									<p className="text-sm text-muted-foreground">
										Kaspa's instant transactions mean supporters can send donations immediately
									</p>
								</div>
								<div className="text-center p-4">
									<Coffee className="h-8 w-8 mx-auto mb-2 text-orange-500" />
									<h3 className="font-semibold">Low Fees</h3>
									<p className="text-sm text-muted-foreground">
										Minimal transaction costs ensure more of the donation reaches creators
									</p>
								</div>
								<div className="text-center p-4">
									<Heart className="h-8 w-8 mx-auto mb-2 text-red-500" />
									<h3 className="font-semibold">Creator-Focused</h3>
									<p className="text-sm text-muted-foreground">
										Beautiful, customizable pages that represent your brand and story
									</p>
								</div>
							</div>
						</CardContent>
					</Card>

					{/* Creator Section */}
					<Card>
						<CardHeader>
							<CardTitle>Created by the Community</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="flex items-start gap-4">
								<Avatar className="w-16 h-16">
									<AvatarFallback className="text-lg font-bold">K</AvatarFallback>
								</Avatar>
								<div className="flex-1">
									<h3 className="font-semibold text-lg">kaspador</h3>
									<p className="text-muted-foreground mb-3">
										kas.coffee was built by kaspador, a passionate member of the Kaspa community 
										who believes in empowering creators and fostering connections through decentralized technology.
									</p>
									<Button asChild variant="outline">
										<Link href="/kaspador">
											<Coffee className="h-4 w-4 mr-2" />
											Support kaspador
										</Link>
									</Button>
								</div>
							</div>
						</CardContent>
					</Card>

					{/* CTA Section */}
					<Card className="bg-gradient-to-r from-orange-500 to-amber-500 text-white border-0">
						<CardContent className="text-center py-8">
							<h2 className="text-2xl font-bold mb-4">Ready to start receiving support?</h2>
							<p className="mb-6 text-orange-100">
								Join thousands of creators who are already using kas.coffee to connect with their supporters.
							</p>
							<Button asChild size="lg" variant="secondary">
								<Link href="/auth/signin">
									Get Started Today
								</Link>
							</Button>
						</CardContent>
					</Card>
				</div>
			</div>
		</div>
	);
} 
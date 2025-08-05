import { Navbar } from "@/components/navbar";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight, Code, Eye, Heart, Users, TrendingUp, Zap } from 'lucide-react';
import Image from 'next/image';

interface Stats {
	totalRaised: number;
	activePages: number;
	supporters: number;
	uptime: number;
}

interface Example {
	id: string;
	handle: string;
	title: string;
	description: string;
	category: string;
	raised: string;
	supporters: number;
	tags: string[];
	color: string;
	profileImage?: string;
	backgroundImage?: string;
}

async function getStats(): Promise<Stats> {
	try {
		const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/examples/stats`, {
			next: { revalidate: 300 } // Cache for 5 minutes
		});
		
		if (response.ok) {
			return await response.json();
		}
	} catch {
		// Failed to fetch stats, will use fallback
	}
	
	// Fallback to default stats if API fails
	return {
		totalRaised: 0,
		activePages: 0,
		supporters: 0,
		uptime: 99.9
	};
}

async function getFeaturedExamples(): Promise<Example[]> {
	try {
		const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/examples/featured`, {
			next: { revalidate: 300 } // Cache for 5 minutes
		});
		
		if (response.ok) {
			const data = await response.json();
			return data.examples || [];
		}
	} catch {
		// Failed to fetch examples, will use fallback
	}
	
	// Fallback to empty array if API fails
	return [];
}

export default async function ExamplesPage() {
	const [stats, examples] = await Promise.all([
		getStats(),
		getFeaturedExamples()
	]);

	return (
		<div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 dark:from-black dark:via-gray-900 dark:to-black relative">
			{/* Animated background */}
			<div className="absolute inset-0 bg-gradient-to-r from-[#70C7BA]/20 via-[#49EACB]/20 to-[#70C7BA]/20 animate-pulse"></div>
			<div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#70C7BA]/10 rounded-full blur-3xl animate-bounce-gentle"></div>
			<div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#49EACB]/10 rounded-full blur-3xl animate-bounce-gentle delay-1000"></div>
			
			<div className="relative z-10">
				<Navbar />
				
				{/* Hero Section */}
				<section className="pt-32 pb-16 px-6">
					<div className="max-w-4xl mx-auto text-center">
						<h1 className="text-5xl md:text-6xl font-black text-white mb-6 leading-tight">
							Donation Page
							<span className="bg-gradient-to-r from-[#70C7BA] to-[#49EACB] bg-clip-text text-transparent"> Examples</span>
						</h1>
						
						<p className="text-xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
							Get inspired by real donation pages built with kas.coffee. 
							See how creators, developers, and organizations are using Kaspa donations.
						</p>

						<div className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
							<Button size="lg" className="bg-gradient-to-r from-[#70C7BA] to-[#49EACB] hover:from-[#5ba8a0] hover:to-[#3dd4b4] text-white px-12 py-6 text-lg font-bold rounded-2xl shadow-2xl hover:shadow-[#70C7BA]/25 transition-all duration-300 transform hover:scale-105" asChild>
								<Link href="/auth/signup">
									Create Your Page
									<ArrowRight className="ml-3 w-5 h-5" />
								</Link>
							</Button>
							<Button size="lg" variant="outline" className="border-2 border-[#70C7BA]/50 text-[#70C7BA] hover:bg-[#70C7BA]/10 backdrop-blur-xl px-12 py-6 text-lg font-bold rounded-2xl transition-all duration-300" asChild>
								<Link href="/docs">Learn More</Link>
							</Button>
						</div>
					</div>
				</section>

				{/* Stats Section */}
				<section className="py-16 px-6">
					<div className="max-w-6xl mx-auto">
						<div className="grid md:grid-cols-4 gap-6">
							<div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 text-center hover:bg-white/10 transition-all duration-300">
								<TrendingUp className="w-8 h-8 text-[#70C7BA] mx-auto mb-3" />
								<div className="text-2xl font-black text-white mb-1">
									{stats.totalRaised > 0 ? `${stats.totalRaised.toLocaleString()}` : '0'}
								</div>
								<div className="text-gray-400 font-medium text-sm">Total Raised (KAS)</div>
							</div>
							<div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 text-center hover:bg-white/10 transition-all duration-300">
								<Users className="w-8 h-8 text-[#49EACB] mx-auto mb-3" />
								<div className="text-2xl font-black text-white mb-1">
									{stats.activePages > 0 ? stats.activePages.toLocaleString() : '0'}
								</div>
								<div className="text-gray-400 font-medium text-sm">Active Pages</div>
							</div>
							<div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 text-center hover:bg-white/10 transition-all duration-300">
								<Heart className="w-8 h-8 text-[#70C7BA] mx-auto mb-3" />
								<div className="text-2xl font-black text-white mb-1">
									{stats.supporters > 0 ? stats.supporters.toLocaleString() : '0'}
								</div>
								<div className="text-gray-400 font-medium text-sm">Supporters</div>
							</div>
							<div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 text-center hover:bg-white/10 transition-all duration-300">
								<Zap className="w-8 h-8 text-[#49EACB] mx-auto mb-3" />
								<div className="text-2xl font-black text-white mb-1">{stats.uptime}%</div>
								<div className="text-gray-400 font-medium text-sm">Uptime</div>
							</div>
						</div>
					</div>
				</section>

				{/* Examples Grid */}
				<section className="py-20 px-6">
					<div className="max-w-7xl mx-auto">
						<div className="text-center mb-16">
							<h2 className="text-4xl md:text-5xl font-black text-white mb-6">
								Real Examples
							</h2>
							<p className="text-xl text-gray-400 max-w-3xl mx-auto">
								See how different creators and organizations are using kas.coffee
							</p>
						</div>

						{examples.length > 0 ? (
							<div className="grid lg:grid-cols-3 gap-8">
								{examples.map((example) => (
									<div key={example.id} className="group">
										<div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-3xl p-6 hover:border-[#70C7BA]/50 transition-all duration-500 hover:transform hover:scale-105">
											{/* Image Placeholder */}
											<div className={`w-full h-48 bg-gradient-to-r ${example.color} rounded-2xl mb-6 flex items-center justify-center relative overflow-hidden`}>
												{example.backgroundImage || example.profileImage ? (
													<Image 
														src={(example.backgroundImage || example.profileImage)!} 
														alt={example.title}
														fill
														className="object-cover"
													/>
												) : (
													<>
														<div className="absolute inset-0 bg-black/20"></div>
														<Eye className="w-12 h-12 text-white/80 relative z-10" />
													</>
												)}
											</div>

											{/* Category Badge */}
											<div className="inline-flex items-center bg-white/10 rounded-full px-3 py-1 mb-4">
												<span className="text-[#70C7BA] text-sm font-semibold">{example.category}</span>
											</div>

											{/* Title & Description */}
											<h3 className="text-xl font-bold text-white mb-3">{example.title}</h3>
											<p className="text-gray-400 mb-6 leading-relaxed line-clamp-3">{example.description}</p>

											{/* Stats */}
											<div className="flex justify-between items-center mb-6">
												<div>
													<div className="text-lg font-bold text-[#70C7BA]">{example.raised}</div>
													<div className="text-sm text-gray-400">Raised</div>
												</div>
												<div>
													<div className="text-lg font-bold text-[#49EACB]">{example.supporters}</div>
													<div className="text-sm text-gray-400">Supporters</div>
												</div>
											</div>

											{/* Tags */}
											<div className="flex flex-wrap gap-2 mb-6">
												{example.tags.map((tag, tagIndex) => (
													<span key={tagIndex} className="bg-white/5 text-gray-300 text-xs px-2 py-1 rounded-lg">
														{tag}
													</span>
												))}
											</div>

											{/* Actions */}
											<div className="flex gap-3">
												<Button className="flex-1 bg-white/10 hover:bg-white/20 text-white rounded-xl" size="sm" asChild>
													<Link href={`/${example.handle}`}>
														<Eye className="w-4 h-4 mr-2" />
														View Page
													</Link>
												</Button>
												<Button className="bg-gradient-to-r from-[#70C7BA] to-[#49EACB] hover:from-[#5ba8a0] hover:to-[#3dd4b4] text-white rounded-xl" size="sm" asChild>
													<Link href="/auth/signup">
														<Code className="w-4 h-4 mr-2" />
														Create Yours
													</Link>
												</Button>
											</div>
										</div>
									</div>
								))}
							</div>
						) : (
							<div className="text-center py-16">
								<div className="text-6xl mb-6">🚀</div>
								<h3 className="text-2xl font-bold text-white mb-4">Be the First!</h3>
								<p className="text-gray-400 text-lg mb-8 max-w-2xl mx-auto">
									No donation pages have been created yet. Be the first creator to start accepting Kaspa donations with kas.coffee!
								</p>
								<Button size="lg" className="bg-gradient-to-r from-[#70C7BA] to-[#49EACB] hover:from-[#5ba8a0] hover:to-[#3dd4b4] text-white px-12 py-6 text-lg font-bold rounded-2xl shadow-2xl hover:shadow-[#70C7BA]/25 transition-all duration-300 transform hover:scale-105" asChild>
									<Link href="/auth/signup">
										Create First Page
										<ArrowRight className="ml-3 w-5 h-5" />
									</Link>
								</Button>
							</div>
						)}
					</div>
				</section>

				{/* CTA Section */}
				<section className="py-20 px-6 pb-32">
					<div className="max-w-4xl mx-auto text-center">
						<div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-3xl p-12">
							<h2 className="text-4xl md:text-5xl font-black text-white mb-6">
								Ready to Create
								<span className="bg-gradient-to-r from-[#70C7BA] to-[#49EACB] bg-clip-text text-transparent"> Your Page?</span>
							</h2>
							<p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto">
								Join thousands of creators already using kas.coffee to accept Kaspa donations
							</p>
							<div className="flex flex-col sm:flex-row gap-6 justify-center">
								<Button size="lg" className="bg-gradient-to-r from-[#70C7BA] to-[#49EACB] hover:from-[#5ba8a0] hover:to-[#3dd4b4] text-white px-12 py-6 text-lg font-bold rounded-2xl shadow-2xl hover:shadow-[#70C7BA]/25 transition-all duration-300 transform hover:scale-105" asChild>
									<Link href="/auth/signup">
										Start Building
										<ArrowRight className="ml-3 w-5 h-5" />
									</Link>
								</Button>
								<Button size="lg" variant="outline" className="border-2 border-[#70C7BA]/50 text-[#70C7BA] hover:bg-[#70C7BA]/10 backdrop-blur-xl px-12 py-6 text-lg font-bold rounded-2xl transition-all duration-300" asChild>
									<Link href="/docs">View Documentation</Link>
								</Button>
							</div>
						</div>
					</div>
				</section>
			</div>
		</div>
	);
} 
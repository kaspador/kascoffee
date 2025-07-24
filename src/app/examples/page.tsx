import { Navbar } from "@/components/navbar";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight, Code, Eye, Heart, Users, TrendingUp, Zap } from 'lucide-react';

export default function ExamplesPage() {
	const examples = [
		{
			title: "Creator Portfolio",
			description: "A beautiful portfolio page for content creators with integrated Kaspa donations",
			image: "/api/placeholder/400/300",
			category: "Creator",
			raised: "2,450 KAS",
			supporters: 127,
			tags: ["Portfolio", "Creative", "Modern"],
			color: "from-[#70C7BA] to-[#49EACB]"
		},
		{
			title: "Open Source Project",
			description: "Fund your open source projects with a professional donation page",
			image: "/api/placeholder/400/300", 
			category: "Developer",
			raised: "5,230 KAS",
			supporters: 89,
			tags: ["GitHub", "Open Source", "Technical"],
			color: "from-[#49EACB] to-[#70C7BA]"
		},
		{
			title: "Nonprofit Campaign",
			description: "Clean, professional design for charitable organizations and causes",
			image: "/api/placeholder/400/300",
			category: "Nonprofit", 
			raised: "8,750 KAS",
			supporters: 342,
			tags: ["Charity", "Community", "Impact"],
			color: "from-[#70C7BA] to-[#49EACB]"
		},
		{
			title: "Podcast Support",
			description: "Monetize your podcast with listener donations and supporter perks",
			image: "/api/placeholder/400/300",
			category: "Media",
			raised: "1,890 KAS", 
			supporters: 73,
			tags: ["Podcast", "Audio", "Community"],
			color: "from-[#49EACB] to-[#70C7BA]"
		},
		{
			title: "Gaming Streamer",
			description: "Interactive donation page for streamers with real-time alerts",
			image: "/api/placeholder/400/300",
			category: "Gaming",
			raised: "12,340 KAS",
			supporters: 456,
			tags: ["Streaming", "Gaming", "Interactive"],
			color: "from-[#70C7BA] to-[#49EACB]"
		},
		{
			title: "Artist Collective",
			description: "Showcase artwork and receive support from art enthusiasts",
			image: "/api/placeholder/400/300",
			category: "Art",
			raised: "3,670 KAS",
			supporters: 198,
			tags: ["Art", "Creative", "Gallery"],
			color: "from-[#49EACB] to-[#70C7BA]"
		}
	];

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
								<div className="text-2xl font-black text-white mb-1">50K+</div>
								<div className="text-gray-400 font-medium text-sm">Total Raised</div>
							</div>
							<div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 text-center hover:bg-white/10 transition-all duration-300">
								<Users className="w-8 h-8 text-[#49EACB] mx-auto mb-3" />
								<div className="text-2xl font-black text-white mb-1">1,200+</div>
								<div className="text-gray-400 font-medium text-sm">Active Pages</div>
							</div>
							<div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 text-center hover:bg-white/10 transition-all duration-300">
								<Heart className="w-8 h-8 text-[#70C7BA] mx-auto mb-3" />
								<div className="text-2xl font-black text-white mb-1">25K+</div>
								<div className="text-gray-400 font-medium text-sm">Supporters</div>
							</div>
							<div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 text-center hover:bg-white/10 transition-all duration-300">
								<Zap className="w-8 h-8 text-[#49EACB] mx-auto mb-3" />
								<div className="text-2xl font-black text-white mb-1">99.9%</div>
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

						<div className="grid lg:grid-cols-3 gap-8">
							{examples.map((example, index) => (
								<div key={index} className="group">
									<div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-3xl p-6 hover:border-[#70C7BA]/50 transition-all duration-500 hover:transform hover:scale-105">
										{/* Image Placeholder */}
										<div className={`w-full h-48 bg-gradient-to-r ${example.color} rounded-2xl mb-6 flex items-center justify-center relative overflow-hidden`}>
											<div className="absolute inset-0 bg-black/20"></div>
											<Eye className="w-12 h-12 text-white/80 relative z-10" />
										</div>

										{/* Category Badge */}
										<div className="inline-flex items-center bg-white/10 rounded-full px-3 py-1 mb-4">
											<span className="text-[#70C7BA] text-sm font-semibold">{example.category}</span>
										</div>

										{/* Title & Description */}
										<h3 className="text-xl font-bold text-white mb-3">{example.title}</h3>
										<p className="text-gray-400 mb-6 leading-relaxed">{example.description}</p>

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
											<Button className="flex-1 bg-white/10 hover:bg-white/20 text-white rounded-xl" size="sm">
												<Eye className="w-4 h-4 mr-2" />
												Preview
											</Button>
											<Button className="bg-gradient-to-r from-[#70C7BA] to-[#49EACB] hover:from-[#5ba8a0] hover:to-[#3dd4b4] text-white rounded-xl" size="sm">
												<Code className="w-4 h-4 mr-2" />
												Use Template
											</Button>
										</div>
									</div>
								</div>
							))}
						</div>
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
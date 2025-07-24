import { Navbar } from "@/components/navbar";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight, Coffee, Zap, Shield, Rocket, ExternalLink, User, Settings, Share2 } from 'lucide-react';

export default function DocsPage() {
	return (
		<div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 relative overflow-hidden">
			{/* Animated background with Kaspa colors */}
			<div className="absolute inset-0 bg-gradient-to-r from-[#70C7BA]/5 via-[#49EACB]/5 to-[#70C7BA]/5 animate-pulse"></div>
			<div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#70C7BA]/10 rounded-full blur-3xl animate-bounce-gentle"></div>
			<div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#49EACB]/10 rounded-full blur-3xl animate-bounce-gentle delay-1000"></div>
			
			<div className="relative z-10">
				<Navbar />
				
				{/* Compact Hero Section */}
				<section className="pt-24 pb-12 px-6">
					<div className="max-w-5xl mx-auto text-center">
						<div className="flex items-center justify-center gap-4 mb-6">
							<div className="coffee-container">
								<Coffee className="h-12 w-12 text-[#70C7BA] coffee-icon drop-shadow-lg" />
							</div>
							<h1 className="text-4xl md:text-5xl font-kaspa-header font-black text-white leading-tight">
								Developer
								<span className="bg-gradient-to-r from-[#70C7BA] to-[#49EACB] bg-clip-text text-transparent"> Documentation</span>
							</h1>
						</div>
						
						<p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto font-kaspa-body">
							Everything you need to integrate Kaspa donations. Fast, secure, and developer-friendly.
						</p>

						<Button size="lg" className="bg-gradient-to-r from-[#70C7BA] to-[#49EACB] hover:from-[#5ba8a0] hover:to-[#3dd4b4] text-white px-8 py-4 text-lg font-kaspa-subheader font-bold rounded-2xl shadow-2xl hover:shadow-[#70C7BA]/25 transition-all duration-300 transform hover:scale-105" asChild>
							<Link href="#quick-start">
								Get Started Now
								<ArrowRight className="ml-2 w-5 h-5" />
							</Link>
						</Button>
					</div>
				</section>

				{/* Compact Feature Overview */}
				<section className="py-8 px-6">
					<div className="max-w-5xl mx-auto">
						<div className="grid md:grid-cols-3 gap-6 mb-12">
							<div className="bg-gradient-to-br from-white/5 to-white/5 backdrop-blur-xl border border-[#70C7BA]/20 rounded-2xl p-6 text-center hover:border-[#70C7BA]/40 transition-all duration-300">
								<Zap className="w-8 h-8 text-[#70C7BA] mx-auto mb-3" />
								<h3 className="text-lg font-kaspa-subheader font-bold text-white mb-2">Lightning Fast</h3>
								<p className="text-gray-400 text-sm font-kaspa-body">Setup in under 5 minutes</p>
							</div>
							<div className="bg-gradient-to-br from-white/5 to-white/5 backdrop-blur-xl border border-[#49EACB]/20 rounded-2xl p-6 text-center hover:border-[#49EACB]/40 transition-all duration-300">
								<Shield className="w-8 h-8 text-[#49EACB] mx-auto mb-3" />
								<h3 className="text-lg font-kaspa-subheader font-bold text-white mb-2">Secure</h3>
								<p className="text-gray-400 text-sm font-kaspa-body">Enterprise-grade security</p>
							</div>
							<div className="bg-gradient-to-br from-white/5 to-white/5 backdrop-blur-xl border border-[#70C7BA]/20 rounded-2xl p-6 text-center hover:border-[#70C7BA]/40 transition-all duration-300">
								<Rocket className="w-8 h-8 text-[#70C7BA] mx-auto mb-3" />
								<h3 className="text-lg font-kaspa-subheader font-bold text-white mb-2">Scalable</h3>
								<p className="text-gray-400 text-sm font-kaspa-body">From startup to enterprise</p>
							</div>
						</div>
					</div>
				</section>

				{/* Compact Quick Start */}
				<section id="quick-start" className="py-12 px-6">
					<div className="max-w-5xl mx-auto">
						<div className="text-center mb-8">
							<h2 className="text-3xl md:text-4xl font-kaspa-header font-black text-white mb-3">
								Quick Start Guide
							</h2>
							<p className="text-gray-400 font-kaspa-body">Get your donation page running in 3 simple steps</p>
						</div>

						<div className="grid lg:grid-cols-3 gap-6">
							<div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-2xl p-6 hover:border-[#70C7BA]/50 transition-all duration-300 group">
								<div className="flex items-center gap-3 mb-4">
									<div className="w-10 h-10 bg-gradient-to-r from-[#70C7BA] to-[#49EACB] rounded-xl flex items-center justify-center">
										<User className="w-5 h-5 text-white" />
									</div>
									<div>
										<span className="text-[#70C7BA] font-kaspa-subheader font-bold text-sm">STEP 1</span>
										<h3 className="text-lg font-kaspa-header font-bold text-white">Sign Up</h3>
									</div>
								</div>
								<p className="text-gray-400 text-sm font-kaspa-body leading-relaxed mb-4">
									Create your free account instantly. No credit card required, no hidden fees.
								</p>
								<Button size="sm" className="bg-white/10 hover:bg-white/20 text-white rounded-xl font-kaspa-body group-hover:bg-[#70C7BA]/20 transition-all" asChild>
									<Link href="/auth/signup">
										Create Account
										<ExternalLink className="ml-2 w-3 h-3" />
									</Link>
								</Button>
							</div>

							<div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-2xl p-6 hover:border-[#49EACB]/50 transition-all duration-300 group">
								<div className="flex items-center gap-3 mb-4">
									<div className="w-10 h-10 bg-gradient-to-r from-[#49EACB] to-[#70C7BA] rounded-xl flex items-center justify-center">
										<Settings className="w-5 h-5 text-white" />
									</div>
									<div>
										<span className="text-[#49EACB] font-kaspa-subheader font-bold text-sm">STEP 2</span>
										<h3 className="text-lg font-kaspa-header font-bold text-white">Configure</h3>
									</div>
								</div>
								<p className="text-gray-400 text-sm font-kaspa-body leading-relaxed mb-4">
									Customize your page design and add your Kaspa wallet address to start receiving donations.
								</p>
								<Button size="sm" className="bg-white/10 hover:bg-white/20 text-white rounded-xl font-kaspa-body group-hover:bg-[#49EACB]/20 transition-all" asChild>
									<Link href="/dashboard">
										Open Dashboard
										<ExternalLink className="ml-2 w-3 h-3" />
									</Link>
								</Button>
							</div>

							<div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-2xl p-6 hover:border-[#70C7BA]/50 transition-all duration-300 group">
								<div className="flex items-center gap-3 mb-4">
									<div className="w-10 h-10 bg-gradient-to-r from-[#70C7BA] to-[#49EACB] rounded-xl flex items-center justify-center">
										<Share2 className="w-5 h-5 text-white" />
									</div>
									<div>
										<span className="text-[#70C7BA] font-kaspa-subheader font-bold text-sm">STEP 3</span>
										<h3 className="text-lg font-kaspa-header font-bold text-white">Share & Earn</h3>
									</div>
								</div>
								<p className="text-gray-400 text-sm font-kaspa-body leading-relaxed mb-4">
									Share your unique kas.coffee link with supporters and start receiving Kaspa donations instantly.
								</p>
								<Button size="sm" className="bg-white/10 hover:bg-white/20 text-white rounded-xl font-kaspa-body group-hover:bg-[#70C7BA]/20 transition-all">
									Copy Your Link
								</Button>
							</div>
						</div>
					</div>
				</section>

				{/* Compact CTA */}
				<section className="py-16 px-6">
					<div className="max-w-4xl mx-auto text-center">
						<div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-3xl p-8">
							<div className="coffee-container inline-block mb-4">
								<Coffee className="h-16 w-16 text-[#70C7BA] coffee-icon drop-shadow-lg" />
							</div>
							<h2 className="text-3xl md:text-4xl font-kaspa-header font-black text-white mb-4">
								Ready to Accept 
								<span className="bg-gradient-to-r from-[#70C7BA] to-[#49EACB] bg-clip-text text-transparent"> Kaspa Donations?</span>
							</h2>
							<p className="text-lg text-gray-400 mb-8 max-w-2xl mx-auto font-kaspa-body">
								Join thousands of creators and organizations already using kas.coffee to receive cryptocurrency donations
							</p>
							<div className="flex flex-col sm:flex-row gap-4 justify-center">
								<Button size="lg" className="bg-gradient-to-r from-[#70C7BA] to-[#49EACB] hover:from-[#5ba8a0] hover:to-[#3dd4b4] text-white px-8 py-4 text-lg font-kaspa-subheader font-bold rounded-2xl shadow-2xl hover:shadow-[#70C7BA]/25 transition-all duration-300 transform hover:scale-105" asChild>
									<Link href="/auth/signup">
										Start Free Today
										<ArrowRight className="ml-2 w-5 h-5" />
									</Link>
								</Button>
								<Button size="lg" variant="outline" className="border-2 border-[#70C7BA]/50 text-[#70C7BA] hover:bg-[#70C7BA]/10 backdrop-blur-xl px-8 py-4 text-lg font-kaspa-subheader font-bold rounded-2xl transition-all duration-300" asChild>
									<Link href="/examples">View Examples</Link>
								</Button>
							</div>
						</div>
					</div>
				</section>
			</div>
		</div>
	);
} 
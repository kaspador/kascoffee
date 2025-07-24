import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Coffee, Users, Zap, Globe, ArrowRight, Star } from 'lucide-react';
import { Navbar } from "@/components/navbar";

export default function LandingPage() {
	return (
		<div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 relative">
			{/* Animated background with Kaspa colors */}
			<div className="absolute inset-0 bg-gradient-to-r from-[#70C7BA]/10 via-[#49EACB]/10 to-[#70C7BA]/10 animate-pulse"></div>
			<div className="absolute top-20 left-20 w-72 h-72 bg-[#70C7BA]/20 rounded-full blur-3xl animate-pulse"></div>
			<div className="absolute bottom-20 right-20 w-96 h-96 bg-[#49EACB]/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
			
			<Navbar />
			
			{/* Main content with proper navbar spacing */}
			<div className="relative z-10 pt-20">
				<div className="flex flex-col items-center justify-center min-h-screen px-6">
					<div className="text-center space-y-8 max-w-4xl mx-auto">
						{/* Hero Badge */}
						<div className="inline-flex items-center gap-3 bg-gradient-to-r from-[#70C7BA]/20 to-[#49EACB]/20 backdrop-blur-xl border border-[#70C7BA]/30 rounded-full px-6 py-3 mb-8">
							<div className="w-3 h-3 bg-gradient-to-r from-[#70C7BA] to-[#49EACB] rounded-full animate-pulse"></div>
							<span className="text-[#70C7BA] font-semibold text-sm">Powered by Kaspa Network</span>
							<Zap className="w-4 h-4 text-[#49EACB]" />
						</div>

						{/* Main Logo */}
						<div className="flex items-center justify-center gap-6 mb-8">
							<div className="relative">
								<Coffee className="h-20 w-20 text-[#70C7BA] drop-shadow-lg" />
								<div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-[#49EACB] to-[#70C7BA] rounded-full animate-bounce"></div>
							</div>
							<h1 className="text-7xl md:text-8xl lg:text-9xl font-black leading-tight">
								<span className="bg-gradient-to-r from-white via-[#70C7BA] to-[#49EACB] bg-clip-text text-transparent">
									kas.coffee
								</span>
							</h1>
						</div>
						
						{/* Hero Description */}
						<p className="text-2xl md:text-3xl text-gray-300 font-light leading-relaxed max-w-3xl mx-auto">
							Create your <span className="text-[#70C7BA] font-semibold">personalized donation page</span> and start accepting <span className="text-[#49EACB] font-semibold">Kaspa cryptocurrency</span> in minutes
						</p>
						
						{/* CTA Buttons */}
						<div className="flex flex-col sm:flex-row gap-6 justify-center mt-12">
							<Button size="lg" asChild className="bg-gradient-to-r from-[#70C7BA] to-[#49EACB] hover:from-[#49EACB] hover:to-[#70C7BA] text-white font-semibold px-8 py-4 text-lg rounded-full shadow-lg hover:shadow-[#70C7BA]/25 transition-all duration-300 group">
								<Link href="/auth/signup" className="flex items-center gap-2">
									Get Started Free
									<ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
								</Link>
							</Button>
							<Button size="lg" variant="outline" asChild className="border-[#70C7BA] text-[#70C7BA] hover:bg-[#70C7BA]/10 font-semibold px-8 py-4 text-lg rounded-full backdrop-blur-sm">
								<Link href="/about">Learn More</Link>
							</Button>
						</div>

						{/* Features Grid */}
						<div className="grid md:grid-cols-3 gap-8 mt-20 max-w-5xl mx-auto">
							<div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:border-[#70C7BA]/50 transition-all duration-300 group">
								<div className="w-12 h-12 bg-gradient-to-r from-[#70C7BA] to-[#49EACB] rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
									<Users className="w-6 h-6 text-white" />
								</div>
								<h3 className="text-xl font-semibold text-white mb-2">Personalized Pages</h3>
								<p className="text-gray-400">Custom handles, themes, and descriptions for your unique donation page</p>
							</div>

							<div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:border-[#70C7BA]/50 transition-all duration-300 group">
								<div className="w-12 h-12 bg-gradient-to-r from-[#70C7BA] to-[#49EACB] rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
									<Zap className="w-6 h-6 text-white" />
								</div>
								<h3 className="text-xl font-semibold text-white mb-2">Instant Kaspa</h3>
								<p className="text-gray-400">Fast, secure cryptocurrency donations with QR codes</p>
							</div>

							<div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:border-[#70C7BA]/50 transition-all duration-300 group">
								<div className="w-12 h-12 bg-gradient-to-r from-[#70C7BA] to-[#49EACB] rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
									<Globe className="w-6 h-6 text-white" />
								</div>
								<h3 className="text-xl font-semibold text-white mb-2">Social Integration</h3>
								<p className="text-gray-400">Link your social accounts and share your donation page</p>
							</div>
						</div>

						{/* Stats */}
						<div className="flex flex-wrap justify-center gap-8 mt-16 mb-16 text-center">
							<div className="flex items-center gap-2">
								<Star className="w-5 h-5 text-[#49EACB]" />
								<span className="text-[#70C7BA] font-semibold">Fast Setup</span>
							</div>
							<div className="flex items-center gap-2">
								<Star className="w-5 h-5 text-[#49EACB]" />
								<span className="text-[#70C7BA] font-semibold">Secure</span>
							</div>
							<div className="flex items-center gap-2">
								<Star className="w-5 h-5 text-[#49EACB]" />
								<span className="text-[#70C7BA] font-semibold">Custom Themes</span>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

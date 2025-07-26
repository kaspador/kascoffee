import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Coffee, Users, Zap, Globe, ArrowRight, Star } from 'lucide-react';
import { Navbar } from "@/components/navbar";
import FeatureCard from "@/components/feature-card";

export default function LandingPage() {
	return (
		<div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 relative overflow-x-hidden">
			{/* Animated background with Kaspa colors - responsive sizing */}
			<div className="absolute inset-0 bg-gradient-to-r from-[#70C7BA]/10 via-[#49EACB]/10 to-[#70C7BA]/10 animate-pulse"></div>
			<div className="absolute top-10 left-5 sm:top-20 sm:left-20 w-32 h-32 sm:w-72 sm:h-72 bg-[#70C7BA]/20 rounded-full blur-3xl animate-pulse"></div>
			<div className="absolute bottom-10 right-5 sm:bottom-20 sm:right-20 w-40 h-40 sm:w-96 sm:h-96 bg-[#49EACB]/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
			
			<Navbar />
			
			{/* Main content with proper navbar spacing */}
			<div className="relative z-10 pt-16 sm:pt-20">
				<div className="flex flex-col items-center justify-center min-h-screen px-4 sm:px-6">
					<div className="text-center space-y-4 sm:space-y-6 md:space-y-8 max-w-4xl mx-auto">
						{/* Hero Badge */}
						<div className="inline-flex items-center gap-2 sm:gap-3 bg-gradient-to-r from-[#70C7BA]/20 to-[#49EACB]/20 backdrop-blur-xl border border-[#70C7BA]/30 rounded-full px-3 py-2 sm:px-6 sm:py-3 mb-4 sm:mb-8">
							<div className="w-2 h-2 sm:w-3 sm:h-3 bg-gradient-to-r from-[#70C7BA] to-[#49EACB] rounded-full animate-pulse"></div>
							<span className="text-[#70C7BA] font-semibold text-xs sm:text-sm">Powered by Kaspa Network</span>
							<Zap className="w-3 h-3 sm:w-4 sm:h-4 text-[#49EACB]" />
						</div>

						{/* Main Logo - much more responsive */}
						<div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6 mb-4 sm:mb-8">
							<div className="relative coffee-container">
								<Coffee className="h-12 w-12 sm:h-16 sm:w-16 md:h-20 md:w-20 text-[#70C7BA] coffee-icon drop-shadow-lg hover:scale-110 transition-all duration-300 cursor-pointer" />
								<div className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 w-4 h-4 sm:w-6 sm:h-6 bg-gradient-to-r from-[#49EACB] to-[#70C7BA] rounded-full animate-bounce"></div>
							</div>
							<h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-black leading-tight text-center sm:text-left">
								<span className="bg-gradient-to-r from-white via-[#70C7BA] to-[#49EACB] bg-clip-text text-transparent">
									kas.coffee
								</span>
							</h1>
						</div>
						
						{/* Hero Description - better mobile sizing */}
						<p className="text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl text-gray-300 font-light leading-relaxed max-w-3xl mx-auto px-2">
							Create your <span className="text-[#70C7BA] font-semibold">personalized donation page</span> and start accepting <span className="text-[#49EACB] font-semibold">Kaspa cryptocurrency</span> in minutes
						</p>
						
						{/* CTA Buttons - better mobile layout */}
						<div className="flex flex-col sm:flex-row gap-3 sm:gap-6 justify-center mt-6 sm:mt-8 md:mt-12 px-4 sm:px-0">
							<Button size="lg" asChild className="bg-gradient-to-r from-[#70C7BA] to-[#49EACB] hover:from-[#49EACB] hover:to-[#70C7BA] text-black font-semibold px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg rounded-full shadow-lg hover:shadow-[#70C7BA]/25 transition-all duration-300 group w-full sm:w-auto">
								<Link href="/auth/signup" className="flex items-center justify-center gap-2">
									Create your own page
									<ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
								</Link>
							</Button>
							<Button size="lg" variant="outline" asChild className="border-[#70C7BA] text-[#70C7BA] hover:bg-[#70C7BA]/10 font-semibold px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg rounded-full backdrop-blur-sm w-full sm:w-auto">
								<Link href="/about">Learn More</Link>
							</Button>
						</div>

						{/* Features Grid - better mobile spacing */}
						<div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8 mt-12 sm:mt-16 md:mt-20 max-w-5xl mx-auto px-4 sm:px-0">
							<FeatureCard
								icon={Users}
								title="Personalized Pages"
								description="Custom handles, themes, and descriptions for your unique donation page"
							/>

							<FeatureCard
								icon={Zap}
								title="Instant Kaspa"
								description="Fast, secure cryptocurrency donations with QR codes"
							/>

							<FeatureCard
								icon={Globe}
								title="Social Integration"
								description="Link your social accounts and share your donation page"
							/>
						</div>

						{/* Stats - better mobile layout */}
						<div className="flex flex-col sm:flex-row flex-wrap justify-center gap-4 sm:gap-8 mt-8 sm:mt-12 md:mt-16 mb-8 sm:mb-12 md:mb-16 text-center px-4">
							<div className="flex items-center justify-center gap-2">
								<Star className="w-4 h-4 sm:w-5 sm:h-5 text-[#49EACB]" />
								<span className="text-[#70C7BA] font-semibold text-sm sm:text-base">Fast Setup</span>
							</div>
							<div className="flex items-center justify-center gap-2">
								<Star className="w-4 h-4 sm:w-5 sm:h-5 text-[#49EACB]" />
								<span className="text-[#70C7BA] font-semibold text-sm sm:text-base">Secure</span>
							</div>
							<div className="flex items-center justify-center gap-2">
								<Star className="w-4 h-4 sm:w-5 sm:h-5 text-[#49EACB]" />
								<span className="text-[#70C7BA] font-semibold text-sm sm:text-base">Custom Themes</span>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

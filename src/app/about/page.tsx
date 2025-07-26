import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Coffee, Heart, Users, Zap, ArrowRight, Star, Github, Twitter } from "lucide-react";
import { Navbar } from "@/components/navbar";
import FeatureCard from "@/components/feature-card";

export default function AboutPage() {
	return (
		<div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 relative">
			{/* Animated background with Kaspa colors */}
			<div className="absolute inset-0 bg-gradient-to-r from-[#70C7BA]/10 via-[#49EACB]/10 to-[#70C7BA]/10 animate-pulse"></div>
			<div className="absolute top-20 left-20 w-72 h-72 bg-[#70C7BA]/20 rounded-full blur-3xl animate-pulse"></div>
			<div className="absolute bottom-20 right-20 w-96 h-96 bg-[#49EACB]/20 rounded-full blur-3xl animate-pulse delay-1000"></div>

			<Navbar />

			<div className="relative z-10 pt-24 pb-16 px-6">
				<div className="max-w-6xl mx-auto">
					{/* Hero Section */}
					<div className="text-center mb-20">
						<div className="flex items-center justify-center gap-3 mb-8">
							<div className="relative">
								<Coffee className="h-16 w-16 text-[#70C7BA] drop-shadow-lg" />
								<div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-[#49EACB] to-[#70C7BA] rounded-full animate-bounce"></div>
							</div>
							<h1 className="text-6xl md:text-7xl font-black bg-gradient-to-r from-white via-[#70C7BA] to-[#49EACB] bg-clip-text text-transparent">
								About kas.coffee
							</h1>
						</div>
						<p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
							Empowering creators, developers, and organizations to accept <span className="text-[#70C7BA] font-semibold">Kaspa cryptocurrency</span> donations through beautiful, personalized pages.
						</p>
					</div>

					{/* Mission Section */}
					<div className="grid lg:grid-cols-2 gap-12 mb-20">
						<Card className="bg-white/5 backdrop-blur-xl border border-white/20 hover:border-[#70C7BA]/50 transition-all duration-300">
							<CardHeader>
								<CardTitle className="text-2xl text-white flex items-center gap-3">
									<Heart className="w-8 h-8 text-[#70C7BA]" />
									Our Mission
								</CardTitle>
							</CardHeader>
							<CardContent className="text-gray-300 leading-relaxed">
								<p className="mb-4">
									We believe in a future where supporting creators and projects is seamless, fast, and powered by innovative cryptocurrency technology. Kaspa represents the next generation of digital payments with its unique blockDAG architecture.
								</p>
								<p>
									kas.coffee bridges the gap between traditional donation platforms and cutting-edge cryptocurrency, making it easy for anyone to create beautiful donation pages and start accepting Kaspa instantly.
								</p>
							</CardContent>
						</Card>

						<Card className="bg-white/5 backdrop-blur-xl border border-white/20 hover:border-[#70C7BA]/50 transition-all duration-300">
							<CardHeader>
								<CardTitle className="text-2xl text-white flex items-center gap-3">
									<Zap className="w-8 h-8 text-[#49EACB]" />
									Why Kaspa?
								</CardTitle>
							</CardHeader>
							<CardContent className="text-gray-300 leading-relaxed">
								<p className="mb-4">
									Kaspa is the fastest, most scalable pure proof-of-work cryptocurrency. With instant confirmations and incredibly low fees, it&apos;s perfect for small donations and micropayments.
								</p>
								<p>
									Unlike traditional payment processors that take 3-5% fees and have lengthy settlement times, Kaspa transactions are nearly instant and cost fractions of a penny.
								</p>
							</CardContent>
						</Card>
					</div>

					{/* Features Grid */}
					<div className="mb-20">
						<h2 className="text-4xl font-bold text-center text-white mb-12">
							Built for <span className="bg-gradient-to-r from-[#70C7BA] to-[#49EACB] bg-clip-text text-transparent">Modern Creators</span>
						</h2>
						<div className="grid md:grid-cols-3 gap-8">
							<FeatureCard
								icon={Users}
								title="Personalized Pages"
								description="Custom handles, themes, colors, and rich content to match your brand perfectly."
							/>

							<FeatureCard
								icon={Zap}
								title="Instant Payments"
								description="Kaspa's lightning-fast transactions mean supporters can donate instantly with QR codes."
							/>

							<FeatureCard
								icon={Star}
								title="Rich Content"
								description="WYSIWYG editor with rich text, images, and social media integration."
							/>
						</div>
					</div>

					{/* Creator Section */}
					<div className="text-center mb-16">
						<h2 className="text-4xl font-bold text-white mb-8">Meet the Creator</h2>
						<Card className="bg-white/5 backdrop-blur-xl border border-white/20 max-w-2xl mx-auto">
							<CardContent className="p-8">
								<div className="flex flex-col items-center text-center">
									<div className="w-24 h-24 bg-gradient-to-r from-[#70C7BA] to-[#49EACB] rounded-full flex items-center justify-center text-2xl font-bold text-white mb-4">
										K
									</div>
									<h3 className="text-2xl font-bold text-white mb-2">kaspador</h3>
									<p className="text-gray-400 mb-6">
										Passionate developer and Kaspa enthusiast building the future of cryptocurrency donations.
										Committed to creating tools that make crypto accessible to everyone.
									</p>
									<div className="flex gap-4">
										<Button variant="outline" size="sm" className="border-[#70C7BA] text-[#70C7BA] hover:bg-[#70C7BA]/10">
											<Github className="w-4 h-4 mr-2" />
											GitHub
										</Button>
										<Button variant="outline" size="sm" className="border-[#70C7BA] text-[#70C7BA] hover:bg-[#70C7BA]/10">
											<Twitter className="w-4 h-4 mr-2" />
											Twitter
										</Button>
									</div>
								</div>
							</CardContent>
						</Card>
					</div>

					{/* CTA Section */}
					<div className="text-center bg-gradient-to-r from-[#70C7BA]/10 to-[#49EACB]/10 backdrop-blur-xl border border-[#70C7BA]/30 rounded-3xl p-12 mb-16">
						<h2 className="text-4xl font-bold text-white mb-4">
							Support <span className="text-[#70C7BA]">kaspador</span>
						</h2>
						<p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
							If you find kas.coffee useful, consider supporting its development by visiting kaspador&apos;s donation page
						</p>
						<Button asChild className="bg-gradient-to-r from-[#70C7BA] to-[#49EACB] hover:from-[#49EACB] hover:to-[#70C7BA] text-white font-semibold px-8 py-4 text-lg rounded-full shadow-lg hover:shadow-[#70C7BA]/25 transition-all duration-300 group">
							<Link href="/kaspador" className="flex items-center gap-2">
								Visit kaspador&apos;s Page
								<ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
							</Link>
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
} 
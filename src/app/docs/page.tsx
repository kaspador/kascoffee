import { Navbar } from "@/components/navbar";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight, Code, Globe } from 'lucide-react';

export default function DocsPage() {
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
							Developer
							<span className="bg-gradient-to-r from-[#70C7BA] to-[#49EACB] bg-clip-text text-transparent"> Documentation</span>
						</h1>
						
						<p className="text-xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
							Everything you need to integrate Kaspa donations into your applications. 
							Fast, secure, and developer-friendly.
						</p>

						<div className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
							<Button size="lg" className="bg-gradient-to-r from-[#70C7BA] to-[#49EACB] hover:from-[#5ba8a0] hover:to-[#3dd4b4] text-white px-12 py-6 text-lg font-bold rounded-2xl shadow-2xl hover:shadow-[#70C7BA]/25 transition-all duration-300 transform hover:scale-105" asChild>
								<Link href="#quick-start">
									Quick Start
									<ArrowRight className="ml-3 w-5 h-5" />
								</Link>
							</Button>
							<Button size="lg" variant="outline" className="border-2 border-[#70C7BA]/50 text-[#70C7BA] hover:bg-[#70C7BA]/10 backdrop-blur-xl px-12 py-6 text-lg font-bold rounded-2xl transition-all duration-300" asChild>
								<Link href="#api-reference">API Reference</Link>
							</Button>
						</div>
					</div>
				</section>

				{/* Rest of the content with proper spacing */}
				{/* Quick Start */}
				<section id="quick-start" className="py-20 px-6">
					<div className="max-w-6xl mx-auto">
						<div className="text-center mb-16">
							<h2 className="text-4xl md:text-5xl font-black text-white mb-6">
								Quick Start
							</h2>
							<p className="text-xl text-gray-400 max-w-3xl mx-auto">
								Get your donation page up and running in minutes
							</p>
						</div>

						<div className="grid lg:grid-cols-3 gap-8">
							<div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-3xl p-8 hover:border-[#70C7BA]/50 transition-all duration-500">
								<div className="w-16 h-16 bg-gradient-to-r from-[#70C7BA] to-[#49EACB] rounded-2xl flex items-center justify-center mb-6">
									<span className="text-white font-black text-2xl">1</span>
								</div>
								<h3 className="text-2xl font-bold text-white mb-4">Sign Up</h3>
								<p className="text-gray-400 mb-6 leading-relaxed">
									Create your free account and verify your email. 
									No credit card required.
								</p>
								<Button className="bg-white/10 hover:bg-white/20 text-white rounded-xl" asChild>
									<Link href="/auth/signup">Get Started</Link>
								</Button>
							</div>

							<div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-3xl p-8 hover:border-[#49EACB]/50 transition-all duration-500">
								<div className="w-16 h-16 bg-gradient-to-r from-[#49EACB] to-[#70C7BA] rounded-2xl flex items-center justify-center mb-6">
									<span className="text-white font-black text-2xl">2</span>
								</div>
								<h3 className="text-2xl font-bold text-white mb-4">Configure</h3>
								<p className="text-gray-400 mb-6 leading-relaxed">
									Set up your donation page with custom branding 
									and your Kaspa wallet address.
								</p>
								<Button className="bg-white/10 hover:bg-white/20 text-white rounded-xl" asChild>
									<Link href="/dashboard">Dashboard</Link>
								</Button>
							</div>

							<div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-3xl p-8 hover:border-[#70C7BA]/50 transition-all duration-500">
								<div className="w-16 h-16 bg-gradient-to-r from-[#70C7BA] to-[#49EACB] rounded-2xl flex items-center justify-center mb-6">
									<span className="text-white font-black text-2xl">3</span>
								</div>
								<h3 className="text-2xl font-bold text-white mb-4">Share</h3>
								<p className="text-gray-400 mb-6 leading-relaxed">
									Share your unique kas.coffee link and start 
									receiving Kaspa donations instantly.
								</p>
								<Button className="bg-white/10 hover:bg-white/20 text-white rounded-xl">
									Copy Link
								</Button>
							</div>
						</div>
					</div>
				</section>

				{/* API Reference */}
				<section id="api-reference" className="py-20 px-6">
					<div className="max-w-6xl mx-auto">
						<div className="text-center mb-16">
							<h2 className="text-4xl md:text-5xl font-black text-white mb-6">
								API Reference
							</h2>
							<p className="text-xl text-gray-400 max-w-3xl mx-auto">
								Integrate kas.coffee into your applications
							</p>
						</div>

						<div className="grid lg:grid-cols-2 gap-8">
							<div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-3xl p-8">
								<h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
									<Code className="w-6 h-6 text-[#70C7BA]" />
									REST API
								</h3>
								
								<div className="space-y-6">
									<div>
										<h4 className="text-lg font-semibold text-[#70C7BA] mb-2">Create Donation</h4>
										<div className="bg-gray-900/50 rounded-xl p-4 border border-white/10">
											<code className="text-gray-300 text-sm">
												POST /api/donations<br/>
												Content-Type: application/json<br/><br/>
												{`{
  "amount": 100,
  "currency": "KAS",
  "message": "Thank you!"
}`}
											</code>
										</div>
									</div>

									<div>
										<h4 className="text-lg font-semibold text-[#49EACB] mb-2">Get Donation Status</h4>
										<div className="bg-gray-900/50 rounded-xl p-4 border border-white/10">
											<code className="text-gray-300 text-sm">
												GET /api/donations/:id
											</code>
										</div>
									</div>
								</div>
							</div>

							<div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-3xl p-8">
								<h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
									<Globe className="w-6 h-6 text-[#49EACB]" />
									Webhooks
								</h3>
								
								<div className="space-y-6">
									<div>
										<h4 className="text-lg font-semibold text-[#70C7BA] mb-2">Payment Received</h4>
										<div className="bg-gray-900/50 rounded-xl p-4 border border-white/10">
											<code className="text-gray-300 text-sm">
												{`{
  "event": "payment.received",
  "data": {
    "id": "don_123",
    "amount": 100,
    "currency": "KAS",
    "status": "confirmed"
  }
}`}
											</code>
										</div>
									</div>

									<div>
										<h4 className="text-lg font-semibold text-[#49EACB] mb-2">Configure Webhook</h4>
										<div className="bg-gray-900/50 rounded-xl p-4 border border-white/10">
											<code className="text-gray-300 text-sm">
												POST /api/webhooks<br/>
												{`{
  "url": "https://your-app.com/webhook",
  "events": ["payment.received"]
}`}
											</code>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</section>

				{/* SDK */}
				<section className="py-20 px-6">
					<div className="max-w-6xl mx-auto">
						<div className="text-center mb-16">
							<h2 className="text-4xl md:text-5xl font-black text-white mb-6">
								SDKs & Libraries
							</h2>
							<p className="text-xl text-gray-400 max-w-3xl mx-auto">
								Official SDKs for popular programming languages
							</p>
						</div>

						<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
							{['JavaScript', 'Python', 'Go', 'PHP', 'Ruby', 'Rust'].map((lang) => (
								<div key={lang} className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-2xl p-6 hover:border-[#70C7BA]/50 transition-all duration-300">
									<h3 className="text-xl font-bold text-white mb-3">{lang}</h3>
									<p className="text-gray-400 text-sm mb-4">
										Official {lang} SDK for kas.coffee integration
									</p>
									<Button className="bg-gradient-to-r from-[#70C7BA] to-[#49EACB] hover:from-[#5ba8a0] hover:to-[#3dd4b4] text-white font-bold px-4 py-2 rounded-xl text-sm">
										Install
									</Button>
								</div>
							))}
						</div>
					</div>
				</section>

				{/* CTA */}
				<section className="py-20 px-6 pb-32">
					<div className="max-w-4xl mx-auto text-center">
						<div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-3xl p-12">
							<h2 className="text-4xl md:text-5xl font-black text-white mb-6">
								Ready to Build?
							</h2>
							<p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto">
								Start integrating Kaspa donations into your application today
							</p>
							<div className="flex flex-col sm:flex-row gap-6 justify-center">
								<Button size="lg" className="bg-gradient-to-r from-[#70C7BA] to-[#49EACB] hover:from-[#5ba8a0] hover:to-[#3dd4b4] text-white px-12 py-6 text-lg font-bold rounded-2xl shadow-2xl hover:shadow-[#70C7BA]/25 transition-all duration-300 transform hover:scale-105" asChild>
									<Link href="/auth/signup">
										Get API Keys
										<ArrowRight className="ml-3 w-5 h-5" />
									</Link>
								</Button>
								<Button size="lg" variant="outline" className="border-2 border-[#70C7BA]/50 text-[#70C7BA] hover:bg-[#70C7BA]/10 backdrop-blur-xl px-12 py-6 text-lg font-bold rounded-2xl transition-all duration-300" asChild>
									<Link href="https://github.com/kas-coffee">View on GitHub</Link>
								</Button>
							</div>
						</div>
					</div>
				</section>
			</div>
		</div>
	);
} 
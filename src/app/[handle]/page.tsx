"use client";

import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ExternalLink, Copy, Coffee, Heart, Star, Share2 } from 'lucide-react';
import { FaTwitter, FaDiscord, FaTelegram, FaGlobe, FaGithub } from 'react-icons/fa';
import parse from 'html-react-parser';
import QRCodeDisplay from '@/components/qr-code-display';
import { useEffect, useState } from 'react';

interface UserPageData {
	id: string;
	userId: string;
	handle: string;
	displayName: string;
	shortDescription: string | null;
	longDescription: string | null;
	kaspaAddress: string;
	profileImage: string | null;
	backgroundImage: string | null;
	backgroundColor: string;
	foregroundColor: string;
	isActive: boolean;
	viewCount: number;
	createdAt: Date;
	updatedAt: Date;
	socials: Array<{
		id: string;
		platform: string;
		url: string;
		username: string;
		isVisible: boolean;
	}>;
}

async function fetchUserPage(handle: string): Promise<UserPageData | null> {
	try {
		const response = await fetch(`/api/user-page/${handle}`, {
			cache: 'no-store' // Disable caching to ensure fresh data
		});
		
		if (!response.ok) {
			return null;
		}
		
		return await response.json();
	} catch (error) {
		console.error('Error fetching user page:', error);
		return null;
	}
}

interface PageProps {
	params: Promise<{
		handle: string;
	}>;
}

// Note: generateMetadata removed since Client Components can't export it
// Metadata will be handled differently for Client Components

export default function UserProfilePage({ params }: PageProps) {
	const [userPage, setUserPage] = useState<UserPageData | null>(null);
	const [loading, setLoading] = useState(true);
	const [handle, setHandle] = useState<string>('');

	useEffect(() => {
		async function loadParams() {
			const resolvedParams = await params;
			setHandle(resolvedParams.handle);
		}
		loadParams();
	}, [params]);

	useEffect(() => {
		if (!handle) return;

		async function loadUserPage() {
			setLoading(true);
			const data = await fetchUserPage(handle);
			setUserPage(data);
			setLoading(false);
		}

		loadUserPage();
	}, [handle]);

	if (loading) {
		return (
			<div className="min-h-screen bg-slate-950 flex items-center justify-center">
				<div className="text-white text-xl">Loading...</div>
			</div>
		);
	}

	if (!userPage) {
		notFound();
	}

	const socialIconMap = {
		twitter: FaTwitter,
		discord: FaDiscord,
		telegram: FaTelegram,
		website: FaGlobe,
		github: FaGithub,
	};

	return (
		<div 
			className="min-h-screen flex flex-col justify-center items-center p-6 relative overflow-hidden"
			style={{ 
				backgroundColor: userPage.backgroundColor,
				backgroundImage: userPage.backgroundImage ? `url(${userPage.backgroundImage})` : 'none',
				backgroundSize: 'cover',
				backgroundPosition: 'center',
				backgroundRepeat: 'no-repeat'
			}}
		>
				{/* Background overlay for better readability */}
				<div className="absolute inset-0 bg-black/40 backdrop-blur-sm"></div>
				
				{/* Header */}
				<div className="relative w-full max-w-4xl mx-auto z-10">
					{/* Navigation */}
					<div className="flex justify-between items-center mb-12">
						<Link
							href="/"
							className="flex items-center gap-2 text-white/80 hover:text-white transition-colors duration-300"
							style={{ 
								color: userPage.foregroundColor + '80',
							}}
						>
							<Coffee className="w-5 h-5" />
							<span className="font-kaspa-body font-semibold">kas.coffee</span>
						</Link>
						
						<div className="flex items-center gap-3">
							<Button
								variant="outline"
								size="sm"
								className="border-2 backdrop-blur-md bg-white/10 hover:bg-white/20 transition-all duration-300"
								style={{ 
									borderColor: userPage.foregroundColor + '60',
									color: userPage.foregroundColor,
								}}
								onClick={() => {
									if (navigator.share) {
										navigator.share({
											title: `${userPage.displayName || userPage.handle || 'User'} - kas.coffee`,
											text: userPage.shortDescription || `Support ${userPage.displayName || userPage.handle || 'this creator'} with Kaspa donations`,
											url: window.location.href,
										});
									} else {
										navigator.clipboard.writeText(window.location.href);
									}
								}}
							>
								<Share2 className="w-4 h-4 mr-2" />
								Share
							</Button>
						</div>
					</div>

					{/* Main Content */}
					<div className="text-center mb-16">
						{/* Profile Section */}
						<div className="flex flex-col items-center gap-6 mb-12">
							<Avatar className="w-32 h-32 border-4 shadow-2xl" style={{ borderColor: userPage.foregroundColor }}>
								<AvatarImage src={userPage.profileImage || undefined} alt={userPage.displayName || userPage.handle || 'User'} />
								<AvatarFallback 
									className="bg-gradient-to-br from-indigo-500/20 to-purple-600/20 text-3xl font-bold backdrop-blur-sm border border-white/20"
									style={{
										color: userPage.foregroundColor,
										backgroundColor: `${userPage.backgroundColor}40`
									}}
								>
									{userPage.displayName?.charAt(0) || 'U'}
								</AvatarFallback>
							</Avatar>
							
							<div className="space-y-4">
								<h1 className="text-5xl font-bold font-kaspa-title tracking-wide text-center" style={{ color: userPage.foregroundColor }}>
									{userPage.displayName || userPage.handle || 'User'}
								</h1>
								<Badge 
									variant="secondary" 
									className="px-4 py-2 text-lg font-kaspa-body backdrop-blur-md"
									style={{ 
										backgroundColor: `${userPage.foregroundColor}20`,
										color: userPage.foregroundColor,
										borderColor: `${userPage.foregroundColor}40`
									}}
								>
									@{userPage.handle}
								</Badge>
								
								{userPage.shortDescription && (
									<p className="text-xl font-kaspa-body max-w-2xl mx-auto leading-relaxed" style={{ color: userPage.foregroundColor + 'E0' }}>
										{userPage.shortDescription}
									</p>
								)}
							</div>
						</div>

						{/* Long Description */}
						{userPage.longDescription && (
							<Card 
								className="border-2 backdrop-blur-xl shadow-xl mb-8 max-w-3xl mx-auto"
								style={{ 
									borderColor: `${userPage.foregroundColor}30`,
									backgroundColor: `${userPage.backgroundColor}95`
								}}
							>
								<CardContent className="p-8">
									<h2 className="text-2xl font-bold mb-6 font-kaspa-title text-center" style={{ color: userPage.foregroundColor }}>
										About {userPage.displayName || userPage.handle || 'User'}
									</h2>
									<div 
										className="prose prose-lg max-w-none text-center"
										style={{ 
											color: userPage.foregroundColor + 'DD',
											'--tw-prose-body': userPage.foregroundColor + 'DD',
											'--tw-prose-headings': userPage.foregroundColor,
											'--tw-prose-links': userPage.foregroundColor,
											'--tw-prose-bold': userPage.foregroundColor,
											'--tw-prose-counters': userPage.foregroundColor + '80',
											'--tw-prose-bullets': userPage.foregroundColor + '80',
											'--tw-prose-hr': userPage.foregroundColor + '40',
											'--tw-prose-quotes': userPage.foregroundColor + 'CC',
											'--tw-prose-quote-borders': userPage.foregroundColor + '40',
											'--tw-prose-captions': userPage.foregroundColor + '80',
											'--tw-prose-code': userPage.foregroundColor,
											'--tw-prose-pre-code': userPage.foregroundColor + 'DD',
											'--tw-prose-pre-bg': userPage.backgroundColor + '20',
											'--tw-prose-th-borders': userPage.foregroundColor + '40',
											'--tw-prose-td-borders': userPage.foregroundColor + '20'
										} as React.CSSProperties}
										dangerouslySetInnerHTML={{ __html: userPage.longDescription }}
									/>
								</CardContent>
							</Card>
						)}

						{/* Support Section */}
						<Card 
							className="border-2 backdrop-blur-xl shadow-xl max-w-2xl mx-auto"
							style={{ 
								borderColor: `${userPage.foregroundColor}40`,
								backgroundColor: `${userPage.backgroundColor}95`
							}}
						>
							<CardContent className="p-8 text-center">
								<Coffee className="w-16 h-16 mx-auto mb-6" style={{ color: userPage.foregroundColor }} />
								<h2 className="text-3xl font-bold mb-4 font-kaspa-title" style={{ color: userPage.foregroundColor }}>
									Support {userPage.displayName || userPage.handle || 'User'}
								</h2>
								<p className="text-lg mb-8 opacity-90 font-kaspa-body" style={{ color: userPage.foregroundColor }}>
									Send Kaspa donations to show your support
								</p>
								
								<div className="space-y-6">
									<div 
										className="p-4 rounded-xl border-2 bg-black/20 backdrop-blur-sm font-mono text-sm break-all"
										style={{ 
											borderColor: `${userPage.foregroundColor}30`,
											color: userPage.foregroundColor 
										}}
									>
										{userPage.kaspaAddress}
									</div>
									
									<div className="flex flex-col sm:flex-row gap-4 justify-center">
										<Button
											size="lg"
											className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold px-8 py-3 rounded-xl shadow-lg transition-all duration-300"
											onClick={() => {
												navigator.clipboard.writeText(userPage.kaspaAddress);
											}}
										>
											<Copy className="w-5 h-5 mr-2" />
											Copy Address
										</Button>
										
										<Button
											variant="outline"
											size="lg"
											className="border-2 backdrop-blur-md bg-white/10 hover:bg-white/20 font-semibold px-8 py-3 rounded-xl transition-all duration-300"
											style={{ 
												borderColor: userPage.foregroundColor + '60',
												color: userPage.foregroundColor,
											}}
											onClick={() => {
												const amount = prompt('Enter Kaspa amount (optional):');
												const kaspaUrl = amount 
													? `kaspa:${userPage.kaspaAddress}?amount=${amount}`
													: `kaspa:${userPage.kaspaAddress}`;
												window.open(kaspaUrl, '_blank');
											}}
										>
											<ExternalLink className="w-5 h-5 mr-2" />
											Open Wallet
										</Button>
									</div>
								</div>
								
								{userPage.socials.length > 0 && (
									<div className="mt-8 pt-6 border-t" style={{ borderColor: `${userPage.foregroundColor}30` }}>
										<h3 className="text-lg font-semibold mb-4 font-kaspa-body" style={{ color: userPage.foregroundColor }}>
											Connect with me
										</h3>
										<div className="flex flex-wrap justify-center gap-3">
											{userPage.socials.map((social) => {
												const IconComponent = socialIconMap[social.platform as keyof typeof socialIconMap] || FaGlobe;
												return (
													<a
														key={social.id}
														href={social.url}
														target="_blank"
														rel="noopener noreferrer"
														className="inline-flex items-center"
													>
														<Badge 
															variant="outline" 
															className="px-4 py-2 border-2 backdrop-blur-md bg-white/10 hover:bg-white/20 transition-all duration-300 cursor-pointer"
															style={{ 
																borderColor: userPage.foregroundColor + '60',
																color: userPage.foregroundColor,
															}}
														>
															<IconComponent className="w-4 h-4 mr-2" />
															{social.platform?.charAt(0)?.toUpperCase() + (social.platform?.slice(1) || '')}
															<ExternalLink className="w-3 h-3 ml-2" />
														</Badge>
													</a>
												);
											})}
										</div>
									</div>
								)}
							</CardContent>
						</Card>
					</div>
				</div>
			</div>
	);
} 
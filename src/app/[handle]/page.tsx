"use client";

import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { ExternalLink, Copy, Coffee, Share2, User, Eye, QrCode, Zap, Heart, ArrowLeft } from 'lucide-react';
import { FaTwitter, FaDiscord, FaTelegram, FaGlobe, FaGithub } from 'react-icons/fa';
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
		console.log('Frontend: Fetching user page for handle:', handle);
		const response = await fetch(`/api/user-page/${handle}`, {
			cache: 'no-store'
		});
		
		console.log('Frontend: API response status:', response.status);
		
		if (response.status === 404) {
			console.log('Frontend: User page not found (404)');
			return null;
		}
		
		if (!response.ok) {
			console.error('Frontend: API error:', response.status, response.statusText);
			throw new Error(`API Error: ${response.status}`);
		}
		
		const data = await response.json();
		console.log('Frontend: Successfully fetched user page data', data);
		return data;
	} catch (error) {
		console.error('Frontend: Error fetching user page:', error);
		throw error;
	}
}

interface PageProps {
	params: Promise<{
		handle: string;
	}>;
}

export default function UserProfilePage({ params }: PageProps) {
	const [userPage, setUserPage] = useState<UserPageData | null>(null);
	const [loading, setLoading] = useState(true);
	const [handle, setHandle] = useState<string>('');
	const [copied, setCopied] = useState(false);

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
			console.log('Frontend: Loading user page for handle:', handle);
			try {
				const data = await fetchUserPage(handle);
				console.log('Frontend: Received user page data:', data);
				setUserPage(data);
			} catch (error) {
				console.error('Frontend: Error loading user page:', error);
				setUserPage(null);
			} finally {
				setLoading(false);
			}
		}

		loadUserPage();
	}, [handle]);

	const handleCopyAddress = async () => {
		if (!userPage) return;
		try {
			const address = userPage.kaspaAddress.replace('kaspa:', '');
			await navigator.clipboard.writeText(address);
			setCopied(true);
			setTimeout(() => setCopied(false), 2000);
		} catch (err) {
			console.error('Failed to copy address:', err);
		}
	};

	const handleShare = async (platform?: string) => {
		if (!userPage) return;
		
		const url = window.location.href;
		const title = `${userPage.displayName || userPage.handle} - kas.coffee`;
		const text = userPage.shortDescription || `Support ${userPage.displayName || userPage.handle} with Kaspa donations`;
		
		if (platform) {
			let shareUrl = '';
			switch (platform) {
				case 'twitter':
					shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
					break;
				case 'discord':
					try {
						await navigator.clipboard.writeText(`${text}\n${url}`);
					} catch (err) {
						console.error('Failed to copy for Discord:', err);
					}
					return;
				case 'telegram':
					shareUrl = `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`;
					break;
			}
			if (shareUrl) {
				window.open(shareUrl, '_blank', 'width=600,height=400');
			}
		} else {
			if (navigator.share) {
				try {
					await navigator.share({ title, text, url });
				} catch {
					await navigator.clipboard.writeText(url);
				}
			} else {
				try {
					await navigator.clipboard.writeText(url);
				} catch (err) {
					console.error('Failed to copy URL:', err);
				}
			}
		}
	};

	if (loading) {
		return (
			<div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
				<div className="text-center">
					<Coffee className="w-16 h-16 mx-auto mb-4 text-[#70C7BA] animate-pulse" />
					<div className="text-[#70C7BA] text-xl font-semibold">Loading profile...</div>
				</div>
			</div>
		);
	}

	if (!userPage) {
		console.error('Frontend: User page data is null, calling notFound for handle:', handle);
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
		<div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 relative overflow-hidden">
			{/* Animated background */}
			<div className="absolute inset-0 bg-gradient-to-r from-[#70C7BA]/5 via-[#49EACB]/5 to-[#70C7BA]/5 animate-pulse"></div>
			<div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#70C7BA]/10 rounded-full blur-3xl animate-bounce-gentle"></div>
			<div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#49EACB]/10 rounded-full blur-3xl animate-bounce-gentle delay-1000"></div>

			{/* Header */}
			<header className="relative z-10 border-b border-[#70C7BA]/20 bg-slate-900/80 backdrop-blur-xl">
				<div className="container mx-auto px-6 py-4">
					<div className="flex items-center justify-between">
						<Link href="/" className="flex items-center gap-3 text-[#70C7BA] hover:text-[#49EACB] transition-all duration-300 group">
							<ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
							<Coffee className="w-6 h-6" />
							<span className="text-lg font-bold">kas.coffee</span>
						</Link>
						
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button variant="outline" size="sm" className="border-[#70C7BA]/50 text-[#70C7BA] hover:bg-[#70C7BA]/10 hover:border-[#70C7BA] rounded-full backdrop-blur-sm">
									<Share2 className="w-4 h-4 mr-2" />
									Share
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent className="w-48 bg-slate-800/90 backdrop-blur-xl border-[#70C7BA]/30">
								<DropdownMenuItem onClick={() => handleShare('twitter')} className="text-white hover:bg-[#70C7BA]/20">
									<FaTwitter className="w-4 h-4 mr-2 text-blue-400" />
									Twitter
								</DropdownMenuItem>
								<DropdownMenuItem onClick={() => handleShare('discord')} className="text-white hover:bg-[#70C7BA]/20">
									<FaDiscord className="w-4 h-4 mr-2 text-indigo-400" />
									Discord
								</DropdownMenuItem>
								<DropdownMenuItem onClick={() => handleShare('telegram')} className="text-white hover:bg-[#70C7BA]/20">
									<FaTelegram className="w-4 h-4 mr-2 text-blue-300" />
									Telegram
								</DropdownMenuItem>
								<DropdownMenuItem onClick={() => handleShare()} className="text-white hover:bg-[#70C7BA]/20">
									<ExternalLink className="w-4 h-4 mr-2" />
									Copy Link
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
					</div>
				</div>
			</header>

			{/* Main Content */}
			<main className="relative z-10 container mx-auto px-6 py-12 max-w-6xl">
				{/* Profile Header */}
				<div className="text-center mb-12">
					<div className="relative inline-block mb-8">
						<div className="w-40 h-40 rounded-full bg-gradient-to-br from-[#70C7BA] to-[#49EACB] p-1 shadow-2xl">
							<Avatar className="w-full h-full border-4 border-slate-900">
								<AvatarImage 
									src={userPage.profileImage || undefined}
									alt={userPage.displayName || userPage.handle}
									className="object-cover"
								/>
								<AvatarFallback className="text-4xl font-bold bg-gradient-to-br from-[#70C7BA] to-[#49EACB] text-white">
									{(userPage.displayName || userPage.handle)?.charAt(0)?.toUpperCase() || 'U'}
								</AvatarFallback>
							</Avatar>
						</div>
						<div className="absolute -bottom-2 -right-2 w-10 h-10 bg-[#49EACB] rounded-full flex items-center justify-center shadow-xl border-4 border-slate-900">
							<Coffee className="w-5 h-5 text-white" />
						</div>
					</div>
					
					<h1 className="text-5xl md:text-6xl font-black text-white mb-4 bg-gradient-to-r from-[#70C7BA] to-[#49EACB] bg-clip-text text-transparent">
						{userPage.displayName || userPage.handle}
					</h1>
					
					<Badge className="mb-6 px-6 py-3 text-lg bg-[#70C7BA]/20 text-[#70C7BA] border border-[#70C7BA]/30 rounded-full backdrop-blur-sm">
						@{userPage.handle}
					</Badge>
					
					{userPage.shortDescription && (
						<p className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed mb-8 bg-white/5 rounded-2xl p-6 border border-[#70C7BA]/20 backdrop-blur-sm">
							{userPage.shortDescription}
						</p>
					)}

					{/* Stats */}
					<div className="flex justify-center items-center gap-8 text-gray-400 mb-8">
						<div className="flex items-center gap-2">
							<Eye className="w-5 h-5 text-[#70C7BA]" />
							<span className="text-white">{userPage.viewCount || 0} views</span>
						</div>
						<div className="w-2 h-2 bg-[#70C7BA]/50 rounded-full"></div>
						<div className="flex items-center gap-2">
							<Zap className="w-5 h-5 text-[#49EACB]" />
							<span className="text-white">Powered by Kaspa</span>
						</div>
					</div>
				</div>

				{/* Social Links */}
				{userPage.socials && userPage.socials.length > 0 && (
					<div className="flex justify-center mb-12">
						<div className="flex flex-wrap justify-center gap-4">
							{userPage.socials.map((social) => {
								const IconComponent = socialIconMap[social.platform as keyof typeof socialIconMap] || FaGlobe;
								return (
									<a
										key={social.id}
										href={social.url}
										target="_blank"
										rel="noopener noreferrer"
										className="group"
									>
										<Button
											variant="outline"
											size="sm"
											className="border-[#70C7BA]/30 text-[#70C7BA] hover:bg-[#70C7BA]/20 hover:border-[#70C7BA] transition-all duration-300 rounded-full backdrop-blur-sm group-hover:scale-105"
										>
											<IconComponent className="w-4 h-4 mr-2" />
											{social.platform.charAt(0).toUpperCase() + social.platform.slice(1)}
										</Button>
									</a>
								);
							})}
						</div>
					</div>
				)}

				{/* Content Grid */}
				<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
					{/* About Section */}
					{userPage.longDescription && (
						<div className="lg:col-span-2">
							<Card className="bg-white/5 backdrop-blur-xl border border-[#70C7BA]/30 shadow-2xl">
								<CardContent className="p-8">
									<div className="flex items-center gap-3 mb-6">
										<User className="w-6 h-6 text-[#70C7BA]" />
										<h2 className="text-2xl font-bold text-white">
											About {userPage.displayName || userPage.handle}
										</h2>
									</div>
									<div 
										className="prose prose-lg max-w-none text-gray-300 leading-relaxed prose-headings:text-white prose-strong:text-white prose-a:text-[#70C7BA]"
										dangerouslySetInnerHTML={{ __html: userPage.longDescription }}
									/>
								</CardContent>
							</Card>
						</div>
					)}

					{/* Donation Section */}
					<div className={userPage.longDescription ? '' : 'lg:col-span-3 max-w-md mx-auto'}>
						<Card className="bg-gradient-to-br from-[#70C7BA]/20 to-[#49EACB]/10 backdrop-blur-xl border border-[#70C7BA]/40 shadow-2xl">
							<CardContent className="p-8">
								<div className="text-center mb-8">
									<div className="inline-flex items-center gap-3 bg-[#70C7BA]/20 text-[#70C7BA] rounded-full px-6 py-3 mb-6 border border-[#70C7BA]/30">
										<Heart className="w-5 h-5" />
										<span className="font-semibold">Support with Kaspa</span>
									</div>
									<h2 className="text-3xl font-bold text-white mb-3">
										Buy me a coffee
									</h2>
									<p className="text-gray-300">
										Send Kaspa donations to show your support
									</p>
								</div>
								
								{/* QR Code and Address */}
								<Tabs defaultValue="qr" className="w-full">
									<TabsList className="grid w-full grid-cols-2 mb-8 bg-slate-800/50 border border-[#70C7BA]/30">
										<TabsTrigger value="qr" className="data-[state=active]:bg-[#70C7BA] data-[state=active]:text-white text-gray-300">
											<QrCode className="w-4 h-4 mr-2" />
											QR Code
										</TabsTrigger>
										<TabsTrigger value="address" className="data-[state=active]:bg-[#70C7BA] data-[state=active]:text-white text-gray-300">
											<Copy className="w-4 h-4 mr-2" />
											Address
										</TabsTrigger>
									</TabsList>
									
									<TabsContent value="qr" className="space-y-6">
										<div className="flex justify-center">
											<div className="bg-white p-6 rounded-2xl shadow-2xl">
												<QRCodeDisplay address={userPage.kaspaAddress} size={200} />
											</div>
										</div>
										<p className="text-center text-gray-400 text-sm">
											Scan with your Kaspa wallet app
										</p>
									</TabsContent>
									
									<TabsContent value="address" className="space-y-6">
										<div className="p-6 rounded-2xl border border-[#70C7BA]/30 bg-slate-800/50 backdrop-blur-sm">
											<p className="text-xs text-gray-400 mb-2">Kaspa Address:</p>
											<p className="font-mono text-sm text-white break-all">
												{userPage.kaspaAddress.replace('kaspa:', '')}
											</p>
										</div>
									</TabsContent>
								</Tabs>
								
								{/* Action Buttons */}
								<div className="space-y-4">
									<Button
										onClick={handleCopyAddress}
										className="w-full bg-[#70C7BA] hover:bg-[#5ba8a0] text-white font-semibold py-4 rounded-xl shadow-lg hover:shadow-[#70C7BA]/25 transition-all duration-300"
									>
										<Copy className="w-5 h-5 mr-2" />
										{copied ? 'Address Copied!' : 'Copy Kaspa Address'}
									</Button>
									
									<Button
										variant="outline"
										onClick={() => {
											const cleanAddress = userPage.kaspaAddress.replace('kaspa:', '');
											const amount = prompt('Enter Kaspa amount (optional):');
											const kaspaUrl = amount 
												? `kaspa:${cleanAddress}?amount=${amount}`
												: `kaspa:${cleanAddress}`;
											window.open(kaspaUrl, '_blank');
										}}
										className="w-full border-[#70C7BA]/50 text-[#70C7BA] hover:bg-[#70C7BA]/10 hover:border-[#70C7BA] py-4 rounded-xl backdrop-blur-sm transition-all duration-300"
									>
										<ExternalLink className="w-5 h-5 mr-2" />
										Open in Wallet
									</Button>
								</div>
							</CardContent>
						</Card>
					</div>
				</div>
			</main>
		</div>
	);
} 
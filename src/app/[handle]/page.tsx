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
import { WalletBalance } from '@/components/wallet/wallet-balance';
import { TransactionList } from '@/components/wallet/transaction-list';
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
			cache: 'no-store'
		});
		

		
		if (response.status === 404) {

			return null;
		}
		
		if (!response.ok) {

			throw new Error(`API Error: ${response.status}`);
		}
		
		const data = await response.json();

		return data;
	} catch (error) {

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
	
			try {
				const data = await fetchUserPage(handle);
				setUserPage(data);

				// Track page view with unique IP filtering
				if (data) {
					try {
						await fetch(`/api/track-view/${handle}`, {
							method: 'POST',
							headers: {
								'Content-Type': 'application/json',
							},
						});
					} catch {
						// Silently fail if view tracking fails
					}
				}
			} catch {
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
			await navigator.clipboard.writeText(userPage.kaspaAddress);
			setCopied(true);
			setTimeout(() => setCopied(false), 2000);
		} catch {
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
					} catch {
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
				} catch {
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
				<div className="container mx-auto px-4 sm:px-6 py-3 sm:py-4">
					<div className="flex items-center justify-between">
						<Link href="/" className="flex items-center gap-2 sm:gap-3 text-[#70C7BA] hover:text-[#49EACB] transition-all duration-300 group">
							<ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 group-hover:-translate-x-1 transition-transform" />
							<Coffee className="w-5 h-5 sm:w-6 sm:h-6" />
							<span className="text-base sm:text-lg font-bold">kas.coffee</span>
						</Link>
						
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button variant="outline" size="sm" className="border-[#70C7BA]/50 text-[#70C7BA] hover:bg-[#70C7BA]/10 hover:border-[#70C7BA] rounded-full backdrop-blur-sm text-xs sm:text-sm px-2 sm:px-4">
									<Share2 className="w-3 h-3 sm:w-4 sm:h-4 sm:mr-2" />
									<span className="hidden sm:inline">Share</span>
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
			<main className="relative z-10 container mx-auto px-4 sm:px-6 py-8 sm:py-12 max-w-6xl">
				{/* Profile Header */}
				<div className="text-center mb-8 sm:mb-12">
					<div className="relative inline-block mb-6 sm:mb-8">
						<div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full bg-gradient-to-br from-[#70C7BA] to-[#49EACB] p-1 shadow-2xl">
							<Avatar className="w-full h-full border-4 border-slate-900">
								<AvatarImage 
									src={userPage.profileImage || undefined}
									alt={userPage.displayName || userPage.handle}
									className="object-cover"
								/>
								<AvatarFallback className="text-2xl sm:text-4xl font-bold bg-gradient-to-br from-[#70C7BA] to-[#49EACB] text-white">
									{(userPage.displayName || userPage.handle)?.charAt(0)?.toUpperCase() || 'U'}
								</AvatarFallback>
							</Avatar>
						</div>
						<div className="absolute -bottom-1 -right-1 sm:-bottom-2 sm:-right-2 w-8 h-8 sm:w-10 sm:h-10 bg-[#49EACB] rounded-full flex items-center justify-center shadow-xl border-2 sm:border-4 border-slate-900">
							<Coffee className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
						</div>
					</div>
					
					<h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-white mb-3 sm:mb-4 bg-gradient-to-r from-[#70C7BA] to-[#49EACB] bg-clip-text text-transparent px-4">
						{userPage.displayName || userPage.handle}
					</h1>
					
					<Badge className="mb-4 sm:mb-6 px-4 py-2 sm:px-6 sm:py-3 text-sm sm:text-lg bg-[#70C7BA]/20 text-[#70C7BA] border border-[#70C7BA]/30 rounded-full backdrop-blur-sm">
						@{userPage.handle}
					</Badge>
					
					{userPage.shortDescription && (
						<p className="text-lg sm:text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed mb-6 sm:mb-8 bg-white/5 rounded-2xl p-4 sm:p-6 border border-[#70C7BA]/20 backdrop-blur-sm mx-4">
							{userPage.shortDescription}
						</p>
					)}

					{/* Stats */}
					<div className="flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-8 text-gray-400 mb-6 sm:mb-8 px-4">
						<div className="flex items-center gap-2">
							<Eye className="w-4 h-4 sm:w-5 sm:h-5 text-[#70C7BA]" />
							<span className="text-white text-sm sm:text-base">{userPage.viewCount || 0} views</span>
						</div>
						<div className="w-2 h-2 bg-[#70C7BA]/50 rounded-full hidden sm:block"></div>
						<div className="flex items-center gap-2">
							<Zap className="w-4 h-4 sm:w-5 sm:h-5 text-[#49EACB]" />
							<span className="text-white text-sm sm:text-base">Powered by Kaspa</span>
						</div>
					</div>
				</div>

				{/* Social Links */}
				{userPage.socials && userPage.socials.length > 0 && (
					<div className="flex justify-center mb-8 sm:mb-12 px-4">
						<div className="flex flex-wrap justify-center gap-3 sm:gap-4">
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
											className="border-[#70C7BA]/30 text-[#70C7BA] hover:bg-[#70C7BA]/20 hover:border-[#70C7BA] transition-all duration-300 rounded-full backdrop-blur-sm group-hover:scale-105 text-xs sm:text-sm px-3 sm:px-4"
										>
											<IconComponent className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
											<span className="hidden sm:inline">{social.platform.charAt(0).toUpperCase() + social.platform.slice(1)}</span>
											<span className="sm:hidden">{social.platform.charAt(0).toUpperCase()}</span>
										</Button>
									</a>
								);
							})}
						</div>
					</div>
				)}

				{/* Content Grid */}
				<div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 px-4">
					{/* About Section */}
					{userPage.longDescription && (
						<div className="lg:col-span-2">
							<Card className="bg-white/5 backdrop-blur-xl border border-[#70C7BA]/30 shadow-2xl">
								<CardContent className="p-4 sm:p-6 lg:p-8">
									<div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
										<User className="w-5 h-5 sm:w-6 sm:h-6 text-[#70C7BA]" />
										<h2 className="text-xl sm:text-2xl font-bold text-white">
											About {userPage.displayName || userPage.handle}
										</h2>
									</div>
									<div 
										className="prose prose-sm sm:prose-lg max-w-none text-gray-300 leading-relaxed prose-headings:text-white prose-strong:text-white prose-a:text-[#70C7BA]"
										dangerouslySetInnerHTML={{ __html: userPage.longDescription }}
									/>
								</CardContent>
							</Card>
						</div>
					)}

					{/* Donation Section */}
					<div className={userPage.longDescription ? 'lg:col-span-1' : 'lg:col-span-3 max-w-md mx-auto w-full'}>
						<Card className="bg-gradient-to-br from-[#70C7BA]/20 to-[#49EACB]/10 backdrop-blur-xl border border-[#70C7BA]/40 shadow-2xl">
							<CardContent className="p-4 sm:p-6 lg:p-8">
								<div className="text-center mb-8">
									<div className="inline-flex items-center gap-3 bg-[#70C7BA]/20 text-[#70C7BA] rounded-full px-4 py-2 sm:px-6 sm:py-3 mb-6 border border-[#70C7BA]/30">
										<Heart className="w-4 h-4 sm:w-5 sm:h-5" />
										<span className="font-semibold text-sm sm:text-base">Support with Kaspa</span>
									</div>
									<h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">
										Buy me a coffee
									</h2>
									<p className="text-gray-300 text-sm sm:text-base">
										Send Kaspa donations to show your support
									</p>
								</div>
								
								{/* QR Code and Address */}
								<Tabs defaultValue="qr" className="w-full">
									<TabsList className="grid w-full grid-cols-2 mb-6 sm:mb-8 bg-slate-800/50 border border-[#70C7BA]/30">
										<TabsTrigger value="qr" className="data-[state=active]:bg-[#70C7BA] data-[state=active]:text-white text-gray-300 text-sm sm:text-base">
											<QrCode className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
											<span className="hidden sm:inline">QR Code</span>
											<span className="sm:hidden">QR</span>
										</TabsTrigger>
										<TabsTrigger value="address" className="data-[state=active]:bg-[#70C7BA] data-[state=active]:text-white text-gray-300 text-sm sm:text-base">
											<Copy className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
											<span className="hidden sm:inline">Address</span>
											<span className="sm:hidden">Addr</span>
										</TabsTrigger>
									</TabsList>
									
									<TabsContent value="qr" className="space-y-4 sm:space-y-6">
										<div className="flex justify-center">
											<div className="bg-white p-3 sm:p-6 rounded-2xl shadow-2xl">
												<QRCodeDisplay address={userPage.kaspaAddress} responsive={true} />
											</div>
										</div>
										<p className="text-center text-gray-400 text-xs sm:text-sm">
											Scan with your Kaspa wallet app
										</p>
									</TabsContent>
									
									<TabsContent value="address" className="space-y-4 sm:space-y-6">
										<div className="p-4 sm:p-6 rounded-2xl border border-[#70C7BA]/30 bg-slate-800/50 backdrop-blur-sm">
											<p className="text-xs text-gray-400 mb-2">Kaspa Address:</p>
											<p className="font-mono text-xs sm:text-sm text-white break-all">
												{userPage.kaspaAddress}
											</p>
										</div>
									</TabsContent>
								</Tabs>
								
								{/* Action Buttons */}
								<div className="space-y-3 sm:space-y-4">
									<Button
										onClick={handleCopyAddress}
										className="w-full bg-[#70C7BA] hover:bg-[#5ba8a0] text-white font-semibold py-3 sm:py-4 rounded-xl shadow-lg hover:shadow-[#70C7BA]/25 transition-all duration-300 text-sm sm:text-base"
									>
										<Copy className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
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
										className="w-full border-[#70C7BA]/50 text-[#70C7BA] hover:bg-[#70C7BA]/10 hover:border-[#70C7BA] py-3 sm:py-4 rounded-xl backdrop-blur-sm transition-all duration-300 text-sm sm:text-base"
									>
										<ExternalLink className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
										Open in Wallet
									</Button>
								</div>
							</CardContent>
						</Card>
					</div>

					{/* Wallet Activity Section */}
					{userPage.kaspaAddress && (
						<div className="lg:col-span-3 mb-6 sm:mb-8">
							<div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 items-start">
								{/* Wallet Balance */}
								<div className="w-full">
									<WalletBalance address={userPage.kaspaAddress} />
								</div>
								
								{/* Recent Transactions */}
								<div className="w-full">
									<TransactionList address={userPage.kaspaAddress} limit={5} />
								</div>
							</div>
						</div>
					)}
				</div>
			</main>
		</div>
	);
} 
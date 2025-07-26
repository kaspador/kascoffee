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
						const trackResponse = await fetch(`/api/track-view/${handle}`, {
							method: 'POST',
							headers: {
								'Content-Type': 'application/json',
							},
						});
						
						if (trackResponse.ok) {
							const trackData = await trackResponse.json();
							
							// Update the local view count if the tracking was successful and counted
							if (trackData.success && trackData.counted && trackData.newViewCount) {
								setUserPage(prevData => prevData ? {
									...prevData,
									viewCount: trackData.newViewCount
								} : null);
							}
						}
					} catch {
						// Silent error handling
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

	// Clean and validate background image URL
	const getBackgroundImageStyle = () => {
		const cleanBgImage = userPage.backgroundImage?.trim();
		if (!cleanBgImage) return undefined;
		
		try {
			// Try to validate as URL first
			new URL(cleanBgImage);
			return `url(${cleanBgImage})`;
		} catch {
			// If URL validation fails, still try to use it if it looks like a reasonable URL
			if (cleanBgImage.startsWith('http://') || cleanBgImage.startsWith('https://')) {
				return `url(${cleanBgImage})`;
			}
			return undefined;
		}
	};

	// Clean and validate profile image URL (same logic as background)
	const getCleanProfileImageUrl = () => {
		const cleanProfileImage = userPage.profileImage?.trim();
		if (!cleanProfileImage) return undefined;
		
		try {
			// Try to validate as URL first
			new URL(cleanProfileImage);
			return cleanProfileImage;
		} catch {
			// If URL validation fails, still try to use it if it looks like a reasonable URL
			if (cleanProfileImage.startsWith('http://') || cleanProfileImage.startsWith('https://')) {
				return cleanProfileImage;
			}
			return undefined;
		}
	};

	return (
		<div 
			className="min-h-screen relative overflow-hidden"
			style={{ 
				backgroundColor: userPage.backgroundColor,
				backgroundImage: getBackgroundImageStyle(),
				backgroundSize: 'cover',
				backgroundPosition: 'center',
				backgroundRepeat: 'no-repeat'
			}}
		>
			{/* Background overlay for better text readability when background image is present */}
			{userPage.backgroundImage && (
				<div className="absolute inset-0 bg-black/40"></div>
			)}
			
			{/* Animated background elements - use user colors or defaults */}
			<div 
				className="absolute inset-0 animate-pulse"
				style={{ background: `linear-gradient(to right, ${userPage.backgroundColor}10, ${userPage.foregroundColor}05, ${userPage.backgroundColor}10)` }}
			></div>
			<div 
				className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl animate-bounce-gentle"
				style={{ backgroundColor: `${userPage.backgroundColor}20` }}
			></div>
			<div 
				className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full blur-3xl animate-bounce-gentle delay-1000"
				style={{ backgroundColor: `${userPage.foregroundColor}10` }}
			></div>

			{/* Header */}
			<header 
				className="relative z-10 border-b backdrop-blur-xl"
				style={{ 
					borderBottomColor: `${userPage.foregroundColor}20`,
					backgroundColor: `${userPage.backgroundColor}90`
				}}
			>
				<div className="container mx-auto px-6 py-4">
					<div className="flex items-center justify-between">
						<Link 
							href="/" 
							className="flex items-center gap-3 transition-all duration-300 group"
							style={{ color: userPage.foregroundColor }}
						>
							<ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
							<Coffee className="w-6 h-6" />
							<span className="text-lg font-bold">kas.coffee</span>
						</Link>
						
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button 
									variant="outline" 
									size="sm" 
									className="rounded-full backdrop-blur-sm transition-all duration-300"
									style={{ 
										borderColor: `${userPage.foregroundColor}50`,
										color: userPage.foregroundColor,
									}}
									onMouseEnter={(e) => {
										e.currentTarget.style.backgroundColor = `${userPage.foregroundColor}10`;
										e.currentTarget.style.borderColor = userPage.foregroundColor;
									}}
									onMouseLeave={(e) => {
										e.currentTarget.style.backgroundColor = 'transparent';
										e.currentTarget.style.borderColor = `${userPage.foregroundColor}50`;
									}}
								>
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
									src={getCleanProfileImageUrl()}
									alt={userPage.displayName || userPage.handle}
									className="object-cover"
									onError={(e) => {
										// Hide the broken image
										(e.target as HTMLImageElement).style.display = 'none';
									}}
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
					
					<h1 
						className="text-5xl md:text-6xl font-black mb-4"
						style={{ color: userPage.foregroundColor }}
					>
						{userPage.displayName || userPage.handle}
					</h1>
					
					<Badge 
						className="mb-6 px-6 py-3 text-lg rounded-full backdrop-blur-sm"
						style={{ 
							backgroundColor: `${userPage.foregroundColor}20`,
							color: userPage.foregroundColor,
							borderColor: `${userPage.foregroundColor}30`,
							borderWidth: '1px',
							borderStyle: 'solid'
						}}
					>
						@{userPage.handle}
					</Badge>
					
					{userPage.shortDescription && (
						<p 
							className="text-xl max-w-2xl mx-auto leading-relaxed mb-8 rounded-2xl p-6 backdrop-blur-sm"
							style={{ 
								color: userPage.foregroundColor,
								backgroundColor: `${userPage.foregroundColor}10`,
								borderColor: `${userPage.foregroundColor}20`,
								borderWidth: '1px',
								borderStyle: 'solid'
							}}
						>
							{userPage.shortDescription}
						</p>
					)}

					{/* Stats */}
					<div 
						className="flex justify-center items-center gap-8 mb-8"
						style={{ color: `${userPage.foregroundColor}80` }}
					>
						<div className="flex items-center gap-2">
							<Eye className="w-5 h-5" style={{ color: userPage.foregroundColor }} />
							<span style={{ color: userPage.foregroundColor }}>{userPage.viewCount || 0} views</span>
						</div>
						<div 
							className="w-2 h-2 rounded-full"
							style={{ backgroundColor: `${userPage.foregroundColor}50` }}
						></div>
						<div className="flex items-center gap-2">
							<Zap className="w-5 h-5" style={{ color: userPage.foregroundColor }} />
							<span style={{ color: userPage.foregroundColor }}>Powered by Kaspa</span>
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
					<div className={userPage.longDescription ? 'lg:col-span-1' : 'lg:col-span-3 max-w-md mx-auto'}>
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
											<a
												href={`https://kas.fyi/address/${userPage.kaspaAddress.startsWith('kaspa:') ? userPage.kaspaAddress : 'kaspa:' + userPage.kaspaAddress}`}
												target="_blank"
												rel="noopener noreferrer"
												className="block font-mono text-xs sm:text-sm text-white break-all hover:text-[#70C7BA] transition-colors group cursor-pointer"
												title="View on kas.fyi explorer"
											>
												<span className="group-hover:underline">{userPage.kaspaAddress}</span>
												<div className="flex items-center gap-1 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
													<ExternalLink className="w-3 h-3 text-[#70C7BA]" />
													<span className="text-[10px] text-[#70C7BA]">View on kas.fyi</span>
												</div>
											</a>
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

					{/* Wallet Activity Section */}
					{userPage.kaspaAddress && (
						<div className="lg:col-span-3 mb-8">
							<div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start align-top">
								{/* Wallet Balance */}
								<div className="flex">
									<WalletBalance address={userPage.kaspaAddress} />
								</div>
								
								{/* Recent Transactions */}
								<div className="flex">
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
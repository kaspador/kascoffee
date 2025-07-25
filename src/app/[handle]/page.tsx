"use client";

import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { ExternalLink, Copy, Coffee, Share2, User, Eye, QrCode, Zap } from 'lucide-react';
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
			return null; // Page legitimately doesn't exist
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
			await navigator.clipboard.writeText(userPage.kaspaAddress);
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
					// Discord doesn't have a direct share URL, copy to clipboard instead
					try {
						await navigator.clipboard.writeText(`${text}\n${url}`);
						// You could add a toast notification here
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
			// Default share behavior
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
			<div className="min-h-screen bg-gray-50 flex items-center justify-center">
				<div className="text-center">
					<Coffee className="w-16 h-16 mx-auto mb-4 text-[#70C7BA] animate-pulse" />
					<div className="text-gray-800 text-xl font-semibold">Loading profile...</div>
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
		<div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
			{/* Header */}
			<div className="bg-white/80 backdrop-blur-lg shadow-sm border-b border-gray-200/50 sticky top-0 z-50">
				<div className="container mx-auto px-4 py-4 flex justify-between items-center max-w-4xl">
					<Link
						href="/"
						className="flex items-center gap-2 text-[#70C7BA] hover:text-[#49EACB] transition-colors font-semibold"
					>
						<Coffee className="w-5 h-5" />
						<span className="text-lg font-bold">kas.coffee</span>
					</Link>
					
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button
								variant="outline"
								size="sm"
								className="border-[#70C7BA] text-[#70C7BA] hover:bg-[#70C7BA] hover:text-white shadow-sm"
							>
								<Share2 className="w-4 h-4 mr-2" />
								Share
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent className="w-48">
							<DropdownMenuItem onClick={() => handleShare('twitter')}>
								<FaTwitter className="w-4 h-4 mr-2 text-blue-500" />
								Twitter
							</DropdownMenuItem>
							<DropdownMenuItem onClick={() => handleShare('discord')}>
								<FaDiscord className="w-4 h-4 mr-2 text-indigo-500" />
								Discord
							</DropdownMenuItem>
							<DropdownMenuItem onClick={() => handleShare('telegram')}>
								<FaTelegram className="w-4 h-4 mr-2 text-blue-400" />
								Telegram
							</DropdownMenuItem>
							<DropdownMenuItem onClick={() => handleShare()}>
								<ExternalLink className="w-4 h-4 mr-2" />
								Share Link
							</DropdownMenuItem>
							<DropdownMenuItem onClick={handleCopyAddress}>
								<Copy className="w-4 h-4 mr-2" />
								Copy URL
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</div>
			</div>

			<div className="container mx-auto px-4 py-8 max-w-4xl">
				{/* Profile Header */}
				<div className="text-center mb-12">
					<div className="relative inline-block mb-6">
						<Avatar className="w-40 h-40 border-4 border-[#70C7BA] shadow-xl">
							<AvatarImage 
								src={userPage.profileImage ? userPage.profileImage : undefined}
								alt={userPage.displayName || userPage.handle}
								className="object-cover"
								onError={(e) => {
									console.log('Profile image failed to load:', userPage.profileImage);
									(e.target as HTMLImageElement).style.display = 'none';
								}}
							/>
							<AvatarFallback className="text-4xl font-bold bg-gradient-to-br from-[#70C7BA] to-[#49EACB] text-white">
								{(userPage.displayName || userPage.handle)?.charAt(0)?.toUpperCase() || 'U'}
							</AvatarFallback>
						</Avatar>
						<div className="absolute -bottom-2 -right-2 w-8 h-8 bg-[#49EACB] rounded-full flex items-center justify-center shadow-lg">
							<Coffee className="w-4 h-4 text-white" />
						</div>
					</div>
					
					<h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-4">
						{userPage.displayName || userPage.handle}
					</h1>
					
					<Badge className="mb-6 px-6 py-2 text-lg bg-[#70C7BA] text-white hover:bg-[#5ba8a0] rounded-full shadow-lg">
						@{userPage.handle}
					</Badge>
					
					{userPage.shortDescription && (
						<p className="text-xl text-gray-700 max-w-2xl mx-auto leading-relaxed mb-8 bg-white/50 rounded-2xl p-6 shadow-sm">
							{userPage.shortDescription}
						</p>
					)}

					{/* Stats */}
					<div className="flex justify-center items-center gap-6 text-gray-600 mb-8">
						<div className="flex items-center gap-2">
							<Eye className="w-4 h-4" />
							<span>{userPage.viewCount || 0} views</span>
						</div>
						<div className="w-1 h-1 bg-gray-400 rounded-full"></div>
						<div className="flex items-center gap-2 text-[#70C7BA]">
							<Zap className="w-4 h-4" />
							<span>Powered by Kaspa</span>
						</div>
					</div>
				</div>

				{/* Social Links */}
				{userPage.socials.length > 0 && (
					<div className="flex justify-center mb-8">
						<div className="flex flex-wrap justify-center gap-3">
							{userPage.socials.map((social) => {
								const IconComponent = socialIconMap[social.platform as keyof typeof socialIconMap] || FaGlobe;
								return (
									<a
										key={social.id}
										href={social.url}
										target="_blank"
										rel="noopener noreferrer"
									>
										<Button
											variant="outline"
											size="sm"
											className="border-gray-300 text-gray-700 hover:bg-[#70C7BA] hover:text-white hover:border-[#70C7BA] transition-all"
										>
											<IconComponent className="w-4 h-4 mr-2" />
											{social.platform.charAt(0).toUpperCase() + social.platform.slice(1)}
											<ExternalLink className="w-3 h-3 ml-2" />
										</Button>
									</a>
								);
							})}
						</div>
					</div>
				)}

				{/* Main Content */}
				<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
					{/* Left Column - About */}
					<div className="lg:col-span-2">
						{userPage.longDescription && (
							<Card className="bg-white shadow-lg border border-gray-200">
								<CardContent className="p-8">
									<div className="flex items-center gap-3 mb-6">
										<User className="w-6 h-6 text-[#70C7BA]" />
										<h2 className="text-2xl font-bold text-gray-900">
											About {userPage.displayName || userPage.handle}
										</h2>
									</div>
									<div 
										className="prose prose-lg max-w-none text-gray-700 leading-relaxed"
										dangerouslySetInnerHTML={{ __html: userPage.longDescription }}
									/>
								</CardContent>
							</Card>
						)}
					</div>

					{/* Right Column - Support */}
					<div className="space-y-6">
						<Card className="bg-white shadow-lg border border-gray-200">
							<CardContent className="p-6">
								<div className="text-center mb-6">
									<div className="inline-flex items-center gap-3 bg-[#70C7BA] text-white rounded-full px-4 py-2 mb-4">
										<Coffee className="w-5 h-5" />
										<span className="font-semibold">Support with Kaspa</span>
									</div>
									<h2 className="text-2xl font-bold text-gray-900 mb-2">
										Buy me a coffee
									</h2>
									<p className="text-gray-600">
										Send Kaspa donations to show your support
									</p>
								</div>
								
								{/* Wallet Address and QR */}
								<Tabs defaultValue="qr" className="w-full">
									<TabsList className="grid w-full grid-cols-2 mb-6 bg-gray-100">
										<TabsTrigger value="qr" className="data-[state=active]:bg-[#70C7BA] data-[state=active]:text-white">
											<QrCode className="w-4 h-4 mr-2" />
											QR Code
										</TabsTrigger>
										<TabsTrigger value="address" className="data-[state=active]:bg-[#70C7BA] data-[state=active]:text-white">
											<Copy className="w-4 h-4 mr-2" />
											Address
										</TabsTrigger>
									</TabsList>
									
									<TabsContent value="qr" className="space-y-4">
										<div className="flex justify-center">
											<div className="bg-white p-4 rounded-lg border border-gray-200 shadow-inner">
												<QRCodeDisplay address={userPage.kaspaAddress} size={180} />
											</div>
										</div>
										<p className="text-center text-gray-500 text-sm">
											Scan with your Kaspa wallet app
										</p>
									</TabsContent>
									
									<TabsContent value="address" className="space-y-4">
										<div className="p-4 rounded-lg border border-gray-200 bg-gray-50 font-mono text-sm text-gray-900 break-all text-center">
											{userPage.kaspaAddress}
										</div>
									</TabsContent>
								</Tabs>
								
								{/* Action Buttons */}
								<div className="flex flex-col gap-3 mt-6">
									<Button
										onClick={handleCopyAddress}
										className="w-full bg-[#70C7BA] hover:bg-[#5ba8a0] text-white font-semibold py-3"
									>
										<Copy className="w-4 h-4 mr-2" />
										{copied ? 'Address Copied!' : 'Copy Kaspa Address'}
									</Button>
									
									<Button
										variant="outline"
										onClick={() => {
											const amount = prompt('Enter Kaspa amount (optional):');
											const kaspaUrl = amount 
												? `kaspa:${userPage.kaspaAddress}?amount=${amount}`
												: `kaspa:${userPage.kaspaAddress}`;
											window.open(kaspaUrl, '_blank');
										}}
										className="w-full border-[#70C7BA] text-[#70C7BA] hover:bg-[#70C7BA] hover:text-white py-3"
									>
										<ExternalLink className="w-4 h-4 mr-2" />
										Open in Wallet
									</Button>
								</div>
							</CardContent>
						</Card>

						{/* Wallet Address Card */}
						<Card className="bg-gray-900 text-white shadow-lg">
							<CardContent className="p-4">
								<div className="text-center">
									<p className="text-gray-400 text-sm mb-2">Kaspa Address</p>
									<p className="font-mono text-xs break-all text-gray-200">
										{userPage.kaspaAddress}
									</p>
								</div>
							</CardContent>
						</Card>
					</div>
				</div>
			</div>
		</div>
	);
} 
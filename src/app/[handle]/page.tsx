"use client";

import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
			// For other errors (500, etc.), we should retry or show a different error
			// For now, let's not call notFound() for server errors
			throw new Error(`API Error: ${response.status}`);
		}
		
		const data = await response.json();
		console.log('Frontend: Successfully fetched user page data');
		return data;
	} catch (error) {
		console.error('Frontend: Error fetching user page:', error);
		// Don't return null for network errors - this would trigger notFound incorrectly
		// Instead, we'll handle this in the component
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
				// For network errors or API errors, set userPage to null
				// The component will handle showing appropriate error
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

	const handleShare = async () => {
		if (!userPage) return;
		
		if (navigator.share) {
			try {
				await navigator.share({
					title: `${userPage.displayName || userPage.handle} - kas.coffee`,
					text: userPage.shortDescription || `Support ${userPage.displayName || userPage.handle} with Kaspa donations`,
					url: window.location.href,
				});
			} catch {
				// User cancelled share or error occurred
				handleCopyAddress();
			}
		} else {
			// Fallback: copy URL to clipboard
			try {
				await navigator.clipboard.writeText(window.location.href);
			} catch (err) {
				console.error('Failed to copy URL:', err);
			}
		}
	};

	if (loading) {
		return (
			<div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
				<div className="text-center">
					<Coffee className="w-12 h-12 mx-auto mb-4 text-[#70C7BA] animate-pulse" />
					<div className="text-white text-xl">Loading...</div>
				</div>
			</div>
		);
	}

	// Only call notFound if we're sure the page doesn't exist
	// Don't call it on API errors or temporary issues
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
		<div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 relative">
			{/* Animated background with Kaspa colors */}
			<div className="absolute inset-0 bg-gradient-to-r from-[#70C7BA]/10 via-[#49EACB]/10 to-[#70C7BA]/10 animate-pulse"></div>
			<div className="absolute top-20 left-20 w-72 h-72 bg-[#70C7BA]/20 rounded-full blur-3xl animate-pulse"></div>
			<div className="absolute bottom-20 right-20 w-96 h-96 bg-[#49EACB]/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
			
			<div className="relative z-10 container mx-auto px-4 py-6 max-w-6xl">
				{/* Header */}
				<div className="flex justify-between items-center mb-8">
					<Link
						href="/"
						className="flex items-center gap-2 text-[#70C7BA] hover:text-[#49EACB] transition-colors font-semibold"
					>
						<Coffee className="w-5 h-5" />
						<span>kas.coffee</span>
					</Link>
					
					<Button
						variant="outline"
						size="sm"
						onClick={handleShare}
						className="border-[#70C7BA]/40 text-[#70C7BA] hover:bg-[#70C7BA]/10 bg-transparent"
					>
						<Share2 className="w-4 h-4 mr-2" />
						Share
					</Button>
				</div>

				{/* Profile Header */}
				<div className="text-center mb-12">
					<Avatar className="w-32 h-32 mx-auto mb-6 border-4 border-[#70C7BA] shadow-xl shadow-[#70C7BA]/25">
						<AvatarImage src={userPage.profileImage || undefined} alt={userPage.displayName || userPage.handle} />
						<AvatarFallback className="text-3xl font-bold bg-gradient-to-br from-[#70C7BA] to-[#49EACB] text-white">
							{(userPage.displayName || userPage.handle)?.charAt(0)?.toUpperCase() || 'U'}
						</AvatarFallback>
					</Avatar>
					
					<h1 className="text-4xl md:text-6xl font-black mb-4">
						<span className="bg-gradient-to-r from-white via-[#70C7BA] to-[#49EACB] bg-clip-text text-transparent">
							{userPage.displayName || userPage.handle}
						</span>
					</h1>
					
					<Badge 
						className="mb-6 px-4 py-2 text-lg bg-gradient-to-r from-[#70C7BA]/20 to-[#49EACB]/20 border border-[#70C7BA]/30 text-[#70C7BA]"
					>
						@{userPage.handle}
					</Badge>
					
					{userPage.shortDescription && (
						<p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed mb-6">
							{userPage.shortDescription}
						</p>
					)}

					{/* Stats Row */}
					<div className="flex justify-center items-center gap-6 mb-8">
						<div className="flex items-center gap-2 text-gray-400">
							<Eye className="w-4 h-4" />
							<span>{userPage.viewCount || 0} views</span>
						</div>
						<div className="w-1 h-1 bg-gray-600 rounded-full"></div>
						<div className="flex items-center gap-2 text-[#70C7BA]">
							<Zap className="w-4 h-4" />
							<span>Powered by Kaspa</span>
						</div>
					</div>
				</div>

				{/* Social Links */}
				{userPage.socials.length > 0 && (
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
											className="border-[#70C7BA]/40 text-white hover:bg-[#70C7BA]/20 bg-gradient-to-r from-[#70C7BA]/10 to-[#49EACB]/10 backdrop-blur-xl transition-all duration-300 group-hover:scale-105"
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

				{/* Main Content Grid */}
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
					{/* Left Column - About */}
					<div className="space-y-6">
						{userPage.longDescription && (
							<Card className="border-[#70C7BA]/30 bg-gradient-to-br from-slate-900/95 to-slate-800/95 backdrop-blur-xl">
								<CardContent className="p-8">
									<div className="flex items-center gap-3 mb-6">
										<User className="w-6 h-6 text-[#70C7BA]" />
										<h2 className="text-2xl font-bold text-white">
											About {userPage.displayName || userPage.handle}
										</h2>
									</div>
									<div 
										className="prose prose-lg max-w-none text-gray-300 leading-relaxed"
										style={{ 
											'--tw-prose-body': '#d1d5db',
											'--tw-prose-headings': '#ffffff',
											'--tw-prose-links': '#70C7BA',
											'--tw-prose-strong': '#ffffff',
										} as React.CSSProperties}
										dangerouslySetInnerHTML={{ __html: userPage.longDescription }}
									/>
								</CardContent>
							</Card>
						)}
					</div>

					{/* Right Column - Support */}
					<div className="space-y-6">
						<Card className="border-[#70C7BA]/30 bg-gradient-to-br from-slate-900/95 to-slate-800/95 backdrop-blur-xl">
							<CardContent className="p-8">
								<div className="text-center mb-8">
									<div className="inline-flex items-center gap-3 bg-gradient-to-r from-[#70C7BA]/20 to-[#49EACB]/20 backdrop-blur-xl border border-[#70C7BA]/30 rounded-full px-6 py-3 mb-6">
										<Coffee className="w-6 h-6 text-[#70C7BA]" />
										<span className="text-[#70C7BA] font-semibold">Support with Kaspa</span>
									</div>
									<h2 className="text-3xl font-bold text-white mb-2">
										Buy me a coffee
									</h2>
									<p className="text-gray-400">
										Send Kaspa donations to show your support
									</p>
								</div>
								
								{/* Donation Tabs */}
								<Tabs defaultValue="qr" className="w-full">
									<TabsList className="grid w-full grid-cols-2 mb-6 bg-slate-800 border-[#70C7BA]/30">
										<TabsTrigger value="qr" className="data-[state=active]:bg-[#70C7BA] data-[state=active]:text-white">
											<QrCode className="w-4 h-4 mr-2" />
											QR Code
										</TabsTrigger>
										<TabsTrigger value="address" className="data-[state=active]:bg-[#70C7BA] data-[state=active]:text-white">
											<Copy className="w-4 h-4 mr-2" />
											Address
										</TabsTrigger>
									</TabsList>
									
									<TabsContent value="qr" className="space-y-6">
										<div className="flex justify-center">
											<div className="bg-white p-6 rounded-xl shadow-lg">
												<QRCodeDisplay address={userPage.kaspaAddress} size={200} />
											</div>
										</div>
										<p className="text-center text-gray-400 text-sm">
											Scan with your Kaspa wallet app
										</p>
									</TabsContent>
									
									<TabsContent value="address" className="space-y-6">
										<div className="p-4 rounded-lg border border-[#70C7BA]/30 bg-slate-800/50 font-mono text-sm text-gray-300 break-all text-center">
											{userPage.kaspaAddress}
										</div>
									</TabsContent>
								</Tabs>
								
								{/* Action Buttons */}
								<div className="flex flex-col gap-4 mt-8">
									<Button
										onClick={handleCopyAddress}
										className="w-full bg-gradient-to-r from-[#70C7BA] to-[#49EACB] hover:from-[#49EACB] hover:to-[#70C7BA] text-white font-semibold py-3 rounded-full shadow-lg hover:shadow-[#70C7BA]/25 transition-all duration-300"
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
										className="w-full border-[#70C7BA]/40 text-[#70C7BA] hover:bg-[#70C7BA]/10 py-3 rounded-full transition-all duration-300"
									>
										<ExternalLink className="w-4 h-4 mr-2" />
										Open in Wallet
									</Button>
								</div>
							</CardContent>
						</Card>
					</div>
				</div>
			</div>
		</div>
	);
} 
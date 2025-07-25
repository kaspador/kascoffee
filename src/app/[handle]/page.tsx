"use client";

import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ExternalLink, Copy, Coffee, Share2, User, Heart, QrCode } from 'lucide-react';
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
		const response = await fetch(`/api/user-page/${handle}`, {
			cache: 'no-store'
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
			const data = await fetchUserPage(handle);
			setUserPage(data);
			setLoading(false);
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
			<div className="min-h-screen bg-slate-950 flex items-center justify-center">
				<div className="text-center">
					<Coffee className="w-8 h-8 mx-auto mb-4 text-green-500 animate-pulse" />
					<div className="text-white text-lg">Loading...</div>
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
		<div 
			className="min-h-screen relative"
			style={{ 
				backgroundColor: userPage.backgroundColor,
				backgroundImage: userPage.backgroundImage ? `url(${userPage.backgroundImage})` : 'none',
				backgroundSize: 'cover',
				backgroundPosition: 'center',
				backgroundRepeat: 'no-repeat'
			}}
		>
			{/* Background overlay */}
			{userPage.backgroundImage && (
				<div className="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>
			)}
			
			<div className="relative z-10 container mx-auto px-4 py-6 max-w-4xl">
				{/* Header */}
				<div className="flex justify-between items-center mb-8">
					<Link
						href="/"
						className="flex items-center gap-2 text-sm font-medium transition-opacity hover:opacity-80"
						style={{ color: userPage.foregroundColor }}
					>
						<Coffee className="w-4 h-4" />
						<span>kas.coffee</span>
					</Link>
					
					<Button
						variant="outline"
						size="sm"
						onClick={handleShare}
						className="border"
						style={{ 
							borderColor: userPage.foregroundColor + '40',
							color: userPage.foregroundColor,
							backgroundColor: 'transparent'
						}}
					>
						<Share2 className="w-4 h-4 mr-2" />
						Share
					</Button>
				</div>

				{/* Profile Header */}
				<div className="text-center mb-8">
					<Avatar className="w-24 h-24 mx-auto mb-4 border-4 shadow-lg" style={{ borderColor: userPage.foregroundColor }}>
						<AvatarImage src={userPage.profileImage || undefined} alt={userPage.displayName || userPage.handle} />
						<AvatarFallback 
							className="text-2xl font-bold"
							style={{
								color: userPage.foregroundColor,
								backgroundColor: userPage.backgroundColor + '80'
							}}
						>
							{(userPage.displayName || userPage.handle)?.charAt(0)?.toUpperCase() || 'U'}
						</AvatarFallback>
					</Avatar>
					
					<h1 className="text-3xl md:text-4xl font-bold mb-3" style={{ color: userPage.foregroundColor }}>
						{userPage.displayName || userPage.handle}
					</h1>
					
					<Badge 
						variant="secondary" 
						className="mb-4 px-3 py-1"
						style={{ 
							backgroundColor: userPage.foregroundColor + '20',
							color: userPage.foregroundColor,
							border: `1px solid ${userPage.foregroundColor}40`
						}}
					>
						@{userPage.handle}
					</Badge>
					
					{userPage.shortDescription && (
						<p className="text-lg md:text-xl mb-6 max-w-2xl mx-auto leading-relaxed" style={{ color: userPage.foregroundColor + 'E0' }}>
							{userPage.shortDescription}
						</p>
					)}
				</div>

				{/* Social Links Row */}
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
										className="group"
									>
										<Button
											variant="outline"
											size="sm"
											className="border transition-all duration-300 group-hover:scale-105"
											style={{ 
												borderColor: userPage.foregroundColor + '40',
												color: userPage.foregroundColor,
												backgroundColor: 'rgba(255,255,255,0.1)'
											}}
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
				<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
					{/* Left Column - About & Description */}
					<div className="lg:col-span-2 space-y-6">
						{userPage.longDescription && (
							<Card 
								className="border backdrop-blur-sm"
								style={{ 
									borderColor: userPage.foregroundColor + '30',
									backgroundColor: userPage.backgroundColor + 'F5'
								}}
							>
								<CardContent className="p-6">
									<div className="flex items-center gap-2 mb-4">
										<User className="w-5 h-5" style={{ color: userPage.foregroundColor }} />
										<h2 className="text-xl font-bold" style={{ color: userPage.foregroundColor }}>
											About {userPage.displayName || userPage.handle}
										</h2>
									</div>
									<div 
										className="prose prose-sm max-w-none leading-relaxed"
										style={{ 
											color: userPage.foregroundColor + 'DD',
											'--tw-prose-body': userPage.foregroundColor + 'DD',
											'--tw-prose-headings': userPage.foregroundColor,
											'--tw-prose-links': userPage.foregroundColor,
											'--tw-prose-strong': userPage.foregroundColor,
										} as React.CSSProperties}
										dangerouslySetInnerHTML={{ __html: userPage.longDescription }}
									/>
								</CardContent>
							</Card>
						)}
					</div>

					{/* Right Column - Support Section */}
					<div className="space-y-6">
						<Card 
							className="border backdrop-blur-sm"
							style={{ 
								borderColor: userPage.foregroundColor + '30',
								backgroundColor: userPage.backgroundColor + 'F5'
							}}
						>
							<CardContent className="p-6">
								<div className="text-center mb-6">
									<div className="flex items-center justify-center gap-2 mb-3">
										<Heart className="w-6 h-6 text-red-500" />
										<Coffee className="w-6 h-6" style={{ color: userPage.foregroundColor }} />
									</div>
									<h2 className="text-xl font-bold mb-2" style={{ color: userPage.foregroundColor }}>
										Support Me
									</h2>
									<p className="text-sm opacity-80" style={{ color: userPage.foregroundColor }}>
										Send Kaspa donations to show your support
									</p>
								</div>
								
								{/* Tabs for Address and QR */}
								<Tabs defaultValue="qr" className="w-full">
									<TabsList className="grid w-full grid-cols-2 mb-4">
										<TabsTrigger value="qr" className="text-xs">
											<QrCode className="w-3 h-3 mr-1" />
											QR Code
										</TabsTrigger>
										<TabsTrigger value="address" className="text-xs">
											<Copy className="w-3 h-3 mr-1" />
											Address
										</TabsTrigger>
									</TabsList>
									
									<TabsContent value="qr" className="space-y-4">
										<div className="flex justify-center">
											<div className="bg-white p-4 rounded-lg">
												<QRCodeDisplay address={userPage.kaspaAddress} size={160} />
											</div>
										</div>
										<p className="text-xs text-center opacity-70" style={{ color: userPage.foregroundColor }}>
											Scan with your Kaspa wallet
										</p>
									</TabsContent>
									
									<TabsContent value="address" className="space-y-4">
										<div 
											className="p-3 rounded-lg border text-xs font-mono break-all text-center"
											style={{ 
												borderColor: userPage.foregroundColor + '30',
												backgroundColor: userPage.backgroundColor + '40',
												color: userPage.foregroundColor 
											}}
										>
											{userPage.kaspaAddress}
										</div>
									</TabsContent>
								</Tabs>
								
								<div className="flex flex-col gap-3 mt-6">
									<Button
										onClick={handleCopyAddress}
										className="w-full bg-green-600 hover:bg-green-700 text-white"
									>
										<Copy className="w-4 h-4 mr-2" />
										{copied ? 'Copied!' : 'Copy Address'}
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
										className="w-full border"
										style={{ 
											borderColor: userPage.foregroundColor + '40',
											color: userPage.foregroundColor,
											backgroundColor: 'transparent'
										}}
									>
										<ExternalLink className="w-4 h-4 mr-2" />
										Open Wallet
									</Button>
								</div>
							</CardContent>
						</Card>

						{/* Stats Card */}
						<Card 
							className="border backdrop-blur-sm"
							style={{ 
								borderColor: userPage.foregroundColor + '30',
								backgroundColor: userPage.backgroundColor + 'F5'
							}}
						>
							<CardContent className="p-4">
								<div className="text-center">
									<div className="text-2xl font-bold mb-1" style={{ color: userPage.foregroundColor }}>
										{userPage.viewCount || 0}
									</div>
									<div className="text-sm opacity-70" style={{ color: userPage.foregroundColor }}>
										Profile Views
									</div>
								</div>
							</CardContent>
						</Card>
					</div>
				</div>
			</div>
		</div>
	);
} 
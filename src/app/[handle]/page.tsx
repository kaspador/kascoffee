"use client";

import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ExternalLink, Copy, Coffee, Share2 } from 'lucide-react';
import { FaTwitter, FaDiscord, FaTelegram, FaGlobe, FaGithub } from 'react-icons/fa';
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
			} catch (err) {
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
				<div className="text-white text-lg">Loading...</div>
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
			className="min-h-screen"
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
				<div className="absolute inset-0 bg-black/50"></div>
			)}
			
			<div className="relative z-10 container mx-auto px-4 py-8 max-w-2xl">
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

				{/* Profile Section */}
				<div className="text-center mb-8">
					<Avatar className="w-20 h-20 mx-auto mb-4 border-2" style={{ borderColor: userPage.foregroundColor }}>
						<AvatarImage src={userPage.profileImage || undefined} alt={userPage.displayName || userPage.handle} />
						<AvatarFallback 
							className="text-xl font-semibold"
							style={{
								color: userPage.foregroundColor,
								backgroundColor: userPage.backgroundColor + '80'
							}}
						>
							{(userPage.displayName || userPage.handle)?.charAt(0)?.toUpperCase() || 'U'}
						</AvatarFallback>
					</Avatar>
					
					<h1 className="text-2xl md:text-3xl font-bold mb-2" style={{ color: userPage.foregroundColor }}>
						{userPage.displayName || userPage.handle}
					</h1>
					
					<Badge 
						variant="secondary" 
						className="mb-4"
						style={{ 
							backgroundColor: userPage.foregroundColor + '20',
							color: userPage.foregroundColor,
							border: `1px solid ${userPage.foregroundColor}40`
						}}
					>
						@{userPage.handle}
					</Badge>
					
					{userPage.shortDescription && (
						<p className="text-lg mb-6 opacity-90" style={{ color: userPage.foregroundColor }}>
							{userPage.shortDescription}
						</p>
					)}
				</div>

				{/* Long Description */}
				{userPage.longDescription && (
					<Card 
						className="mb-6 border"
						style={{ 
							borderColor: userPage.foregroundColor + '30',
							backgroundColor: userPage.backgroundColor + 'F0'
						}}
					>
						<CardContent className="p-6">
							<div 
								className="prose prose-sm max-w-none"
								style={{ 
									color: userPage.foregroundColor,
									'--tw-prose-body': userPage.foregroundColor,
									'--tw-prose-headings': userPage.foregroundColor,
									'--tw-prose-links': userPage.foregroundColor,
								} as React.CSSProperties}
								dangerouslySetInnerHTML={{ __html: userPage.longDescription }}
							/>
						</CardContent>
					</Card>
				)}

				{/* Support Section */}
				<Card 
					className="border"
					style={{ 
						borderColor: userPage.foregroundColor + '30',
						backgroundColor: userPage.backgroundColor + 'F0'
					}}
				>
					<CardContent className="p-6">
						<div className="text-center mb-6">
							<Coffee className="w-8 h-8 mx-auto mb-3" style={{ color: userPage.foregroundColor }} />
							<h2 className="text-xl font-bold mb-2" style={{ color: userPage.foregroundColor }}>
								Support {userPage.displayName || userPage.handle}
							</h2>
							<p className="text-sm opacity-80" style={{ color: userPage.foregroundColor }}>
								Send Kaspa donations to show your support
							</p>
						</div>
						
						{/* Kaspa Address */}
						<div className="mb-6">
							<div 
								className="p-3 rounded-lg border text-xs font-mono break-all text-center mb-3"
								style={{ 
									borderColor: userPage.foregroundColor + '30',
									backgroundColor: userPage.backgroundColor + '40',
									color: userPage.foregroundColor 
								}}
							>
								{userPage.kaspaAddress}
							</div>
							
							<div className="flex flex-col sm:flex-row gap-3">
								<Button
									onClick={handleCopyAddress}
									className="flex-1 bg-green-600 hover:bg-green-700 text-white"
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
									className="flex-1 border"
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
						</div>

						{/* Social Links */}
						{userPage.socials.length > 0 && (
							<div className="pt-6 border-t" style={{ borderColor: userPage.foregroundColor + '20' }}>
								<h3 className="text-sm font-medium mb-3 text-center" style={{ color: userPage.foregroundColor }}>
									Connect
								</h3>
								<div className="flex flex-wrap justify-center gap-2">
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
													className="px-3 py-1 border transition-opacity hover:opacity-80"
													style={{ 
														borderColor: userPage.foregroundColor + '40',
														color: userPage.foregroundColor,
														backgroundColor: 'transparent'
													}}
												>
													<IconComponent className="w-3 h-3 mr-1" />
													{social.platform.charAt(0).toUpperCase() + social.platform.slice(1)}
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
	);
} 
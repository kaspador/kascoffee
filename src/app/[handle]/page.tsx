'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ExternalLink, Copy, Coffee, Heart, Star, Share2 } from 'lucide-react';
import { FaTwitter, FaDiscord, FaTelegram, FaGlobe, FaGithub } from 'react-icons/fa';
import parse from 'html-react-parser';
import QRCodeDisplay from '@/components/qr-code-display';

interface UserPageData {
	id: string;
	userId: string;
	handle: string;
	displayName: string;
	shortDescription?: string | null;
	longDescription?: string | null;
	kaspaAddress: string;
	profileImage?: string | null;
	backgroundImage?: string | null;
	backgroundColor?: string | null;
	foregroundColor?: string | null;
	isActive: boolean;
	viewCount?: number | null;
	createdAt: Date;
	updatedAt: Date;
	socials: Array<{
		id: string;
		platform: string;
		url: string;
		username?: string | null;
		isVisible: boolean;
	}>;
	user?: {
		id: string;
		name: string;
		email: string;
	} | null;
}

function getUserPage(handle: string): UserPageData | null {
	// Mock data system - works for any handle without database
	const mockUserPages: Record<string, UserPageData> = {
		'kaspador': {
			id: 'kaspador-id',
			userId: 'kaspador-user-id',
			handle: 'kaspador',
			displayName: 'Kaspador',
			shortDescription: 'Building the future of cryptocurrency donations with kas.coffee',
			longDescription: '<p>Welcome to my donation page! I\'m passionate about creating tools that make cryptocurrency accessible to everyone.</p><p>Your support helps me continue developing kas.coffee and contributing to the Kaspa ecosystem.</p>',
			kaspaAddress: 'kaspa:qz8h9w7g6f5d4s3a2q1w9e8r7t6y5u4i3o2p1a9s8d7f6g5h4j3k2l1z0x9c8v7b6n5m4',
			profileImage: null,
			backgroundImage: null,
			backgroundColor: '#0f172a',
			foregroundColor: '#ffffff',
			isActive: true,
			viewCount: 1337,
			createdAt: new Date(),
			updatedAt: new Date(),
			socials: [
				{
					id: 'social-1',
					platform: 'twitter',
					url: 'https://twitter.com/kaspador',
					username: 'kaspador',
					isVisible: true
				},
				{
					id: 'social-2',
					platform: 'discord',
					url: 'https://discord.gg/kaspa',
					username: null,
					isVisible: true
				}
			],
			user: {
				id: 'kaspador-user-id',
				name: 'Kaspador',
				email: 'kaspador@kas.coffee'
			}
		},
		'demo': {
			id: 'demo-id',
			userId: 'demo-user-1',
			handle: 'demo',
			displayName: 'Demo User',
			shortDescription: 'This is a demo kas.coffee donation page showcasing the platform features',
			longDescription: '<p>Welcome to my demo donation page!</p><p>This page demonstrates the beautiful design and functionality of kas.coffee. You can create your own personalized donation page just like this one.</p><p>Features include custom themes, social links, QR codes for easy donations, and much more!</p>',
			kaspaAddress: 'kaspa:qz8h9w7g6f5d4s3a2q1w9e8r7t6y5u4i3o2p1a9s8d7f6g5h4j3k2l1z0x9c8v7b6n5m4',
			profileImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
			backgroundImage: null,
			backgroundColor: '#1e293b',
			foregroundColor: '#ffffff',
			isActive: true,
			viewCount: 256,
			createdAt: new Date(),
			updatedAt: new Date(),
			socials: [
				{
					id: 'demo-social-1',
					platform: 'twitter',
					url: 'https://twitter.com/demo',
					username: 'demo',
					isVisible: true
				},
				{
					id: 'demo-social-2',
					platform: 'github',
					url: 'https://github.com/demo',
					username: 'demo',
					isVisible: true
				}
			],
			user: {
				id: 'demo-user-1',
				name: 'Demo User',
				email: 'demo@kas.coffee'
			}
		},
		'test': {
			id: 'test-id',
			userId: 'test-user-1',
			handle: 'test',
			displayName: 'Test User',
			shortDescription: 'Test account for kas.coffee - exploring cryptocurrency donations',
			longDescription: '<p>Hello! This is a test donation page.</p><p>I\'m testing out kas.coffee and its amazing features for accepting Kaspa cryptocurrency donations.</p><p>Feel free to explore and see how easy it is to support creators with crypto!</p>',
			kaspaAddress: 'kaspa:qz8h9w7g6f5d4s3a2q1w9e8r7t6y5u4i3o2p1a9s8d7f6g5h4j3k2l1z0x9c8v7b6n5m4',
			profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
			backgroundImage: null,
			backgroundColor: '#0f766e',
			foregroundColor: '#ffffff',
			isActive: true,
			viewCount: 89,
			createdAt: new Date(),
			updatedAt: new Date(),
			socials: [
				{
					id: 'test-social-1',
					platform: 'website',
					url: 'https://example.com',
					username: null,
					isVisible: true
				}
			],
			user: {
				id: 'test-user-1',
				name: 'Test User',
				email: 'test@example.com'
			}
		}
	};

	// Check if we have a predefined mock user
	if (mockUserPages[handle]) {
		return mockUserPages[handle];
	}

	// For any other handle, generate a generic mock user
	const genericMockUser: UserPageData = {
		id: `${handle}-id`,
		userId: `${handle}-user-id`,
		handle: handle,
		displayName: handle.charAt(0).toUpperCase() + handle.slice(1),
		shortDescription: `Welcome to ${handle}'s kas.coffee donation page!`,
		longDescription: `<p>Hi! I'm ${handle} and this is my personalized donation page.</p><p>Thank you for visiting! Your support through Kaspa cryptocurrency donations helps me continue my work.</p><p>This page was created with kas.coffee - the easiest way to accept crypto donations.</p>`,
		kaspaAddress: 'kaspa:qz8h9w7g6f5d4s3a2q1w9e8r7t6y5u4i3o2p1a9s8d7f6g5h4j3k2l1z0x9c8v7b6n5m4',
		profileImage: `https://images.unsplash.com/photo-1494790108755-2616b612b5bb?w=150&h=150&fit=crop&crop=face`,
		backgroundImage: null,
		backgroundColor: '#0f172a',
		foregroundColor: '#ffffff',
		isActive: true,
		viewCount: Math.floor(Math.random() * 500) + 10,
		createdAt: new Date(),
		updatedAt: new Date(),
		socials: [
			{
				id: `${handle}-social-1`,
				platform: 'website',
				url: `https://${handle}.example.com`,
				username: null,
				isVisible: true
			}
		],
		user: {
			id: `${handle}-user-id`,
			name: handle.charAt(0).toUpperCase() + handle.slice(1),
			email: `${handle}@example.com`
		}
	};

	return genericMockUser;
}

export default function UserProfilePage() {
	const params = useParams();
	const handle = params.handle as string;
	const [userPage, setUserPage] = useState<UserPageData | null>(null);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		if (handle) {
			const userData = getUserPage(handle);
			setUserPage(userData);
			setIsLoading(false);
		}
	}, [handle]);

	// Get social platform icons
	const getSocialIcon = (platform: string) => {
		switch (platform) {
			case 'twitter':
				return <FaTwitter className="w-5 h-5" />;
			case 'discord':
				return <FaDiscord className="w-5 h-5" />;
			case 'telegram':
				return <FaTelegram className="w-5 h-5" />;
			case 'github':
				return <FaGithub className="w-5 h-5" />;
			case 'website':
				return <FaGlobe className="w-5 h-5" />;
			default:
				return <ExternalLink className="w-5 h-5" />;
		}
	};

	const handleShare = () => {
		if (navigator.share) {
			navigator.share({
				title: `Support ${userPage?.displayName}`,
				url: window.location.href
			});
		} else {
			// Fallback to copying URL
			navigator.clipboard.writeText(window.location.href);
		}
	};

	const handleCopyAddress = () => {
		if (userPage?.kaspaAddress) {
			navigator.clipboard.writeText(userPage.kaspaAddress);
		}
	};

	const handleSocialClick = (url: string) => {
		window.open(url, '_blank');
	};

	if (isLoading) {
		return (
			<div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
				<div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#70C7BA]"></div>
			</div>
		);
	}

	if (!userPage) {
		return (
			<div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
				<div className="text-center text-white">
					<h1 className="text-4xl font-bold mb-4">User Not Found</h1>
					<p className="text-gray-400">This donation page doesn&apos;t exist.</p>
				</div>
			</div>
		);
	}

	return (
		<div 
			className="min-h-screen relative overflow-hidden"
			style={{
				background: `linear-gradient(135deg, ${userPage.backgroundColor || '#0f172a'} 0%, #1e293b 100%)`
			}}
		>
			{/* Animated background with Kaspa colors */}
			<div className="absolute inset-0 bg-gradient-to-r from-[#70C7BA]/10 via-[#49EACB]/10 to-[#70C7BA]/10 animate-pulse"></div>
			<div className="absolute top-20 left-20 w-72 h-72 bg-[#70C7BA]/20 rounded-full blur-3xl animate-pulse"></div>
			<div className="absolute bottom-20 right-20 w-96 h-96 bg-[#49EACB]/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
			
			{/* Background Image Overlay */}
			{userPage.backgroundImage && (
				<div 
					className="absolute inset-0 bg-cover bg-center opacity-20"
					style={{ backgroundImage: `url(${userPage.backgroundImage})` }}
				/>
			)}

			<div className="relative z-10 container mx-auto px-6 py-12">
				<div className="max-w-4xl mx-auto">
					{/* Header */}
					<div className="text-center mb-12">
						<div className="flex items-center justify-center gap-4 mb-8">
							<Avatar className="w-24 h-24 border-4 border-[#70C7BA] shadow-lg">
								<AvatarImage src={userPage.profileImage || undefined} alt={userPage.displayName} />
								<AvatarFallback className="bg-gradient-to-r from-[#70C7BA] to-[#49EACB] text-white text-2xl font-bold">
									{userPage.displayName.charAt(0)}
								</AvatarFallback>
							</Avatar>
							<div className="text-center">
								<h1 className="text-4xl md:text-5xl font-black text-white mb-2">
									{userPage.displayName}
								</h1>
								<p className="text-[#70C7BA] text-lg font-medium">@{userPage.handle}</p>
							</div>
						</div>

						{/* Share Button */}
						<div className="flex justify-center mb-8">
							<Button 
								variant="outline" 
								className="border-[#70C7BA] text-[#70C7BA] hover:bg-[#70C7BA]/10 rounded-full"
								onClick={handleShare}
							>
								<Share2 className="w-4 h-4 mr-2" />
								Share Page
							</Button>
						</div>

						{/* View Count */}
						<div className="flex items-center justify-center gap-2 text-gray-400 text-sm">
							<Star className="w-4 h-4" />
							<span>{userPage.viewCount || 0} page views</span>
						</div>
					</div>

					<div className="grid lg:grid-cols-3 gap-8">
						{/* Main Content */}
						<div className="lg:col-span-2 space-y-8">
							{/* Short Description */}
							{userPage.shortDescription && (
								<Card className="bg-white/5 backdrop-blur-xl border border-white/20 shadow-xl">
									<CardContent className="p-6">
										<h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
											<Heart className="w-5 h-5 text-[#70C7BA]" />
											About
										</h2>
										<p className="text-gray-300 leading-relaxed">
											{userPage.shortDescription}
										</p>
									</CardContent>
								</Card>
							)}

							{/* Long Description */}
							{userPage.longDescription && (
								<Card className="bg-white/5 backdrop-blur-xl border border-white/20 shadow-xl">
									<CardContent className="p-6">
										<h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
											<Coffee className="w-5 h-5 text-[#49EACB]" />
											Story
										</h2>
										<div className="prose prose-invert prose-lg max-w-none text-gray-300">
											{parse(userPage.longDescription)}
										</div>
									</CardContent>
								</Card>
							)}

							{/* Social Links */}
							{userPage.socials && userPage.socials.length > 0 && (
								<Card className="bg-white/5 backdrop-blur-xl border border-white/20 shadow-xl">
									<CardContent className="p-6">
										<h2 className="text-xl font-semibold text-white mb-4">Connect</h2>
										<div className="flex flex-wrap gap-3">
											{userPage.socials
												.filter((social) => social.isVisible)
												.map((social) => (
													<Badge 
														key={social.id} 
														variant="outline" 
														className="border-[#70C7BA] text-[#70C7BA] hover:bg-[#70C7BA]/10 p-3 rounded-full cursor-pointer transition-all"
														onClick={() => handleSocialClick(social.url)}
													>
														{getSocialIcon(social.platform)}
														<span className="ml-2 capitalize">{social.platform}</span>
													</Badge>
												))}
										</div>
									</CardContent>
								</Card>
							)}
						</div>

						{/* Donation Section */}
						<div className="space-y-6">
							<Card className="bg-gradient-to-br from-[#70C7BA]/10 to-[#49EACB]/10 backdrop-blur-xl border border-[#70C7BA]/30 shadow-2xl">
								<CardContent className="p-6 text-center">
									<div className="flex items-center justify-center gap-3 mb-6">
										<Coffee className="w-8 h-8 text-[#70C7BA]" />
										<h2 className="text-2xl font-bold text-white">
											Support with <span className="bg-gradient-to-r from-[#70C7BA] to-[#49EACB] bg-clip-text text-transparent">Kaspa</span>
										</h2>
									</div>

									{/* QR Code */}
									<div className="mb-6">
										<QRCodeDisplay address={userPage.kaspaAddress} size={200} />
									</div>

									{/* Kaspa Address */}
									<div className="space-y-4">
										<div className="bg-black/20 rounded-xl p-4 border border-[#70C7BA]/20">
											<p className="text-[#70C7BA] text-sm font-medium mb-2">Kaspa Address</p>
											<p className="text-white font-mono text-sm break-all">
												{userPage.kaspaAddress}
											</p>
										</div>

										<Button 
											className="w-full bg-gradient-to-r from-[#70C7BA] to-[#49EACB] hover:from-[#49EACB] hover:to-[#70C7BA] text-white font-semibold rounded-xl shadow-lg hover:shadow-[#70C7BA]/25 transition-all duration-300"
											onClick={handleCopyAddress}
										>
											<Copy className="w-4 h-4 mr-2" />
											Copy Address
										</Button>
									</div>

									{/* Help Text */}
									<div className="mt-6 text-center">
										<p className="text-gray-400 text-sm">
											Scan the QR code or copy the address to send Kaspa directly
										</p>
									</div>
								</CardContent>
							</Card>

							{/* Kaspa Info */}
							<Card className="bg-white/5 backdrop-blur-xl border border-white/20 shadow-xl">
								<CardContent className="p-6">
									<h3 className="text-lg font-semibold text-white mb-3">Why Kaspa?</h3>
									<ul className="space-y-2 text-gray-300 text-sm">
										<li className="flex items-center gap-2">
											<div className="w-2 h-2 bg-[#70C7BA] rounded-full"></div>
											Lightning-fast transactions
										</li>
										<li className="flex items-center gap-2">
											<div className="w-2 h-2 bg-[#49EACB] rounded-full"></div>
											Extremely low fees
										</li>
										<li className="flex items-center gap-2">
											<div className="w-2 h-2 bg-[#70C7BA] rounded-full"></div>
											Secure and decentralized
										</li>
									</ul>
								</CardContent>
							</Card>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
} 
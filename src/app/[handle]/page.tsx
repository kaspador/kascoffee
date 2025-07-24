import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ExternalLink, Copy, Coffee, Heart, Star, Share2 } from 'lucide-react';
import { FaTwitter, FaDiscord, FaTelegram, FaGlobe, FaGithub } from 'react-icons/fa';
import parse from 'html-react-parser';
import QRCodeDisplay from '@/components/qr-code-display';
import { db } from '@/lib/db';
import { userPages, socials, users } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

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

async function getUserPage(handle: string): Promise<UserPageData | null> {
	try {
		// Get user page from database
		const userPage = await db.query.userPages.findFirst({
			where: eq(userPages.handle, handle),
			with: {
				user: true
			}
		});

		if (!userPage || !userPage.isActive) {
			return null;
		}

		// Get user's social links
		const userSocials = await db.query.socials.findMany({
			where: eq(socials.userId, userPage.userId)
		});

		// Increment view count
		await db
			.update(userPages)
			.set({ 
				viewCount: (userPage.viewCount || 0) + 1,
				updatedAt: new Date()
			})
			.where(eq(userPages.id, userPage.id));

		return {
			...userPage,
			backgroundColor: userPage.backgroundColor || '#0f172a',
			foregroundColor: userPage.foregroundColor || '#ffffff',
			viewCount: userPage.viewCount || 0,
			socials: userSocials.filter(social => social.isVisible).map(social => ({
				id: social.id,
				platform: social.platform,
				url: social.url,
				username: social.username || '',
				isVisible: social.isVisible
			}))
		};
	} catch (error) {
		console.error('Error fetching user page:', error);
		return null;
	}
}

interface PageProps {
	params: {
		handle: string;
	};
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
	const userPage = await getUserPage(params.handle);

	if (!userPage) {
		return {
			title: 'Page Not Found - kas.coffee',
			description: 'This donation page does not exist.',
		};
	}

	return {
		title: `${userPage.displayName} - kas.coffee`,
		description: userPage.shortDescription || `Support ${userPage.displayName} with Kaspa donations`,
		openGraph: {
			title: `${userPage.displayName} - kas.coffee`,
			description: userPage.shortDescription || `Support ${userPage.displayName} with Kaspa donations`,
			images: userPage.profileImage ? [userPage.profileImage] : [],
		},
		twitter: {
			card: 'summary_large_image',
			title: `${userPage.displayName} - kas.coffee`,
			description: userPage.shortDescription || `Support ${userPage.displayName} with Kaspa donations`,
			images: userPage.profileImage ? [userPage.profileImage] : [],
		},
	};
}

export default async function UserProfilePage({ params }: PageProps) {
	const userPage = await getUserPage(params.handle);

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
			className="min-h-screen relative overflow-hidden"
			style={{ 
				backgroundColor: userPage.backgroundColor,
				color: userPage.foregroundColor,
				backgroundImage: userPage.backgroundImage ? `url(${userPage.backgroundImage})` : undefined,
				backgroundSize: 'cover',
				backgroundPosition: 'center',
				backgroundAttachment: 'fixed'
			}}
		>
			{/* Background overlay for better readability */}
			{userPage.backgroundImage && (
				<div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
			)}

			{/* Animated background effects */}
			<div className="absolute inset-0 opacity-10">
				<div 
					className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl animate-pulse"
					style={{ backgroundColor: userPage.foregroundColor }}
				/>
				<div 
					className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full blur-3xl animate-pulse delay-1000"
					style={{ backgroundColor: userPage.foregroundColor }}
				/>
			</div>

			<div className="relative z-10 container mx-auto px-4 py-8 md:py-12">
				{/* Navigation */}
				<div className="flex justify-between items-center mb-8">
					<a 
						href="/"
						className="inline-flex items-center gap-2 px-4 py-2 rounded-full border-2 hover:bg-white/10 transition-all duration-300 font-semibold"
						style={{ 
							borderColor: userPage.foregroundColor,
							color: userPage.foregroundColor
						}}
					>
						<Coffee className="w-4 h-4" />
						kas.coffee
					</a>
					
					<div className="flex items-center gap-2">
						<Button
							variant="outline"
							size="sm"
							className="border-2 hover:bg-white/10 transition-all duration-300"
							style={{ 
								borderColor: userPage.foregroundColor,
								color: userPage.foregroundColor,
								backgroundColor: 'transparent'
							}}
							onClick={() => {
								if (navigator.share) {
									navigator.share({
										title: `${userPage.displayName} - kas.coffee`,
										text: userPage.shortDescription || `Support ${userPage.displayName} with Kaspa donations`,
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

				<div className="max-w-4xl mx-auto">
					<div className="grid lg:grid-cols-3 gap-8">
						{/* Profile Section */}
						<div className="lg:col-span-2 space-y-6">
							{/* Profile Card */}
							<Card 
								className="border-2 backdrop-blur-xl shadow-2xl"
								style={{ 
									borderColor: `${userPage.foregroundColor}40`,
									backgroundColor: `${userPage.backgroundColor}90`
								}}
							>
								<CardContent className="p-8">
									<div className="flex flex-col md:flex-row items-center md:items-start gap-6">
										<Avatar className="w-24 h-24 border-4" style={{ borderColor: userPage.foregroundColor }}>
											<AvatarImage src={userPage.profileImage || undefined} alt={userPage.displayName} />
											<AvatarFallback 
												className="text-2xl font-bold"
												style={{ 
													backgroundColor: userPage.foregroundColor,
													color: userPage.backgroundColor
												}}
											>
												{userPage.displayName.charAt(0)}
											</AvatarFallback>
										</Avatar>
										
										<div className="flex-1 text-center md:text-left">
											<h1 className="text-3xl md:text-4xl font-bold mb-2" style={{ color: userPage.foregroundColor }}>
												{userPage.displayName}
											</h1>
											<Badge 
												variant="outline" 
												className="mb-4 border-2"
												style={{ 
													borderColor: userPage.foregroundColor,
													color: userPage.foregroundColor,
													backgroundColor: 'transparent'
												}}
											>
												@{userPage.handle}
											</Badge>
											
											{userPage.shortDescription && (
												<p className="text-lg mb-4 opacity-90" style={{ color: userPage.foregroundColor }}>
													{userPage.shortDescription}
												</p>
											)}
											
											<div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-sm opacity-75">
												<div className="flex items-center gap-1">
													<Heart className="w-4 h-4" />
													<span>{userPage.viewCount} supporters</span>
												</div>
												<div className="flex items-center gap-1">
													<Star className="w-4 h-4" />
													<span>Active since {new Date(userPage.createdAt).getFullYear()}</span>
												</div>
											</div>
										</div>
									</div>
								</CardContent>
							</Card>

							{/* Long Description */}
							{userPage.longDescription && (
								<Card 
									className="border-2 backdrop-blur-xl shadow-2xl"
									style={{ 
										borderColor: `${userPage.foregroundColor}40`,
										backgroundColor: `${userPage.backgroundColor}90`
									}}
								>
									<CardContent className="p-8">
										<h2 className="text-xl font-bold mb-4" style={{ color: userPage.foregroundColor }}>
											About {userPage.displayName}
										</h2>
										<div 
											className="prose prose-lg max-w-none"
											style={{ color: userPage.foregroundColor }}
										>
											{parse(userPage.longDescription)}
										</div>
									</CardContent>
								</Card>
							)}

							{/* Social Links */}
							{userPage.socials.length > 0 && (
								<Card 
									className="border-2 backdrop-blur-xl shadow-2xl"
									style={{ 
										borderColor: `${userPage.foregroundColor}40`,
										backgroundColor: `${userPage.backgroundColor}90`
									}}
								>
									<CardContent className="p-8">
										<h2 className="text-xl font-bold mb-4" style={{ color: userPage.foregroundColor }}>
											Connect
										</h2>
										<div className="flex flex-wrap gap-3">
											{userPage.socials.map((social) => {
												const IconComponent = socialIconMap[social.platform as keyof typeof socialIconMap] || FaGlobe;
												return (
													<Badge
														key={social.id}
														variant="outline"
														className="px-4 py-2 border-2 hover:bg-white/10 transition-all duration-300 cursor-pointer"
														style={{ 
															borderColor: userPage.foregroundColor,
															color: userPage.foregroundColor,
															backgroundColor: 'transparent'
														}}
														onClick={() => window.open(social.url, '_blank')}
													>
														<IconComponent className="w-4 h-4 mr-2" />
														{social.platform.charAt(0).toUpperCase() + social.platform.slice(1)}
														<ExternalLink className="w-3 h-3 ml-2" />
													</Badge>
												);
											})}
										</div>
									</CardContent>
								</Card>
							)}
						</div>

						{/* Donation Section */}
						<div className="space-y-6">
							{/* Donation Card */}
							<Card 
								className="border-2 backdrop-blur-xl shadow-2xl sticky top-8"
								style={{ 
									borderColor: `${userPage.foregroundColor}40`,
									backgroundColor: `${userPage.backgroundColor}90`
								}}
							>
								<CardContent className="p-8 text-center">
									<div className="mb-6">
										<Coffee className="w-16 h-16 mx-auto mb-4" style={{ color: userPage.foregroundColor }} />
										<h2 className="text-2xl font-bold mb-2" style={{ color: userPage.foregroundColor }}>
											Support {userPage.displayName}
										</h2>
										<p className="opacity-75" style={{ color: userPage.foregroundColor }}>
											Send Kaspa donations to show your support
										</p>
									</div>

									<div className="space-y-4">
										<div className="p-4 rounded-lg border-2" style={{ borderColor: `${userPage.foregroundColor}40` }}>
											<div className="text-sm font-medium mb-2 opacity-75" style={{ color: userPage.foregroundColor }}>
												Kaspa Address
											</div>
											<div className="font-mono text-sm break-all p-3 rounded border" style={{ 
												backgroundColor: `${userPage.foregroundColor}10`,
												borderColor: `${userPage.foregroundColor}30`,
												color: userPage.foregroundColor
											}}>
												{userPage.kaspaAddress}
											</div>
											<Button
												size="sm"
												className="mt-3 border-2 hover:bg-white/10 transition-all duration-300"
												style={{ 
													borderColor: userPage.foregroundColor,
													color: userPage.foregroundColor,
													backgroundColor: 'transparent'
												}}
												onClick={() => navigator.clipboard.writeText(userPage.kaspaAddress)}
											>
												<Copy className="w-4 h-4 mr-2" />
												Copy Address
											</Button>
										</div>

										<div className="p-4">
											<div className="text-sm font-medium mb-3 opacity-75" style={{ color: userPage.foregroundColor }}>
												QR Code
											</div>
											<div className="mx-auto">
												<QRCodeDisplay 
													address={userPage.kaspaAddress}
													size={200}
												/>
											</div>
										</div>
									</div>
								</CardContent>
							</Card>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
} 
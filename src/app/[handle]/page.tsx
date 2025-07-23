import 'server-only';

import { db } from '@/lib/db';
import { userPages, socials } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { notFound } from 'next/navigation';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ExternalLink, Copy } from 'lucide-react';
import { FaTwitter, FaDiscord, FaTelegram, FaGlobe } from 'react-icons/fa';
import parse from 'html-react-parser';
import QRCodeDisplay from '@/components/qr-code-display';
import { Button } from '@/components/ui/button';
import type { Metadata } from 'next';

interface PageProps {
	params: Promise<{ handle: string }>;
}

async function getUserPage(handle: string) {
	const userPage = await db.query.userPages.findFirst({
		where: eq(userPages.handle, handle),
		with: {
			user: true
		}
	});

	if (!userPage || !userPage.isActive) {
		return null;
	}

	const userSocials = await db.query.socials.findMany({
		where: eq(socials.userId, userPage.userId)
	});

	return { ...userPage, socials: userSocials };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
	const { handle } = await params;
	const userPage = await getUserPage(handle);

	if (!userPage) {
		return {
			title: 'User not found | kas.coffee',
			description: 'This user page does not exist.'
		};
	}

	return {
		title: `${userPage.displayName} | kas.coffee`,
		description: userPage.shortDescription || `Support ${userPage.displayName} with Kaspa cryptocurrency`,
		openGraph: {
			title: `${userPage.displayName} | kas.coffee`,
			description: userPage.shortDescription || `Support ${userPage.displayName} with Kaspa cryptocurrency`,
			images: userPage.profileImage ? [userPage.profileImage] : undefined
		}
	};
}

export const revalidate = 3600; // ISR: revalidate every hour

const socialIcons = {
	twitter: FaTwitter,
	discord: FaDiscord,
	telegram: FaTelegram,
	website: FaGlobe
};

export default async function UserProfilePage({ params }: PageProps) {
	const { handle } = await params;
	const userPage = await getUserPage(handle);

	if (!userPage) {
		notFound();
	}

	// Update view count (fire and forget)
	db.update(userPages)
		.set({ viewCount: (userPage.viewCount || 0) + 1 })
		.where(eq(userPages.id, userPage.id))
		.catch(console.error);

	const copyToClipboard = async (text: string) => {
		if (navigator.clipboard) {
			await navigator.clipboard.writeText(text);
		}
	};

	return (
		<div 
			className="min-h-screen p-4"
			style={{
				backgroundColor: userPage.backgroundColor || '#ffffff',
				color: userPage.foregroundColor || '#000000',
				backgroundImage: userPage.backgroundImage ? `url(${userPage.backgroundImage})` : undefined,
				backgroundSize: 'cover',
				backgroundPosition: 'center'
			}}
		>
			<div className="mx-auto max-w-2xl">
				<Card className="backdrop-blur-sm bg-background/80">
					<CardContent className="p-6">
						{/* Profile Header */}
						<div className="text-center mb-6">
							<Avatar className="w-24 h-24 mx-auto mb-4">
								<AvatarImage src={userPage.profileImage || undefined} />
								<AvatarFallback className="text-2xl">
									{userPage.displayName.charAt(0).toUpperCase()}
								</AvatarFallback>
							</Avatar>
							<h1 className="text-2xl font-bold mb-2">{userPage.displayName}</h1>
							<Badge variant="secondary">@{userPage.handle}</Badge>
							{userPage.shortDescription && (
								<p className="text-muted-foreground mt-4 max-w-md mx-auto">
									{userPage.shortDescription}
								</p>
							)}
						</div>

						{/* Kaspa Address and QR Code */}
						<div className="space-y-4 mb-6">
							<div className="text-center">
								<h2 className="text-lg font-semibold mb-2">Support with Kaspa</h2>
								<QRCodeDisplay address={userPage.kaspaAddress} />
							</div>
							<div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
								<code className="flex-1 text-sm break-all">{userPage.kaspaAddress}</code>
								<Button
									size="sm"
									variant="ghost"
									onClick={() => copyToClipboard(userPage.kaspaAddress)}
								>
									<Copy className="h-4 w-4" />
								</Button>
							</div>
						</div>

						{/* Social Links */}
						{userPage.socials.length > 0 && (
							<div className="mb-6">
								<h3 className="font-semibold mb-3">Connect</h3>
								<div className="flex flex-wrap gap-2">
									{userPage.socials
										.filter(social => social.isVisible)
										.map((social) => {
											const Icon = socialIcons[social.platform];
											return (
												<Button
													key={social.id}
													variant="outline"
													size="sm"
													asChild
												>
													<a
														href={social.url}
														target="_blank"
														rel="noopener noreferrer"
														className="flex items-center gap-2"
													>
														<Icon className="h-4 w-4" />
														{social.username || social.platform}
														<ExternalLink className="h-3 w-3" />
													</a>
												</Button>
											);
										})}
								</div>
							</div>
						)}

						{/* Long Description */}
						{userPage.longDescription && (
							<div className="prose prose-sm max-w-none">
								<h3 className="font-semibold mb-3">About</h3>
								<div className="text-sm">
									{parse(userPage.longDescription)}
								</div>
							</div>
						)}

						{/* View Count */}
						<div className="text-center text-xs text-muted-foreground mt-6">
							{userPage.viewCount || 0} views
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	);
} 
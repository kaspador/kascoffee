'use client';

import { useSession } from '@/lib/auth-client';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { ExternalLink, User, Palette, Link as LinkIcon, Settings, Eye, Copy } from 'lucide-react';
import { ThemeToggle } from '@/components/theme-toggle';
import { ProfileForm } from '@/components/dashboard/profile-form';
import { SocialLinksForm } from '@/components/dashboard/social-links-form';
import { ThemeCustomization } from '@/components/dashboard/theme-customization';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';

export default function DashboardPage() {
	const { data: session, isPending } = useSession();
	const router = useRouter();

	// Fetch user profile data
	const { data: userProfile, isLoading: profileLoading } = useQuery({
		queryKey: ['profile'],
		queryFn: async () => {
			const response = await fetch('/api/user/profile');
			if (!response.ok) throw new Error('Failed to fetch profile');
			return response.json();
		},
		enabled: !!session
	});

	// Fetch social links
	const { data: socials, isLoading: socialsLoading } = useQuery({
		queryKey: ['socials'],
		queryFn: async () => {
			const response = await fetch('/api/user/socials');
			if (!response.ok) throw new Error('Failed to fetch socials');
			return response.json();
		},
		enabled: !!session
	});

	useEffect(() => {
		if (!isPending && !session) {
			router.push('/auth/signin');
		}
	}, [session, isPending, router]);

	if (isPending || !session) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
			</div>
		);
	}

	const copyProfileUrl = () => {
		if (userProfile?.userPage?.handle) {
			const url = `${window.location.origin}/${userProfile.userPage.handle}`;
			navigator.clipboard.writeText(url);
		}
	};

	return (
		<div className="min-h-screen bg-background">
			{/* Header */}
			<header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
				<div className="container mx-auto px-4 py-4">
					<div className="flex items-center justify-between">
						<Link href="/" className="flex items-center gap-2 font-bold text-xl">
							☕ kas.coffee
						</Link>
						<div className="flex items-center gap-4">
							{userProfile?.userPage?.handle && (
								<Button variant="outline" size="sm" asChild>
									<Link
										href={`/${userProfile.userPage.handle}`}
										target="_blank"
										className="flex items-center gap-2"
									>
										<Eye className="h-4 w-4" />
										View Page
										<ExternalLink className="h-3 w-3" />
									</Link>
								</Button>
							)}
							<ThemeToggle />
							<Avatar>
								<AvatarImage src={session.user.image || undefined} />
								<AvatarFallback>
									{session.user.name?.charAt(0) || session.user.email?.charAt(0)}
								</AvatarFallback>
							</Avatar>
						</div>
					</div>
				</div>
			</header>

			<div className="container mx-auto px-4 py-8">
				<div className="mb-8">
					<h1 className="text-3xl font-bold mb-2">Dashboard</h1>
					<p className="text-muted-foreground">
						Manage your kas.coffee profile and customize your donation page
					</p>
				</div>

				{/* Profile Summary Card */}
				{userProfile?.userPage && (
					<Card className="mb-8">
						<CardContent className="p-6">
							<div className="flex items-center justify-between">
								<div className="flex items-center gap-4">
									<Avatar className="w-16 h-16">
										<AvatarImage src={userProfile.userPage.profileImage || undefined} />
										<AvatarFallback className="text-lg">
											{userProfile.userPage.displayName.charAt(0)}
										</AvatarFallback>
									</Avatar>
									<div>
										<h2 className="text-xl font-semibold">
											{userProfile.userPage.displayName}
										</h2>
										<Badge variant="secondary">@{userProfile.userPage.handle}</Badge>
										<p className="text-sm text-muted-foreground mt-1">
											{userProfile.userPage.viewCount || 0} page views
										</p>
									</div>
								</div>
								<div className="flex items-center gap-2">
									<Button
										variant="outline"
										size="sm"
										onClick={copyProfileUrl}
										className="flex items-center gap-2"
									>
										<Copy className="h-4 w-4" />
										Copy URL
									</Button>
									<Button variant="default" size="sm" asChild>
										<Link
											href={`/${userProfile.userPage.handle}`}
											target="_blank"
											className="flex items-center gap-2"
										>
											<Eye className="h-4 w-4" />
											Preview
										</Link>
									</Button>
								</div>
							</div>
						</CardContent>
					</Card>
				)}

				{/* Main Dashboard Tabs */}
				<Tabs defaultValue="profile" className="space-y-6">
					<TabsList className="grid w-full grid-cols-4">
						<TabsTrigger value="profile" className="flex items-center gap-2">
							<User className="h-4 w-4" />
							Profile
						</TabsTrigger>
						<TabsTrigger value="theme" className="flex items-center gap-2">
							<Palette className="h-4 w-4" />
							Theme
						</TabsTrigger>
						<TabsTrigger value="socials" className="flex items-center gap-2">
							<LinkIcon className="h-4 w-4" />
							Social Links
						</TabsTrigger>
						<TabsTrigger value="settings" className="flex items-center gap-2">
							<Settings className="h-4 w-4" />
							Settings
						</TabsTrigger>
					</TabsList>

					<TabsContent value="profile">
						<Card>
							<CardHeader>
								<CardTitle>Profile Information</CardTitle>
							</CardHeader>
							<CardContent>
								<ProfileForm
									userPage={userProfile?.userPage}
									isLoading={profileLoading}
								/>
							</CardContent>
						</Card>
					</TabsContent>

					<TabsContent value="theme">
						<Card>
							<CardHeader>
								<CardTitle>Customize Your Page</CardTitle>
							</CardHeader>
							<CardContent>
								<ThemeCustomization
									userPage={userProfile?.userPage}
									isLoading={profileLoading}
								/>
							</CardContent>
						</Card>
					</TabsContent>

					<TabsContent value="socials">
						<Card>
							<CardHeader>
								<CardTitle>Social Links</CardTitle>
							</CardHeader>
							<CardContent>
								<SocialLinksForm
									socials={socials?.socials || []}
									isLoading={socialsLoading}
								/>
							</CardContent>
						</Card>
					</TabsContent>

					<TabsContent value="settings">
						<Card>
							<CardHeader>
								<CardTitle>Account Settings</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="space-y-4">
									<div className="grid gap-4">
										<div>
											<h3 className="font-medium">Account Information</h3>
											<p className="text-sm text-muted-foreground">
												{session.user.email}
											</p>
										</div>
										<div>
											<h3 className="font-medium mb-2">Danger Zone</h3>
											<Button variant="destructive" size="sm">
												Delete Account
											</Button>
										</div>
									</div>
								</div>
							</CardContent>
						</Card>
					</TabsContent>
				</Tabs>
			</div>
		</div>
	);
} 
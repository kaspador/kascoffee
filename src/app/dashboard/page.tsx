'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { ExternalLink, User, Palette, Link as LinkIcon, Settings, Eye, Copy, LogOut, Coffee, Sparkles, TrendingUp, Users } from 'lucide-react';
import { ThemeToggle } from '@/components/theme-toggle';
import { ProfileForm } from '@/components/dashboard/profile-form';
import { SocialLinksForm } from '@/components/dashboard/social-links-form';
import { ThemeCustomization } from '@/components/dashboard/theme-customization';
import Link from 'next/link';

interface MockSession {
	user: {
		id: string;
		email: string;
		name: string;
		image?: string | null;
	};
	expires: string;
}

interface UserProfile {
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
}

// Helper function to get mock session from localStorage
function getMockSessionHeader() {
	if (typeof window === 'undefined') return null;
	
	const sessionData = localStorage.getItem('kas-coffee-session');
	if (!sessionData) return null;
	
	try {
		const session = JSON.parse(sessionData);
		const expires = new Date(session.expires);
		
		if (expires <= new Date()) {
			localStorage.removeItem('kas-coffee-session');
			return null;
		}
		
		return `Bearer ${sessionData}`;
	} catch {
		localStorage.removeItem('kas-coffee-session');
		return null;
	}
}

export default function DashboardPage() {
	const [session, setSession] = useState<MockSession | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
	const [profileLoading, setProfileLoading] = useState(false);
	const router = useRouter();

	// Mock social links data
	const socials = {
		socials: [
			{
				id: 'twitter-1',
				platform: 'twitter',
				url: 'https://twitter.com/example',
				username: 'example',
				isVisible: true
			}
		]
	};

	// Function to fetch profile data from API
	const fetchProfile = async () => {
		const authHeader = getMockSessionHeader();
		if (!authHeader) return;

		try {
			setProfileLoading(true);
			const response = await fetch('/api/user/profile', {
				headers: {
					'Authorization': authHeader
				}
			});

			if (response.ok) {
				const data = await response.json();
				setUserProfile(data.userPage);
			}
		} catch (error) {
			console.error('Error fetching profile:', error);
		} finally {
			setProfileLoading(false);
		}
	};

	useEffect(() => {
		// Check for mock session in localStorage
		const mockSession = localStorage.getItem('kas-coffee-session');
		if (mockSession) {
			try {
				const parsedSession = JSON.parse(mockSession);
				const expires = new Date(parsedSession.expires);

				if (expires > new Date()) {
					setSession(parsedSession);
					// Fetch the actual profile data
					fetchProfile();
				} else {
					// Session expired
					localStorage.removeItem('kas-coffee-session');
					router.push('/auth/signin');
				}
			} catch (error) {
				console.error('Invalid session data:', error);
				localStorage.removeItem('kas-coffee-session');
				router.push('/auth/signin');
			}
		} else {
			router.push('/auth/signin');
		}
		setIsLoading(false);
	}, [router]);

	// Function to refresh profile data (called after updates)
	// const refreshProfile = () => {
	// 	fetchProfile();
	// };

	// Convert UserProfile to the format expected by components
	const convertProfileForComponents = (profile: UserProfile | null) => {
		if (!profile) return undefined;
		
		return {
			...profile,
			shortDescription: profile.shortDescription ?? null,
			longDescription: profile.longDescription ?? null,
			profileImage: profile.profileImage ?? null,
			backgroundImage: profile.backgroundImage ?? null,
			backgroundColor: profile.backgroundColor ?? null,
			foregroundColor: profile.foregroundColor ?? null,
			viewCount: profile.viewCount ?? null
		};
	};

	const handleSignOut = () => {
		localStorage.removeItem('kas-coffee-session');
		router.push('/');
	};

	const copyProfileUrl = () => {
		if (userProfile?.handle) {
			const url = `${window.location.origin}/${userProfile.handle}`;
			navigator.clipboard.writeText(url);
		}
	};

	if (isLoading) {
		return (
			<div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
				<div className="text-center">
					<div className="w-16 h-16 border-4 border-[#70C7BA] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
					<p className="text-[#70C7BA] font-medium">Loading your dashboard...</p>
				</div>
			</div>
		);
	}

	if (!session) {
		return null; // Will redirect in useEffect
	}

	return (
		<div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 relative">
			{/* Animated background with Kaspa colors */}
			<div className="absolute inset-0 bg-gradient-to-r from-[#70C7BA]/10 via-[#49EACB]/10 to-[#70C7BA]/10 animate-pulse"></div>
			<div className="absolute top-20 left-20 w-72 h-72 bg-[#70C7BA]/20 rounded-full blur-3xl animate-pulse"></div>
			<div className="absolute bottom-20 right-20 w-96 h-96 bg-[#49EACB]/20 rounded-full blur-3xl animate-pulse delay-1000"></div>

			{/* Header */}
			<header className="relative z-10 border-b border-[#70C7BA]/20 bg-slate-900/50 backdrop-blur-xl">
				<div className="container mx-auto px-4 py-4">
					<div className="flex items-center justify-between">
						<Link href="/" className="flex items-center gap-3 font-bold text-xl group">
							<div className="relative">
								<Coffee className="h-8 w-8 text-[#70C7BA] group-hover:text-[#49EACB] transition-colors" />
								<div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-[#49EACB] to-[#70C7BA] rounded-full animate-pulse"></div>
							</div>
							<span className="bg-gradient-to-r from-[#70C7BA] to-[#49EACB] bg-clip-text text-transparent">
								kas.coffee
							</span>
						</Link>
						<div className="flex items-center gap-4">
							{userProfile?.handle && (
								<Button 
									variant="outline" 
									size="sm" 
									asChild
									className="border-[#70C7BA]/30 text-[#70C7BA] hover:bg-[#70C7BA]/10 hover:border-[#70C7BA] rounded-full backdrop-blur-sm"
								>
									<Link
										href={`/${userProfile.handle}`}
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
							<Button
								variant="ghost"
								size="sm"
								onClick={handleSignOut}
								className="flex items-center gap-2 text-white/80 hover:text-[#70C7BA] hover:bg-[#70C7BA]/10 rounded-full"
							>
								<LogOut className="h-4 w-4" />
								Sign Out
							</Button>
							<Avatar className="border-2 border-[#70C7BA]/50">
								<AvatarImage src={userProfile?.profileImage || session.user.image || undefined} />
								<AvatarFallback className="bg-gradient-to-r from-[#70C7BA] to-[#49EACB] text-white font-bold">
									{userProfile?.displayName?.charAt(0) || session.user.name?.charAt(0) || session.user.email?.charAt(0)}
								</AvatarFallback>
							</Avatar>
						</div>
					</div>
				</div>
			</header>

			<div className="relative z-10 container mx-auto px-4 py-8">
				{/* Welcome Header */}
				<div className="mb-8 text-center">
					<div className="inline-flex items-center gap-3 bg-gradient-to-r from-[#70C7BA]/20 to-[#49EACB]/20 backdrop-blur-xl border border-[#70C7BA]/30 rounded-full px-6 py-3 mb-6">
						<Sparkles className="w-4 h-4 text-[#49EACB]" />
						<span className="text-[#70C7BA] font-semibold text-sm">Dashboard</span>
					</div>
					<h1 className="text-4xl md:text-5xl font-black text-white mb-2">
						Welcome back, <span className="bg-gradient-to-r from-[#70C7BA] to-[#49EACB] bg-clip-text text-transparent">
							{userProfile?.displayName || session.user.name}
						</span>
					</h1>
					<p className="text-gray-400 text-lg">
						Manage your kas.coffee profile and customize your donation page
					</p>
				</div>

				{/* Stats Cards */}
				<div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
					<Card className="bg-gradient-to-br from-[#70C7BA]/10 to-[#49EACB]/10 backdrop-blur-xl border border-[#70C7BA]/30 shadow-xl">
						<CardContent className="p-6">
							<div className="flex items-center justify-between">
								<div>
									<p className="text-[#70C7BA] text-sm font-medium">Page Views</p>
									<p className="text-2xl font-bold text-white">{userProfile?.viewCount || 0}</p>
									<p className="text-green-400 text-xs flex items-center gap-1 mt-1">
										<TrendingUp className="w-3 h-3" />
										+12% this week
									</p>
								</div>
								<div className="w-12 h-12 bg-[#70C7BA]/20 rounded-full flex items-center justify-center">
									<Eye className="w-6 h-6 text-[#70C7BA]" />
								</div>
							</div>
						</CardContent>
					</Card>

					<Card className="bg-gradient-to-br from-[#49EACB]/10 to-[#70C7BA]/10 backdrop-blur-xl border border-[#49EACB]/30 shadow-xl">
						<CardContent className="p-6">
							<div className="flex items-center justify-between">
								<div>
									<p className="text-[#49EACB] text-sm font-medium">Social Links</p>
									<p className="text-2xl font-bold text-white">{socials?.socials?.length || 0}</p>
									<p className="text-gray-400 text-xs mt-1">Connected platforms</p>
								</div>
								<div className="w-12 h-12 bg-[#49EACB]/20 rounded-full flex items-center justify-center">
									<LinkIcon className="w-6 h-6 text-[#49EACB]" />
								</div>
							</div>
						</CardContent>
					</Card>

					<Card className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 backdrop-blur-xl border border-purple-500/30 shadow-xl">
						<CardContent className="p-6">
							<div className="flex items-center justify-between">
								<div>
									<p className="text-purple-400 text-sm font-medium">Donations</p>
									<p className="text-2xl font-bold text-white">0 KAS</p>
									<p className="text-gray-400 text-xs mt-1">Total received</p>
								</div>
								<div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center">
									<Coffee className="w-6 h-6 text-purple-400" />
								</div>
							</div>
						</CardContent>
					</Card>
				</div>

				{/* Profile Summary Card */}
				{userProfile && (
					<Card className="mb-8 bg-gradient-to-r from-[#70C7BA]/10 via-[#49EACB]/10 to-[#70C7BA]/10 backdrop-blur-xl border border-[#70C7BA]/30 shadow-2xl">
						<CardContent className="p-8">
							<div className="flex items-center justify-between">
								<div className="flex items-center gap-6">
									<Avatar className="w-20 h-20 border-4 border-[#70C7BA]/50 shadow-lg">
										<AvatarImage src={userProfile.profileImage || undefined} />
										<AvatarFallback className="text-2xl bg-gradient-to-r from-[#70C7BA] to-[#49EACB] text-white font-bold">
											{userProfile.displayName.charAt(0)}
										</AvatarFallback>
									</Avatar>
									<div>
										<h2 className="text-2xl font-bold text-white mb-1">
											{userProfile.displayName}
										</h2>
										<Badge variant="outline" className="border-[#70C7BA] text-[#70C7BA] bg-[#70C7BA]/10 rounded-full mb-2">
											@{userProfile.handle}
										</Badge>
										<div className="flex items-center gap-4 text-sm text-gray-400">
											<div className="flex items-center gap-1">
												<Users className="w-4 h-4" />
												{userProfile.viewCount || 0} views
											</div>
											<div className="flex items-center gap-1">
												<Coffee className="w-4 h-4" />
												Active
											</div>
										</div>
									</div>
								</div>
								<div className="flex items-center gap-3">
									<Button
										variant="outline"
										size="sm"
										onClick={copyProfileUrl}
										className="flex items-center gap-2 border-[#70C7BA]/30 text-[#70C7BA] hover:bg-[#70C7BA]/10 hover:border-[#70C7BA] rounded-full backdrop-blur-sm"
									>
										<Copy className="h-4 w-4" />
										Copy URL
									</Button>
									<Button 
										size="sm" 
										asChild
										className="bg-gradient-to-r from-[#70C7BA] to-[#49EACB] hover:from-[#49EACB] hover:to-[#70C7BA] text-white font-semibold rounded-full shadow-lg hover:shadow-[#70C7BA]/25 transition-all duration-300"
									>
										<Link
											href={`/${userProfile.handle}`}
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

				{/* Loading state for profile data */}
				{profileLoading && (
					<div className="text-center py-4">
						<div className="w-8 h-8 border-2 border-[#70C7BA] border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
						<p className="text-[#70C7BA] text-sm">Updating profile...</p>
					</div>
				)}

				{/* Main Dashboard Tabs */}
				<Tabs defaultValue="profile" className="space-y-8">
					<TabsList className="grid w-full grid-cols-4 bg-slate-800/50 backdrop-blur-xl border border-[#70C7BA]/20 rounded-2xl p-2">
						<TabsTrigger 
							value="profile" 
							className="flex items-center gap-2 rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#70C7BA] data-[state=active]:to-[#49EACB] data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-300"
						>
							<User className="h-4 w-4" />
							Profile
						</TabsTrigger>
						<TabsTrigger 
							value="theme" 
							className="flex items-center gap-2 rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#70C7BA] data-[state=active]:to-[#49EACB] data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-300"
						>
							<Palette className="h-4 w-4" />
							Theme
						</TabsTrigger>
						<TabsTrigger 
							value="socials" 
							className="flex items-center gap-2 rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#70C7BA] data-[state=active]:to-[#49EACB] data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-300"
						>
							<LinkIcon className="h-4 w-4" />
							Social Links
						</TabsTrigger>
						<TabsTrigger 
							value="settings" 
							className="flex items-center gap-2 rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#70C7BA] data-[state=active]:to-[#49EACB] data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-300"
						>
							<Settings className="h-4 w-4" />
							Settings
						</TabsTrigger>
					</TabsList>

					<TabsContent value="profile">
						<Card className="bg-white/5 backdrop-blur-xl border border-[#70C7BA]/20 shadow-2xl">
							<CardHeader>
								<CardTitle className="text-white flex items-center gap-2">
									<User className="w-5 h-5 text-[#70C7BA]" />
									Profile Information
								</CardTitle>
							</CardHeader>
							<CardContent>
								<ProfileForm
									userPage={convertProfileForComponents(userProfile)}
									isLoading={profileLoading}
								/>
							</CardContent>
						</Card>
					</TabsContent>

					<TabsContent value="theme">
						<Card className="bg-white/5 backdrop-blur-xl border border-[#70C7BA]/20 shadow-2xl">
							<CardHeader>
								<CardTitle className="text-white flex items-center gap-2">
									<Palette className="w-5 h-5 text-[#49EACB]" />
									Customize Your Page
								</CardTitle>
							</CardHeader>
							<CardContent>
								<ThemeCustomization
									userPage={convertProfileForComponents(userProfile)}
									isLoading={profileLoading}
								/>
							</CardContent>
						</Card>
					</TabsContent>

					<TabsContent value="socials">
						<Card className="bg-white/5 backdrop-blur-xl border border-[#70C7BA]/20 shadow-2xl">
							<CardHeader>
								<CardTitle className="text-white flex items-center gap-2">
									<LinkIcon className="w-5 h-5 text-[#70C7BA]" />
									Social Links
								</CardTitle>
							</CardHeader>
							<CardContent>
								<SocialLinksForm
									socials={socials?.socials || []}
									isLoading={false}
								/>
							</CardContent>
						</Card>
					</TabsContent>

					<TabsContent value="settings">
						<Card className="bg-white/5 backdrop-blur-xl border border-[#70C7BA]/20 shadow-2xl">
							<CardHeader>
								<CardTitle className="text-white flex items-center gap-2">
									<Settings className="w-5 h-5 text-[#49EACB]" />
									Account Settings
								</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="space-y-6">
									<div className="grid gap-6">
										<div className="bg-slate-800/50 backdrop-blur-sm border border-[#70C7BA]/20 rounded-xl p-6">
											<h3 className="font-semibold text-white mb-2 flex items-center gap-2">
												<User className="w-4 h-4 text-[#70C7BA]" />
												Account Information
											</h3>
											<p className="text-gray-400 mb-4">
												{session.user.email}
											</p>
											<div className="text-sm text-gray-500">
												Member since {new Date().toLocaleDateString()}
											</div>
										</div>
										
										<div className="bg-slate-800/50 backdrop-blur-sm border border-[#70C7BA]/20 rounded-xl p-6">
											<h3 className="font-semibold text-white mb-4 flex items-center gap-2">
												<LogOut className="w-4 h-4 text-[#49EACB]" />
												Session Management
											</h3>
											<Button 
												variant="outline" 
												onClick={handleSignOut}
												className="border-[#70C7BA]/30 text-[#70C7BA] hover:bg-[#70C7BA]/10 hover:border-[#70C7BA] rounded-full"
											>
												Sign Out
											</Button>
										</div>
										
										<div className="bg-red-500/10 backdrop-blur-sm border border-red-500/30 rounded-xl p-6">
											<h3 className="font-semibold text-red-400 mb-4">Danger Zone</h3>
											<p className="text-gray-400 text-sm mb-4">
												Once you delete your account, there is no going back. Please be certain.
											</p>
											<Button variant="destructive" size="sm" className="rounded-full">
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
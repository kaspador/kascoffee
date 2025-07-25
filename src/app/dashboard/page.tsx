'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { DirectusAPI } from '@/lib/directus';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ProfileForm } from '@/components/dashboard/profile-form';
import { ThemeCustomization } from '@/components/dashboard/theme-customization';
import { SocialLinksForm } from '@/components/dashboard/social-links-form';
import { User, Palette, Link as LinkIcon, Settings, Eye, Copy, LogOut, Coffee, Sparkles, TrendingUp, Users } from 'lucide-react';
import Link from 'next/link';

// Type for API responses
interface UserProfile {
	id: string;
	userId: string;
	handle: string;
	displayName: string;
	shortDescription: string;
	longDescription: string;
	kaspaAddress: string;
	profileImage: string | null;
	backgroundImage: string | null;
	backgroundColor: string;
	foregroundColor: string;
	isActive: boolean;
	viewCount: number;
	createdAt: string;
	updatedAt: string;
}

interface AuthUser {
	id: string;
	email: string;
	first_name?: string;
	last_name?: string;
	name: string;
}

export default function DashboardPage() {
	const [authUser, setAuthUser] = useState<AuthUser | null>(null);
	const [authLoading, setAuthLoading] = useState(true);
	const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
	const [profileLoading, setProfileLoading] = useState(false);
	const [socials, setSocials] = useState<{socials: Array<{id: string; platform: string; url: string; username: string; isVisible: boolean}>} | null>(null);
	const router = useRouter();

	// Check authentication on component mount
	useEffect(() => {
		const checkAuth = async () => {
			try {
				setAuthLoading(true);
				const isAuth = await DirectusAPI.isAuthenticated();
				if (isAuth) {
					const user = await DirectusAPI.getCurrentUser();
					setAuthUser({
						id: user.id,
						email: user.email,
						first_name: user.first_name,
						last_name: user.last_name,
						name: `${user.first_name || ''} ${user.last_name || ''}`.trim() || user.email
					});
				} else {
					router.push('/auth/signin');
					return;
				}
			} catch (error) {
				console.error('Auth check failed:', error);
				router.push('/auth/signin');
				return;
			} finally {
				setAuthLoading(false);
			}
		};

		checkAuth();
	}, [router]);

	// Fetch profile when user is authenticated
	useEffect(() => {
		if (!authUser) return;
		
		fetchProfile();
		fetchSocials();
	}, [authUser]);

	// Function to fetch profile data from API
	const fetchProfile = async () => {
		try {
			setProfileLoading(true);
			const response = await fetch('/api/user/profile');
			
			if (response.ok) {
				const data = await response.json();
				setUserProfile(data.userPage);
			}
		} catch (error) {
			console.error('Failed to fetch profile:', error);
		} finally {
			setProfileLoading(false);
		}
	};

	// Function to fetch social links
	const fetchSocials = async () => {
		try {
			const response = await fetch('/api/user/socials');
			
			if (response.ok) {
				const data = await response.json();
				setSocials(data);
			}
		} catch (error) {
			console.error('Failed to fetch socials:', error);
		}
	};

	// Convert UserProfile to the format expected by components
	const convertProfileForComponents = (profile: UserProfile | null) => {
		if (!profile) return undefined;
		
		return {
			...profile,
			profileImage: profile.profileImage || null,
			backgroundImage: profile.backgroundImage || null,
			shortDescription: profile.shortDescription || null,
			longDescription: profile.longDescription || null,
			viewCount: profile.viewCount || null,
			createdAt: new Date(profile.createdAt),
			updatedAt: new Date(profile.updatedAt),
		};
	};

	const copyProfileUrl = () => {
		if (userProfile?.handle) {
			navigator.clipboard.writeText(`https://kas.coffee/${userProfile.handle}`);
		}
	};

	const handleLogout = async () => {
		try {
			await DirectusAPI.logout();
			setAuthUser(null);
			setUserProfile(null);
			setSocials(null);
			router.push('/');
		} catch (error) {
			console.error('Logout error:', error);
			// Even if logout fails, clear local state and redirect
			setAuthUser(null);
			setUserProfile(null);
			setSocials(null);
			router.push('/');
		}
	};

	if (authLoading) {
		return (
			<div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
				<div className="text-center">
					<div className="w-16 h-16 border-4 border-[#70C7BA] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
					<p className="text-[#70C7BA] text-lg font-kaspa-header font-semibold">Loading your dashboard...</p>
				</div>
			</div>
		);
	}

	if (!authUser) {
		return null;
	}

	return (
		<div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 relative overflow-hidden">
			{/* Animated background with Kaspa colors */}
			<div className="absolute inset-0 bg-gradient-to-r from-[#70C7BA]/5 via-[#49EACB]/5 to-[#70C7BA]/5 animate-pulse"></div>
			<div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#70C7BA]/10 rounded-full blur-3xl animate-bounce-gentle"></div>
			<div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#49EACB]/10 rounded-full blur-3xl animate-bounce-gentle delay-1000"></div>

			{/* Header */}
			<header className="relative z-10 border-b border-[#70C7BA]/20 bg-slate-900/80 backdrop-blur-xl">
				<div className="container mx-auto px-6 py-4">
					<div className="flex items-center justify-between">
						<Link href="/" className="flex items-center gap-3 font-kaspa-header font-bold text-xl group">
							<div className="relative coffee-container">
								<Coffee className="h-8 w-8 text-[#70C7BA] coffee-icon group-hover:text-[#49EACB] transition-all duration-300" />
								<div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-[#49EACB] to-[#70C7BA] rounded-full animate-pulse"></div>
							</div>
							<span className="bg-gradient-to-r from-[#70C7BA] to-[#49EACB] bg-clip-text text-transparent">
								kas.coffee
							</span>
						</Link>
						<div className="flex items-center gap-4">
							{userProfile?.handle && (
								<Button 
									variant="ghost" 
									size="sm"
									onClick={copyProfileUrl}
									className="hidden md:flex items-center gap-2 border border-[#70C7BA]/30 text-[#70C7BA] hover:bg-[#70C7BA]/10 hover:border-[#70C7BA] rounded-full backdrop-blur-sm font-kaspa-body transition-all duration-300"
								>
									<Copy className="h-4 w-4" />
									Copy Profile URL
								</Button>
							)}
							<Button 
								variant="ghost" 
								size="sm"
								onClick={handleLogout}
								className="flex items-center gap-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-full font-kaspa-body transition-all duration-300"
							>
								<LogOut className="h-4 w-4" />
								<span className="hidden md:inline">Sign Out</span>
							</Button>
						</div>
					</div>
				</div>
			</header>

			{/* Main Content */}
			<main className="relative z-10 container mx-auto px-6 py-8">
				{/* Welcome Header */}
				<div className="mb-8 text-center">
					<div className="inline-flex items-center gap-3 bg-gradient-to-r from-[#70C7BA]/20 to-[#49EACB]/20 backdrop-blur-xl border border-[#70C7BA]/30 rounded-full px-6 py-3 mb-6">
						<Sparkles className="w-5 h-5 text-[#49EACB]" />
						<span className="text-[#70C7BA] font-kaspa-subheader font-bold text-sm">DASHBOARD</span>
					</div>
					<h1 className="text-3xl md:text-4xl font-kaspa-header font-black text-white mb-3">
						Welcome back, <span className="bg-gradient-to-r from-[#70C7BA] to-[#49EACB] bg-clip-text text-transparent">
							{userProfile?.displayName || authUser.name}
						</span>
					</h1>
					<p className="text-gray-400 text-lg font-kaspa-body max-w-2xl mx-auto">
						Manage your kas.coffee profile and customize your donation page to start receiving Kaspa donations
					</p>
				</div>

				{/* Stats Overview */}
				<div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-8">
					<Card className="bg-gradient-to-br from-[#70C7BA]/15 to-[#49EACB]/8 backdrop-blur-xl border border-[#70C7BA]/40 shadow-xl hover:shadow-2xl hover:border-[#70C7BA]/60 transition-all duration-300 group">
						<CardContent className="p-6">
							<div className="flex items-start justify-between">
								<div className="flex-1">
									<p className="text-[#70C7BA] text-sm font-kaspa-subheader font-bold uppercase tracking-wider mb-2">PAGE VIEWS</p>
									<p className="text-3xl font-kaspa-header font-black text-white mb-2">{userProfile?.viewCount || 0}</p>
									<p className="text-green-400 text-sm flex items-center gap-1.5 font-kaspa-body">
										<TrendingUp className="w-4 h-4" />
										Growing steadily
									</p>
								</div>
								<div className="w-14 h-14 bg-[#70C7BA]/20 rounded-2xl flex items-center justify-center group-hover:bg-[#70C7BA]/30 transition-all duration-300">
									<Eye className="w-7 h-7 text-[#70C7BA]" />
								</div>
							</div>
						</CardContent>
					</Card>

					<Card className="bg-gradient-to-br from-[#49EACB]/15 to-[#70C7BA]/8 backdrop-blur-xl border border-[#49EACB]/40 shadow-xl hover:shadow-2xl hover:border-[#49EACB]/60 transition-all duration-300 group">
						<CardContent className="p-6">
							<div className="flex items-start justify-between">
								<div className="flex-1">
									<p className="text-[#49EACB] text-sm font-kaspa-subheader font-bold uppercase tracking-wider mb-2">SOCIAL LINKS</p>
									<p className="text-3xl font-kaspa-header font-black text-white mb-2">{socials?.socials?.length || 0}</p>
									<p className="text-gray-300 text-sm font-kaspa-body">Connected platforms</p>
								</div>
								<div className="w-14 h-14 bg-[#49EACB]/20 rounded-2xl flex items-center justify-center group-hover:bg-[#49EACB]/30 transition-all duration-300">
									<LinkIcon className="w-7 h-7 text-[#49EACB]" />
								</div>
							</div>
						</CardContent>
					</Card>

					<Card className="bg-gradient-to-br from-purple-500/15 to-pink-500/8 backdrop-blur-xl border border-purple-500/40 shadow-xl hover:shadow-2xl hover:border-purple-500/60 transition-all duration-300 group">
						<CardContent className="p-6">
							<div className="flex items-start justify-between">
								<div className="flex-1">
									<p className="text-purple-400 text-sm font-kaspa-subheader font-bold uppercase tracking-wider mb-2">SUPPORTERS</p>
									<p className="text-3xl font-kaspa-header font-black text-white mb-2">0</p>
									<p className="text-gray-300 text-sm font-kaspa-body">This month</p>
								</div>
								<div className="w-14 h-14 bg-purple-500/20 rounded-2xl flex items-center justify-center group-hover:bg-purple-500/30 transition-all duration-300">
									<Users className="w-7 h-7 text-purple-400" />
								</div>
							</div>
						</CardContent>
					</Card>
				</div>

				{/* Quick Actions Card */}
				{userProfile && (
					<Card className="mb-8 bg-gradient-to-r from-[#70C7BA]/15 via-[#49EACB]/15 to-[#70C7BA]/15 backdrop-blur-xl border border-[#70C7BA]/40 shadow-xl hover:shadow-2xl transition-all duration-300">
						<CardContent className="p-8">
							<div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
								<div className="text-center lg:text-left">
									<h3 className="text-2xl font-kaspa-header font-bold text-white mb-3 flex items-center justify-center lg:justify-start gap-2">
										<Sparkles className="w-6 h-6 text-[#49EACB]" />
										Your Donation Page is Live!
									</h3>
									<p className="text-gray-200 font-kaspa-body text-lg mb-2">
										Share your unique link and start receiving donations
									</p>
									<div className="bg-slate-800/50 rounded-lg px-4 py-3 inline-block">
										<p className="text-[#70C7BA] font-kaspa-subheader font-bold text-lg">
											kas.coffee/{userProfile.handle}
										</p>
									</div>
								</div>
								<div className="flex flex-col sm:flex-row items-center gap-3">
									<Button 
										variant="outline"
										onClick={copyProfileUrl}
										className="w-full sm:w-auto flex items-center justify-center gap-2 border-[#70C7BA]/50 text-[#70C7BA] hover:bg-[#70C7BA]/10 hover:border-[#70C7BA] rounded-xl backdrop-blur-sm font-kaspa-body font-semibold px-6 py-3 transition-all duration-300"
									>
										<Copy className="h-5 w-5" />
										Copy URL
									</Button>
									<Button 
										asChild
										className="w-full sm:w-auto bg-gradient-to-r from-[#70C7BA] to-[#49EACB] hover:from-[#5ba8a0] hover:to-[#3dd4b4] text-white font-kaspa-subheader font-bold rounded-xl shadow-lg hover:shadow-[#70C7BA]/25 px-6 py-3 transition-all duration-300 transform hover:scale-105"
									>
										<Link
											href={`/${userProfile.handle}`}
											target="_blank"
											className="flex items-center justify-center gap-2"
										>
											<Eye className="h-5 w-5" />
											Preview Page
										</Link>
									</Button>
								</div>
							</div>
						</CardContent>
					</Card>
				)}

				{/* Profile Loading State */}
				{profileLoading && (
					<div className="text-center py-6 mb-8">
						<div className="w-8 h-8 border-2 border-[#70C7BA] border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
						<p className="text-[#70C7BA] text-sm font-kaspa-body">Updating your profile...</p>
					</div>
				)}

				{/* Dashboard Tabs */}
				<Tabs defaultValue="profile" className="space-y-8">
					<div className="flex justify-center mb-8">
						<TabsList className="inline-flex bg-slate-800/90 backdrop-blur-xl border border-[#70C7BA]/30 rounded-2xl p-1 shadow-xl">
							<TabsTrigger 
								value="profile" 
								className="flex items-center gap-2 rounded-xl font-kaspa-body font-semibold px-6 py-3 text-gray-400 hover:text-white transition-all duration-300 data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#70C7BA] data-[state=active]:to-[#49EACB] data-[state=active]:text-white data-[state=active]:shadow-lg min-w-[120px] justify-center"
							>
								<User className="h-5 w-5" />
								<span>Profile</span>
							</TabsTrigger>
							<TabsTrigger 
								value="theme" 
								className="flex items-center gap-2 rounded-xl font-kaspa-body font-semibold px-6 py-3 text-gray-400 hover:text-white transition-all duration-300 data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#70C7BA] data-[state=active]:to-[#49EACB] data-[state=active]:text-white data-[state=active]:shadow-lg min-w-[120px] justify-center"
							>
								<Palette className="h-5 w-5" />
								<span>Theme</span>
							</TabsTrigger>
							<TabsTrigger 
								value="socials" 
								className="flex items-center gap-2 rounded-xl font-kaspa-body font-semibold px-6 py-3 text-gray-400 hover:text-white transition-all duration-300 data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#70C7BA] data-[state=active]:to-[#49EACB] data-[state=active]:text-white data-[state=active]:shadow-lg min-w-[120px] justify-center"
							>
								<LinkIcon className="h-5 w-5" />
								<span>Social</span>
							</TabsTrigger>
							<TabsTrigger 
								value="settings" 
								className="flex items-center gap-2 rounded-xl font-kaspa-body font-semibold px-6 py-3 text-gray-400 hover:text-white transition-all duration-300 data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#70C7BA] data-[state=active]:to-[#49EACB] data-[state=active]:text-white data-[state=active]:shadow-lg min-w-[120px] justify-center"
							>
								<Settings className="h-5 w-5" />
								<span>Settings</span>
							</TabsTrigger>
						</TabsList>
					</div>

					<TabsContent value="profile" className="space-y-0">
						<Card className="bg-white/5 backdrop-blur-xl border border-[#70C7BA]/30 shadow-2xl hover:shadow-[#70C7BA]/10 transition-all duration-300">
							<CardHeader className="border-b border-[#70C7BA]/20 p-8">
								<CardTitle className="text-white flex items-center gap-3 font-kaspa-header text-xl">
									<User className="w-7 h-7 text-[#70C7BA]" />
									Profile Information
								</CardTitle>
								<p className="text-gray-300 font-kaspa-body mt-2">
									Configure your basic profile information and donation settings
								</p>
							</CardHeader>
							<CardContent className="p-8">
								<ProfileForm
									userPage={convertProfileForComponents(userProfile)}
									isLoading={profileLoading}
									onSuccess={fetchProfile}
								/>
							</CardContent>
						</Card>
					</TabsContent>

					<TabsContent value="theme" className="space-y-0">
						<Card className="bg-white/5 backdrop-blur-xl border border-[#49EACB]/30 shadow-2xl hover:shadow-[#49EACB]/10 transition-all duration-300">
							<CardHeader className="border-b border-[#49EACB]/20 p-8">
								<CardTitle className="text-white flex items-center gap-3 font-kaspa-header text-xl">
									<Palette className="w-7 h-7 text-[#49EACB]" />
									Customize Your Page
								</CardTitle>
								<p className="text-gray-300 font-kaspa-body mt-2">
									Personalize the look and feel of your donation page
								</p>
							</CardHeader>
							<CardContent className="p-8">
								<ThemeCustomization
									userPage={convertProfileForComponents(userProfile)}
									isLoading={profileLoading}
									onSuccess={fetchProfile}
								/>
							</CardContent>
						</Card>
					</TabsContent>

					<TabsContent value="socials" className="space-y-0">
						<Card className="bg-white/5 backdrop-blur-xl border border-[#70C7BA]/30 shadow-2xl hover:shadow-[#70C7BA]/10 transition-all duration-300">
							<CardHeader className="border-b border-[#70C7BA]/20 p-8">
								<CardTitle className="text-white flex items-center gap-3 font-kaspa-header text-xl">
									<LinkIcon className="w-7 h-7 text-[#70C7BA]" />
									Social Links
								</CardTitle>
								<p className="text-gray-300 font-kaspa-body mt-2">
									Connect your social media accounts to build trust with supporters
								</p>
							</CardHeader>
							<CardContent className="p-8">
								<SocialLinksForm
									socials={socials?.socials || []}
									isLoading={false}
									onSuccess={fetchSocials}
								/>
							</CardContent>
						</Card>
					</TabsContent>

					<TabsContent value="settings" className="space-y-0">
						<Card className="bg-white/5 backdrop-blur-xl border border-purple-500/30 shadow-2xl hover:shadow-purple-500/10 transition-all duration-300">
							<CardHeader className="border-b border-purple-500/20 p-8">
								<CardTitle className="text-white flex items-center gap-3 font-kaspa-header text-xl">
									<Settings className="w-7 h-7 text-purple-400" />
									Account Settings
								</CardTitle>
								<p className="text-gray-300 font-kaspa-body mt-2">
									Manage your account preferences and advanced settings
								</p>
							</CardHeader>
							<CardContent className="p-8">
								<div className="space-y-6">
									<div className="text-center py-12">
										<div className="w-20 h-20 bg-purple-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
											<Settings className="w-10 h-10 text-purple-400 opacity-60" />
										</div>
										<h3 className="text-2xl font-kaspa-header font-bold text-white mb-3">Settings Coming Soon</h3>
										<p className="text-gray-400 font-kaspa-body text-lg max-w-md mx-auto">
											Advanced settings and preferences will be available here in a future update.
										</p>
									</div>
								</div>
							</CardContent>
						</Card>
					</TabsContent>
				</Tabs>
			</main>
		</div>
	);
} 
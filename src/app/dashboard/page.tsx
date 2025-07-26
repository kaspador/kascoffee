'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ProfileForm } from '@/components/dashboard/profile-form';
import { ThemeCustomization } from '@/components/dashboard/theme-customization';
import { SocialLinksForm } from '@/components/dashboard/social-links-form';
import { User, Palette, Link as LinkIcon, Eye, LogOut, Coffee, Sparkles, TrendingUp, Users } from 'lucide-react';
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
				const response = await fetch('/api/auth/me', {
					credentials: 'include', // Include cookies
				});

				if (response.ok) {
					const data = await response.json();
					setAuthUser(data.user);
				} else {
					router.push('/auth/signin');
					return;
				}
			} catch {
				router.push('/auth/signin');
				return;
			} finally {
				setAuthLoading(false);
			}
		};

		checkAuth();
	}, [router]);

	// Function to fetch profile data from API
	const fetchProfile = useCallback(async () => {
		try {
			setProfileLoading(true);
			const response = await fetch('/api/user/profile');
			
			if (response.ok) {
				const data = await response.json();
				setUserProfile(data.userPage);
			} else {
				// Handle error if needed
			}
		} catch {
			// Handle error if needed
		} finally {
			setProfileLoading(false);
		}
	}, []);

	// Function to fetch social links
	const fetchSocials = useCallback(async () => {
		try {
			const response = await fetch('/api/user/socials');
			
			if (response.ok) {
				const data = await response.json();
				setSocials(data);
			}
		} catch {
			// Handle error if needed
		}
	}, []);

	// Fetch profile when user is authenticated
	useEffect(() => {
		if (!authUser) return;
		fetchProfile();
		fetchSocials();
	}, [authUser, fetchProfile, fetchSocials]); // Dependencies optimized to prevent infinite loops

	// Convert UserProfile to the format expected by components
	const convertProfileForComponents = (profile: UserProfile | null) => {
		if (!profile) return undefined; // Return undefined for new users to match component interfaces
		
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

	const handleLogout = async () => {
		try {
			await fetch('/api/auth/logout', {
				method: 'POST',
				credentials: 'include', // Include cookies
			});
			setAuthUser(null);
			setUserProfile(null);
			setSocials(null);
			router.push('/');
		} catch {
			// Even if logout fails, clear local state and redirect
			setAuthUser(null);
			setUserProfile(null);
			setSocials(null);
			router.push('/');
		}
	};

	if (authLoading) {
		return (
			<div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center px-4">
				<div className="text-center">
					<div className="w-12 h-12 sm:w-16 sm:h-16 border-4 border-[#70C7BA] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
					<p className="text-[#70C7BA] text-base sm:text-lg font-kaspa-header font-semibold">Loading your dashboard...</p>
				</div>
			</div>
		);
	}

	if (!authUser) {
		return null;
	}

	return (
		<div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 relative overflow-x-hidden">
			{/* Animated background with Kaspa colors - responsive sizing */}
			<div className="absolute inset-0 bg-gradient-to-r from-[#70C7BA]/5 via-[#49EACB]/5 to-[#70C7BA]/5 animate-pulse"></div>
			<div className="absolute top-10 left-5 sm:top-1/4 sm:left-1/4 w-32 h-32 sm:w-96 sm:h-96 bg-[#70C7BA]/10 rounded-full blur-3xl animate-bounce-gentle"></div>
			<div className="absolute bottom-10 right-5 sm:bottom-1/4 sm:right-1/4 w-40 h-40 sm:w-96 sm:h-96 bg-[#49EACB]/10 rounded-full blur-3xl animate-bounce-gentle delay-1000"></div>

			{/* Header - better mobile optimization */}
			<header className="relative z-10 border-b border-[#70C7BA]/20 bg-slate-900/80 backdrop-blur-xl">
				<div className="container mx-auto px-4 sm:px-6 py-3 sm:py-4">
					<div className="flex items-center justify-between">
						<Link href="/" className="flex items-center gap-2 sm:gap-3 font-kaspa-header font-bold text-lg sm:text-xl group">
							<div className="relative coffee-container">
								<Coffee className="h-6 w-6 sm:h-8 sm:w-8 text-[#70C7BA] coffee-icon group-hover:text-[#49EACB] transition-all duration-300" />
								<div className="absolute -top-1 -right-1 w-2 h-2 sm:w-3 sm:h-3 bg-gradient-to-r from-[#49EACB] to-[#70C7BA] rounded-full animate-pulse"></div>
							</div>
							<span className="bg-gradient-to-r from-[#70C7BA] to-[#49EACB] bg-clip-text text-transparent">
								kas.coffee
							</span>
						</Link>
						<div className="flex items-center gap-2 sm:gap-4">
							<Button 
								variant="ghost" 
								size="sm"
								onClick={handleLogout}
								className="flex items-center gap-1 sm:gap-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-full font-kaspa-body transition-all duration-300 px-2 sm:px-3"
							>
								<LogOut className="h-3 w-3 sm:h-4 sm:w-4" />
								<span className="hidden sm:inline text-xs sm:text-sm">Sign Out</span>
							</Button>
						</div>
					</div>
				</div>
			</header>

			{/* Main Content - better mobile padding */}
			<main className="relative z-10 container mx-auto px-4 sm:px-6 py-6 sm:py-8">
				{/* Welcome Header - better mobile sizing */}
				<div className="mb-6 sm:mb-8 text-center">
					<div className="inline-flex items-center gap-2 sm:gap-3 bg-gradient-to-r from-[#70C7BA]/20 to-[#49EACB]/20 backdrop-blur-xl border border-[#70C7BA]/30 rounded-full px-3 py-2 sm:px-6 sm:py-3 mb-4 sm:mb-6">
						<Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-[#49EACB]" />
						<span className="text-[#70C7BA] font-kaspa-subheader font-bold text-xs sm:text-sm">DASHBOARD</span>
					</div>
					<h1 className="text-2xl sm:text-3xl md:text-4xl font-kaspa-header font-black text-white mb-2 sm:mb-3 px-2">
						Welcome back, <span className="bg-gradient-to-r from-[#70C7BA] to-[#49EACB] bg-clip-text text-transparent">
							{userProfile?.displayName || authUser.name}
						</span>
					</h1>
					<p className="text-gray-400 text-sm sm:text-base md:text-lg font-kaspa-body max-w-2xl mx-auto px-2">
						Manage your kas.coffee profile and customize your donation page to start receiving Kaspa donations
					</p>
				</div>

				{/* Stats Overview - better mobile cards */}
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6 mb-6 sm:mb-8">
					<Card className="bg-gradient-to-br from-[#70C7BA]/15 to-[#49EACB]/8 backdrop-blur-xl border border-[#70C7BA]/40 shadow-xl hover:shadow-2xl hover:border-[#70C7BA]/60 transition-all duration-300 group">
						<CardContent className="p-4 sm:p-6">
							<div className="flex items-start justify-between">
								<div className="flex-1">
									<p className="text-[#70C7BA] text-xs sm:text-sm font-kaspa-subheader font-bold uppercase tracking-wider mb-1 sm:mb-2">PAGE VIEWS</p>
									<p className="text-2xl sm:text-3xl font-kaspa-header font-black text-white mb-1 sm:mb-2">{userProfile?.viewCount || 0}</p>
									<p className="text-green-400 text-xs sm:text-sm flex items-center gap-1.5 font-kaspa-body">
										<TrendingUp className="w-3 h-3 sm:w-4 sm:h-4" />
										Unique visitors
									</p>
								</div>
								<div className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 bg-[#70C7BA]/20 rounded-2xl flex items-center justify-center group-hover:bg-[#70C7BA]/30 transition-all duration-300">
									<Eye className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 text-[#70C7BA]" />
								</div>
							</div>
						</CardContent>
					</Card>

					<Card className="bg-gradient-to-br from-[#49EACB]/15 to-[#70C7BA]/8 backdrop-blur-xl border border-[#49EACB]/40 shadow-xl hover:shadow-2xl hover:border-[#49EACB]/60 transition-all duration-300 group">
						<CardContent className="p-4 sm:p-6">
							<div className="flex items-start justify-between">
								<div className="flex-1">
									<p className="text-[#49EACB] text-xs sm:text-sm font-kaspa-subheader font-bold uppercase tracking-wider mb-1 sm:mb-2">SOCIAL LINKS</p>
									<p className="text-2xl sm:text-3xl font-kaspa-header font-black text-white mb-1 sm:mb-2">{socials?.socials?.length || 0}</p>
									<p className="text-gray-300 text-xs sm:text-sm font-kaspa-body">Connected platforms</p>
								</div>
								<div className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 bg-[#49EACB]/20 rounded-2xl flex items-center justify-center group-hover:bg-[#49EACB]/30 transition-all duration-300">
									<LinkIcon className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 text-[#49EACB]" />
								</div>
							</div>
						</CardContent>
					</Card>

					<Card className="bg-gradient-to-br from-purple-500/15 to-pink-500/8 backdrop-blur-xl border border-purple-500/40 shadow-xl hover:shadow-2xl hover:border-purple-500/60 transition-all duration-300 group sm:col-span-2 lg:col-span-1">
						<CardContent className="p-4 sm:p-6">
							<div className="flex items-start justify-between">
								<div className="flex-1">
									<p className="text-purple-400 text-xs sm:text-sm font-kaspa-subheader font-bold uppercase tracking-wider mb-1 sm:mb-2">SUPPORTERS</p>
									<p className="text-2xl sm:text-3xl font-kaspa-header font-black text-white mb-1 sm:mb-2">0</p>
									<p className="text-gray-300 text-xs sm:text-sm font-kaspa-body">This month</p>
								</div>
								<div className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 bg-purple-500/20 rounded-2xl flex items-center justify-center group-hover:bg-purple-500/30 transition-all duration-300">
									<Users className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 text-purple-400" />
								</div>
							</div>
						</CardContent>
					</Card>
				</div>

				{/* Quick Actions Card - better mobile layout */}
				{userProfile && (
					<Card className="mb-6 sm:mb-8 bg-gradient-to-r from-[#70C7BA]/15 via-[#49EACB]/15 to-[#70C7BA]/15 backdrop-blur-xl border border-[#70C7BA]/40 shadow-xl hover:shadow-2xl transition-all duration-300">
						<CardContent className="p-4 sm:p-6 md:p-8">
							<div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 sm:gap-6">
								<div className="text-center lg:text-left">
									<h3 className="text-lg sm:text-xl md:text-2xl font-kaspa-header font-bold text-white mb-2 sm:mb-3 flex items-center justify-center lg:justify-start gap-2">
										<Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-[#49EACB]" />
										Your Donation Page is Live!
									</h3>
									<p className="text-gray-200 font-kaspa-body text-sm sm:text-base md:text-lg mb-2 sm:mb-3">
										Share your unique link and start receiving donations
									</p>
									<div className="bg-slate-800/50 rounded-lg px-3 py-2 sm:px-4 sm:py-3 inline-block max-w-full overflow-hidden">
										<p className="text-[#70C7BA] font-kaspa-subheader font-bold text-sm sm:text-base md:text-lg break-all">
											kas.coffee/{userProfile.handle}
										</p>
									</div>
								</div>
								<div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3">
									<Button 
										asChild
										className="w-full sm:w-auto bg-gradient-to-r from-[#70C7BA] to-[#49EACB] hover:from-[#5ba8a0] hover:to-[#3dd4b4] text-white font-kaspa-subheader font-bold rounded-xl shadow-lg hover:shadow-[#70C7BA]/25 px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base transition-all duration-300 transform hover:scale-105"
									>
										<Link
											href={`/${userProfile.handle}`}
											target="_blank"
											className="flex items-center justify-center gap-2"
										>
											👀 View Page
										</Link>
									</Button>
									<Button 
										variant="outline"
										className="w-full sm:w-auto border-[#70C7BA]/50 text-[#70C7BA] hover:bg-[#70C7BA]/10 backdrop-blur-xl font-kaspa-subheader font-bold rounded-xl px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base transition-all duration-300"
										onClick={() => {
											navigator.clipboard.writeText(`${window.location.origin}/${userProfile.handle}`);
										}}
									>
										📋 Copy Link
									</Button>
								</div>
							</div>
						</CardContent>
					</Card>
				)}

				{/* Management Tabs - better mobile design */}
				<Tabs defaultValue="profile" className="space-y-6 sm:space-y-8">
					<div className="bg-gradient-to-r from-white/5 to-white/5 backdrop-blur-xl border border-white/20 rounded-2xl p-2">
						<TabsList className="grid w-full grid-cols-3 bg-transparent gap-1 h-auto">
							<TabsTrigger 
								value="profile" 
								className="data-[state=active]:bg-[#70C7BA] data-[state=active]:text-white text-gray-300 rounded-xl font-kaspa-subheader font-bold transition-all duration-300 text-xs sm:text-sm py-3 sm:py-4 px-3 sm:px-4 flex items-center justify-center min-h-[44px] sm:min-h-[48px]"
							>
								<User className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2 flex-shrink-0" />
								<span className="hidden sm:inline">Profile</span>
								<span className="sm:hidden">Info</span>
							</TabsTrigger>
							<TabsTrigger 
								value="theme" 
								className="data-[state=active]:bg-[#49EACB] data-[state=active]:text-white text-gray-300 rounded-xl font-kaspa-subheader font-bold transition-all duration-300 text-xs sm:text-sm py-3 sm:py-4 px-3 sm:px-4 flex items-center justify-center min-h-[44px] sm:min-h-[48px]"
							>
								<Palette className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2 flex-shrink-0" />
								<span className="hidden sm:inline">Theme</span>
								<span className="sm:hidden">Style</span>
							</TabsTrigger>
							<TabsTrigger 
								value="socials" 
								className="data-[state=active]:bg-[#70C7BA] data-[state=active]:text-white text-gray-300 rounded-xl font-kaspa-subheader font-bold transition-all duration-300 text-xs sm:text-sm py-3 sm:py-4 px-3 sm:px-4 flex items-center justify-center min-h-[44px] sm:min-h-[48px]"
							>
								<LinkIcon className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2 flex-shrink-0" />
								<span className="hidden sm:inline">Socials</span>
								<span className="sm:hidden">Links</span>
							</TabsTrigger>
						</TabsList>
					</div>

					<TabsContent value="profile" className="space-y-6">
						<Card className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 shadow-xl">
							<CardHeader className="pb-4 sm:pb-6">
								<CardTitle className="text-xl sm:text-2xl font-kaspa-header font-bold text-white flex items-center gap-2 sm:gap-3">
									<User className="w-5 h-5 sm:w-6 sm:h-6 text-[#70C7BA]" />
									Profile Information
								</CardTitle>
							</CardHeader>
							<CardContent className="p-4 sm:p-6">
								<ProfileForm 
									userPage={convertProfileForComponents(userProfile)}
									isLoading={profileLoading}
									onSuccess={() => {
										fetchProfile();
									}}
								/>
							</CardContent>
						</Card>
					</TabsContent>

					<TabsContent value="theme" className="space-y-6">
						<Card className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 shadow-xl">
							<CardHeader className="pb-4 sm:pb-6">
								<CardTitle className="text-xl sm:text-2xl font-kaspa-header font-bold text-white flex items-center gap-2 sm:gap-3">
									<Palette className="w-5 h-5 sm:w-6 sm:h-6 text-[#49EACB]" />
									Theme Customization
								</CardTitle>
							</CardHeader>
							<CardContent className="p-4 sm:p-6">
								<ThemeCustomization 
									userPage={convertProfileForComponents(userProfile)}
									isLoading={profileLoading}
									onSuccess={() => {
										fetchProfile();
									}}
								/>
							</CardContent>
						</Card>
					</TabsContent>

					<TabsContent value="socials" className="space-y-6">
						<Card className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 shadow-xl">
							<CardHeader className="pb-4 sm:pb-6">
								<CardTitle className="text-xl sm:text-2xl font-kaspa-header font-bold text-white flex items-center gap-2 sm:gap-3">
									<LinkIcon className="w-5 h-5 sm:w-6 sm:h-6 text-[#70C7BA]" />
									Social Media Links
								</CardTitle>
							</CardHeader>
							<CardContent className="p-4 sm:p-6">
								<SocialLinksForm 
									socials={socials?.socials || []}
									isLoading={profileLoading}
									onSuccess={() => {
										fetchSocials();
									}}
								/>
							</CardContent>
						</Card>
					</TabsContent>
				</Tabs>
			</main>
		</div>
	);
} 
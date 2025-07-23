'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useSession, signOut } from '@/lib/auth-client';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ThemeToggle } from '@/components/theme-toggle';
import { Coffee, Menu, X, User, Settings, LogOut } from 'lucide-react';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export function Navbar() {
	const [isOpen, setIsOpen] = useState(false);
	const { data: session } = useSession();

	const handleSignOut = async () => {
		await signOut();
	};

	return (
		<nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
			<div className="container mx-auto px-4">
				<div className="flex items-center justify-between h-16">
					{/* Logo */}
					<Link href="/" className="flex items-center gap-2 font-bold text-xl hover:opacity-80 transition-opacity">
						<Coffee className="h-6 w-6" />
						kas.coffee
					</Link>

					{/* Desktop Navigation */}
					<div className="hidden md:flex items-center gap-6">
						<Link href="/about" className="text-muted-foreground hover:text-foreground transition-colors">
							About
						</Link>
						
						<ThemeToggle />

						{session ? (
							<DropdownMenu>
								<DropdownMenuTrigger asChild>
									<Button variant="ghost" className="relative h-10 w-10 rounded-full">
										<Avatar>
											<AvatarImage src={session.user.image || undefined} />
											<AvatarFallback>
												{session.user.name?.charAt(0) || session.user.email?.charAt(0)}
											</AvatarFallback>
										</Avatar>
									</Button>
								</DropdownMenuTrigger>
								<DropdownMenuContent className="w-56" align="end" forceMount>
									<div className="flex items-center justify-start gap-2 p-2">
										<div className="flex flex-col space-y-1 leading-none">
											{session.user.name && (
												<p className="font-medium">{session.user.name}</p>
											)}
											{session.user.email && (
												<p className="w-[200px] truncate text-sm text-muted-foreground">
													{session.user.email}
												</p>
											)}
										</div>
									</div>
									<DropdownMenuSeparator />
									<DropdownMenuItem asChild>
										<Link href="/dashboard" className="flex items-center gap-2">
											<User className="h-4 w-4" />
											Dashboard
										</Link>
									</DropdownMenuItem>
									<DropdownMenuItem asChild>
										<Link href="/dashboard" className="flex items-center gap-2">
											<Settings className="h-4 w-4" />
											Settings
										</Link>
									</DropdownMenuItem>
									<DropdownMenuSeparator />
									<DropdownMenuItem
										className="flex items-center gap-2 text-red-600 focus:text-red-600"
										onClick={handleSignOut}
									>
										<LogOut className="h-4 w-4" />
										Sign Out
									</DropdownMenuItem>
								</DropdownMenuContent>
							</DropdownMenu>
						) : (
							<div className="flex items-center gap-2">
								<Button variant="ghost" asChild>
									<Link href="/auth/signin">Sign In</Link>
								</Button>
								<Button asChild>
									<Link href="/auth/signup">Get Started</Link>
								</Button>
							</div>
						)}
					</div>

					{/* Mobile menu button */}
					<div className="md:hidden flex items-center gap-2">
						<ThemeToggle />
						<Button
							variant="ghost"
							size="icon"
							onClick={() => setIsOpen(!isOpen)}
							aria-label="Toggle menu"
						>
							{isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
						</Button>
					</div>
				</div>

				{/* Mobile Navigation */}
				{isOpen && (
					<div className="md:hidden border-t py-4">
						<div className="space-y-4">
							<Link
								href="/about"
								className="block px-3 py-2 text-muted-foreground hover:text-foreground transition-colors"
								onClick={() => setIsOpen(false)}
							>
								About
							</Link>
							
							{session ? (
								<div className="space-y-2">
									<div className="px-3 py-2 text-sm">
										<p className="font-medium">{session.user.name}</p>
										<p className="text-muted-foreground">{session.user.email}</p>
									</div>
									<Link
										href="/dashboard"
										className="block px-3 py-2 text-muted-foreground hover:text-foreground transition-colors"
										onClick={() => setIsOpen(false)}
									>
										Dashboard
									</Link>
									<button
										onClick={() => {
											handleSignOut();
											setIsOpen(false);
										}}
										className="block w-full text-left px-3 py-2 text-red-600 hover:text-red-700 transition-colors"
									>
										Sign Out
									</button>
								</div>
							) : (
								<div className="space-y-2">
									<Link
										href="/auth/signin"
										className="block px-3 py-2 text-muted-foreground hover:text-foreground transition-colors"
										onClick={() => setIsOpen(false)}
									>
										Sign In
									</Link>
									<Link
										href="/auth/signup"
										className="block px-3 py-2 bg-primary text-primary-foreground rounded-md mx-3"
										onClick={() => setIsOpen(false)}
									>
										Get Started
									</Link>
								</div>
							)}
						</div>
					</div>
				)}
			</div>
		</nav>
	);
} 
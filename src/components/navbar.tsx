"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Coffee, Menu, X } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { useState } from "react";

export function Navbar() {
	const [isOpen, setIsOpen] = useState(false);

	return (
		<nav className="fixed top-0 left-0 right-0 z-50 bg-black/20 backdrop-blur-xl border-b border-white/10">
			<div className="max-w-7xl mx-auto px-6 py-4">
				<div className="flex items-center justify-between">
					{/* Logo */}
					<Link href="/" className="flex items-center gap-3 group">
						<div className="relative coffee-container">
							<Coffee className="h-8 w-8 text-[#70C7BA] coffee-icon group-hover:scale-110 transition-all duration-300" />
							<div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-[#49EACB] to-[#70C7BA] rounded-full animate-pulse"></div>
						</div>
						<span className="text-2xl font-bold bg-gradient-to-r from-[#70C7BA] to-[#49EACB] bg-clip-text text-transparent">
							kas.coffee
						</span>
					</Link>

					{/* Desktop Navigation */}
					<div className="hidden md:flex items-center gap-8">
						<Link href="/about" className="text-white/80 hover:text-[#70C7BA] transition-colors font-medium">
							About
						</Link>
						<Link href="/docs" className="text-white/80 hover:text-[#70C7BA] transition-colors font-medium">
							Docs
						</Link>
						<Link href="/examples" className="text-white/80 hover:text-[#70C7BA] transition-colors font-medium">
							Examples
						</Link>
					</div>

					{/* Desktop Actions */}
					<div className="hidden md:flex items-center gap-4">
						<ThemeToggle />
						<Button variant="ghost" asChild className="text-white/80 hover:text-[#70C7BA] hover:bg-[#70C7BA]/10">
							<Link href="/auth/signin">Sign In</Link>
						</Button>
						<Button asChild className="bg-gradient-to-r from-[#70C7BA] to-[#49EACB] hover:from-[#49EACB] hover:to-[#70C7BA] text-white font-semibold rounded-full px-6">
							<Link href="/auth/signup">Get Started</Link>
						</Button>
					</div>

					{/* Mobile Menu Button */}
					<div className="md:hidden flex items-center gap-2">
						<ThemeToggle />
						<Button
							variant="ghost"
							size="sm"
							onClick={() => setIsOpen(!isOpen)}
							className="text-white hover:text-[#70C7BA] hover:bg-[#70C7BA]/10"
						>
							{isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
						</Button>
					</div>
				</div>

				{/* Mobile Menu */}
				{isOpen && (
					<div className="md:hidden mt-4 pb-4 border-t border-white/10">
						<div className="flex flex-col gap-4 mt-4">
							<Link 
								href="/about" 
								className="text-white/80 hover:text-[#70C7BA] transition-colors font-medium"
								onClick={() => setIsOpen(false)}
							>
								About
							</Link>
							<Link 
								href="/docs" 
								className="text-white/80 hover:text-[#70C7BA] transition-colors font-medium"
								onClick={() => setIsOpen(false)}
							>
								Docs
							</Link>
							<Link 
								href="/examples" 
								className="text-white/80 hover:text-[#70C7BA] transition-colors font-medium"
								onClick={() => setIsOpen(false)}
							>
								Examples
							</Link>
							<div className="flex flex-col gap-2 mt-4">
								<Button variant="ghost" asChild className="text-white/80 hover:text-[#70C7BA] hover:bg-[#70C7BA]/10 justify-start">
									<Link href="/auth/signin" onClick={() => setIsOpen(false)}>Sign In</Link>
								</Button>
								<Button asChild className="bg-gradient-to-r from-[#70C7BA] to-[#49EACB] hover:from-[#49EACB] hover:to-[#70C7BA] text-white font-semibold rounded-full justify-start">
									<Link href="/auth/signup" onClick={() => setIsOpen(false)}>Get Started</Link>
								</Button>
							</div>
						</div>
					</div>
				)}
			</div>
		</nav>
	);
} 
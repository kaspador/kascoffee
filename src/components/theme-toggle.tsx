'use client';

import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { Button } from './ui/button';
import { useEffect, useState } from 'react';

export function ThemeToggle() {
	const { theme, setTheme } = useTheme();
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true);
	}, []);

	if (!mounted) {
		return (
			<Button
				variant="ghost"
				size="icon"
				className="text-gray-300 hover:text-white hover:bg-white/10 h-10 w-10 rounded-2xl"
				disabled
			>
				<Sun className="h-5 w-5" />
				<span className="sr-only">Toggle theme</span>
			</Button>
		);
	}

	return (
		<Button
			variant="ghost"
			size="icon"
			className="text-gray-300 hover:text-[#70C7BA] hover:bg-white/10 h-10 w-10 rounded-2xl transition-all duration-300 group"
			onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
		>
			<Sun className="h-5 w-5 rotate-0 scale-100 transition-all group-hover:rotate-12 dark:-rotate-90 dark:scale-0" />
			<Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all group-hover:rotate-12 dark:rotate-0 dark:scale-100" />
			<span className="sr-only">Toggle theme</span>
		</Button>
	);
} 
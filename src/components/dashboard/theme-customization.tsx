'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Check, AlertCircle, Palette } from 'lucide-react';
import type { UserPage } from '@/lib/db/schema';

const themeSchema = z.object({
	backgroundColor: z
		.string()
		.regex(/^#[0-9A-Fa-f]{6}$/, 'Must be a valid hex color (e.g., #ffffff)')
		.optional(),
	foregroundColor: z
		.string()
		.regex(/^#[0-9A-Fa-f]{6}$/, 'Must be a valid hex color (e.g., #000000)')
		.optional(),
	backgroundImage: z.string().url('Must be a valid URL').optional().or(z.literal(''))
});

type ThemeFormData = z.infer<typeof themeSchema>;

interface ThemeCustomizationProps {
	userPage?: UserPage;
	isLoading?: boolean;
}

const colorPresets = [
	{ name: 'Default', bg: '#ffffff', fg: '#000000' },
	{ name: 'Dark', bg: '#0f0f0f', fg: '#ffffff' },
	{ name: 'Ocean', bg: '#0ea5e9', fg: '#ffffff' },
	{ name: 'Forest', bg: '#16a34a', fg: '#ffffff' },
	{ name: 'Sunset', bg: '#ea580c', fg: '#ffffff' },
	{ name: 'Purple', bg: '#9333ea', fg: '#ffffff' },
	{ name: 'Rose', bg: '#e11d48', fg: '#ffffff' },
	{ name: 'Kaspa', bg: '#70C7BA', fg: '#ffffff' }
];

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

export function ThemeCustomization({ userPage, isLoading }: ThemeCustomizationProps) {
	const queryClient = useQueryClient();

	const {
		register,
		handleSubmit,
		formState: { errors },
		watch,
		setValue
	} = useForm<ThemeFormData>({
		resolver: zodResolver(themeSchema),
		defaultValues: {
			backgroundColor: userPage?.backgroundColor || '#ffffff',
			foregroundColor: userPage?.foregroundColor || '#000000',
			backgroundImage: userPage?.backgroundImage || ''
		}
	});

	const updateThemeMutation = useMutation({
		mutationFn: async (data: ThemeFormData) => {
			const authHeader = getMockSessionHeader();
			if (!authHeader) {
				throw new Error('Please sign in again');
			}

			const response = await fetch('/api/user/profile', {
				method: 'PUT',
				headers: { 
					'Content-Type': 'application/json',
					'Authorization': authHeader
				},
				body: JSON.stringify(data)
			});
			
			if (!response.ok) {
				const error = await response.json();
				throw new Error(error.error || 'Failed to update theme');
			}
			return response.json();
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['profile'] });
		}
	});

	const onSubmit = (data: ThemeFormData) => {
		updateThemeMutation.mutate(data);
	};

	const applyPreset = (preset: typeof colorPresets[0]) => {
		setValue('backgroundColor', preset.bg);
		setValue('foregroundColor', preset.fg);
	};

	const backgroundColor = watch('backgroundColor');
	const foregroundColor = watch('foregroundColor');
	const backgroundImage = watch('backgroundImage');

	if (isLoading) {
		return (
			<div className="space-y-4">
				<div className="animate-pulse">
					<div className="h-4 bg-muted rounded w-1/4 mb-2"></div>
					<div className="h-10 bg-muted rounded"></div>
				</div>
				<div className="animate-pulse">
					<div className="h-4 bg-muted rounded w-1/4 mb-2"></div>
					<div className="h-20 bg-muted rounded"></div>
				</div>
			</div>
		);
	}

	return (
		<form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
			{updateThemeMutation.error && (
				<div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md dark:bg-red-950 dark:text-red-400 dark:border-red-800">
					{updateThemeMutation.error.message}
				</div>
			)}

			{updateThemeMutation.isSuccess && (
				<div className="p-3 text-sm text-[#70C7BA] bg-[#70C7BA]/10 border border-[#70C7BA]/30 rounded-md dark:bg-[#70C7BA]/10 dark:text-[#70C7BA] dark:border-[#70C7BA]/30 flex items-center gap-2">
					<Check className="h-4 w-4" />
					Theme updated successfully!
				</div>
			)}

			{/* Color Presets */}
			<Card>
				<CardHeader>
					<CardTitle className="text-lg flex items-center gap-2">
						<Palette className="h-5 w-5" />
						Color Presets
					</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="grid grid-cols-2 md:grid-cols-4 gap-3">
						{colorPresets.map((preset) => (
							<Button
								key={preset.name}
								type="button"
								variant="outline"
								onClick={() => applyPreset(preset)}
								disabled={updateThemeMutation.isPending}
								className="h-16 flex flex-col gap-1 relative"
								style={{
									backgroundColor: preset.bg,
									color: preset.fg,
									borderColor: preset.bg === backgroundColor && preset.fg === foregroundColor ? '#3b82f6' : undefined,
									borderWidth: preset.bg === backgroundColor && preset.fg === foregroundColor ? '2px' : '1px'
								}}
							>
								<span className="text-xs font-medium">{preset.name}</span>
								<div className="flex gap-1">
									<div
										className="w-3 h-3 rounded-full border"
										style={{ backgroundColor: preset.bg }}
									/>
									<div
										className="w-3 h-3 rounded-full border"
										style={{ backgroundColor: preset.fg }}
									/>
								</div>
							</Button>
						))}
					</div>
				</CardContent>
			</Card>

			{/* Custom Colors */}
			<Card>
				<CardHeader>
					<CardTitle className="text-lg">Custom Colors</CardTitle>
				</CardHeader>
				<CardContent className="space-y-4">
					<div className="grid md:grid-cols-2 gap-4">
						<div className="space-y-2">
							<Label htmlFor="backgroundColor">Background Color</Label>
							<div className="flex gap-2">
								<Input
									id="backgroundColor"
									placeholder="#ffffff"
									{...register('backgroundColor')}
									disabled={updateThemeMutation.isPending}
									className="font-mono"
								/>
								<input
									type="color"
									value={backgroundColor || '#ffffff'}
									onChange={(e) => setValue('backgroundColor', e.target.value)}
									disabled={updateThemeMutation.isPending}
									className="w-12 h-10 rounded border cursor-pointer"
								/>
							</div>
							{errors.backgroundColor && (
								<p className="text-sm text-red-600 flex items-center gap-1">
									<AlertCircle className="h-3 w-3" />
									{errors.backgroundColor.message}
								</p>
							)}
						</div>

						<div className="space-y-2">
							<Label htmlFor="foregroundColor">Text Color</Label>
							<div className="flex gap-2">
								<Input
									id="foregroundColor"
									placeholder="#000000"
									{...register('foregroundColor')}
									disabled={updateThemeMutation.isPending}
									className="font-mono"
								/>
								<input
									type="color"
									value={foregroundColor || '#000000'}
									onChange={(e) => setValue('foregroundColor', e.target.value)}
									disabled={updateThemeMutation.isPending}
									className="w-12 h-10 rounded border cursor-pointer"
								/>
							</div>
							{errors.foregroundColor && (
								<p className="text-sm text-red-600 flex items-center gap-1">
									<AlertCircle className="h-3 w-3" />
									{errors.foregroundColor.message}
								</p>
							)}
						</div>
					</div>

					<div className="space-y-2">
						<Label htmlFor="backgroundImage">Background Image URL (optional)</Label>
						<Input
							id="backgroundImage"
							placeholder="https://example.com/background.jpg"
							{...register('backgroundImage')}
							disabled={updateThemeMutation.isPending}
						/>
						{errors.backgroundImage && (
							<p className="text-sm text-red-600 flex items-center gap-1">
								<AlertCircle className="h-3 w-3" />
								{errors.backgroundImage.message}
							</p>
						)}
						<p className="text-xs text-muted-foreground">
							Background images will overlay the background color
						</p>
					</div>
				</CardContent>
			</Card>

			{/* Preview */}
			<Card>
				<CardHeader>
					<CardTitle className="text-lg">Preview</CardTitle>
				</CardHeader>
				<CardContent>
					<div
						className="border rounded-lg p-6 text-center transition-all duration-200"
						style={{
							backgroundColor: backgroundColor || '#ffffff',
							color: foregroundColor || '#000000',
							backgroundImage: backgroundImage ? `url(${backgroundImage})` : undefined,
							backgroundSize: 'cover',
							backgroundPosition: 'center'
						}}
					>
						<div className="bg-white/90 backdrop-blur-sm rounded-lg p-4 inline-block">
							<h3 className="font-bold text-lg mb-2" style={{ color: foregroundColor || '#000000' }}>
								{userPage?.displayName || 'Your Name'}
							</h3>
							<p className="text-sm opacity-75" style={{ color: foregroundColor || '#000000' }}>
								This is how your page will look with these colors
							</p>
						</div>
					</div>
				</CardContent>
			</Card>

			<Button
				type="submit"
				disabled={updateThemeMutation.isPending}
				className="w-full md:w-auto bg-gradient-to-r from-[#70C7BA] to-[#49EACB] hover:from-[#49EACB] hover:to-[#70C7BA] text-white font-semibold rounded-xl shadow-lg hover:shadow-[#70C7BA]/25 transition-all duration-300"
			>
				{updateThemeMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
				Save Theme
			</Button>
		</form>
	);
} 
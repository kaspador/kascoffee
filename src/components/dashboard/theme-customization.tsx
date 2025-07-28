'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

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
	userPage?: {
		handle: string;
		id: string;
		displayName: string;
		createdAt: Date;
		updatedAt: Date;
		userId: string;
		shortDescription: string | null;
		longDescription: string | null;
		kaspaAddress: string;
		donationGoal: number | null;
		profileImage: string | null;
		backgroundImage: string | null;
		backgroundColor: string;
		foregroundColor: string;
		isActive: boolean;
		viewCount: number | null;
	};
	isLoading?: boolean;
	onSuccess?: () => void;
}

const colorPresets = [
	{ name: 'Kaspa Mint', bg: '#70C7BA', fg: '#ffffff' },
	{ name: 'Kaspa Ocean', bg: '#49EACB', fg: '#ffffff' },
	{ name: 'Classic Dark', bg: '#0f0f0f', fg: '#ffffff' },
	{ name: 'Pure White', bg: '#ffffff', fg: '#000000' },
	{ name: 'Midnight Blue', bg: '#1e3a8a', fg: '#ffffff' },
	{ name: 'Forest Green', bg: '#16a34a', fg: '#ffffff' },
	{ name: 'Sunset Orange', bg: '#ea580c', fg: '#ffffff' },
	{ name: 'Royal Purple', bg: '#9333ea', fg: '#ffffff' }
];

export function ThemeCustomization({ userPage, isLoading, onSuccess }: ThemeCustomizationProps) {
	const queryClient = useQueryClient();

	const {
		register,
		handleSubmit,
		setValue,
		watch,
		formState: { errors }
	} = useForm<ThemeFormData>({
		resolver: zodResolver(themeSchema),
		defaultValues: {
			backgroundColor: userPage?.backgroundColor || '#70C7BA',
			foregroundColor: userPage?.foregroundColor || '#ffffff',
			backgroundImage: userPage?.backgroundImage || ''
		}
	});

	const updateThemeMutation = useMutation({
		mutationFn: async (data: ThemeFormData & { 
			handle?: string;
			displayName?: string;
			kaspaAddress?: string;
			donationGoal?: number | null;
			shortDescription?: string | null;
			longDescription?: string | null;
			profileImage?: string | null;
		}) => {
			const response = await fetch('/api/user/profile', {
				method: 'PUT',
				headers: { 
					'Content-Type': 'application/json',
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
			onSuccess?.();
		}
	});

	const onSubmit = (data: ThemeFormData) => {
		// Preserve all existing profile data when updating theme
		const preservedData = {
			handle: userPage?.handle,
			displayName: userPage?.displayName,
			kaspaAddress: userPage?.kaspaAddress,
			donationGoal: userPage?.donationGoal,
			shortDescription: userPage?.shortDescription,
			longDescription: userPage?.longDescription,
			profileImage: userPage?.profileImage, // This was getting erased!
			...data // Theme data overwrites only the theme fields
		};
		
		updateThemeMutation.mutate(preservedData);
	};

	const currentBg = watch('backgroundColor');
	const currentFg = watch('foregroundColor');

	const applyPreset = (preset: typeof colorPresets[0]) => {
		setValue('backgroundColor', preset.bg);
		setValue('foregroundColor', preset.fg);
	};

	if (isLoading) {
		return (
			<div className="space-y-6">
				<div className="animate-pulse">
					<div className="h-4 bg-slate-700 rounded w-1/4 mb-2"></div>
					<div className="h-12 bg-slate-700 rounded"></div>
				</div>
				<div className="animate-pulse">
					<div className="h-4 bg-slate-700 rounded w-1/4 mb-2"></div>
					<div className="h-24 bg-slate-700 rounded"></div>
				</div>
			</div>
		);
	}

	return (
		<form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
			{updateThemeMutation.error && (
				<div className="p-4 text-sm text-red-400 bg-red-900/20 border border-red-500/30 rounded-xl backdrop-blur-sm">
					{updateThemeMutation.error.message}
				</div>
			)}

			{/* Theme Preview */}
			<div className="space-y-4">
				<h3 className="text-lg font-kaspa-header font-bold text-[#70C7BA] mb-4 flex items-center gap-2">
					👀 Live Preview
				</h3>
				<div 
					className="relative p-8 rounded-2xl border-2 border-dashed border-[#70C7BA]/30 min-h-[200px] flex flex-col items-center justify-center overflow-hidden"
					style={{ backgroundColor: currentBg }}
				>
					{watch('backgroundImage') && (
						<div 
							className="absolute inset-0 bg-cover bg-center opacity-20"
							style={{ backgroundImage: `url(${watch('backgroundImage')})` }}
						/>
					)}
					<div className="relative z-10 text-center">
						<h4 
							className="text-2xl font-kaspa-header font-bold mb-2"
							style={{ color: currentFg }}
						>
							{userPage?.displayName || 'Your Name'}
						</h4>
						<p 
							className="opacity-80 font-kaspa-body"
							style={{ color: currentFg }}
						>
							This is how your donation page will look
						</p>
						<div 
							className="mt-4 px-6 py-2 rounded-full border-2 inline-block font-kaspa-body font-semibold"
							style={{ 
								borderColor: currentFg, 
								color: currentFg,
								backgroundColor: `${currentFg}20`
							}}
						>
							☕ Support Me
						</div>
					</div>
				</div>
			</div>

			{/* Color Presets */}
			<div className="space-y-4">
				<h3 className="text-lg font-kaspa-header font-bold text-[#49EACB] mb-4 flex items-center gap-2">
					🎨 Color Presets
				</h3>
				<div className="grid grid-cols-2 md:grid-cols-4 gap-3">
					{colorPresets.map((preset) => (
						<button
							key={preset.name}
							type="button"
							onClick={() => applyPreset(preset)}
							className={`relative p-4 rounded-xl border-2 transition-all duration-300 hover:scale-105 group ${
								currentBg === preset.bg && currentFg === preset.fg
									? 'border-[#70C7BA] shadow-lg shadow-[#70C7BA]/25'
									: 'border-slate-600 hover:border-[#70C7BA]/50'
							}`}
							style={{ backgroundColor: preset.bg }}
						>
							<div className="text-center">
								<div 
									className="w-8 h-8 rounded-full mx-auto mb-2 border-2"
									style={{ backgroundColor: preset.fg, borderColor: preset.fg }}
								/>
								<span 
									className="text-xs font-kaspa-body font-semibold"
									style={{ color: preset.fg }}
								>
									{preset.name}
								</span>
							</div>
							{currentBg === preset.bg && currentFg === preset.fg && (
								<div className="absolute -top-1 -right-1 w-4 h-4 bg-[#70C7BA] rounded-full flex items-center justify-center">
									<span className="text-white text-xs">✓</span>
								</div>
							)}
						</button>
					))}
				</div>
			</div>

			{/* Custom Colors */}
			<div className="space-y-6">
				<h3 className="text-lg font-kaspa-header font-bold text-[#70C7BA] mb-4 flex items-center gap-2">
					🎯 Custom Colors
				</h3>
				<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
					<div className="space-y-3">
						<Label htmlFor="backgroundColor" className="text-gray-300 font-kaspa-body font-semibold">
							Background Color
						</Label>
						<div className="flex items-center gap-3">
							<input
								type="color"
								value={currentBg}
								onChange={(e) => setValue('backgroundColor', e.target.value)}
								className="w-12 h-12 rounded-lg border-2 border-[#70C7BA]/30 bg-transparent cursor-pointer"
							/>
							<Input
								id="backgroundColor"
								{...register('backgroundColor')}
								placeholder="#70C7BA"
								className="bg-slate-800/50 border-[#70C7BA]/30 text-white placeholder:text-gray-500 focus:border-[#70C7BA] focus:ring-[#70C7BA]/20 rounded-xl font-kaspa-body transition-all duration-300"
							/>
						</div>
						{errors.backgroundColor && (
							<p className="text-red-400 text-sm font-kaspa-body">{errors.backgroundColor.message}</p>
						)}
					</div>

					<div className="space-y-3">
						<Label htmlFor="foregroundColor" className="text-gray-300 font-kaspa-body font-semibold">
							Text Color
						</Label>
						<div className="flex items-center gap-3">
							<input
								type="color"
								value={currentFg}
								onChange={(e) => setValue('foregroundColor', e.target.value)}
								className="w-12 h-12 rounded-lg border-2 border-[#49EACB]/30 bg-transparent cursor-pointer"
							/>
							<Input
								id="foregroundColor"
								{...register('foregroundColor')}
								placeholder="#ffffff"
								className="bg-slate-800/50 border-[#49EACB]/30 text-white placeholder:text-gray-500 focus:border-[#49EACB] focus:ring-[#49EACB]/20 rounded-xl font-kaspa-body transition-all duration-300"
							/>
						</div>
						{errors.foregroundColor && (
							<p className="text-red-400 text-sm font-kaspa-body">{errors.foregroundColor.message}</p>
						)}
					</div>
				</div>
			</div>

			{/* Background Image */}
			<div className="space-y-4">
				<h3 className="text-lg font-kaspa-header font-bold text-[#49EACB] mb-4 flex items-center gap-2">
					🖼️ Background Image
				</h3>
				<div className="space-y-3">
					<Label htmlFor="backgroundImage" className="text-gray-300 font-kaspa-body font-semibold">
						Background Image URL (Optional)
					</Label>
					<Input
						id="backgroundImage"
						{...register('backgroundImage')}
						placeholder="https://example.com/background.jpg"
						className="bg-slate-800/50 border-[#49EACB]/30 text-white placeholder:text-gray-500 focus:border-[#49EACB] focus:ring-[#49EACB]/20 rounded-xl font-kaspa-body transition-all duration-300"
					/>
					{errors.backgroundImage && (
						<p className="text-red-400 text-sm font-kaspa-body">{errors.backgroundImage.message}</p>
					)}
					<p className="text-xs text-gray-500 font-kaspa-body">
						This image will be displayed behind your content with reduced opacity
					</p>
				</div>
			</div>

			{/* Submit Button */}
			<div className="flex justify-end pt-6 border-t border-[#70C7BA]/20">
				<Button
					type="submit"
					disabled={updateThemeMutation.isPending}
					className="bg-gradient-to-r from-[#70C7BA] to-[#49EACB] hover:from-[#5ba8a0] hover:to-[#3dd4b4] text-white px-8 py-3 font-kaspa-subheader font-bold rounded-xl shadow-lg hover:shadow-[#70C7BA]/25 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
				>
					{updateThemeMutation.isPending ? (
						<>
							<div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
							Saving Theme...
						</>
					) : (
						'🎨 Save Theme'
					)}
				</Button>
			</div>
		</form>
	);
} 
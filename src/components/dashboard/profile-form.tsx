'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { RichTextEditor } from '@/components/rich-text-editor';
import { validateKaspaAddress } from '@/lib/utils/kaspa-validation';

// Zod schema for form validation
const profileFormSchema = z.object({
	handle: z.string().min(1, 'Handle is required').max(50, 'Handle must be less than 50 characters'),
	displayName: z.string().min(1, 'Display name is required').max(100, 'Display name must be less than 100 characters'),
	kaspaAddress: z.string().refine(
		(address) => validateKaspaAddress(address),
		'Please enter a valid Kaspa address'
	),
	shortDescription: z.string().max(300, 'Short description must be less than 300 characters').optional(),
	profileImage: z.string().url('Please enter a valid URL').optional().or(z.literal('')),
	backgroundImage: z.string().url('Please enter a valid URL').optional().or(z.literal(''))
});

type ProfileFormData = z.infer<typeof profileFormSchema>;

interface ProfileFormProps {
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

export function ProfileForm({ userPage, isLoading, onSuccess }: ProfileFormProps) {
	const [longDescription, setLongDescription] = useState(userPage?.longDescription || '');
	const queryClient = useQueryClient();

	const {
		register,
		handleSubmit,
		watch,
		formState: { errors }
	} = useForm<ProfileFormData>({
		resolver: zodResolver(profileFormSchema),
		defaultValues: {
			handle: userPage?.handle || '',
			displayName: userPage?.displayName || '',
			kaspaAddress: userPage?.kaspaAddress || '',
			shortDescription: userPage?.shortDescription || '',
			profileImage: userPage?.profileImage || '',
			backgroundImage: userPage?.backgroundImage || ''
		}
	});

	const updateProfileMutation = useMutation({
		mutationFn: async (data: ProfileFormData & { longDescription: string }) => {
			const response = await fetch('/api/user/profile', {
				method: 'PUT',
				headers: { 
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(data)
			});
			
			if (!response.ok) {
				const error = await response.json();
				throw new Error(error.error || 'Failed to update profile');
			}
			return response.json();
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['profile'] });
			onSuccess?.();
		}
	});

	const onSubmit = (data: ProfileFormData) => {
		updateProfileMutation.mutate({ ...data, longDescription });
	};

	const shortDescriptionLength = watch('shortDescription')?.length || 0;

	if (isLoading) {
		return (
			<div className="space-y-6">
				<div className="animate-pulse">
					<div className="h-4 bg-slate-700 rounded w-1/4 mb-2"></div>
					<div className="h-12 bg-slate-700 rounded"></div>
				</div>
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
			{updateProfileMutation.error && (
				<div className="p-4 text-sm text-red-400 bg-red-900/20 border border-red-500/30 rounded-xl backdrop-blur-sm">
					{updateProfileMutation.error.message}
				</div>
			)}

			{/* Basic Information Section */}
			<div className="space-y-6">
				<div>
					<h3 className="text-lg font-kaspa-header font-bold text-[#70C7BA] mb-4 flex items-center gap-2">
						✨ Basic Information
					</h3>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
						<div className="space-y-2">
							<Label htmlFor="handle" className="text-gray-300 font-kaspa-body font-semibold">
								Handle *
							</Label>
							<Input
								id="handle"
								{...register('handle')}
								placeholder="your-unique-handle"
								className="bg-slate-800/50 border-[#70C7BA]/30 text-white placeholder:text-gray-500 focus:border-[#70C7BA] focus:ring-[#70C7BA]/20 rounded-xl font-kaspa-body transition-all duration-300"
							/>
							{errors.handle && (
								<p className="text-red-400 text-sm font-kaspa-body">{errors.handle.message}</p>
							)}
							<p className="text-xs text-gray-500 font-kaspa-body">
								This will be your unique URL: kas.coffee/your-handle
							</p>
						</div>

						<div className="space-y-2">
							<Label htmlFor="displayName" className="text-gray-300 font-kaspa-body font-semibold">
								Display Name *
							</Label>
							<Input
								id="displayName"
								{...register('displayName')}
								placeholder="Your Name"
								className="bg-slate-800/50 border-[#70C7BA]/30 text-white placeholder:text-gray-500 focus:border-[#70C7BA] focus:ring-[#70C7BA]/20 rounded-xl font-kaspa-body transition-all duration-300"
							/>
							{errors.displayName && (
								<p className="text-red-400 text-sm font-kaspa-body">{errors.displayName.message}</p>
							)}
						</div>

						<div className="space-y-2 md:col-span-2">
							<Label htmlFor="kaspaAddress" className="text-gray-300 font-kaspa-body font-semibold">
								Kaspa Address *
							</Label>
							<Input
								id="kaspaAddress"
								{...register('kaspaAddress')}
								placeholder="kaspa:qq..."
								className="bg-slate-800/50 border-[#70C7BA]/30 text-white placeholder:text-gray-500 focus:border-[#70C7BA] focus:ring-[#70C7BA]/20 rounded-xl font-kaspa-body transition-all duration-300"
							/>
							{errors.kaspaAddress && (
								<p className="text-red-400 text-sm font-kaspa-body">{errors.kaspaAddress.message}</p>
							)}
							<p className="text-xs text-gray-500 font-kaspa-body">
								Your Kaspa wallet address where donations will be sent
							</p>
						</div>
					</div>
				</div>
			</div>

			{/* Images Section */}
			<div className="space-y-6">
				<div>
					<h3 className="text-lg font-kaspa-header font-bold text-[#49EACB] mb-4 flex items-center gap-2">
						🖼️ Images
					</h3>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
						<div className="space-y-2">
							<Label htmlFor="profileImage" className="text-gray-300 font-kaspa-body font-semibold">
								Profile Image URL
							</Label>
							<Input
								id="profileImage"
								{...register('profileImage')}
								placeholder="https://example.com/image.jpg"
								className="bg-slate-800/50 border-[#49EACB]/30 text-white placeholder:text-gray-500 focus:border-[#49EACB] focus:ring-[#49EACB]/20 rounded-xl font-kaspa-body transition-all duration-300"
							/>
							{errors.profileImage && (
								<p className="text-red-400 text-sm font-kaspa-body">{errors.profileImage.message}</p>
							)}
						</div>

						<div className="space-y-2">
							<Label htmlFor="backgroundImage" className="text-gray-300 font-kaspa-body font-semibold">
								Background Image URL
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
						</div>
					</div>
				</div>
			</div>

			{/* Descriptions Section */}
			<div className="space-y-6">
				<div>
					<h3 className="text-lg font-kaspa-header font-bold text-[#70C7BA] mb-4 flex items-center gap-2">
						📝 Descriptions
					</h3>
					<div className="space-y-6">
						<div className="space-y-2">
							<Label htmlFor="shortDescription" className="text-gray-300 font-kaspa-body font-semibold">
								Short Description ({shortDescriptionLength}/300)
							</Label>
							<Textarea
								id="shortDescription"
								{...register('shortDescription')}
								placeholder="A brief description about yourself..."
								className="bg-slate-800/50 border-[#70C7BA]/30 text-white placeholder:text-gray-500 focus:border-[#70C7BA] focus:ring-[#70C7BA]/20 rounded-xl font-kaspa-body transition-all duration-300 min-h-[100px]"
								maxLength={300}
							/>
							{errors.shortDescription && (
								<p className="text-red-400 text-sm font-kaspa-body">{errors.shortDescription.message}</p>
							)}
						</div>

						<div className="space-y-2">
							<Label className="text-gray-300 font-kaspa-body font-semibold">
								Long Description (Rich Text)
							</Label>
							<div className="bg-slate-800/50 border border-[#70C7BA]/30 rounded-xl overflow-hidden transition-all duration-300 focus-within:border-[#70C7BA]">
								<RichTextEditor
									content={longDescription}
									onChange={setLongDescription}
									placeholder="Tell your supporters more about yourself and what you're working on..."
								/>
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* Submit Button */}
			<div className="flex justify-end pt-6 border-t border-[#70C7BA]/20">
				<Button
					type="submit"
					disabled={updateProfileMutation.isPending}
					className="bg-gradient-to-r from-[#70C7BA] to-[#49EACB] hover:from-[#5ba8a0] hover:to-[#3dd4b4] text-white px-8 py-3 font-kaspa-subheader font-bold rounded-xl shadow-lg hover:shadow-[#70C7BA]/25 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
				>
					{updateProfileMutation.isPending ? (
						<>
							<div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
							Saving Profile...
						</>
					) : (
						'💾 Save Profile'
					)}
				</Button>
			</div>
		</form>
	);
} 
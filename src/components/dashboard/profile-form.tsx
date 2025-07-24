'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RichTextEditor } from '@/components/rich-text-editor';
import { Loader2, Check, AlertCircle } from 'lucide-react';
import { validateKaspaAddress } from '@/lib/utils/kaspa-validation';
import type { UserPage } from '@/lib/db/schema';

const profileSchema = z.object({
	handle: z
		.string()
		.min(3, 'Handle must be at least 3 characters')
		.max(50, 'Handle must be less than 50 characters')
		.regex(/^[a-z0-9_-]+$/, 'Handle must be lowercase alphanumeric with underscores and hyphens only'),
	displayName: z
		.string()
		.min(1, 'Display name is required')
		.max(100, 'Display name must be less than 100 characters'),
	shortDescription: z
		.string()
		.max(300, 'Short description must be less than 300 characters')
		.optional(),
	longDescription: z.string().optional(),
	kaspaAddress: z
		.string()
		.min(1, 'Kaspa address is required')
		.refine(validateKaspaAddress, 'Invalid Kaspa address'),
	profileImage: z.string().url('Must be a valid URL').optional().or(z.literal('')),
	backgroundImage: z.string().url('Must be a valid URL').optional().or(z.literal(''))
});

type ProfileFormData = z.infer<typeof profileSchema>;

interface ProfileFormProps {
	userPage?: UserPage;
	isLoading?: boolean;
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
	} catch (error) {
		localStorage.removeItem('kas-coffee-session');
		return null;
	}
}

export function ProfileForm({ userPage, isLoading }: ProfileFormProps) {
	const [longDescription, setLongDescription] = useState(userPage?.longDescription || '');
	const queryClient = useQueryClient();

	const {
		register,
		handleSubmit,
		formState: { errors },
		watch,
		setValue
	} = useForm<ProfileFormData>({
		resolver: zodResolver(profileSchema),
		defaultValues: {
			handle: userPage?.handle || '',
			displayName: userPage?.displayName || '',
			shortDescription: userPage?.shortDescription || '',
			longDescription: userPage?.longDescription || '',
			kaspaAddress: userPage?.kaspaAddress || '',
			profileImage: userPage?.profileImage || '',
			backgroundImage: userPage?.backgroundImage || ''
		}
	});

	const updateProfileMutation = useMutation({
		mutationFn: async (data: ProfileFormData) => {
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
				throw new Error(error.error || 'Failed to update profile');
			}
			return response.json();
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['profile'] });
		}
	});

	const onSubmit = (data: ProfileFormData) => {
		updateProfileMutation.mutate({ ...data, longDescription });
	};

	const shortDescriptionLength = watch('shortDescription')?.length || 0;

	if (isLoading) {
		return (
			<div className="space-y-4">
				<div className="animate-pulse">
					<div className="h-4 bg-muted rounded w-1/4 mb-2"></div>
					<div className="h-10 bg-muted rounded"></div>
				</div>
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
			{updateProfileMutation.error && (
				<div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md dark:bg-red-950 dark:text-red-400 dark:border-red-800">
					{updateProfileMutation.error.message}
				</div>
			)}

			{updateProfileMutation.isSuccess && (
				<div className="p-3 text-sm text-[#70C7BA] bg-[#70C7BA]/10 border border-[#70C7BA]/30 rounded-md dark:bg-[#70C7BA]/10 dark:text-[#70C7BA] dark:border-[#70C7BA]/30 flex items-center gap-2">
					<Check className="h-4 w-4" />
					Profile updated successfully!
				</div>
			)}

			<div className="grid md:grid-cols-2 gap-6">
				{/* Basic Information */}
				<Card>
					<CardHeader>
						<CardTitle className="text-lg">Basic Information</CardTitle>
					</CardHeader>
					<CardContent className="space-y-4">
						<div className="space-y-2">
							<Label htmlFor="handle">Handle *</Label>
							<Input
								id="handle"
								placeholder="your-unique-handle"
								{...register('handle')}
								disabled={updateProfileMutation.isPending}
							/>
							{errors.handle && (
								<p className="text-sm text-red-600 flex items-center gap-1">
									<AlertCircle className="h-3 w-3" />
									{errors.handle.message}
								</p>
							)}
							<p className="text-xs text-muted-foreground">
								This will be your unique URL: kas.coffee/{watch('handle')}
							</p>
						</div>

						<div className="space-y-2">
							<Label htmlFor="displayName">Display Name *</Label>
							<Input
								id="displayName"
								placeholder="Your Name"
								{...register('displayName')}
								disabled={updateProfileMutation.isPending}
							/>
							{errors.displayName && (
								<p className="text-sm text-red-600 flex items-center gap-1">
									<AlertCircle className="h-3 w-3" />
									{errors.displayName.message}
								</p>
							)}
						</div>

						<div className="space-y-2">
							<Label htmlFor="kaspaAddress">Kaspa Address *</Label>
							<Input
								id="kaspaAddress"
								placeholder="kaspa:qqr..."
								{...register('kaspaAddress')}
								disabled={updateProfileMutation.isPending}
							/>
							{errors.kaspaAddress && (
								<p className="text-sm text-red-600 flex items-center gap-1">
									<AlertCircle className="h-3 w-3" />
									{errors.kaspaAddress.message}
								</p>
							)}
							<p className="text-xs text-muted-foreground">
								Your Kaspa wallet address where donations will be sent
							</p>
						</div>
					</CardContent>
				</Card>

				{/* Images */}
				<Card>
					<CardHeader>
						<CardTitle className="text-lg">Images</CardTitle>
					</CardHeader>
					<CardContent className="space-y-4">
						<div className="space-y-2">
							<Label htmlFor="profileImage">Profile Image URL</Label>
							<Input
								id="profileImage"
								placeholder="https://example.com/image.jpg"
								{...register('profileImage')}
								disabled={updateProfileMutation.isPending}
							/>
							{errors.profileImage && (
								<p className="text-sm text-red-600 flex items-center gap-1">
									<AlertCircle className="h-3 w-3" />
									{errors.profileImage.message}
								</p>
							)}
						</div>

						<div className="space-y-2">
							<Label htmlFor="backgroundImage">Background Image URL</Label>
							<Input
								id="backgroundImage"
								placeholder="https://example.com/background.jpg"
								{...register('backgroundImage')}
								disabled={updateProfileMutation.isPending}
							/>
							{errors.backgroundImage && (
								<p className="text-sm text-red-600 flex items-center gap-1">
									<AlertCircle className="h-3 w-3" />
									{errors.backgroundImage.message}
								</p>
							)}
						</div>
					</CardContent>
				</Card>
			</div>

			{/* Descriptions */}
			<Card>
				<CardHeader>
					<CardTitle className="text-lg">Descriptions</CardTitle>
				</CardHeader>
				<CardContent className="space-y-6">
					<div className="space-y-2">
						<Label htmlFor="shortDescription">
							Short Description ({shortDescriptionLength}/300)
						</Label>
						<Textarea
							id="shortDescription"
							placeholder="A brief description about yourself..."
							{...register('shortDescription')}
							disabled={updateProfileMutation.isPending}
							maxLength={300}
						/>
						{errors.shortDescription && (
							<p className="text-sm text-red-600 flex items-center gap-1">
								<AlertCircle className="h-3 w-3" />
								{errors.shortDescription.message}
							</p>
						)}
					</div>

					<div className="space-y-2">
						<Label>Long Description</Label>
						<RichTextEditor
							content={longDescription}
							onChange={(content) => {
								setLongDescription(content);
								setValue('longDescription', content);
							}}
							placeholder="Tell your story, explain your work, add links..."
							editable={!updateProfileMutation.isPending}
						/>
					</div>
				</CardContent>
			</Card>

			<Button
				type="submit"
				disabled={updateProfileMutation.isPending}
				className="w-full md:w-auto bg-gradient-to-r from-[#70C7BA] to-[#49EACB] hover:from-[#49EACB] hover:to-[#70C7BA] text-white font-semibold rounded-xl shadow-lg hover:shadow-[#70C7BA]/25 transition-all duration-300"
			>
				{updateProfileMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
				Save Profile
			</Button>
		</form>
	);
} 
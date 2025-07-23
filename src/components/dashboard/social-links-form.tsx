'use client';

import { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Plus, Trash2, Check, AlertCircle } from 'lucide-react';
import { FaTwitter, FaDiscord, FaTelegram, FaGlobe } from 'react-icons/fa';
import type { Social } from '@/lib/db/schema';

const socialSchema = z.object({
	platform: z.enum(['twitter', 'discord', 'telegram', 'website']),
	url: z.string().url('Must be a valid URL'),
	username: z.string().max(100).optional(),
	isVisible: z.boolean().default(true)
});

const socialLinksSchema = z.object({
	socials: z.array(socialSchema)
});

type SocialLinksFormData = z.infer<typeof socialLinksSchema>;

interface SocialLinksFormProps {
	socials: Social[];
	isLoading?: boolean;
}

const socialIcons = {
	twitter: FaTwitter,
	discord: FaDiscord,
	telegram: FaTelegram,
	website: FaGlobe
};

const socialLabels = {
	twitter: 'Twitter/X',
	discord: 'Discord',
	telegram: 'Telegram',
	website: 'Website'
};

export function SocialLinksForm({ socials, isLoading }: SocialLinksFormProps) {
	const queryClient = useQueryClient();

	const {
		control,
		register,
		handleSubmit,
		formState: { errors },
		watch,
		setValue
	} = useForm<SocialLinksFormData>({
		resolver: zodResolver(socialLinksSchema),
		defaultValues: {
			socials: socials.length > 0 ? socials : [{ platform: 'twitter', url: '', username: '', isVisible: true }]
		}
	});

	const { fields, append, remove } = useFieldArray({
		control,
		name: 'socials'
	});

	const updateSocialsMutation = useMutation({
		mutationFn: async (data: SocialLinksFormData) => {
			const response = await fetch('/api/user/socials', {
				method: 'PUT',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(data)
			});
			if (!response.ok) {
				const error = await response.json();
				throw new Error(error.error || 'Failed to update social links');
			}
			return response.json();
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['socials'] });
		}
	});

	const onSubmit = (data: SocialLinksFormData) => {
		// Filter out empty URLs
		const filteredSocials = data.socials.filter(social => social.url.trim() !== '');
		updateSocialsMutation.mutate({ socials: filteredSocials });
	};

	const addSocialLink = () => {
		append({ platform: 'twitter', url: '', username: '', isVisible: true });
	};

	if (isLoading) {
		return (
			<div className="space-y-4">
				{[1, 2, 3].map((i) => (
					<div key={i} className="animate-pulse">
						<div className="h-4 bg-muted rounded w-1/4 mb-2"></div>
						<div className="h-10 bg-muted rounded"></div>
					</div>
				))}
			</div>
		);
	}

	return (
		<form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
			{updateSocialsMutation.error && (
				<div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md dark:bg-red-950 dark:text-red-400 dark:border-red-800">
					{updateSocialsMutation.error.message}
				</div>
			)}

			{updateSocialsMutation.isSuccess && (
				<div className="p-3 text-sm text-green-600 bg-green-50 border border-green-200 rounded-md dark:bg-green-950 dark:text-green-400 dark:border-green-800 flex items-center gap-2">
					<Check className="h-4 w-4" />
					Social links updated successfully!
				</div>
			)}

			<div className="space-y-4">
				{fields.map((field, index) => {
					const platform = watch(`socials.${index}.platform`);
					const Icon = socialIcons[platform];

					return (
						<Card key={field.id}>
							<CardHeader className="pb-3">
								<CardTitle className="flex items-center justify-between">
									<div className="flex items-center gap-2">
										<Icon className="h-4 w-4" />
										{socialLabels[platform]}
									</div>
									{fields.length > 1 && (
										<Button
											type="button"
											variant="outline"
											size="sm"
											onClick={() => remove(index)}
											disabled={updateSocialsMutation.isPending}
										>
											<Trash2 className="h-4 w-4" />
										</Button>
									)}
								</CardTitle>
							</CardHeader>
							<CardContent className="space-y-4">
								<div className="grid md:grid-cols-2 gap-4">
									<div className="space-y-2">
										<Label>Platform</Label>
										<Select
											value={platform}
											onValueChange={(value) => setValue(`socials.${index}.platform` as const, value as any)}
											disabled={updateSocialsMutation.isPending}
										>
											<SelectTrigger>
												<SelectValue />
											</SelectTrigger>
											<SelectContent>
												<SelectItem value="twitter">Twitter/X</SelectItem>
												<SelectItem value="discord">Discord</SelectItem>
												<SelectItem value="telegram">Telegram</SelectItem>
												<SelectItem value="website">Website</SelectItem>
											</SelectContent>
										</Select>
									</div>

									<div className="space-y-2">
										<Label>Username (optional)</Label>
										<Input
											placeholder="@username"
											{...register(`socials.${index}.username`)}
											disabled={updateSocialsMutation.isPending}
										/>
									</div>
								</div>

								<div className="space-y-2">
									<Label>URL *</Label>
									<Input
										placeholder="https://twitter.com/username"
										{...register(`socials.${index}.url`)}
										disabled={updateSocialsMutation.isPending}
									/>
									{errors.socials?.[index]?.url && (
										<p className="text-sm text-red-600 flex items-center gap-1">
											<AlertCircle className="h-3 w-3" />
											{errors.socials[index]?.url?.message}
										</p>
									)}
								</div>

								<div className="flex items-center space-x-2">
									<input
										type="checkbox"
										id={`visible-${index}`}
										{...register(`socials.${index}.isVisible`)}
										disabled={updateSocialsMutation.isPending}
										className="h-4 w-4"
									/>
									<Label htmlFor={`visible-${index}`} className="text-sm">
										Show on profile page
									</Label>
								</div>
							</CardContent>
						</Card>
					);
				})}
			</div>

			<div className="flex gap-3">
				<Button
					type="button"
					variant="outline"
					onClick={addSocialLink}
					disabled={updateSocialsMutation.isPending}
					className="flex items-center gap-2"
				>
					<Plus className="h-4 w-4" />
					Add Social Link
				</Button>

				<Button
					type="submit"
					disabled={updateSocialsMutation.isPending}
				>
					{updateSocialsMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
					Save Social Links
				</Button>
			</div>
		</form>
	);
} 
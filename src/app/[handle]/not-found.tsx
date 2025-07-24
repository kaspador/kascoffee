import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Coffee, Plus } from 'lucide-react';

export default function UserNotFound() {
	return (
		<div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-[#70C7BA]/5 to-[#49EACB]/10 dark:from-[#70C7BA]/5 dark:to-[#49EACB]/5">
			<Card className="max-w-lg w-full">
				<CardHeader className="text-center">
					<div className="text-6xl mb-4">☕</div>
					<CardTitle className="text-2xl">This coffee page doesn&apos;t exist yet</CardTitle>
				</CardHeader>
				<CardContent className="text-center space-y-4">
					<p className="text-lg text-gray-400 mb-6">
						This user page doesn&apos;t exist or has been removed.
					</p>
					<div className="p-4 bg-muted rounded-lg">
						<h3 className="font-semibold mb-2">Want to create your own?</h3>
						<p className="text-sm text-muted-foreground mb-3">
							Join kas.coffee and start receiving Kaspa donations from your supporters!
						</p>
						<Button asChild className="w-full">
							<Link href="/auth/signin" className="flex items-center gap-2">
								<Plus className="h-4 w-4" />
								Create Your Coffee Page
							</Link>
						</Button>
					</div>
					<Button asChild variant="outline" size="sm">
						<Link href="/" className="flex items-center gap-2">
							<Coffee className="h-4 w-4" />
							Back to kas.coffee
						</Link>
					</Button>
					<p className="text-gray-400 text-sm">
						Can&apos;t find what you&apos;re looking for? <Link href="/" className="text-[#70C7BA] hover:underline">Go back home</Link>
					</p>
				</CardContent>
			</Card>
		</div>
	);
} 
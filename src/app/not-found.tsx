import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Home, Search } from 'lucide-react';

export default function NotFound() {
	return (
		<div className="min-h-screen flex items-center justify-center p-4">
			<Card className="max-w-md w-full">
				<CardHeader className="text-center">
					<div className="text-6xl mb-4">🫠</div>
					<CardTitle className="text-2xl">Page Not Found</CardTitle>
				</CardHeader>
				<CardContent className="text-center space-y-4">
					<p className="text-muted-foreground">
						The page you're looking for doesn't exist or has been moved.
					</p>
					<div className="flex flex-col sm:flex-row gap-2 justify-center">
						<Button asChild variant="default">
							<Link href="/" className="flex items-center gap-2">
								<Home className="h-4 w-4" />
								Go Home
							</Link>
						</Button>
						<Button asChild variant="outline">
							<Link href="/dashboard" className="flex items-center gap-2">
								<Search className="h-4 w-4" />
								Create Your Page
							</Link>
						</Button>
					</div>
				</CardContent>
			</Card>
		</div>
	);
} 
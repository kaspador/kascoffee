import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/navbar";

export default function Home() {
	return (
		<div className="min-h-screen bg-background">
			<Navbar />
			<main className="flex min-h-[calc(100vh-4rem)] items-center justify-center">
				<div className="text-center space-y-6">
					<h1 className="text-6xl md:text-8xl font-bold bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent">
						kas.coffee
					</h1>
					<p className="text-xl text-muted-foreground max-w-md mx-auto">
						Support your favorite creators with fast, low-fee Kaspa cryptocurrency donations
					</p>
					<div className="flex flex-col sm:flex-row gap-4 justify-center">
						<Button size="lg" asChild>
							<Link href="/auth/signup">Get Started</Link>
						</Button>
						<Button size="lg" variant="outline" asChild>
							<Link href="/about">Learn More</Link>
						</Button>
					</div>
				</div>
			</main>
		</div>
	);
}

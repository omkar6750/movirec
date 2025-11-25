import { Heart, Eye, ListPlus } from "lucide-react";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "./ui/card";

export function Features() {
	const features = [
		{
			icon: Heart,
			title: "Add to Favorites",
			description:
				"Keep track of your beloved movies in one convenient location. Build your personal collection of all-time favorites.",
			color: "text-red-500",
		},
		{
			icon: Eye,
			title: "Mark as Watched",
			description:
				"Never lose track of what you've already seen. Mark movies as watched and maintain a comprehensive viewing history.",
			color: "text-green-500",
		},
		{
			icon: ListPlus,
			title: "Create Watchlist",
			description:
				"Build your perfect queue of movies to watch. Add films you're interested in and never run out of viewing options.",
			color: "text-blue-500",
		},
	];

	return (
		<section className="py-24 px-4 bg-gradient-to-b from-background to-muted/30">
			<div className="container mx-auto">
				<div className="text-center mb-16 space-y-4">
					<h2>Powerful Features for Movie Lovers</h2>
					<p className="text-muted-foreground max-w-2xl mx-auto text-lg">
						Everything you need to manage your movie collection and
						discover your next favorite film
					</p>
				</div>

				<div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
					{features.map((feature, index) => (
						<Card
							key={index}
							className="relative overflow-hidden group hover:shadow-xl transition-all duration-300 border-2 hover:border-primary/50"
						>
							<div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
							<CardHeader>
								<div
									className={`w-14 h-14 rounded-lg bg-muted flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 ${feature.color}`}
								>
									<feature.icon className="h-7 w-7" />
								</div>
								<CardTitle>{feature.title}</CardTitle>
							</CardHeader>
							<CardContent>
								<CardDescription className="text-base">
									{feature.description}
								</CardDescription>
							</CardContent>
						</Card>
					))}
				</div>

				<div className="mt-16 text-center">
					<p className="text-muted-foreground mb-4">
						Ready to start organizing your movie collection?
					</p>
					<div className="inline-flex gap-2 items-center px-6 py-3 bg-primary/10 rounded-lg border border-primary/20">
						<span className="text-primary">✨</span>
						<span>Sign up today and get started for free</span>
						<span className="text-primary">✨</span>
					</div>
				</div>
			</div>
		</section>
	);
}

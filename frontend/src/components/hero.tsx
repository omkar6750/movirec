import { Button } from "./ui/button";
import { Play } from "lucide-react";
import { Link } from "react-router-dom";

export function Hero() {
	return (
		<section className="relative min-h-screen flex items-center justify-center overflow-hidden">
			{/* Background Image with Overlay */}
			<div className="absolute inset-0 z-0">
				<img
					src="https://images.unsplash.com/photo-1739433437912-cca661ba902f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaW5lbWElMjBtb3ZpZSUyMHRoZWF0ZXJ8ZW58MXx8fHwxNzY0MDYwNTU4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
					alt="Cinema background"
					className="w-full h-full object-cover"
				/>
				<div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/80" />
			</div>

			{/* Content */}
			<div className="relative z-10 container mx-auto px-4 text-center">
				<div className="max-w-4xl mx-auto space-y-6">
					<h1 className="text-white">
						Welcome to{" "}
						<span className="text-blue-500">movirec</span>
					</h1>
					<p className="text-gray-200 text-xl max-w-2xl mx-auto">
						Discover, track, and organize your favorite movies all
						in one place. Never forget what to watch next with our
						intuitive movie management system.
					</p>

					<div className="flex gap-4 justify-center flex-wrap">
						<Link to="/recommended">
							<Button
								size="lg"
								className="bg-blue-600 hover:bg-blue-700"
							>
								<Play className="mr-2 h-5 w-5" />
								Get Started
							</Button>
						</Link>

						<Link to="/recommended">
							<Button
								size="lg"
								variant="outline"
								className="bg-white/10 backdrop-blur-sm text-white border-white/20 hover:bg-white/20"
							>
								Learn More
							</Button>
						</Link>
					</div>
				</div>
			</div>
		</section>
	);
}

import { useState, useEffect } from "react";
import { AlertTriangle, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function CookieBanner() {
	const [isVisible, setIsVisible] = useState(false);

	useEffect(() => {
		const hasSeenBanner = localStorage.getItem("demo-cookie-banner-seen");

		if (!hasSeenBanner) {
			const timer = setTimeout(() => setIsVisible(true), 500);
			return () => clearTimeout(timer);
		}
	}, []);

	const handleDismiss = () => {
		setIsVisible(false);
		localStorage.setItem("demo-cookie-banner-seen", "true");
	};

	if (!isVisible) return null;

	return (
		<div className="fixed bottom-0 left-0 right-0 z-[100] p-4 animate-in slide-in-from-bottom-5 fade-in duration-500">
			<div className="mx-auto max-w-4xl rounded-xl border border-yellow-200 bg-yellow-50/95 p-4 shadow-lg backdrop-blur-sm md:flex md:items-center md:justify-between md:gap-4">
				<div className="flex items-start gap-4">
					<div className="rounded-full bg-yellow-100 p-2 text-yellow-600">
						<AlertTriangle className="h-6 w-6" />
					</div>
					<div>
						<h3 className="font-semibold text-yellow-900">
							Demo Login Requirement
						</h3>
						<p className="mt-1 text-sm text-yellow-800/90">
							Because the Frontend (Netlify) and Backend (Render)
							are on different domains,
							<strong>
								{" "}
								you must allow Third-Party Cookies
							</strong>{" "}
							to log in.
							<span className="hidden sm:inline">
								{" "}
								Click the 👁️ or 🛡️ icon in your address bar to
								allow them.
							</span>
						</p>
					</div>
				</div>

				<div className="mt-4 flex shrink-0 gap-3 md:mt-0">
					<Button
						onClick={handleDismiss}
						variant="outline"
						className="border-yellow-200 bg-white text-yellow-900 hover:bg-yellow-100 hover:text-yellow-950"
					>
						I understand
					</Button>
					<button
						onClick={handleDismiss}
						className="absolute top-2 right-2 text-yellow-500 hover:text-yellow-700 md:hidden"
					>
						<X className="h-5 w-5" />
					</button>
				</div>
			</div>
		</div>
	);
}

import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

// Change defineConfig to a function that accepts 'mode'
export default defineConfig(({ mode }) => {
	// Load env file based on `mode` in the current working directory.
	// The third parameter '' loads ALL env vars, regardless of "VITE_" prefix.
	const env = loadEnv(mode, process.cwd(), "");

	return {
		plugins: [react(), tailwindcss()],
		resolve: {
			alias: {
				"@": path.resolve(__dirname, "./src"),
			},
		},
		server: {
			proxy: {
				// Use the 'env' variable we loaded above
				"/api": {
					target: env.VITE_SERVER_URL || "http://localhost:4000",
					changeOrigin: true,
					secure: false,
				},
				"/auth": {
					target: "http://localhost:4000", // You can also replace this with env.VITE_SERVER_URL
					changeOrigin: true,
					secure: false,
				},
			},
		},
	};
});

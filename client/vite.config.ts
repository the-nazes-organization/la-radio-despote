import { TanStackRouterVite } from '@tanstack/router-vite-plugin';
import path from 'path';
import { defineConfig } from 'vite';
import checker from 'vite-plugin-checker';

export default defineConfig({
	plugins: [
		TanStackRouterVite(),
		checker({
			typescript: true,
		}),
	],
	server: {
		strictPort: true,
	},
	resolve: {
		alias: {
			'@': path.resolve(__dirname, './src'),
		},
	},
	optimizeDeps: {
		exclude: ['canvas-confetti'],
	},
});

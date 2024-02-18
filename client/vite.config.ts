import { defineConfig } from 'vite';
import { TanStackRouterVite } from '@tanstack/router-vite-plugin';
import path from 'path';
import checker from 'vite-plugin-checker';

export default defineConfig({
	plugins: [
		TanStackRouterVite(),
		checker({
			typescript: true,
		}),
	],
	resolve: {
		alias: {
			'@': path.resolve(__dirname, './src'),
		},
	},
});

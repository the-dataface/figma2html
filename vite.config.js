import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import { viteSingleFile } from 'vite-plugin-singlefile';
import dsv from '@rollup/plugin-dsv';
dsv;

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [svelte(), dsv(), viteSingleFile()],
	build: {
		target: 'esnext',
		assetsInlineLimit: 100000000,
		chunkSizeWarningLimit: 100000000,
		cssCodeSplit: false,
		brotliSize: false,
		rollupOptions: {
			output: {
				inlineDynamicImports: true
			}
		}
	}
});

import { resolve } from 'path';
import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import { viteSingleFile } from 'vite-plugin-singlefile';
import dsv from '@rollup/plugin-dsv';

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => ({
	plugins: [svelte(), dsv(), viteSingleFile()],
	resolve: {
		alias: {
			$lib: resolve(__dirname, 'src/lib'),
			$types: resolve(__dirname, 'src/types.ts')
		}
	},
	build: {
		sourcemap: mode === 'development',
		target: 'esnext',
		minify: 'terser',
		assetsInlineLimit: 100000000,
		chunkSizeWarningLimit: 100000000,
		cssCodeSplit: false,
		brotliSize: false,
		rollupOptions: {
			input: [resolve('index.html'), resolve('code.ts')],
			output: {
				preserveModules: false,
				inlineDynamicImports: false
			}
		}
		// rollupOptions: [
		// 	{ input: './index.html', output: { inlineDynamicImports: true } },
		// 	{ input: './code.ts', output: { inlineDynamicImports: true } }
		// ]
		// {
		// 	input: {
		// 		index: './index.html',
		// 		code: './code.ts'
		// 	},
		// 	output: {
		// 		inlineDynamicImports: false
		// 	}
		// }
	}
}));

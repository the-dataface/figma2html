import { resolve } from 'path';

import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import { viteSingleFile } from 'vite-plugin-singlefile';

import dsv from '@rollup/plugin-dsv';
import commonjs from '@rollup/plugin-commonjs';
import nodeResolve from '@rollup/plugin-node-resolve';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
	plugins: [svelte(), dsv(), viteSingleFile()],
	resolve: {
		alias: {
			$lib: resolve(__dirname, 'src/lib'),
			$components: resolve(__dirname, 'src/ui/components'),
			$types: resolve(__dirname, 'src/types/index.ts')
		}
	},
	build: {
		assetsInlineLimit: 100000000,
		chunkSizeWarningLimit: 100000000,
		cssCodeSplit: false,
		exmptyOutDir: true,
		minify: false,
		outDir: resolve(__dirname, 'dist'),
		sourcemap: mode === 'development',
		target: 'esnext',
		lib: {
			entry: {
				// this is required but ignored to specifiy formats
				ui: resolve(__dirname, 'src/ui/index.html'),
				core: resolve(__dirname, 'src/core/index.ts')
			}
		},
		rollupOptions: {
			// Just in case we use any npm modules...
			// Docs: https://github.com/rollup/plugins/tree/master/packages/commonjs
			plugins: [
				nodeResolve({
					browser: true,
					dedupe: (importee) => importee === 'svelte' || importee.startsWith('svelte/'),
					extensions: ['.svelte', '.mjs', '.js', '.json', '.node']
				}),
				commonjs()
			],
			// make sure to externalize deps that shouldn't be bundled
			external: ['@figma/plugin-typings'],

			output: {
				// Provide global variables
				globals: {
					'@figma/plugin-typings': 'figma'
				},
				inlineDynamicImports: false,
				dir: 'plugin',
				format: 'es'
			},

			watch: {
				buildDelay: 1000
			}
		}
	}
}));

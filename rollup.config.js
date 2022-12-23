import dsv from '@rollup/plugin-dsv';
import json from '@rollup/plugin-json';
import terser from '@rollup/plugin-terser';
import htmlBundle from '@rollup/plugin-html';
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';

import svg from 'rollup-plugin-svg';
import svelte from 'rollup-plugin-svelte';
import postcss from 'rollup-plugin-postcss';
import livereload from 'rollup-plugin-livereload';

import sveltePreprocess from 'svelte-preprocess';

import cssnano from 'cssnano';
import childProcess from 'child_process';

const production = !process.env.ROLLUP_WATCH;

export default [
	{
		input: 'app.js',
		output: {
			format: 'iife',
			name: 'ui',
			file: 'build/bundle.js',
		},
		plugins: [
			svelte({
				dev: !production,
				preprocess: sveltePreprocess({
					sourceMap: !production,
					postcss: true,
				}),
				compilerOptions: {
					dev: !production,
				},
			}),
			resolve({
				browser: true,
				dedupe: (importee) =>
					importee === 'svelte' || importee.startsWith('svelte/'),
				extensions: ['.svelte', '.mjs', '.js', '.json', '.node'],
			}),
			typescript(),
			commonjs(),
			svg(),
			dsv(),
			json(),
			postcss({
				extensions: ['.css'],
				plugins: [cssnano()],
			}),
			htmlBundle({
				fileName: 'index.html',
				target: 'build/index.html',
				title: 'figma2html',
			}),
			!production && serve(),
			!production && livereload('build'),
			production && terser(),
		],
		watch: {
			clearScreen: false,
		},
	},
	{
		input: 'src/main.ts',
		output: {
			file: 'build/main.js',
			format: 'cjs',
			name: 'main',
		},
		plugins: [typescript(), commonjs(), json(), production && terser()],
	},
];

function serve() {
	let started = false;

	return {
		writeBundle() {
			if (!started) {
				started = true;

				childProcess.spawn('npm', ['run', 'start', '--', '--dev'], {
					stdio: ['ignore', 'inherit', 'inherit'],
					shell: true,
				});
			}
		},
	};
}

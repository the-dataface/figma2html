// https://github.com/sveltejs/eslint-plugin-svelte3
module.exports = {
	root: true,
	parser: '@typescript-eslint/parser',
	extends: ['eslint:recommended', 'prettier'],
	plugins: ['svelte3', '@typescript-eslint'],
	overrides: [{ files: ['*.svelte'], processor: 'svelte3/svelte3' }],
	parserOptions: {
		sourceType: 'module',
		ecmaVersion: 2020
	},
	env: {
		browser: true,
		es6: true,
		node: true
	},
	settings: {
		// pass the TypeScript package to the Svelte plugin
		'svelte3/typescript': () => require('typescript')
	}
};

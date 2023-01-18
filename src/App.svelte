<script lang="ts">
	import type {
		Asset,
		Config,
		Format,
		Output,
		HTMLFile,
		Loading,
		Scale,
		Panels,
		PostMessage
	} from './types';

	import { onMount, setContext } from 'svelte';
	import JSZip from 'jszip/dist/jszip.min.js';

	import Panel from './lib/components/Layout/Panel.svelte';
	import ErrorMessage from './lib/components/ErrorMessage.svelte';
	import Footer from './lib/components/Footer.svelte';
	import File from './lib/components/Controls/File.svelte';
	import Images from './lib/components/Controls/Images.svelte';
	import Page from './lib/components/Controls/Page.svelte';
	import Preview from './lib/components/Controls/Preview.svelte';
	import Text from './lib/components/Controls/Text.svelte';
	import { writable } from 'svelte/store';

	// GlobalCSS;

	const error = writable({ message: undefined, timeout: undefined } as {
		message: string;
		timeout: number;
	});

	// LOADING STATE
	const loading = writable(false as Loading);

	// PANELS OPEN
	let panels = {} as Panels;

	// CONFIG
	const output = writable('html' as Output);
	const format = writable('PNG' as Format);
	const scale = writable('1' as Scale);
	const name = writable(undefined as string | undefined);
	const includeResizer = writable(true as boolean);
	const fluid = writable(true as boolean);
	const testingMode = writable(false as boolean);
	const centered = writable(false as boolean);
	const applyStyleNames = writable(false as boolean);
	const applyHtags = writable(false as boolean);
	const styleTextSegments = writable(true as boolean);
	const includeGoogleFonts = writable(true as boolean);
	const maxWidth = writable(undefined as number | undefined);
	const imagePath = writable(undefined as string | undefined);
	const alt = writable(undefined as string | undefined);
	const customScript = writable(undefined as string | undefined);

	const preview = writable({
		total: 0 as number,
		assets: [] as Asset[],
		file: undefined as HTMLFile | undefined
	} as {
		total: number;
		assets: Asset[];
		file: HTMLFile | undefined;
	});

	const variables = writable(false as boolean);

	const buildConfig = (): Config => ({
		name: $name,
		scale: $scale,
		format: $format,
		output: $output,
		includeResizer: $includeResizer,
		testingMode: $testingMode,
		maxWidth: $maxWidth,
		fluid: $fluid,
		centered: $centered,
		imagePath: $imagePath,
		alt: $alt,
		applyStyleNames: $applyStyleNames,
		applyHtags: $applyHtags,
		styleTextSegments: $styleTextSegments,
		includeGoogleFonts: $includeGoogleFonts,
		customScript: $customScript
	});

	// send messages to our plugin
	const postMessage = (message: PostMessage) => parent.postMessage({ pluginMessage: message }, '*');

	window.onmessage = async (event: MessageEvent) => {
		const message = event.data.pluginMessage;
		if (!message) return;
		switch (message.type) {
			case 'load': {
				const config: Config = message.config;
				panels = message.panels;

				variables.set(Object.keys(message.variables).length > 0);

				// config
				name.set(config.name);
				format.set(config.format);
				scale.set(config.scale);
				output.set(config.output);
				includeResizer.set(config.includeResizer);
				testingMode.set(config.testingMode);
				maxWidth.set(config.maxWidth);
				fluid.set(config.fluid);
				centered.set(config.centered);
				imagePath.set(config.imagePath);
				alt.set(config.alt);
				applyStyleNames.set(config.applyStyleNames);
				applyHtags.set(config.applyHtags);
				styleTextSegments.set(config.styleTextSegments);
				includeGoogleFonts.set(config.includeGoogleFonts);
				customScript.set(config.customScript);
				break;
			}

			case 'preview': {
				preview.set({
					total: message.preview.total,
					assets: await buildPreviewImages(message.preview.assets),
					file: message.preview.file
				});
				loading.set(message.loading);
				break;
			}

			case 'loading': {
				loading.set(message.loading);
				break;
			}

			case 'export': {
				const link = document.createElement('a');
				link.href = await buildZipArchive(message.assets, message.file);
				link.download = `${$name}.zip`;
				link.click();
				setTimeout(() => loading.set(false), 1500);
				break;
			}

			case 'write-variables': {
				variables.set(message.variables === null);
				break;
			}

			case 'error': {
				setErrorMessage(message.message);
				break;
			}

			default: {
				break;
			}
		}
	};

	const onChangeConfig = () => postMessage({ type: 'config', config: buildConfig() });

	const onSelectExport = () => {
		if (!$alt || $alt === '') {
			setErrorMessage('Please enter alt text');
			panels.images = true;
			return;
		}

		if (!$name || $name === '') {
			setErrorMessage('File name cannot be empty');
			return;
		}

		loading.set(true);
		postMessage({ type: 'export', config: buildConfig() });
	};

	const onResetSettings = () => postMessage({ type: 'reset-settings' });

	const onSaveSettings = () =>
		parent.postMessage({ pluginMessage: { type: 'save-settings' } }, '*');

	const onLoadSettings = () =>
		parent.postMessage({ pluginMessage: { type: 'load-settings' } }, '*');

	const onWriteVariables = () =>
		parent.postMessage({ pluginMessage: { type: 'write-variables' } }, '*');

	const onTogglePanel = () =>
		parent.postMessage({ pluginMessage: { type: 'panels', panels: panels } }, '*');

	const setErrorMessage = (message: string) => {
		clearTimeout($error.timeout);
		$error.message = message;

		// clear error message after 3 seconds
		$error.timeout = setTimeout(() => {
			$error.message = undefined;
		}, 3000);
	};

	const buildPreviewImages = async (assets: Asset[]): Promise<Asset[]> => {
		assets.forEach((asset) => {
			const blob = new Blob([asset.data], { type: `image/png` });
			const url = window.URL.createObjectURL(blob);
			asset.url = url;
		});
		return assets;
	};

	const buildZipArchive = async (assets: Asset[], file: HTMLFile): Promise<string> => {
		const zip = new JSZip();

		assets.forEach((asset) => {
			const formatLower = asset.format.toLowerCase();
			const blob = new Blob([asset.data], { type: `image/${formatLower}` });
			zip.file(`${asset.filename}.${formatLower}`, blob, { base64: true });
		});

		const fileBlob = new Blob([file.data], { type: `string` });
		zip.file(`${file.filename}.${file.output.toLowerCase()}`, fileBlob, { base64: true });

		const blob = await zip.generateAsync({ type: 'blob' });
		const url = window.URL.createObjectURL(blob);

		return url;
	};

	onMount(() => postMessage({ type: 'init' }));

	// SVG's are scalable by default. Revert scale config to default
	$: if ($format === 'SVG') scale.set('1');

	setContext('App', {
		loading,
		error,
		preview,
		config: {
			name,
			format,
			scale,
			output,
			includeResizer,
			testingMode,
			maxWidth,
			fluid,
			centered,
			imagePath,
			alt,
			applyStyleNames,
			applyHtags,
			styleTextSegments,
			includeGoogleFonts,
			customScript
		}
	});
</script>

<h1 class="sr-only">figma2html</h1>

<div class="content grid h-full w-full grid-cols-3 overflow-hidden bg-figma-bg text-figma-text">
	<div
		class="col-span-1 flex h-[100vh_-_48px] flex-col overflow-y-scroll border-r border-solid border-figma-border pb-12"
	>
		{#if panels}
			<Panel title="File settings" open={panels.file} on:toggle={onTogglePanel}>
				<File on:change={onChangeConfig} on:error={() => setErrorMessage($error.message)} />
			</Panel>
			<Panel title="Image settings" bind:open={panels.images} on:toggle={onTogglePanel}>
				<Images on:change={onChangeConfig} />
			</Panel>
			<Panel title="Page settings" bind:open={panels.page} on:toggle={onTogglePanel}>
				<Page on:change={onChangeConfig} />
			</Panel>
			<Panel
				border={false}
				title="Text settings"
				bind:open={panels.text}
				on:togglePanel={onTogglePanel}
			>
				<Text on:change={onChangeConfig} on:write-variables={onWriteVariables} />
			</Panel>
		{/if}
	</div>

	<div class="col-span-2 col-start-2 h-[100vh_-_48px] overflow-y-scroll pb-12">
		<Panel title="Output" bind:open={panels.preview} on:togglePanel={onTogglePanel}>
			<Preview />
		</Panel>
	</div>
</div>

<Footer
	on:export={onSelectExport}
	on:reset-settings={onResetSettings}
	on:save-settings={onSaveSettings}
	on:load-settings={onLoadSettings}
/>

{#if $error.message}
	<ErrorMessage />
{/if}

<style>
	.content {
		min-height: calc(100% + 48px);
	}
</style>

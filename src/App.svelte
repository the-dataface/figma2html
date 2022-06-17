<script lang="ts" type="module">
	import './app.css';
	import ExportIcon from './img/icons/export.svg';
	import HelpIcon from './img/icons/help.svg';
	import ImportIcon from './img/icons/import.svg';
	import TextIcon from './img/icons/text.svg';

	import {
		Icon,
		IconAdjust,
		IconDraft,
		IconEllipses,
		IconImage,
		IconLibrary,
		IconSpinner,
		IconSwap,
		IconVisible,
		IconWarning,
		Section,
		SelectMenu,
		Switch,
	} from 'figma-plugin-ds-svelte';
	import { onMount } from 'svelte';
	import { slide, fade } from 'svelte/transition';
	import JSZip from '../node_modules/jszip/dist/jszip.min.js';
	import {
		Asset,
		Config,
		Extension,
		FileType,
		HTMLFile,
		Scale,
		Size,
	} from './types';

	let loading = false;
	let menuOpen = false;

	interface FileTypeOption {
		value: FileType;
		label: string;
		group: string | null;
		selected: boolean;
	}

	let fileType: FileType | undefined = undefined;
	let fileTypeOptions: FileTypeOption[] = [
		{ value: 'html', label: 'html', group: null, selected: false },
		{ value: 'svelte', label: 'svelte', group: null, selected: false }, // TO DO
	];

	$: {
		fileTypeOptions.forEach((o, i) => {
			fileTypeOptions[i].selected = o.value === fileType;
		});
	}

	interface ExtensionOption {
		value: Extension;
		label: string;
		group: string | null;
		selected: boolean;
	}

	let extension: Extension | undefined = undefined;
	let extensionOptions: ExtensionOption[] = [
		{ value: 'PNG', label: 'PNG', group: null, selected: false },
		{ value: 'JPG', label: 'JPG', group: null, selected: false },
		{ value: 'SVG', label: 'SVG', group: null, selected: false },
	];

	$: {
		extensionOptions.forEach((o, i) => {
			extensionOptions[i].selected = o.value === extension;
		});
	}

	interface ScaleOption {
		value: Scale;
		label: string;
		selected: boolean;
	}

	let scale: Scale | undefined = undefined;
	let scaleOptions: ScaleOption[] = [
		{ value: 1, label: '1x', selected: false },
		{ value: 2, label: '2x', selected: false },
		{ value: 4, label: '4x', selected: false },
	];

	$: {
		scaleOptions.forEach((o, i) => {
			scaleOptions[i].selected = o.value === scale;
		});
	}

	let fluid = true;
	let syntax: string | undefined = undefined;
	let includeResizer = true;
	let testingMode = false;
	let centerHtmlOutput = false;
	let applyStyleNames = false;
	let applyHtags = false;
	let styleTextSegments = true;
	let includeGoogleFonts = true;
	let clickableLink: string | undefined = undefined;
	let maxWidth: number | undefined = undefined;
	let imagePath: string | undefined = undefined;
	let altText: string | undefined = undefined;

	let nodeCount = 0;
	let exampleAssets: Asset[] = [];
	let exampleFile: HTMLFile;

	let showVariablesButton = false;

	const displaySize = (size: Size): string => {
		const rounded: Size = {
			width: Math.round(size.width),
			height: Math.round(size.height),
		};
		return `${rounded.width}x${rounded.height}`;
	};

	const buildConfig = (): Config => {
		return {
			syntax,
			scale,
			extension,
			fileType,
			includeResizer,
			testingMode,
			maxWidth,
			fluid,
			centerHtmlOutput,
			clickableLink,
			imagePath,
			altText,
			applyStyleNames,
			applyHtags,
			styleTextSegments,
			includeGoogleFonts,
		};
	};

	window.onmessage = async (event: MessageEvent) => {
		const message = event.data.pluginMessage;

		switch (message.type) {
			case 'load':
				const config = message.config as Config;

				syntax = config.syntax;
				extension = config.extension;
				scale = config.scale;
				fileType = config.fileType;
				includeResizer = config.includeResizer;
				testingMode = config.testingMode;
				maxWidth = config.maxWidth;
				fluid = config.fluid;
				centerHtmlOutput = config.centerHtmlOutput;
				clickableLink = config.clickableLink;
				imagePath = config.imagePath;
				altText = config.altText;
				applyStyleNames = config.applyStyleNames;
				applyHtags = config.applyHtags;
				styleTextSegments = config.styleTextSegments;
				includeGoogleFonts = config.includeGoogleFonts;
				break;
			case 'preview':
				const preview = message.preview;
				nodeCount = preview.nodeCount;
				exampleAssets = preview.exampleAssets;
				exampleFile = preview.exampleFile;
				exampleAssets = await buildPreviewImages(exampleAssets);
				break;
			case 'export':
				const url = await buildZipArchive(message.assets, message.file);
				const link = document.createElement('a');
				link.href = url;
				link.download = `${syntax}.zip`;
				link.click();

				setTimeout(() => {
					loading = false;
				}, 1500);
				break;
			case 'variables':
				showVariablesButton = message.variables === null;
				break;
		}
	};

	interface PostMessage {
		type:
			| 'init'
			| 'load'
			| 'config'
			| 'export'
			| 'reset'
			| 'saveSettings'
			| 'loadSettings'
			| 'writeVariables';
		config?: Config | null;
	}

	const postMessage = (message: PostMessage) =>
		parent.postMessage({ pluginMessage: message }, '*');

	onMount(() => postMessage({ type: 'init' }));

	const onChangeConfig = () =>
		postMessage({ type: 'config', config: buildConfig() });

	const onToggleMenu = () => (menuOpen = !menuOpen);

	const buildPreviewImages = async (assets: Asset[]): Promise<Asset[]> => {
		assets.forEach((asset) => {
			let blob = new Blob([asset.data], { type: `image/png` });
			const url = window.URL.createObjectURL(blob);
			asset.url = url;
		});

		return assets;
	};

	const buildZipArchive = async (
		assets: Asset[],
		file: HTMLFile
	): Promise<string> => {
		let zip = new JSZip();

		assets.forEach((asset) => {
			const extensionLower = asset.extension.toLowerCase();
			let blob = new Blob([asset.data], {
				type: `image/${extensionLower}`,
			});
			zip.file(`${asset.filename}.${extensionLower}`, blob, {
				base64: true,
			});
		});

		let fileBlob = new Blob([file.data], { type: `string` });
		zip.file(`${file.filename}.${file.extension.toLowerCase()}`, fileBlob, {
			base64: true,
		});

		const blob = await zip.generateAsync({ type: 'blob' });
		const url = window.URL.createObjectURL(blob);

		return url;
	};
</script>

{#if loading}
	<div class="overlay">
		<div class="spinner">
			<Icon iconName={IconSpinner} color="black" spin />
		</div>
	</div>
{/if}

<div class="content">
	<div class="group">
		<div class="header">
			<div class="group-title">
				<Icon iconName={IconDraft} color="black" />
				<h3>File Output</h3>
			</div>
		</div>

		<div class="row">
			<div class="setting">
				<Section>Filename</Section>
				<input
					type="text"
					placeholder={syntax}
					bind:value={syntax}
					on:input={onChangeConfig}
				/>
			</div>
			<div class="setting">
				<Section>Filetype</Section>
				<SelectMenu
					bind:menuItems={fileTypeOptions}
					on:change={(e) => {
						fileType = e.detail.value;
						onChangeConfig();
					}}
				/>
			</div>
		</div>
	</div>

	<div class="group">
		<div class="header">
			<div class="group-title">
				<Icon iconName={IconImage} color="black" />
				<h3>Image Settings</h3>
			</div>
		</div>

		<div class="row">
			<div class="setting">
				<Section>Image Scale</Section>
				<SelectMenu
					bind:menuItems={scaleOptions}
					disabled={!extension || extension === 'SVG'}
					on:change={(e) => {
						scale = e.detail.value;
						onChangeConfig();
					}}
				/>
			</div>
			<div class="setting">
				<Section>Format</Section>
				<SelectMenu
					bind:menuItems={extensionOptions}
					on:change={(e) => {
						extension = e.detail.value;
						onChangeConfig();
					}}
				/>
			</div>
		</div>
		<div class="row">
			<div class="setting">
				<Section>Path</Section>
				<input
					type="text"
					placeholder="Image path"
					bind:value={imagePath}
					on:change={onChangeConfig}
				/>
			</div>
			<div class="setting">
				<Section>Alt Text</Section>
				<input
					type="text"
					placeholder="Alt text"
					bind:value={altText}
					on:change={onChangeConfig}
				/>
			</div>
		</div>
	</div>

	<div class="group">
		<div class="header">
			<div class="group-title">
				<Icon iconName={IconAdjust} color="black" />
				<h3>Page Settings</h3>
			</div>
		</div>

		<div class="row">
			<div class="setting switch-setting">
				<div class="switch-title">
					<Section>Include Resize Script?</Section>
				</div>
				<Switch
					value={includeResizer}
					bind:checked={includeResizer}
					on:change={onChangeConfig}
				/>
			</div>
			<div class="setting switch-setting">
				<div class="switch-title">
					<Section>Center HTML Output?</Section>
				</div>
				<Switch
					value={centerHtmlOutput}
					bind:checked={centerHtmlOutput}
					on:change={onChangeConfig}
				/>
			</div>
		</div>
		<div class="row">
			<div class="setting switch-setting">
				<div class="switch-title">
					<Section>Fluid-width container?</Section>
				</div>
				<Switch
					value={fluid}
					bind:checked={fluid}
					on:change={onChangeConfig}
				/>
			</div>
			<div class="setting switch-setting">
				<div class="switch-title">
					<Section>Testing Mode?</Section>
				</div>
				<Switch
					value={testingMode}
					bind:checked={testingMode}
					on:change={onChangeConfig}
				/>
			</div>
		</div>
		<div class="row">
			<div class="setting">
				<Section>Add Max Container Width (px)</Section>
				<input
					type="number"
					placeholder="1920"
					bind:value={maxWidth}
					on:input={onChangeConfig}
				/>
			</div>
			<div class="setting">
				<Section>Clickable Link</Section>
				<input
					type="text"
					placeholder="Link image?"
					bind:value={clickableLink}
					on:change={onChangeConfig}
				/>
			</div>
		</div>
	</div>

	<div class="group">
		<div class="header">
			<div class="group-title">
				<Icon iconName={IconLibrary} color="black" />
				<h3>Text Settings</h3>
			</div>
			{#if showVariablesButton}
				<button
					class="generate"
					on:click={() => postMessage({ type: 'writeVariables' })}
					out:fade
				>
					<Icon iconName={TextIcon} color="#121212" />
					<p>Generate Variable Text</p>
				</button>
			{/if}
		</div>

		<div class="row">
			<div class="setting switch-setting">
				<div class="switch-title">
					<Section>Style Text Segments</Section>
				</div>
				<Switch
					value={styleTextSegments}
					bind:checked={styleTextSegments}
					on:change={onChangeConfig}
				/>
			</div>
			<div class="setting switch-setting">
				<div class="switch-title">
					<Section>Include Figma Styles as Classes</Section>
				</div>
				<Switch
					value={applyStyleNames}
					bind:checked={applyStyleNames}
					on:change={onChangeConfig}
				/>
			</div>
		</div>
		<div class="row">
			<div class="setting switch-setting">
				<div class="switch-title">
					<Section>Convert Header Styles to H Tags</Section>
				</div>
				<Switch
					value={applyHtags}
					bind:checked={applyHtags}
					on:change={onChangeConfig}
				/>
			</div>
			<div class="setting switch-setting">
				<div class="switch-title">
					<Section>Include Google Fonts</Section>
				</div>
				<Switch
					value={includeGoogleFonts}
					bind:checked={includeGoogleFonts}
					on:change={onChangeConfig}
				/>
			</div>
		</div>
	</div>

	<div class="group">
		<div class="header">
			<div class="group-title">
				<Icon iconName={IconVisible} color="black" />
				<h3>Output Preview</h3>
			</div>
		</div>

		<div class="preview">
			{#if exampleAssets.length > 0}
				{#if exampleFile}
					<div class="preview-card">
						<div class="preview-card-image">
							<Icon iconName={IconDraft} color="black" />
						</div>
						<div class="preview-card-content">
							<h5>
								{exampleFile.filename}.{exampleFile.extension.toLowerCase()}
							</h5>
						</div>
					</div>
				{/if}
				{#each exampleAssets as asset, i}
					<div class="preview-card">
						<img
							class="preview-card-image"
							src={asset.url}
							alt="asset thumbnail"
						/>
						<div class="preview-card-content">
							<h5>
								{asset.filename}.{asset.extension.toLowerCase()}
							</h5>
							{#if asset.size}
								{displaySize(asset.size)} ({scale}x)
							{/if}
						</div>
					</div>
				{/each}
			{:else}
				<div class="output-placeholder">
					Add a frame named #[size]px...
				</div>
			{/if}
		</div>
	</div>
</div>

<div class="footer">
	<div class="footer-inner">
		<button
			class="primary"
			on:click={() => {
				loading = true;
				postMessage({ type: 'export', config: buildConfig() });
			}}
			disabled={nodeCount === 0}
			>Export {nodeCount > 0 ? nodeCount + 1 : 0} Files</button
		>
		<button
			class="secondary"
			on:click={() => postMessage({ type: 'reset' })}
		>
			<Icon iconName={IconSwap} color="#121212" />
			<p>Reset to Defaults</p>
		</button>
		<button
			class="secondary"
			on:click={() => postMessage({ type: 'saveSettings' })}
		>
			<Icon iconName={ImportIcon} color="#121212" />
			<p>Save Settings</p>
		</button>
		<button
			class="secondary"
			on:click={() => postMessage({ type: 'loadSettings' })}
		>
			<Icon iconName={ExportIcon} color="#121212" />
			<p>Load Settings</p>
		</button>
	</div>
	<button class="ellipses" on:click={onToggleMenu}>
		<Icon iconName={IconEllipses} color="#121212" />
	</button>
</div>

{#if menuOpen}
	<div class="menu-pane" transition:slide>
		<a href="https://github.com/the-dataface/figma2html" target="_blank">
			<div class="menu-row">
				<Icon iconName={HelpIcon} /> About
			</div>
		</a>
		<a
			href="https://github.com/the-dataface/figma2html/issues"
			target="_blank"
		>
			<div class="menu-row">
				<Icon iconName={IconWarning} color="#121212" /> Report Issue
			</div>
		</a>
	</div>
{/if}

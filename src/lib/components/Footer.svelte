<script lang="ts">
	import { createEventDispatcher, getContext } from 'svelte';
	import {
		SaveIcon,
		UploadCloudIcon,
		RotateCcwIcon,
		HelpCircleIcon,
		AlertCircleIcon,
		XIcon,
		InfoIcon
	} from 'svelte-feather-icons';
	import Button from './Inputs/Button.svelte';
	import DatafaceLogo from './DatafaceLogo.svelte';
	import WindowResize from './WindowResize.svelte';

	const { error, preview } = getContext('App');

	const dispatch = createEventDispatcher();

	let isMenuOpen = false;
</script>

<footer
	class="fixed bottom-0 left-0 w-full h-12 flex justify-between items-center z-20 overflow-y-hidden border-t border-solid border-figma-border bg-figma-bg"
>
	<h2>
		<button
			id="export"
			class="h-full flex items-center flex-nowrap cursor-pointer bg-none rounded-none border-none py-2 px-4 text-2xs font-bold text-figma-bg disabled:cursor-not-allowed disabled:hover:opacity-100 active:bg-figma-bg-success-pressed hover:bg-figma-bg-success-hover"
			class:bg-figma-bg-success={$preview.total > 0}
			class:bg-figma-bg-danger={$preview.total === 0}
			disabled={$preview.total === 0}
			on:click={() => dispatch('export')}
		>
			Export {$preview.total > 0 ? $preview.total + 1 : 0} assets
		</button>
	</h2>

	<div class="flex gap-2 mx-2">
		{#each [{ id: 'reset', icon: RotateCcwIcon, text: 'Reset settings', onClick: () => dispatch('reset-settings') }, { id: 'save', icon: SaveIcon, text: 'Save settings', onClick: () => dispatch('save-settings') }, { id: 'load', icon: UploadCloudIcon, text: 'Load settings', onClick: () => dispatch('load-settings') }] as { id, icon, text, onClick }}
			<Button
				{id}
				class="text-figma-text h-full flex items-center flex-nowrap gap-1 cursor-pointer bg-none rounded-none border-none text-2xs"
				on:click={onClick}
			>
				<svelte:component this={icon} size="16" />
				{text}
			</Button>
		{/each}
	</div>

	<DatafaceLogo size={{ w: 48, h: 48 }} class="ml-auto" />

	<details
		id="menu"
		class="h-full flex items-center flex-nowrap cursor-pointer bg-none rounded-none text-2xs text-figma-text select-none group"
		title="Menu"
		bind:open={isMenuOpen}
	>
		<summary
			class="no-marker w-full h-full flex items-center justify-center border-l border-solid border-figma-border p-2 hover:text-figma-text-secondary active:text-figma-text-tertiary"
		>
			<svelte:component
				this={isMenuOpen ? XIcon : InfoIcon}
				size="16"
				class="transition-opacity duration-100 ease-out"
			/>
		</summary>
		<div
			class="menu-pane fixed right-2 bottom-14 rounded-lg flex flex-col p-1 border border-solid border-figma-border bg-figma-bg"
		>
			{#each [{ href: 'https://github.com/the-dataface/figma2html', icon: HelpCircleIcon, text: 'About' }, { href: 'https://github.com/the-dataface/figma2html/issues', icon: AlertCircleIcon, text: 'Report Issue' }] as { href, icon, text }}
				<a
					class="flex items-center p-2 text-sm text-figma-text hover:text-figma-text-secondary active:text-figma-text-tertiary"
					{href}
					target="_blank"
					rel="noreferrer"
				>
					<svelte:component this={icon} size="18" class="mr-2 fill-figma-bg" />
					{text}
				</a>
			{/each}
		</div>
	</details>

	<WindowResize />
</footer>

<!-- TODO: make the menu use <details>/<summary> -->
<style>
	:global(html.figma-dark) button#export {
		color: var(--figma-color-text) !important;
	}
</style>

<script>
	import { createEventDispatcher, getContext } from 'svelte';
	import {
		SaveIcon,
		UploadCloudIcon,
		RotateCcwIcon,
		HelpCircleIcon,
		AlertCircleIcon,
		XIcon,
		InfoIcon,
		GitMergeIcon
	} from 'svelte-feather-icons';
	import Button from './Inputs/Button.svelte';
	import DatafaceLogo from './DatafaceLogo.svelte';
	import WindowResize from './WindowResize.svelte';

	const { preview, pkg } = getContext('App');

	const dispatch = createEventDispatcher();

	let isMenuOpen = false;
</script>

<footer
	class="flex-0 relative z-20 flex h-footer w-full flex-shrink-0 flex-grow-0 items-center justify-between overflow-y-hidden border-t border-solid border-figma-border bg-figma-bg"
>
	<h2>
		<button
			id="export"
			class="flex h-full cursor-pointer flex-nowrap items-center rounded-none border-none bg-none py-2 px-4 text-2xs font-bold text-figma-bg hover:bg-figma-bg-success-hover active:bg-figma-bg-success-pressed disabled:cursor-not-allowed disabled:hover:opacity-100"
			class:bg-figma-bg-success={$preview.total > 0}
			class:bg-figma-bg-danger={$preview.total === 0}
			disabled={$preview.total === 0}
			on:click={() => dispatch('export')}
		>
			Export {$preview.total > 0 ? $preview.total + 1 : 0} assets
		</button>
	</h2>

	<div class="mx-2 flex gap-2">
		{#each [{ id: 'reset', icon: RotateCcwIcon, text: 'Reset', onClick: () => dispatch('reset-settings') }, { id: 'save', icon: SaveIcon, text: 'Save', onClick: () => dispatch('save-settings') }, { id: 'load', icon: UploadCloudIcon, text: 'Load', onClick: () => dispatch('load-settings') }] as { id, icon, text, onClick }}
			<Button
				{id}
				class="flex h-full cursor-pointer flex-nowrap items-center gap-1 rounded-none border-none bg-none text-2xs text-figma-text"
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
		class="group flex h-full cursor-pointer select-none flex-nowrap items-center rounded-none bg-none text-2xs text-figma-text"
		title="Menu"
		bind:open={isMenuOpen}
	>
		<summary
			class="no-marker flex h-full w-full items-center justify-center border-l border-solid border-figma-border p-2 hover:text-figma-text-secondary active:text-figma-text-tertiary"
		>
			<svelte:component
				this={isMenuOpen ? XIcon : InfoIcon}
				size="16"
				class="transition-opacity duration-100 ease-out"
			/>
		</summary>
		<div
			class="menu-pane fixed right-2 bottom-14 flex flex-col rounded-lg border border-solid border-figma-border bg-figma-bg p-1"
		>
			{#each [{ href: pkg.homepage, icon: HelpCircleIcon, text: 'About' }, { href: pkg.bugs.url, icon: AlertCircleIcon, text: 'Report Issue' }, { href: 'https://github.com/the-dataface/figma2html/blob/main/CHANGELOG.md', icon: GitMergeIcon, text: `v${pkg.version}` }] as { href, icon, text }}
				<a
					class="flex items-center p-2 text-sm text-figma-text hover:text-figma-text-secondary active:text-figma-text-tertiary"
					{href}
					target="_blank"
					rel="noreferrer"
					title={text}
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

<script>
	import { getContext } from 'svelte';
	import { fly } from 'svelte/transition';
	import { backOut } from 'svelte/easing';

	import { AlertTriangleIcon } from 'svelte-feather-icons';
	import Input from '../Inputs/Input.svelte';
	import Select from '../Inputs/Select.svelte';
	import TextArea from '../Inputs/TextArea.svelte';

	const {
		config: { alt, format, imagePath, scale }
	} = getContext('App');
</script>

<div class="flex w-full flex-col gap-2">
	<div class="flex gap-2">
		<div class="flex-grow">
			<div class="mt-2 mb-2.5 flex items-center justify-between text-[10px]">
				<h3 class="m-0 text-xs">Scale</h3>
			</div>
			<div class="flex-start flex w-full">
				<div class="w-full">
					<Select id="scale" disabled={$format === 'SVG'} bind:value={$scale} on:change />
				</div>
			</div>
		</div>
		<div class="flex-grow">
			<div class="mt-2 mb-2.5 flex items-center justify-between text-[10px]">
				<h3 class="m-0 text-xs">Format</h3>
			</div>
			<div class="flex-start flex w-full">
				<div class="w-full">
					<Select id="format" bind:value={$format} on:change />
				</div>
			</div>
		</div>
	</div>

	<div>
		<div class="mt-2 mb-2.5 flex items-center justify-between text-[10px]">
			<h3 class="m-0 text-xs">Path</h3>
		</div>
		<div class="flex-start flex w-full">
			<div class="w-full">
				<Input
					placeholder="Enter an image path to include in your export."
					bind:value={$imagePath}
					on:change
				/>
			</div>
		</div>
	</div>

	<div>
		<div class="mt-2 mb-2.5 flex items-center justify-between text-[10px]">
			<h3 class="m-0 text-xs">Alt text</h3>
			{#if !$alt || $alt === ''}
				<div
					class="flex items-center gap-1 text-xs text-figma-bg-danger"
					transition:fly={{ x: 50, duration: 300, easing: backOut }}
				>
					<AlertTriangleIcon size="12" />
					<p class="text-xs">Required</p>
				</div>
			{/if}
		</div>
		<div class="flex-start flex w-full">
			<div class="w-full">
				<TextArea
					required
					placeholder="Enter alternate text to apply to your images."
					bind:value={$alt}
					on:change
				/>
			</div>
		</div>
	</div>
</div>

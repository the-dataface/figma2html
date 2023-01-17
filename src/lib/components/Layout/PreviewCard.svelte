<script lang="ts">
	import { getContext } from 'svelte';
	import type { Format, Size } from '../../../types';

	const {
		config: { scale }
	} = getContext('App');

	export let size: Size = undefined;
	export let format: Format = undefined;
	export let src: string = undefined;
	export let title: string = undefined;
</script>

<div
	class="container w-full flex gap-2 p-2 rounded-lg items-center border border-soliod border-figma-border"
>
	<div class="w-16 h-16 rounded-md flex items-center justify-center">
		{#if $$slots.icon}
			<div class="bg-figma-bg-secondary w-full h-full flex items-center justify-center">
				<slot name="icon" />
			</div>
		{/if}
		{#if src}
			<img class="w-full h-full" {src} alt="asset thumbnail" width="64" height="64" />
		{/if}
	</div>
	{#if title || size}
		<div class="flex-grow flex-col gap-1">
			{#if title}
				<h3 class="m-0 text-xs font-bold">{title}.{format.toLowerCase()}</h3>
			{/if}
			{#if size}
				<p class="m-0 text-xs">
					{Math.round(size.w)}&cross;{Math.round(size.h)}
					{format === 'SVG' ? '' : `(${$scale}x)`}
				</p>
			{/if}
		</div>
	{/if}
</div>

<script>
	import { getContext } from 'svelte';

	export let size = undefined;
	export let format = undefined;
	export let src = undefined;
	export let title = undefined;

	const {
		config: { scale }
	} = getContext('App');
</script>

<div
	class="container flex w-full items-center gap-2 rounded-lg border border-solid border-figma-border p-2"
>
	<div class="flex h-16 w-16 items-center justify-center rounded-md">
		{#if $$slots.icon}
			<div class="flex h-full w-full items-center justify-center bg-figma-bg-secondary">
				<slot name="icon" />
			</div>
		{/if}
		{#if src}
			<img class="h-full w-full" {src} alt="asset thumbnail" width="64" height="64" />
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

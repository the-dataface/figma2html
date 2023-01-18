<script>
	import { getContext } from 'svelte';
	import { FileTextIcon } from 'svelte-feather-icons';
	import PreviewCard from '../Layout/PreviewCard.svelte';
	const { preview } = getContext('App');
</script>

<div class="flex flex-col items-start justify-between px-4">
	<h2 class="my-4 text-base font-bold">Output</h2>
	<div class="relative grid w-full gap-2 pb-6 md:grid-cols-2">
		{#if $preview.assets.length > 0 && $preview.file}
			<PreviewCard title={$preview.file.filename} format={$preview.file.output.toLowerCase()}>
				<svelte:fragment slot="icon">
					<FileTextIcon size="32" class="text-figma-text" />
				</svelte:fragment>
			</PreviewCard>
		{/if}
		{#each $preview.assets as asset}
			<PreviewCard title={asset.filename} format={asset.format} size={asset.size} src={asset.url} />
		{/each}
	</div>
</div>

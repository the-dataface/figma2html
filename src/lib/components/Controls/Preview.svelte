<script>
	import { getContext } from 'svelte';
	import { FileTextIcon } from 'svelte-feather-icons';
	import PreviewCard from '../Layout/PreviewCard.svelte';
	// import Overlay from '../Overlay.svelte';

	const { loading, preview } = getContext('App');
</script>

<div class="w-full grid md:grid-cols-2 gap-2 relative">
	<!-- {#if $loading}
		<Overlay />
	{/if} -->
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

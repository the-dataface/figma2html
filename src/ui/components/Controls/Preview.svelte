<script>
  import PreviewCard from "../Layout/PreviewCard.svelte";
  import Overlay from "../Overlay.svelte";

  export let exampleAssets = [];
  export let exampleFile = undefined;
  export let scale = undefined;
  export let showLoader;
</script>

<div class="w-full flex flex-wrap gap-2 relative">
    {#if showLoader === true || showLoader === undefined}
        <Overlay />
    {/if}
    {#if exampleAssets.length > 0}
        {#if exampleFile}
            <PreviewCard icon="file" title={exampleFile.filename} extension={exampleFile.extension.value} />
        {/if}
    {/if}
    {#each exampleAssets as asset}
        <PreviewCard title={asset.filename} extension={asset.extension.value} size={asset.size} scale={scale.value} src={asset.url} />
    {/each}
</div>

<style></style>
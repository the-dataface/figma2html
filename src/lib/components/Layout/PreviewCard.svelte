<script>
    export let extension = undefined;
    export let icon = undefined;
    export let scale = undefined;
    export let size = undefined;
    export let src = undefined;
    export let title = undefined;

    const displaySize = (size) => {
        const rounded = {
            width: Math.round(size.width),
            height: Math.round(size.height),
        };

        return `${rounded.width}x${rounded.height}`;
    };
</script>

<div class="container w-full flex gap-2 p-2 rounded-lg items-center">
    <div class="w-16 h-16 rounded-md flex items-center justify-center">
        {#if icon}
            <i class="text-base fa-sharp fa-solid fa-{icon}" />
        {/if}
        {#if src}
            <img class="w-full h-full" src={src} alt="asset thumbnail" />
        {/if}
    </div>
    <div class="flex-grow flex-col gap-1">
        {#if title}
            <h5 class="m-0 text-xs font-bold">{title}.{extension.toLowerCase()}</h5>
        {/if}
        {#if size}
            <h5 class="m-0 text-xs">{displaySize(size)} ({scale}x)</h5>
        {/if}
    </div>
</div>

<style>
    .container {
        border: 1px solid var(--figma-color-border);
        width: calc(50% - 16px);
    }
</style>
<script>
	import { fade } from 'svelte/transition';
	import { LoaderIcon } from 'svelte-feather-icons';
</script>

<div
	class="overlay absolute top-0 left-0 z-[999] h-full min-h-[200px] w-full bg-figma-bg text-figma-text"
	out:fade
>
	<div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
		<LoaderIcon class="mr-2 text-xl" />
	</div>
</div>

<style>
	.overlay {
		background-color: rgb(255, 255, 255);
	}

	:global(.figma-dark .overlay) {
		background-color: rgb(44, 44, 44) !important;
	}
</style>

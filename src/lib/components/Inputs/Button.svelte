<script lang="ts">
	export let id: string = undefined;

	let classes = '';
	export { classes as class };
</script>

<button
	{id}
	class="flex h-4 cursor-pointer items-center justify-center rounded-full bg-figma-bg py-4 px-[11px] transition-all hover:bg-figma-bg-secondary {classes}"
	on:click
>
	<slot />
</button>

<script lang="ts">
	export let id: string = undefined;

	let classes = '';
	export { classes as class };
</script>

<button
	{id}
	class="flex items-center justify-center py-4 px-[11px] cursor-pointer h-4 transition-all rounded-full bg-figma-bg hover:bg-figma-bg-secondary {classes}"
	on:click
>
	<slot />
</button>

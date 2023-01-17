<script lang="ts">
	export let border: boolean = true;
	export let open: boolean = false;
	export let title: string | undefined;
</script>

<div
	class="flex items-center justify-between"
	class:border-b={border}
	class:border-solid={border}
	class:border-figma-border={border}
>
	<!-- TODO: do we need to dispatch here? -->
	<details class="w-full px-4" bind:open on:toggle>
		<summary
			class="no-marker flex items-center gap-2 py-4 select-none transition-opacity hover:opacity-80 cursor-pointer"
		>
			<div class="h-4 flex items-center justify-center px-2 aspect-square">
				<span class="transition-transform duration-300 ease-out" class:rotate-90={open}>
					&rightarrow;
				</span>
			</div>
			<h2 class="text-base font-bold">{title}</h2>
		</summary>
		<div class="pb-6">
			<slot />
		</div>
	</details>
</div>

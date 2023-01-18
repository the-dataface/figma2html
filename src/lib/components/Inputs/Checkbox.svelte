<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { fly } from 'svelte/transition';
	import { backOut } from 'svelte/easing';

	export let label: string;
	export let value: string;
	export let checked: boolean;
	export let id = 'checkbox--' + (Math.random() * 10000000).toFixed(0).toString();

	const dispatch = createEventDispatcher();
</script>

<div class="container group flex gap-2 relative items-center cursor-pointer">
	<input
		class="opacity-0 cursor-pointer absolute inset-0 h-full w-full peer"
		type="checkbox"
		{id}
		bind:value
		bind:checked
		on:change
		on:focus
		on:blur
		on:toggle={() => {
			checked = !checked;
			dispatch('toggle');
		}}
	/>
	<div
		class="checkmark w-6 h-6 relative flex-shrink-0 flex-grow-0 rounded pointer-events-none flex items-center justify-center border border-solid border-figma-border bg-figma-bg-danger peer-checked:bg-figma-bg-success"
	>
		{#key checked}
			<span
				class="text-sm text-white font-bold absolute inset-0 h-full w-full flex items-center justify-center"
				in:fly={{ y: checked ? -2 : 2, duration: 300, easing: backOut }}
			>
				{@html checked ? '&check;' : '&cross;'}
			</span>
		{/key}
	</div>
	<label for={id} class="select-none cursor-pointer flex-grow">
		<h3 class="m-0 text-xs pointer-events-none">
			{label}
		</h3>
	</label>
</div>

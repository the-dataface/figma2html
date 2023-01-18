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

<div class="group container relative flex cursor-pointer items-center gap-2">
	<input
		class="peer absolute inset-0 h-full w-full cursor-pointer opacity-0"
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
		class="checkmark pointer-events-none relative flex h-6 w-6 flex-shrink-0 flex-grow-0 items-center justify-center rounded border border-solid border-figma-border bg-figma-bg-danger peer-checked:bg-figma-bg-success"
	>
		{#key checked}
			<span
				class="absolute inset-0 flex h-full w-full items-center justify-center text-sm font-bold text-white"
				in:fly={{ y: checked ? -2 : 2, duration: 300, easing: backOut }}
			>
				{@html checked ? '&check;' : '&cross;'}
			</span>
		{/key}
	</div>
	<label for={id} class="flex-grow cursor-pointer select-none">
		<h3 class="pointer-events-none m-0 text-xs">
			{label}
		</h3>
	</label>
</div>

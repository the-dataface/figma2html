<script context="module">
	import { ChevronDownIcon } from 'svelte-feather-icons';
	export const types = {
		'file-type': {
			html: 'HTML',
			svelte: 'Svelte'
		},
		format: {
			PNG: 'PNG',
			JPG: 'JPG',
			SVG: 'SVG'
		},
		scale: {
			'1': '1x',
			'2': '2x',
			'4': '4x'
		}
	};
</script>

<script lang="ts">
	export let id: 'format' | 'file-type' | 'scale' = undefined; // id attribute on the `<select>` element
	let classes = '';
	export { classes as class }; // class attribute on the `<select>` element
	export let disabled = false; // disabled attribute on the `<select>` element
	export let value = null; // stores the current selection, note, the value will be an object from your array

	$: options = types[id];
</script>

<div class="w-full relative {classes}">
	<div class="absolute right-2 inset-y-0 grid place-items-center h-full pointer-events-none">
		<ChevronDownIcon size="16" />
	</div>
	<select {id} class="w-full cursor-pointer" {disabled} bind:value on:change>
		{#if !Object.hasOwn(options, value)}
			<option {value} selected disabled>UNKNOWN VALUE: {value}</option>
		{/if}
		{#each Object.entries(options) as [v, label]}
			<option value={v} selected={v === value}>{label}</option>
		{/each}
	</select>
</div>

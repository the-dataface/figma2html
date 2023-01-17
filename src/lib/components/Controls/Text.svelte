<script>
	import { createEventDispatcher, getContext } from 'svelte';

	import Checkbox from '../Inputs/Checkbox.svelte';
	import Button from '../Inputs/Button.svelte';

	const {
		variables,
		config: { applyHtags, applyStyleNames, includeGoogleFonts, styleTextSegments }
	} = getContext('App');

	const dispatch = createEventDispatcher();
</script>

<div class="w-full flex flex-col gap-2">
	<Checkbox
		label="Style text segments"
		bind:value={$styleTextSegments}
		bind:checked={$styleTextSegments}
	/>
	<Checkbox
		label="Include Figma styles as classes"
		bind:value={$applyStyleNames}
		bind:checked={$applyStyleNames}
	/>
	<Checkbox
		label="Convert header styles to <h> tags"
		bind:value={$applyHtags}
		bind:checked={$applyHtags}
	/>
	<Checkbox
		label="Include Google fonts"
		bind:value={$includeGoogleFonts}
		bind:checked={$includeGoogleFonts}
	/>
	{#if !$variables}
		<Button
			class="bg-figma-bg-secondary hover:bg-figma-bg-tertiary"
			on:click={() => dispatch('write-variables')}
		>
			<i class="mr-2 text-xs fa-sharp fa-solid fa-text" />
			<p class="m-0 text-xs">Generate variable text</p>
		</Button>
	{/if}
</div>

<script>
	import { createEventDispatcher, getContext } from 'svelte';

	import { TypeIcon } from 'svelte-feather-icons';
	import Checkbox from '../Inputs/Checkbox.svelte';
	import Button from '../Inputs/Button.svelte';

	const {
		variables,
		config: { applyStyleNames, includeGoogleFonts, styleTextSegments }
	} = getContext('App');

	const dispatch = createEventDispatcher();
</script>

<div class="flex w-full flex-col gap-2">
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
		label="Include Google fonts"
		bind:value={$includeGoogleFonts}
		bind:checked={$includeGoogleFonts}
	/>
</div>

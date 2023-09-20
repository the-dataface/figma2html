<script>
	import { getContext } from 'svelte';

	import Checkbox from '../Inputs/Checkbox.svelte';

	const {
		config: { applyStyleNames, includeGoogleFonts, styleTextSegments }
	} = getContext('App');
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

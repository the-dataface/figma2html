<script>
	import { getContext } from 'svelte';

	import Checkbox from '../Inputs/Checkbox.svelte';
	import Input from '../Inputs/Input.svelte';
	import TextArea from '../Inputs/TextArea.svelte';

	const {
		config: { customScript, centered, fluid, includeResizer, maxWidth }
	} = getContext('App');
</script>

<div class="flex w-full flex-col gap-2">
	<Checkbox
		label="Include resizer script"
		bind:value={$includeResizer}
		bind:checked={$includeResizer}
		on:change
	/>
	<Checkbox label="Center HTML output" bind:value={$centered} bind:checked={$centered} on:change />
	<Checkbox label="Fluid container width" bind:value={$fluid} bind:checked={$fluid} on:change />

	<div class="flex gap-2">
		<div class="flex-grow">
			<div class="mt-2 mb-2.5 flex items-center justify-between text-[10px]">
				<h3 class="m-0 text-xs">Add max width (px)</h3>
			</div>
			<div class="input-row">
				<div class="w-full">
					<Input placeholder="Enter a max width for the images." bind:value={$maxWidth} on:change />
				</div>
			</div>
		</div>
	</div>

	<div>
		<div class="mt-2 mb-2.5 flex items-center justify-between text-[10px]">
			<h3 class="m-0 text-xs">Custom script</h3>
		</div>
		<div class="flex-start flex w-full">
			<div class="w-full">
				<TextArea
					placeholder="Enter a custom script to be included in the exported HTML file here."
					bind:value={$customScript}
					on:change
				/>
			</div>
		</div>
	</div>
</div>

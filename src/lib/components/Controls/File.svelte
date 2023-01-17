<script>
	import { createEventDispatcher, getContext } from 'svelte';
	import slugify from 'slugify';

	import Checkbox from '../Inputs/Checkbox.svelte';
	import Input from '../Inputs/Input.svelte';
	import Select from '../Inputs/Select.svelte';

	const {
		error,
		config: { output, testingMode, name }
	} = getContext('App');

	const dispatch = createEventDispatcher();
</script>

<div class="w-full flex flex-col gap-2">
	<div>
		<div class="flex justify-between items-center text-[10px] mt-2 mb-2.5">
			<h3 class="m-0 text-xs">File name</h3>
			{#if !$name || $name === ''}
				<div class="flex items-center gap-1 text-red-600 text-xs">
					<i class="fa-sharp fa-solid fa-circle-exclamation" />
					<p class="text-xs">Required</p>
				</div>
			{/if}
		</div>
		<div class="input-row">
			<div class="w-full">
				<Input
					id="file-name"
					required
					placeholder="Enter a file name"
					bind:value={$name}
					on:change={() => {
						if ($name === '') {
							$error.message = 'File name cannot be empty';
							dispatch('error');
							return;
						}
						// if (fileName.includes("/")) {
						//   errorMessage = "File name cannot contain '/'";
						//   dispatch("error");
						//   return;
						// }
						name.set(slugify($name, { lower: true, strict: true, remove: /[*+~.()'"!:@]/g }));
						dispatch('change');
						return;
					}}
				/>
			</div>
		</div>
	</div>

	<div>
		<div class="flex justify-between items-center text-[10px] mt-2 mb-2.5">
			<h3 class="m-0 text-xs">File type</h3>
		</div>
		<div class="flex flex-start w-full">
			<div class="w-full">
				<Select id="file-type" bind:value={$output} on:change />
			</div>
		</div>
	</div>

	<div class="mt-2">
		<Checkbox
			label="Testing mode"
			bind:value={$testingMode}
			bind:checked={$testingMode}
			on:change
		/>
	</div>
</div>

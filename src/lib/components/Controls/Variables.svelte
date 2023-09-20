<script>
	import { createEventDispatcher, getContext } from 'svelte';
	import { flip } from 'svelte/animate';
	import slugify from 'lib/utils/slugify';
	import { PlusIcon, SaveIcon, Trash2Icon } from 'svelte-feather-icons';
	import Button from '../Inputs/Button.svelte';
	import Input from '../Inputs/Input.svelte';

	const { variables } = getContext('App');

	const dispatch = createEventDispatcher();

	$: entries = Object.entries($variables).sort(([a], [b]) => a.localeCompare(b));
</script>

<div class="flex w-full flex-col gap-4">
	{#if entries.length}
		<ul class="flex flex-col gap-4 divide-y divide-figma-bg-secondary">
			{#each entries as [key, value] (key)}
				{@const id = `variable-${slugify(key, { lower: true, strict: true })}`}
				<li class="flex flex-col gap-2 pt-4 first-of-type:pt-0" animate:flip={{ duration: 300 }}>
					<div class="flex flex-row flex-nowrap items-center justify-between gap-2">
						<Input
							id="{id}-key"
							placeholder="Key"
							value={key}
							on:change={(e) => {
								variables.update((v) => {
									delete v[key];
									v[e.target.value] = value;
									return v;
								});
								dispatch('write-variables');
							}}
						/>

						<button
							id="{id}-save"
							class="rounded-full bg-figma-bg-secondary p-2"
							title="Save variable: {key}"
							on:click={() => {
								variables.update((v) => {
									// delete entire entry
									delete v[key];

									const newKey = document.getElementById(`${id}-key`).value;
									const newValue = document.getElementById(`${id}-value`).value;
									v[newKey] = newValue;
									return v;
								});
								dispatch('write-variables');
							}}
						>
							<SaveIcon size="16" />
						</button>

						<button
							id="{id}-delete"
							class="rounded-full bg-figma-bg-secondary p-2"
							title="Delete variable: {key}"
							on:click={() => {
								variables.update((v) => {
									// delete entire entry
									delete v[key];
									return v;
								});
								dispatch('write-variables');
							}}
						>
							<Trash2Icon size="16" />
						</button>
					</div>
					<Input
						id="{id}-value"
						placeholder="Value"
						{value}
						on:input={(e) => {
							variables.update((v) => {
								v[key] = e.target.value;
								return v;
							});
							dispatch('write-variables');
						}}
					/>
				</li>
			{/each}
		</ul>
	{/if}

	<Button
		class="bg-figma-bg-secondary"
		on:click={() => {
			variables.update((v) => ({ ...v, '': '' }));
		}}
	>
		<PlusIcon size="12" class="mr-2" />
		<p class="m-0 text-xs">Add variable</p>
	</Button>
</div>

<style>
	li :global(.input-wrapper) {
		width: 100%;
	}
	li :global(.input-wrapper input) {
		width: 100%;
	}
</style>

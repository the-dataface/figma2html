<script>
	import { createEventDispatcher, getContext } from 'svelte';
	import { flip } from 'svelte/animate';
	import slugify from 'lib/utils/slugify';
	import {
		EyeIcon,
		PlusIcon,
		Trash2Icon,
		HelpCircleIcon,
		ChevronDownIcon
	} from 'svelte-feather-icons';
	import Button from '../Inputs/Button.svelte';
	import Input from '../Inputs/Input.svelte';
	import TextArea from '../Inputs/TextArea.svelte';

	const { variables } = getContext('App');

	const dispatch = createEventDispatcher();

	$: entries = Object.entries($variables);
</script>

<div class="flex w-full flex-col gap-4">
	<details class="group rounded-md border border-figma-border bg-figma-bg-secondary text-xs">
		<summary
			class="flex cursor-pointer select-none flex-row flex-nowrap items-center gap-2 p-2 leading-none"
		>
			<HelpCircleIcon size="14" strokeWidth="2" />
			<span>How do I use Variables?</span>
		</summary>
		<div class="border-t border-figma-border">
			<div class="flex flex-col gap-2 p-2">
				<p>
					Figma2html's Variables are a way to simultaneously set the text content of several nodes.
					Variables can occur in two modes: whole or partial. Whole variables will replace the
					entire text content of a node and are previewable, while partial variables will replace
					only the variable name itself after exporting.
				</p>
				<p>
					Get started with whole variables by renaming a text node in the left-hand panel to a
					variable name of your choosing, excluding spaces. Wrap the variable name in two curly
					braces on each side, like this: <code>{`{{variable}}`}</code>.
				</p>
				<p>
					Then, open figma2html and add that same name in the Variables panel. Add an associated
					value in the text area, and hit the <span
						class="inline-block rounded-full border border-figma-border bg-figma-bg-secondary p-1 align-middle"
						><EyeIcon size="12" /></span
					> button to preview the text.
				</p>
				<p>
					Whole Variables support valid HTML but only does so on exported frames. Previewing whole
					variables in Figma will show only pure text content without any further styling.
				</p>
			</div>
		</div>
	</details>

	{#if entries.length}
		<ul class="flex flex-col gap-4 divide-y divide-figma-bg-secondary">
			{#each entries as [uuid, { key, value }] (uuid)}
				{@const id = `variable-${slugify(uuid, { lower: true, strict: true })}`}
				<li class="flex flex-col gap-2 pt-4 first-of-type:pt-0" animate:flip={{ duration: 300 }}>
					<div class="flex flex-row flex-nowrap items-center justify-between gap-2">
						<Input
							id="{id}-key"
							placeholder="Key"
							value={key}
							on:input={(e) => {
								// replace spaces with dashes, integral for parsing
								e.target.value = e.target.value.replaceAll(/\s/g, '-');
							}}
							on:change={(e) => {
								variables.update((v) => {
									v[uuid].key = e.target.value;
									return v;
								});
								dispatch('write-variables');
							}}
						/>

						<button
							id="{id}-inject"
							class="rounded-full bg-figma-bg-secondary p-2"
							title="Inject variable: {key}"
							on:click={() => {
								dispatch('write-variables');
								dispatch('inject-variables', { uuid: { key, value } });
							}}
						>
							<EyeIcon size="16" />
						</button>

						<button
							id="{id}-delete"
							class="rounded-full bg-figma-bg-secondary p-2"
							title="Delete variable: {key}"
							on:click={() => {
								variables.update((v) => {
									// delete entire entry
									delete v[uuid];
									return v;
								});
								dispatch('write-variables');
							}}
						>
							<Trash2Icon size="16" />
						</button>
					</div>
					<TextArea
						id="{id}-value"
						placeholder="Value"
						{value}
						on:change={(e) => {
							variables.update((v) => {
								v[uuid].value = e.target.value;
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
			variables.update((v) => {
				return { ...v, [Math.random().toString(36).substring(2, 15)]: { key: '', value: '' } };
			});
		}}
	>
		<PlusIcon size="12" class="mr-2" />
		<span class="m-0 text-xs">Add variable</span>
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

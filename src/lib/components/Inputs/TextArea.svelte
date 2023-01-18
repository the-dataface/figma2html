<script>
	export let id = null;
	export let required = undefined;
	export let value = null;
	export let rows = 2;
	export let name = null;
	export let disabled = false;
	export let placeholder = 'Input something here...';

	let classes = '';
	export { classes as class };
</script>

<div class="textarea relative {classes}">
	<textarea
		{id}
		{name}
		{rows}
		{disabled}
		{required}
		{placeholder}
		class="w-full h-16 min-h-[4rem] p-2 resize-y overflow-y-auto cursor-text bg-figma-bg-secondary"
		bind:value
		on:input
		on:change
		on:keydown
		on:focus
		on:blur
	/>
</div>

<!-- <style>
	textarea {
		font-family: var(--font-stack);
		font-size: var(--font-size-xsmall);
		font-weight: var(--font-weight-normal);
		letter-spacing: var(--font-letter-spacing-neg-xsmall);
		line-height: var(--line-height);
		position: relative;
		display: flex;
		overflow: visible;
		align-items: center;
		width: 100%;
		min-height: 62px;
		margin: 1px 0 1px 0;
		padding: 7px 4px 9px 7px;
		color: var(--figma-color-text);
		border: 1px solid var(--figma-color-border);
		border-radius: var(--border-radius-small);
		outline: none;
		background-color: var(--figma-color-bg);
		resize: none;
		overflow-y: auto;
	}
	textarea:hover,
	textarea:placeholder-shown:hover {
		color: var(--figma-color-text);
		border: 1px solid var(--figma-color-border);
		background-image: none;
	}
	textarea::selection {
		color: var(--figma-color-text);
		background-color: var(--text-highlight);
	}
	textarea::placeholder {
		color: var(--figma-color-text-tertiary);
		border: 1px solid transparent;
	}
	textarea:focus:placeholder-shown {
		border: 1px solid var(--figma-color-border-selected);
		outline: 1px solid var(--figma-color-border-selected);
		outline-offset: -2px;
	}
	textarea:active,
	textarea:focus {
		padding: 7px 4px 9px 7px;

		color: var(--figma-color-text);
		border: 1px solid var(--figma-color-border-selected);
		outline: 1px solid var(--figma-color-border-selected);
		outline-offset: -2px;
	}
	textarea:disabled,
	textarea:disabled:hover {
		position: relative;
		color: var(--figma-color-text-disabled);
		border: 1px solid transparent;
	}
	textarea:disabled:active {
		padding: 7px 4px 9px 7px;
		outline: none;
	}
</style> -->

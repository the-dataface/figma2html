<script>
	export let id = null;
	export let value = null;
	export let name = null;
	export let borders = false;
	export let disabled = false;
	export let invalid = false;
	export let required = undefined;
	export let errorMessage = 'Error message';
	export let placeholder = 'Input something here...';
	export let ref = null;
	let classes = '';
	export { classes as class };
</script>

<div class="input-wrapper">
	<input
		{id}
		type="text"
		class="relative w-full cursor-text {classes}"
		class:borders
		class:invalid
		{name}
		{disabled}
		{placeholder}
		{errorMessage}
		{required}
		bind:value
		bind:this={ref}
		on:input
		on:change
		on:keydown
		on:focus
		on:blur
	/>
	{#if invalid}
		<div class="error text-2xs font-normal tracking-tighter text-figma-text-danger">
			{errorMessage}
		</div>
	{/if}
</div>

<style>
	.borders {
		border: 1px solid var(--figma-color-border);
		background-image: none;
	}
	.borders:disabled {
		border: 1px solid transparent;
		background-image: none;
	}
	.borders:disabled:placeholder-shown {
		border: 1px solid transparent;
		background-image: none;
	}
	.borders:disabled:placeholder-shown:active {
		border: 1px solid transparent;
		outline: none;
	}
	.borders:placeholder-shown {
		border: 1px solid var(--figma-color-border);
		background-image: none;
	}
</style>

<script>
    import { createEventDispatcher } from "svelte";
    import { fade } from "svelte/transition";

    const dispatch = createEventDispatcher();

    export let checked;
    export let label;
    export let value;

    let uniqueId = 'checkbox--' + ((Math.random() * 10000000).toFixed(0)).toString();

    const toggle = () => {
        checked = !checked;
        dispatch("change");
    }
</script>

<div class="container flex gap-2 relative items-center cursor-pointer" on:click={toggle}>
    <input 
        type="checkbox" 
        id={uniqueId} 
        bind:checked={checked} 
        bind:value={value} 
        onclick="this.blur();"
        on:change
        on:focus
        on:blur
        >
    <div class="checkmark w-6 h-6 rounded-full pointer-events-none flex items-center justify-center transition-all"
        class:checked={checked}
    >
        {#if checked}
            <i class="fas fa-check text-xs" transition:fade />
        {/if}
    </div>
    <label for={uniqueId} class="pointer-events-none">
        <h5 class="m-0 text-xs">
            {label}
        </h5>
    </label>
</div>

<style>
    input {
        opacity: 0;
        cursor: pointer;
        position: absolute;
    }

    .checkmark {
        background-color: var(--figma-color-bg);
        border: 1px solid var(--figma-color-border);
    }

    .container:hover .checkmark {
        border: 1px solid var(--figma-color-border-strong);
    }

    .checkmark.checked {
        background-color: var(--figma-color-bg-success);
    }
</style>
<script>
  import { createEventDispatcher } from "svelte";

  import Checkbox from "../Inputs/Checkbox.svelte";
  import HoverIcon from "../Inputs/HoverIcon.svelte";

  const dispatch = createEventDispatcher();

  export let applyHtags = false;
  export let applyStyleNames = false;
  export let includeGoogleFonts = false;
  export let showVariablesButton = false;
  export let styleTextSegments = false;
</script>

<div class="w-full flex flex-col gap-2">
    <Checkbox bind:value={styleTextSegments} bind:checked={styleTextSegments} label="Style text segments" on:change={() => dispatch("changeConfig")} />
    <Checkbox bind:value={applyStyleNames} bind:checked={applyStyleNames} label="Include Figma styles as classes" on:change={() => dispatch("changeConfig")} />
    <Checkbox bind:value={applyHtags} bind:checked={applyHtags} label="Convert header styles to <h> tags" on:change={() => dispatch("changeConfig")} />
    <Checkbox bind:value={includeGoogleFonts} bind:checked={includeGoogleFonts} label="Include Google fonts" on:change={() => dispatch("changeConfig")} />
    {#if showVariablesButton}
    <HoverIcon text={true} on:onClick={() => dispatch("writeVariables")}>
              <i class="mr-2 text-xs fa-sharp fa-solid fa-text" />
              <p class="m-0 text-xs">Generate variable text</p>
            </HoverIcon>
    {/if}
</div>

<style>
  .input-row {
    display: flex;
    justify-content: flex-start;
    width: 100%;
  }

  .toggle-button {
    border: none !important;
    background-color: var(--figma-color-bg-secondary) !important;
    color: var(--figma-color-text) !important;
  }

  .toggle-button.active {
    border: 2px solid var(--figma-color-bg-success) !important;
  }
</style>

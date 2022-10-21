<script>
  import { createEventDispatcher } from "svelte";
  import HoverIcon from "../Inputs/HoverIcon.svelte";

  const dispatch = createEventDispatcher();

  export let border = true;
  export let expanded = false;
  export let title;

  const toggleExpanded = () => {
    expanded = !expanded;
    dispatch("changeView");
  };
</script>

<div class="w-full p-4" class:panel={border}>
  <div class="flex items-center justify-between transition-all cursor-pointer hover:opacity-80">
    <div class="flex items-center gap-4" on:click={toggleExpanded}>
      {#if expanded}
        <HoverIcon>
          <i class="fa-sharp fa-solid fa-caret-down" />
        </HoverIcon>
      {:else}
        <HoverIcon>
          <i class="fa-sharp fa-solid fa-caret-right" />
        </HoverIcon>
      {/if}
      <h3 class="text-base font-bold">{title}</h3>
    </div>
    <slot name="button" />
  </div>

  {#if expanded}
    <div class="mt-4">
      <slot />
    </div>
  {/if}
</div>

<style>
  .panel {
    border-bottom: 1px solid var(--figma-color-border);
  }
</style>

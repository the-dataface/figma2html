<script>
  import { createEventDispatcher } from "svelte";

  export let text = false;

  const dispatch = createEventDispatcher();

  const onClick = () => {
    dispatch("onClick");
  };
</script>

<div
  class="flex items-center justify-center py-4 px-[11px] cursor-pointer h-4 transition-all rounded-full"
  class:aspect-square={!text}
  on:click={onClick}
>
  <slot />
</div>

<style>
  div {
    background-color: var(--figma-color-bg);
  }

  div:hover {
    background-color: var(--figma-color-bg-secondary);
  }
</style>

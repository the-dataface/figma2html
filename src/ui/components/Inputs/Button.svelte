<script>
  import { createEventDispatcher } from "svelte";

  const dispatch = createEventDispatcher();
</script>

<div on:click={() => dispatch("click")}>
  <slot />
</div>

<style>
  div {
    display: flex;
    flex-direction: row;
    align-items: center;
    border: none;
    background: none;
    color: var(--figma-color-text-secondary);
    cursor: pointer;
    font-size: 11px;
    white-space: nowrap;
  }

  div p {
    margin-left: -4px;
  }

  div:hover {
    color: var(--figma-color-text) !important;
    border: none !important;
    background: none !important;
  }

  div svg {
    fill: var(--figma-color-text);
  }

  div:hover svg {
    fill: var(--figma-color-text-secondary);
  }
</style>

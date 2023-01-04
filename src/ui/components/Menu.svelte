<script>
  import { slide } from "svelte/transition";
</script>

<div class="menu-pane" transition:slide>
  <a href="https://github.com/the-dataface/figma2html" target="_blank">
    <div class="menu-row">
      <i class="mr-2 text-xs fa-sharp fa-solid fa-location-question" />
      About
    </div>
  </a>
  <a href="https://github.com/the-dataface/figma2html/issues" target="_blank">
    <div class="menu-row">
      <i class="mr-2 text-xs fa-sharp fa-solid fa-triangle-exclamation" />
      Report Issue
    </div>
  </a>
</div>

<style>
  .menu-pane {
    position: fixed;
    bottom: 52px;
    right: 8px;
    display: flex;
    flex-direction: column;
    /* border: 1px solid var(--figma-color-text-secondary); */
    border: 1px solid var(--figma-color-border);
    border-radius: 8px;
    background-color: var(--figma-color-bg);
  }

  .menu-row {
    display: flex;
    align-items: center;
    padding: 8px;
    font-size: 14px;
    color: var(--figma-color-text);
  }

  .menu-row:hover {
    color: var(--figma-color-text-secondary);
  }
</style>

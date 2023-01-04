<script>
  import { createEventDispatcher } from "svelte";

  import Menu from "./Menu.svelte";
  import HoverIcon from "./Inputs/HoverIcon.svelte";

  export let nodeCount = 0;

  const dispatch = createEventDispatcher();

  let menuOpen = false;

  const onToggleMenu = () => (menuOpen = !menuOpen);

  const onExport = () => dispatch("export");
  const onSave = () => dispatch("save");
  const onLoad = () => dispatch("load");
  const onReset = () => dispatch("reset");
</script>

<div class="footer fixed bottom-0 left-0 w-full h-12 flex justify-between items-center z-20">
  <div class="h-full flex items-center gap-2">
    <button class="primary" disabled={nodeCount === 0} on:click={onExport}>Export {nodeCount > 0 ? nodeCount + 1 : 0} assets</button>
    
    <HoverIcon text={true} on:click={onReset}>
      <button class="secondary" on:click={onReset}>
        <i class="mr-2 fa-sharp fa-solid fa-rotate" />
        <p class="m-0">Reset to defaults</p>
      </button>
    </HoverIcon>

    <HoverIcon text={true} on:click={onSave}>
      <button class="secondary" on:click={onSave}>
        <i class="mr-2 fa-sharp fa-solid fa-floppy-disk" />
        <p class="m-0">Save settings</p>
      </button>
    </HoverIcon>

    <HoverIcon text={true} on:click={onLoad}>
      <button class="secondary" on:click={onLoad}>
        <i class="mr-2 fa-sharp fa-solid fa-file-import" />
        <p class="m-0">Load settings</p>
      </button>
    </HoverIcon>
  </div>
  <button class="ellipses" on:click={onToggleMenu}>
    <i class="mx-2 fa-sharp fa-solid fa-ellipsis" />
  </button>
</div>

{#if menuOpen}
  <Menu />
{/if}

<style>
  .footer {
    border-top: 1px solid var(--figma-color-border);
    background: var(--figma-color-bg);
  }

  .footer button {
    height: 100%;
    color: var(--figma-color-text);
    padding: 0;
    display: flex;
    align-items: center;
    flex-wrap: none;
    cursor: pointer;
    background: none;
    border-radius: 0;
    border: none;
  }

  .footer button:hover {
    opacity: 0.8;
  }

  .footer button.primary {
    padding: 8px 16px;
    background: var(--figma-color-bg-success);
    color: var(--figma-color-bg);
    font-weight: bold;
  }

  :global(.figma-dark .footer button.primary) {
    color: var(--figma-color-text) !important;
  }

  .footer button.primary:disabled {
    cursor: not-allowed;
    background: var(--figma-color-bg-secondary) !important;
  }

  .footer button.secondary {
    font-size: 11px;
    color: var(--figma-color-text-secondary);
  }

  .footer button.secondary p {
    margin-left: -4px;
  }

  .footer button.secondary:hover {
    opacity: 0.8;
  }

  .footer button.ellipses {
    padding: 8px 8px;
    border-left: 1px solid var(--figma-color-border);
  }
</style>
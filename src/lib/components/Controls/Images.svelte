<script>
  import { createEventDispatcher } from "svelte";

  import Input from "../Inputs/Input.svelte";
  import SelectMenu from "../Inputs/SelectMenu.svelte";
  import TextArea from "../Inputs/TextArea.svelte";

  const dispatch = createEventDispatcher();

  export let altText = undefined;
  export let extension = undefined;
  export let extensionOptions = [];
  export let imagePath = undefined;
  export let scale = undefined;
  export let scaleOptions = [];
</script>

<div class="w-full flex flex-col gap-2">
  <div class="flex gap-2">
    <div class="flex-grow">
      <div class="flex justify-between items-center text-[10px] mt-2 mb-2.5">
        <h5 class="m-0 text-xs">Scale</h5>
      </div>
      <div class="input-row">
        <div class="w-full" class:disabled={extension.value === "SVG"}>
          <SelectMenu
            menuItems={scaleOptions}
            bind:value={scale}
            on:change={() => dispatch("changeConfig")}
            disabled={extension.value === "SVG"}
          />
        </div>
      </div>
    </div>
    <div class="flex-grow">
      <div class="flex justify-between items-center text-[10px] mt-2 mb-2.5">
        <h5 class="m-0 text-xs">Format</h5>
      </div>
      <div class="input-row">
        <div class="w-full">
          <SelectMenu menuItems={extensionOptions} bind:value={extension} on:change={() => dispatch("changeConfig")} />
        </div>
      </div>
    </div>
  </div>

  <div>
    <div class="flex justify-between items-center text-[10px] mt-2 mb-2.5">
      <h5 class="m-0 text-xs">Path</h5>
    </div>
    <div class="input-row">
      <div class="w-full">
        <Input
          bind:value={imagePath}
          placeholder="Enter an image path to include in your export."
          on:change={() => dispatch("changeConfig")}
        />
      </div>
    </div>
  </div>

  <div>
    <div class="flex justify-between items-center text-[10px] mt-2 mb-2.5">
      <h5 class="m-0 text-xs">Alt text</h5>
    </div>
    <div class="input-row">
      <div class="w-full">
        <TextArea
          bind:value={altText}
          placeholder="Enter alternate text to apply to your images."
          on:change={() => {
            console.log("here");
            dispatch("changeConfig");
          }}
        />
      </div>
    </div>
  </div>
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

  .disabled {
    pointer-events: none;
    opacity: 0.5;
    cursor: not-allowed;
  }
</style>

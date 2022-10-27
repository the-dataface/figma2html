<script>
  import { createEventDispatcher } from "svelte";

  import Checkbox from "../Inputs/Checkbox.svelte";
  import Input from "../Inputs/Input.svelte";
  import TextArea from "../Inputs/TextArea.svelte";

  const dispatch = createEventDispatcher();

  export let centerHtmlOutput = false;
  export let clickableLink = undefined;
  export let customScript = undefined;
  export let fluid = false;
  export let includeResizer = false;
  export let maxWidth = undefined;

  $: console.log(customScript);
</script>

<div class="w-full flex flex-col gap-2">
  <Checkbox
    bind:value={includeResizer}
    bind:checked={includeResizer}
    label="Include resizer script"
    on:change={() => dispatch("changeConfig")}
  />
  <Checkbox
    bind:value={centerHtmlOutput}
    bind:checked={centerHtmlOutput}
    label="Center HTML output"
    on:change={() => dispatch("changeConfig")}
  />
  <Checkbox
    bind:value={fluid}
    bind:checked={fluid}
    label="Fluid container width"
    on:change={() => dispatch("changeConfig")}
  />

  <div class="flex gap-2">
    <div class="flex-grow">
      <div class="flex justify-between items-center text-[10px] mt-2 mb-2.5">
        <h5 class="m-0 text-xs">Add max width (px)</h5>
      </div>
      <div class="input-row">
        <div class="w-full">
          <Input
            bind:value={maxWidth}
            placeholder="Enter a max width for the images."
            on:change={() => dispatch("changeConfig")}
          />
        </div>
      </div>
    </div>
  </div>

  <div>
    <div class="flex justify-between items-center text-[10px] mt-2 mb-2.5">
      <h5 class="m-0 text-xs">Clickable link</h5>
    </div>
    <div class="input-row">
      <div class="w-full">
        <Input
          bind:value={clickableLink}
          placeholder="Enter a link to apply to the full image."
          on:change={() => dispatch("changeConfig")}
        />
      </div>
    </div>
  </div>

  <div>
    <div class="flex justify-between items-center text-[10px] mt-2 mb-2.5">
      <h5 class="m-0 text-xs">Custom script</h5>
    </div>
    <div class="input-row">
      <div class="w-full">
        <TextArea
          bind:value={customScript}
          placeholder="Enter a custom script to be included in the exported HTML file here."
          on:change={() => dispatch("changeConfig")}
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
</style>

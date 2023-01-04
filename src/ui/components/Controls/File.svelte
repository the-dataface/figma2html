<script>
  import { createEventDispatcher } from "svelte";
  import slugify from "slugify";

  import Checkbox from "../Inputs/Checkbox.svelte";
  import Input from "../Inputs/Input.svelte";
  import SelectMenu from "../Inputs/SelectMenu.svelte";

  const dispatch = createEventDispatcher();

  export let fileType = undefined;
  export let menuItems = [];
  export let syntax = undefined;
  export let testingMode = false;
  export let errorMessage = "";

  const validateFileName = (fileName) => {
    if (fileName === "") {
      errorMessage = "File name cannot be empty";
      dispatch("sendError");
      return;
    }
    // if (fileName.includes("/")) {
    //   errorMessage = "File name cannot contain '/'";
    //   dispatch("sendError");
    //   return;
    // }
    syntax = slugify(fileName, { lower: true, strict: true, remove: /[*+~.()'"!:@]/g });
    dispatch("changeConfig");
    return;
  };
</script>

<div class="w-full flex flex-col gap-2">
  <div>
    <div class="flex justify-between items-center text-[10px] mt-2 mb-2.5">
      <h5 class="m-0 text-xs">File name</h5>
      {#if !syntax || syntax === ""}
        <div class="flex items-center gap-1 text-red-600 text-xs">
          <i class="fa-sharp fa-solid fa-circle-exclamation" />
          <p class="text-xs">Required</p>
        </div>
      {/if}
    </div>
    <div class="input-row">
      <div class="w-full">
        <Input
          bind:value={syntax}
          placeholder="Enter a file name"
          on:change={() => validateFileName(syntax)}
          className={syntax === "" ? "required" : ""}
        />
      </div>
    </div>
  </div>

  <div>
    <div class="flex justify-between items-center text-[10px] mt-2 mb-2.5">
      <h5 class="m-0 text-xs">File type</h5>
    </div>
    <div class="input-row">
      <div class="w-full">
        <SelectMenu bind:menuItems bind:value={fileType} on:change={() => dispatch("changeConfig")} />
      </div>
    </div>
  </div>

  <div class="mt-2">
    <Checkbox
      bind:value={testingMode}
      bind:checked={testingMode}
      label="Testing mode"
      on:change={() => dispatch("changeConfig")}
    />
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

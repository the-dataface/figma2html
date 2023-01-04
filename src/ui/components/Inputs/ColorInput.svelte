<script>
  import { createEventDispatcher } from "svelte";
  import chroma from "chroma-js";
  import stringToHex from "lib/utils/stringToHex";

  export let id = null;
  export let value = null;
  export let name = null;
  export let borders = false;
  export let disabled = false;
  export let invalid = false;
  export let errorMessage = "Please enter a valid color";
  export let placeholder = "Input something here...";
  export { className as class };

  const dispatch = createEventDispatcher();

  let className = "";
  let isInvalid;

  const onChange = () => {
    if (value) value = stringToHex(value);
    isInvalid = !chroma.valid(value);

    dispatch("change");
  };
</script>

<div class="wrapper">
  <div class="input {className}">
    <div class="relative icon">
      <input class="opacity-0" type="color" bind:value on:change {disabled} class:disabled />
      <div
        class="absolute w-4 h-4 transform -translate-x-1/2 -translate-y-1/2 border rounded-full pointer-events-none dot top-1/2 left-1/2"
        style:background-color={value}
      />
    </div>
    <input
      type="input"
      on:input
      on:change={onChange}
      on:keydown
      on:focus
      on:blur
      bind:value
      {id}
      {name}
      {disabled}
      {placeholder}
      {errorMessage}
      class="indent"
      class:borders
      class:invalid
      class:disabled
    />
  </div>
  {#if isInvalid}
    <div class="error">
      {errorMessage}
    </div>
  {/if}
</div>

<style>
  .disabled {
    opacity: 0.5 !important;
  }

  .input {
    position: relative;
    transition: flex 0s 0.2s;
  }

  input[type="color"] {
    border: none !important;
    outline: none !important;
    padding: 0 !important;
    height: 28px !important;
    width: 24px !important;
    margin-left: 2px;
  }

  .dot {
    border: 1px solid 1px solid var(--figma-color-border-secondary);
  }

  input {
    font-size: var(--font-size-xsmall);
    font-weight: var(--font-weight-normal);
    letter-spacing: var(--font-letter-spacing-neg-xsmall);
    line-height: var(--line-height);
    position: relative;
    display: flex;
    overflow: visible;
    align-items: center;
    width: 100%;
    height: 30px;
    margin: 1px 0 1px 0;
    padding: var(--size-xxsmall) var(--size-xxxsmall) var(--size-xxsmall) var(--size-xxsmall);
    color: var(--black8);
    border: 1px solid transparent;
    border-radius: var(--border-radius-small);
    outline: none;
    background-color: var(--white);
  }
  input:hover,
  input:placeholder-shown:hover {
    color: var(--black8);
    border: 1px solid var(--black1);
    background-image: none;
  }
  input::selection {
    color: var(--black);
    background-color: var(--blue3);
  }
  input::placeholder {
    color: var(--black3);
    border: 1px solid transparent;
  }
  input:placeholder-shown {
    color: var(--black8);
    border: 1px solid var(--black1);
    background-image: none;
  }
  input:focus:placeholder-shown {
    border: 1px solid var(--blue);
    outline: 1px solid var(--blue);
    outline-offset: -2px;
  }
  input:disabled:hover {
    border: 1px solid transparent;
  }
  input:active,
  input:focus {
    color: var(--black);
    border: 1px solid var(--blue);
    outline: 1px solid var(--blue);
    outline-offset: -2px;
  }
  input:disabled {
    position: relative;
    color: var(--black3);
    background-image: none;
  }
  input:disabled:active {
    outline: none;
  }

  .borders {
    border: 1px solid var(--black1);
    background-image: none;
  }
  .borders:disabled {
    border: 1px solid transparent;
    background-image: none;
  }
  .borders:disabled:placeholder-shown {
    border: 1px solid transparent;
    background-image: none;
  }
  .borders:disabled:placeholder-shown:active {
    border: 1px solid transparent;
    outline: none;
  }
  .borders:placeholder-shown {
    border: 1px solid var(--black1);
    background-image: none;
  }

  .indent {
    padding-left: 32px;
  }

  .invalid,
  .invalid:hover,
  .invalid:focus {
    border: 1px solid var(--red);
    outline: 1px solid var(--red);
    outline-offset: -2px;
  }

  .icon {
    margin-left: 4px;
    position: absolute;
    top: -1px;
    left: 0;
    width: var(--size-medium);
    height: var(--size-medium);
    z-index: 1;
    opacity: 1 !important;
  }

  .error {
    color: var(--red);
    font-size: var(--font-size-xsmall);
    font-weight: var(--font-weight-normal);
    letter-spacing: var(--font-letter-spacing-neg-xsmall);
    line-height: var(--line-height);
    padding-top: var(--size-xxxsmall);
    padding-left: var(--size-xxsmall);
  }

  /* ////////////////////// */
  /* .color-input {
    display: flex;
    margin-top: 8px;
    border: 1px solid var(--figma-color-border);
    height: 36px;
  }

  .color-input:hover {
    border: 1px solid var(--figma-color-border-strong);
  }

  .color-input:focus {
    outline: 1px solid var(--figma-color-border-selected);
  }

  .color-input input {
    border: none !important;
  }

  input[type="color"] {
    width: 32px !important;
    height: 32px !important;
    border: none !important;
  } */
</style>

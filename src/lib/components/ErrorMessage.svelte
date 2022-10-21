<script>
  import { fade } from "svelte/transition";
  import { Icon, IconWarning } from "figma-plugin-ds-svelte";

  export let errorMessage;
</script>

<div class="error-message" transition:fade>
  <Icon iconName={IconWarning} color="red" />
  {errorMessage}
</div>

<style>
  .error-message {
    background: red;
    border-radius: 3px;
    box-shadow: 0px 0px 13.5155px rgba(0, 0, 0, 0.05);
    position: fixed;
    z-index: 99;
    bottom: 32px;
    left: 50%;
    transform: translate(-50%, 0);
    display: flex;
    flex-direction: row;
    align-items: center;
    padding: 4px 16px 4px 8px;
    color: white;
    font-size: 12px;
    font-weight: 500;
  }
</style>

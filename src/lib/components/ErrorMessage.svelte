<script>
  import { fade } from "svelte/transition";

  export let errorMessage;
</script>

<div class="error-message flex gap-2 items-center" transition:fade>
  <i class="fa-sharp fa-solid fa-triangle-exclamation" />
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
    padding: 4px 16px 4px 8px;
    color: white;
    font-size: 12px;
    font-weight: 500;
  }
</style>

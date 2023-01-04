<script>
  import { fade } from "svelte/transition";
</script>

<div class="overlay absolute top-0 left-0 w-full h-full min-h-[200px] bg-white z-[999]" out:fade>
  <div class="absolute -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2">
    <i class="mr-2 text-xl fa-sharp fa-solid fa-spin fa-spinner-third" />
  </div>
</div>

<style>
  .overlay {
    background-color: rgb(255, 255, 255);
  }

  :global(.figma-dark .overlay) {
    background-color: rgb(44, 44, 44) !important;
  }
</style>

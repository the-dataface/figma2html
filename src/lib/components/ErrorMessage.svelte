<script lang="ts">
	import { getContext } from 'svelte';
	import { fly } from 'svelte/transition';
	import { backOut } from 'svelte/easing';
	import { AlertTriangleIcon } from 'svelte-feather-icons';

	const { error } = getContext('App');
</script>

<div
	class="flex items-center gap-2 bg-figma-bg-danger rounded fixed bottom-16 right-4 z-50 py-2 px-2.5 text-white text-sm font-bold w-max max-w-xs mx-auto"
	style:box-shadow="0px 0px 13.5155px rgba(0, 0, 0, 0.05)"
	transition:fly={{ x: 320, duration: 400, easing: backOut }}
>
	<AlertTriangleIcon size="18" class="flex-none" />
	<div class="flex-1">
		{$error.message}
	</div>
</div>

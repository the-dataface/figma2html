<script>
	import { getContext } from 'svelte';
	import { fly } from 'svelte/transition';
	import { backOut } from 'svelte/easing';
	import { AlertTriangleIcon } from 'svelte-feather-icons';

	const { error } = getContext('App');
</script>

<div
	class="fixed bottom-16 right-4 z-50 mx-auto flex w-max max-w-xs items-center gap-2 rounded bg-figma-bg-danger py-2 px-2.5 text-sm font-bold text-white"
	style:box-shadow="0px 0px 13.5155px rgba(0, 0, 0, 0.05)"
	transition:fly={{ x: 320, duration: 400, easing: backOut }}
>
	<AlertTriangleIcon size="18" class="flex-none" />
	<div class="flex-1">
		{$error.message}
	</div>
</div>

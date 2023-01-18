<script lang="ts">
	import { Maximize2Icon } from 'svelte-feather-icons';

	let resizing = false;

	const resizeWindow = (e) => {
		if (!resizing) return;
		const [w, h] = [e.clientX, e.clientY].map((d) => Math.max(50, Math.floor(d + 5)));
		parent.postMessage({ pluginMessage: { type: 'resize', size: { w, h } } }, '*');
	};

	const resizeUp = () => {
		resizing = false;
		window.removeEventListener('mousemove', resizeWindow, true);
		window.removeEventListener('mouseup', null);
	};

	const resizeDown = (e) => {
		resizing = true;
		window.addEventListener('mousemove', resizeWindow, true);
		window.addEventListener('mouseup', resizeUp, true);
	};
</script>

<div
	id="resize"
	class="flex h-full cursor-se-resize items-center justify-center overflow-hidden border-l border-solid border-figma-border p-2 text-figma-text hover:text-figma-text-secondary active:text-figma-text-tertiary"
	on:mousedown={resizeDown}
	on:mouseup={resizeUp}
>
	<Maximize2Icon size="16" class="rotate-90" />
</div>

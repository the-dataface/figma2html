import trim from 'lib/utils/trim';

export default (containerId, isSvelte) => {
	// The resizer function is embedded in the HTML page -- external variables must
	// be passed in.

	const resizer = (containerId) => {
		if (!('querySelector' in document)) return;

		const elementInView = (el) => {
			const bounds = el.getBoundingClientRect();

			return bounds.top < window.innerHeight && bounds.bottom > 0;
		};

		const updateImgSrc = (img) => {
			const src = img.getAttribute('data-src');

			if (src && img.getAttribute('src') != src)
				img.setAttribute('src', src);
		};

		const onIntersectionChange = (entries) => {
			const isIntersecting = entries.reduce(
				(memo, entry) => memo || entry.isIntersecting,
				false
			);

			if (isIntersecting) {
				waiting = false;
				update();
			}
		};

		const selectChildren = (selector, parent) =>
			parent
				? Array.prototype.slice.call(parent.querySelectorAll(selector))
				: [];

		// based on underscore.js
		const throttle = (func, wait) => {
			let timeout = null;
			let previous = 0;

			const run = () => {
				previous = Date.now();
				timeout = null;
				func();
			};

			return function () {
				const remaining = wait - (Date.now() - previous);

				if (remaining <= 0 || remaining > wait) {
					clearTimeout(timeout);
					run();
				} else if (!timeout) {
					timeout = setTimeout(run, remaining);
				}
			};
		};

		const update = () => {
			const frames = selectChildren(
				`.${nameSpace}artboard:where([data-min-width],[data-max-width])`,
				container
			);

			const width = Math.round(container.offsetWidth);

			// Set frame visibility based on container width
			frames.forEach(function (el) {
				let minwidth = el.getAttribute('data-min-width');
				let maxwidth = el.getAttribute('data-max-width');

				if (
					+minwidth <= width &&
					(+maxwidth >= width || maxwidth === null)
				) {
					if (!waiting)
						selectChildren(`.${nameSpace}f2h-img`, el).forEach(
							updateImgSrc
						);
					el.style.display = 'block';
				} else {
					el.style.display = 'none';
				}
			});

			// Initialize lazy loading on first call
			if (waiting && !observer) {
				if (elementInView(container)) {
					waiting = false;
					update();
				} else {
					observer = new IntersectionObserver(onIntersectionChange, {
						rootMargin: '400px 400px',
					});
					observer.observe(container);
				}
			}
		};

		const container = document.getElementById(containerId);
		const onResize = throttle(update, 200);
		const nameSpace = '';

		let waiting = !!window.IntersectionObserver;
		let observer;

		update();

		document.addEventListener('DOMContentLoaded', update);
		window.addEventListener('resize', onResize);
	};

	// convert resizer function to JS source code
	const resizerJs = `(${trim(
		resizer.toString().replace(/ {2}/g, '\t')
	)})("${containerId}", {namespace: "", setup: window.setupInteractive || window.getComponent});`;

	if (isSvelte)
		return `<script>\n\t import { onMount } from 'svelte'; \n\t onMount(() => {\n\t\t${resizerJs}\n\t\t});\n</script>`;
	else return `<script>\n\t ${resizerJs}\n </script>`;
};

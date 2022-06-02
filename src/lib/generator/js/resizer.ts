import trim from 'lib/utils/trim';

export default (containerId, isSvelte) => {
	// The resizer function is embedded in the HTML page -- external variables must
	// be passed in.

	const resizer = (containerId) => {
		if (!('querySelector' in document)) return;

		const elementInView = (el) => {
			let bounds = el.getBoundingClientRect();

			return bounds.top < window.innerHeight && bounds.bottom > 0;
		};

		const updateImgSrc = (img) => {
			let src = img.getAttribute('data-src');

			if (src && img.getAttribute('src') != src) {
				img.setAttribute('src', src);
			}
		};

		const onIntersectionChange = (entries) => {
			let isIntersecting = entries.reduce(function (memo, entry) {
				return memo || entry.isIntersecting;
			}, false);

			if (isIntersecting) {
				waiting = false;

				update();
			}
		};

		const selectChildren = (selector, parent) => {
			return parent
				? Array.prototype.slice.call(parent.querySelectorAll(selector))
				: [];
		};

		// based on underscore.js
		const throttle = (func, wait) => {
			let timeout = null,
				previous = 0;

			function run() {
				previous = Date.now();
				timeout = null;
				func();
			}

			return function () {
				let remaining = wait - (Date.now() - previous);

				if (remaining <= 0 || remaining > wait) {
					clearTimeout(timeout);
					run();
				} else if (!timeout) {
					timeout = setTimeout(run, remaining);
				}
			};
		};

		const update = () => {
			let frames = selectChildren(
					'.' + nameSpace + 'artboard[data-min-width]',
					container
				),
				width = Math.round(container.getBoundingClientRect().width);

			// Set frame visibility based on container width
			frames.forEach(function (el) {
				let minwidth = el.getAttribute('data-min-width'),
					maxwidth = el.getAttribute('data-max-width');

				if (
					+minwidth <= width &&
					(+maxwidth >= width || maxwidth === null)
				) {
					if (!waiting)
						selectChildren('.' + nameSpace + 'f2hImg', el).forEach(
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

		let container = document.getElementById(containerId);

		let nameSpace = '';
		let onResize = throttle(update, 200);
		let waiting = !!window.IntersectionObserver;
		let observer;

		update();

		document.addEventListener('DOMContentLoaded', update);
		window.addEventListener('resize', onResize);
	};

	let optStr =
		'{namespace: "' +
		'' +
		'", setup: window.setupInteractive || window.getComponent}';

	// convert resizer function to JS source code
	let resizerJs =
		'(' +
		trim(resizer.toString().replace(/ {2}/g, '\t')) + // indent with tabs
		')("' +
		containerId +
		'", ' +
		optStr +
		');';

	if (isSvelte)
		return `<script>\n\timport { onMount } from 'svelte';\n\tonMount(() => {\n\t\t${resizerJs}\n\t\t});\n</script>`;
	else return `<script>\n\t${resizerJs}\n</script>`;
};

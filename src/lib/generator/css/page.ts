export default ({ containerId, config, frameCss }) => {
	const id = `#${containerId}`;
	const selectors = {};

	// add max-width to styles
	selectors[id] = {
		'max-width': config.maxWidth ? `${config.maxWidth}px` : 'none',
		margin: config.centerHtmlOutput ? '0 auto' : '0',
	};

	// add clickable link base styles
	if (config.clickableLink !== '')
		selectors[`${id} .f2h-link`] = {
			cursor: 'pointer',
		};

	// default <p> styles
	selectors[`${id} p, ${id} .body`] = { margin: '0' };

	// image placement
	selectors[`${id} .f2h-img`] = {
		width: '100% !important',
		top: '0',
	};

	selectors[`${id} .f2h-symbol`] = {
		'box-sizing': 'border-box',
	};

	selectors[`${id} :where(.frame, .f2h-text, .f2h-symbol)`] = {
		position: 'absolute',
	};

	selectors[`${id} :where(.f2h-link, .f2h-img)`] = {
		display: 'block',
	};

	let computedStyles = Object.entries(selectors)
		.map(([selector, properties]) => {
			return `\t${selector} { ${Object.entries(properties)
				.map(([property, value]) => `\n\t\t${property}: ${value};`)
				.join('')}\n\t}`;
		})
		.join('\n\n');

	computedStyles += `\n\n${frameCss}`;

	return computedStyles;
};

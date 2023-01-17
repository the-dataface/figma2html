export default ({ id, config, css }) => {
	const hashID = `#${id}`;
	const selectors = {};

	// add max-width to styles
	selectors[hashID] = {
		'max-width': config.maxWidth ? `${config.maxWidth}px` : 'none',
		margin: config.centered ? '0 auto' : '0'
	};

	// center content
	if (config.centered) {
		selectors[`${hashID} .f2h-frame`] = {
			margin: '0 auto'
		};
	}

	// default <p> styles
	selectors[`${hashID} p, ${hashID} .body`] = { margin: '0' };

	// image placement
	selectors[`${hashID} .f2h-img`] = {
		width: '100% !important',
		top: '0'
	};

	selectors[`${hashID} .f2h-symbol`] = {
		'box-sizing': 'border-box'
	};

	selectors[`${hashID} :where(.frame, .f2h-text, .f2h-symbol)`] = {
		position: 'absolute'
	};

	selectors[`${hashID} :where(.f2h-link, .f2h-img)`] = {
		display: 'block'
	};

	const computedStyles =
		Object.entries(selectors)
			.map(
				([selector, properties]) =>
					`\t${selector} { ${Object.entries(properties)
						.map(([property, value]) => `\n\t\t${property}: ${value};`)
						.join('')}\n\t}`
			)
			.join('\n\n') + `\n\n${css}`;

	return computedStyles;
};

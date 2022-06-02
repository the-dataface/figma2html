import dashify from 'lib/utils/dashify';

export default (textFrames, frameWidth, frameHeight) => {
	const styleProps = [
		'fontName',
		'fontSize',
		'textDecoration',
		'textCase',
		'lineHeight',
		'letterSpacing',
		'fills',
		'textStyleId',
		'fillStyleId',
		'listOptions',
		'indentation',
		'hyperlink',
	];

	// return array of text frame style + class data
	return textFrames.map((textFrame) => {
		let elClass;
		let customClasses;

		const segments = textFrame.getStyledTextSegments(styleProps);
		const styleId = textFrame.textStyleId;
		const styleObject = figma.getStyleById(styleId);

		if (styleId && typeof styleId !== 'symbol' && styleObject)
			elClass = dashify(styleObject.name.split('/')[0]);

		// turn f2h-class=x, y, z into an array
		if (textFrame.name.startsWith('f2h-class='))
			customClasses = textFrame.name
				.replace('f2h-class=', '')
				.replaceAll(/[\[\]]/g, '')
				.split(',')
				.map((value) => value.trim());

		return {
			customClasses,
			class: elClass,
			segments,
			x: `${(textFrame.x / frameWidth) * 100}% `,
			y: `${(textFrame.y / frameHeight) * 100}% `,
			width:
				textFrame.textAutoResize === 'WIDTH_AND_HEIGHT'
					? 'auto'
					: `${textFrame.width}px`,
			opacity: textFrame.opacity,
			rotation: textFrame.rotation * -1,
			effect: textFrame.effects,
		};
	});
};

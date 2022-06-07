import dashify from 'lib/utils/dashify';
import styleProps from 'lib/generator/styleProps';

export default (textFrames, frameWidth, frameHeight) => {
	const props = [
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
		let textSegments = [];

		let segments = textFrame.getStyledTextSegments(props);
		const styleId = textFrame.textStyleId;
		const styleObject = figma.getStyleById(styleId);

		segments.forEach((seg, i) => {
			// get styles object from included props
			const stylesObject = styleProps.styles(seg, props).stylesObject,
				styleString = styleProps.styles(seg, props).styleString;

			// is this segment's style the same as the first segment's style, except for font weight and font style?
			const isBaseStyle = i === 0 ? true :
				stylesObject["font-family"] === textSegments[0].stylesObject["font-family"] &&
				stylesObject["font-size"] === textSegments[0].stylesObject["font-size"] &&
				stylesObject["letter-spacing"] === textSegments[0].stylesObject["letter-spacing"] &&
				stylesObject["color"] === textSegments[0].stylesObject["color"] &&
				stylesObject["line-height"] === textSegments[0].stylesObject["line-height"] &&
				stylesObject["mix-blend-mode"] === textSegments[0].stylesObject["mix-blend-mode"] &&
				stylesObject["text-decoration"] === textSegments[0].stylesObject["text-decoration"] &&
				stylesObject["text-transform"] === textSegments[0].stylesObject["text-transform"];

			// is this segment's font-weight 700 (bold) (only if isBaseStyle is false)?
			const isBold = isBaseStyle && stylesObject["font-weight"] === 700;

			// is this segment's font-weight neither 400 or 700 (only if isBaseStyle is false)?
			const isOtherWeight = isBaseStyle && stylesObject["font-weight"] !== 400 && stylesObject["font-weight"] !== 700 ? stylesObject["font-weight"] : false;

			// is this segment's font-style italic (only if isBaseStyle is false)?
			const isItalic = isBaseStyle && stylesObject["font-style"] === "italic";

			textSegments.push({
				characters: seg.characters,
				start: seg.start,
				end: seg.end,
				hyperlink: seg.hyperlink,
				listOptions: seg.listOptions,
				stylesObject,
				styleString,
				isBaseStyle,
				isBold,
				isOtherWeight,
				isItalic
			});
		});

		if (styleId && typeof styleId !== 'symbol' && styleObject)
			elClass = dashify(styleObject.name.split('/')[0]);

		// turn f2h-class=x, y, z into an array
		if (textFrame.name.startsWith('f2h-class='))
			customClasses = textFrame.name
				.replace('f2h-class=', '')
				.replaceAll(/[\[\]]/g, '')
				.split(',')
				.map((value) => value.trim());

		// get base style and change font-weight to 400 and style to normal
		const baseStyle = textSegments[0].styleString.replace('font-weight: 700', 'font-weight: 400').replace('font-style: italic', 'font-style: normal');

		return {
			customClasses,
			class: elClass,
			segments: textSegments,
			baseStyle,
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

import dashify from 'lib/utils/dashify';
import styleProps from 'lib/generator/styleProps';
import trim from 'lib/utils/trim';

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
	return textFrames.map((textFrame, i) => {
		let elClass = ``;
		let elId = `f2h-text-${i}`;
		let customClasses;
		let textSegments = [];
		let customAttributes = [];
		let x, y;
		let translateX, translateY;

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
			elClass += ` ${dashify(styleObject.name.split('/')[styleObject.name.split('/').length - 1])}`

		// get base style and change font-weight to 400 and style to normal
		const tag = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].includes(
			trim(elClass)
		) ? trim(elClass) : 'p';
		const baseStyle = { tag, style: textSegments[0].styleString.replace('font-weight: 700', 'font-weight: 400').replace('font-style: italic', 'font-style: normal'); }

		// turn layer name into custom attributes if it starts with [f2h]
		if (textFrame.name.startsWith('[f2h]')) {
			let layerName = textFrame.name.replace('[f2h]', '');
			let attributes = layerName.split(';');

			attributes.forEach(attr => {
				customAttributes.push({
					key: attr.split(':')[0],
					value: attr.split(':')[1].split(',').map(v => v.trim())
				});
			});
		}

		// get x positioning based on horizontal alignment
		if (textFrame.textAlignHorizontal === "LEFT") {
			x = (textFrame.x / frameWidth) * 100;
			translateX = 0;
		} else if (textFrame.textAlignHorizontal === "CENTER") {
			x = ((textFrame.x + textFrame.width / 2) / frameWidth) * 100;
			translateX = -50;
		} else if (textFrame.textAlignHorizontal === "RIGHT") {
			x = ((textFrame.x + textFrame.width) / frameWidth) * 100;
			translateX = -100;
		} else if (textFrame.textAlignHorizontal === "JUSTIFIED") {
			x = (textFrame.x / frameWidth) * 100;
			translateX = 0;
		}

		// get y positioning based on vertical alignment
		if (textFrame.textAlignVertical === "TOP") {
			y = (textFrame.y / frameHeight) * 100;
			translateY = 0;
		} else if (textFrame.textAlignVertical === "MIDDLE") {
			y = ((textFrame.y + textFrame.height / 2) / frameHeight) * 100;
			translateY = -50;
		} else if (textFrame.textAlignVertical === "BOTTOM") {
			y = ((textFrame.y + textFrame.height) / frameHeight) * 100;
			translateY = -100;
		}

		return {
			customClasses,
			customAttributes,
			class: elClass,
			elId,
			segments: textSegments,
			baseStyle,
			x: `${x}% `,
			y: `${y}% `,
			horizontalAlignment: textFrame.textAlignHorizontal,
			verticalAlignment: textFrame.textAlignVertical,
			width:
				textFrame.textAutoResize === 'WIDTH_AND_HEIGHT'
					? 'auto'
					: `${textFrame.width}px`,
			opacity: textFrame.opacity,
			translate: `${translateX}%, ${translateY}%`,
			rotation: textFrame.rotation * -1,
			effect: textFrame.effects,
		};
	});
};

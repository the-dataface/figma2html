import slugify from 'slugify';
import styleProps from 'lib/generator/styleProps';

// fields to check against the root. all of these would need to match original
const baseStyleFields = [
	'font-family',
	'font-size',
	'letter-spacing',
	'color',
	'line-height',
	'mix-blend-mode',
	'text-decoration',
	'text-transform'
];

export default (textFrames: TextNode[], artboard: FrameNode) => {
	// return array of text frame style + class data
	let frames = [];

	textFrames.forEach((textFrame, i) => {
		const elId = `f2h-text-${i}`;
		const textSegments = [];
		const customAttributes = {};

		let elClass = ``;
		let customClasses: string;
		let x = 0;
		let y = 0;
		let translateX = 0;
		let translateY = 0;

		// check all fields
		const segments = textFrame.getStyledTextSegments([
			'fontName',
			'fontWeight',
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
			'hyperlink'
		]) as StyledTextSegment[];

		let styleid: TextStyle;

		if (typeof textFrame.textStyleId !== 'symbol' && textFrame.textStyleId) {
			styleid = figma?.getStyleById(textFrame.textStyleId) as TextStyle;
		}

		let tag = 'p';

		const baseStyle = segments[0]
			? styleProps.styles(segments[0]).string.replace('font-weight: 700', 'font-weight: 400')
			: '';

		segments.forEach((seg, i) => {
			// get styles object from included props
			const styles = styleProps.styles(seg);

			// is this segment's style the same as the first segment's style, except for font weight and font style?
			const isBaseStyle =
				!i ||
				!new Set(
					baseStyleFields.map(
						(key) => styles.object[key] === textSegments?.[0]?.styles?.object[key]
					)
				).has(false);

			// is this segment's font-weight 700 (bold) (only if isBaseStyle is false)?
			const isBold = isBaseStyle && styles.object['font-weight'] === 700;

			// is this segment's font-weight neither 400 or 700 (only if isBaseStyle is false)?
			const isOtherWeight =
				isBaseStyle && styles.object['font-weight'] !== 400 && styles.object['font-weight'] !== 700
					? styles.object['font-weight']
					: false;

			// is this segment's font-style italic (only if isBaseStyle is false)?
			const isItalic = isBaseStyle && styles.object['font-style'] === 'italic';

			textSegments.push({
				characters: seg.characters,
				start: seg.start,
				end: seg.end,
				hyperlink: seg.hyperlink,
				listOptions: seg.listOptions,
				styles,
				isBaseStyle,
				isBold,
				isOtherWeight,
				isItalic
			});
		});

		if (styleid?.name && typeof styleid.name !== 'symbol')
			elClass += ` ${slugify(styleid.name.split('/').slice(-1)[0], {
				lower: true,
				strict: true
			})}`;

		// turn layer name into custom attributes if it starts with [f2h]
		if (textFrame.name.startsWith('[f2h]')) {
			const attributesString = textFrame.name.replace('[f2h]', '').trim();
			const attributes = attributesString.split(/\s+(?=\w+=)/);

			for (const attribute of attributes) {
				const [k, v] = attribute.split('=');

				const key = k.trim();
				let value = v.trim();

				// account for optional starting/ending quots
				if (value.startsWith('"') || value.startsWith("'")) {
					value = value.slice(1, -1).trim();
				}

				if (value.endsWith('"') || value.endsWith("'")) {
					value = value.slice(0, -1).trim();
				}

				// if key is tag, set tag and continue
				if (key === 'tag') {
					tag = value;
					continue;
				}

				// otherwise, count as attribute
				customAttributes[key] = value;
			}
		}

		// get x positioning based on horizontal alignment
		switch (textFrame.textAlignHorizontal) {
			case 'JUSTIFIED':
			case 'LEFT':
				x = (textFrame.x / artboard.width) * 100;
				translateX = 0;
				break;
			case 'CENTER':
				x = (textFrame.x / artboard.width + +(textFrame.width / artboard.width) / 2) * 100;
				translateX = -50;
				break;
			case 'RIGHT':
				x = ((textFrame.x + textFrame.width) / artboard.width) * 100;
				translateX = -100;
				break;
		}

		// get y positioning based on vertical alignment
		switch (textFrame.textAlignVertical) {
			case 'TOP':
				y = (textFrame.y / artboard.height) * 100;
				translateY = 0;
				break;
			case 'CENTER':
				y = ((textFrame.y + textFrame.height / 2) / artboard.height) * 100;
				translateY = -50;
				break;
			case 'BOTTOM':
				y = ((textFrame.y + textFrame.height) / artboard.height) * 100;
				translateY = -100;
				break;
		}

		frames.push({
			node: textFrame,
			tag,
			customClasses,
			customAttributes,
			class: elClass,
			elId,
			segments: textSegments,
			baseStyle,
			x: `${x.toFixed(2)}%`,
			y: `${y.toFixed(2)}%`,
			horizontalAlignment: textFrame.textAlignHorizontal,
			verticalAlignment: textFrame.textAlignVertical,
			width:
				textFrame.textAutoResize === 'WIDTH_AND_HEIGHT'
					? 'auto'
					: `${textFrame.width.toFixed(2)}px`,
			opacity: textFrame.opacity,
			translate: `${translateX}%, ${translateY}%`,
			rotation: textFrame.rotation * -1,
			effect: textFrame.effects
		});
	});

	return frames;
};

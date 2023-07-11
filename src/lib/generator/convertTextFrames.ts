import slugify from 'slugify';

import styleProps from 'lib/generator/styleProps';
import trim from 'lib/utils/trim';

// const isFrameVisible = (frame) => {
// 	while (frame.parent) {
// 		if (!frame.visible || frame.opacity === 0) return false;
// 		if (frame.parent.type === 'PAGE') return true;
// 		frame = frame.parent;
// 	}
// 	return true;
// };

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

const hTag = new Set(['h1', 'h2', 'h3', 'h4', 'h5', 'h6']);

export default (textFrames: TextNode[], artboard: FrameNode) => {
	// return array of text frame style + class data
	let frames = [];

	textFrames.forEach((textFrame, i) => {
		// if (!isFrameVisible(textFrame)) {
		// 	log(`Skipping hidden text frame ${textFrame.name}`, textFrame);
		// 	return;
		// }

		const elId = `f2h-text-${i}`;
		const textSegments = [];
		const customAttributes = [];

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

		// get base style and change font-weight to 400 and style to normal
		const tag = hTag.has(trim(elClass)) ? trim(elClass) : 'p';

		const baseStyle = {
			tag,
			style: styleProps
				.styles(segments[0])
				.string.replace('font-weight: 700', 'font-weight: 400')
				.replace('font-style: italic', 'font-style: normal')
		};

		console.log({ baseStyle }, textSegments);

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
			const layerName = textFrame.name.replace('[f2h]', '');
			const attributes = layerName.split(';');
			attributes.forEach((attr) => {
				const [key, value] = attr.split(':');
				customAttributes.push({
					key: key,
					value: value.split(',').map((v: string) => v.trim())
				});
			});
		}

		const artboardWidth = artboard.absoluteBoundingBox.x + artboard.absoluteBoundingBox.width;
		const artboardHeight = artboard.absoluteBoundingBox.y + artboard.absoluteBoundingBox.height;

		// textFrame.absoluteBoundingBox.x /
		// 	(artboard.absoluteBoundingBox.x + artboard.absoluteBoundingBox.width);

		// get x positioning based on horizontal alignment
		switch (textFrame.textAlignHorizontal) {
			case 'JUSTIFIED':
			case 'LEFT':
				x = (textFrame.absoluteBoundingBox.x / artboardWidth) * 100;
				translateX = 0;
				break;
			case 'CENTER':
				x =
					(textFrame.absoluteBoundingBox.x / artboardWidth +
						+(textFrame.width / artboard.width) / 2) *
					100;
				translateX = -50;
				break;
			case 'RIGHT':
				x = ((textFrame.absoluteBoundingBox.x + textFrame.width) / artboardWidth) * 100;
				translateX = -100;
				break;
		}

		// get y positioning based on vertical alignment
		switch (textFrame.textAlignVertical) {
			case 'TOP':
				y = (textFrame.absoluteBoundingBox.y / artboardHeight) * 100;
				translateY = 0;
				break;
			case 'CENTER':
				y = ((textFrame.absoluteBoundingBox.y + textFrame.height / 2) / artboardHeight) * 100;
				translateY = -50;
				break;
			case 'BOTTOM':
				y = ((textFrame.absoluteBoundingBox.y + textFrame.height) / artboardHeight) * 100;
				translateY = -100;
				break;
		}

		frames.push({
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

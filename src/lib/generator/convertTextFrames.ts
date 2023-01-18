import slugify from 'slugify';
import styleProps from 'lib/generator/styleProps';
import trim from 'lib/utils/trim';

// https://www.figma.com/plugin-docs/api/properties/TextNode-getstyledtextsegments/#fields
const fields = [
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
];

const hTag = new Set(['h1', 'h2', 'h3', 'h4', 'h5', 'h6']);

export default (textFrames, frameWidth: number, frameHeight: number) => {
	// return array of text frame style + class data
	return textFrames.map((textFrame, i: number) => {
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
		const segments = textFrame.getStyledTextSegments(fields) as StyledTextSegment[];

		const styleid = figma.getStyleById(textFrame.textStyleId) as TextStyle;

		segments.forEach((seg, i) => {
			// get styles object from included props
			const styles = styleProps.styles(seg);

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

			// is this segment's style the same as the first segment's style, except for font weight and font style?
			const isBaseStyle =
				!i ||
				!new Set(
					baseStyleFields.map((key) => styles.object[key] === textSegments[0].styles.object[key])
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

		// get base style and change font-weight to 400 and style to normal
		const tag = hTag.has(trim(elClass)) ? trim(elClass) : 'p';

		const baseStyle = {
			tag,
			style: textSegments[0].styles.string
				.replace('font-weight: 700', 'font-weight: 400')
				.replace('font-style: italic', 'font-style: normal')
		};

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

		// get x positioning based on horizontal alignment
		switch (textFrame.textAlignHorizontal) {
			case 'JUSTIFIED':
			case 'LEFT':
				x = (textFrame.x / frameWidth) * 100;
				translateX = 0;
				break;
			case 'CENTER':
				x = ((textFrame.x + textFrame.width / 2) / frameWidth) * 100;
				translateX = -50;
				break;
			case 'RIGHT':
				x = ((textFrame.x + textFrame.width) / frameWidth) * 100;
				translateX = -100;
				break;
		}

		// get y positioning based on vertical alignment
		switch (textFrame.textAlignVertical) {
			case 'TOP':
				y = (textFrame.y / frameHeight) * 100;
				translateY = 0;
				break;
			case 'CENTER':
				y = ((textFrame.y + textFrame.height / 2) / frameHeight) * 100;
				translateY = -50;
				break;
			case 'BOTTOM':
				y = ((textFrame.y + textFrame.height) / frameHeight) * 100;
				translateY = -100;
				break;
		}

		return {
			customClasses,
			customAttributes,
			class: elClass,
			elId,
			segments: textSegments,
			baseStyle,
			x: `${x.toFixed(2)}% `,
			y: `${y.toFixed(2)}% `,
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
		};
	});
};

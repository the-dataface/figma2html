export const fontList = [];

// TODO: shouldn't this use our stringify function?
export const styles = (segment: StyledTextSegment) => {
	if (!segment) return;

	fontList.push(segment.fontName);

	let color: string = undefined;
	let mixBlendMode: string = undefined;

	if (segment.fills.length) {
		const [fill] = segment.fills as SolidPaint[];
		const [r, g, b] = [fill.color.r, fill.color.g, fill.color.b].map((color) =>
			Math.round(color * 255)
		);
		color = `rgba(${r}, ${g}, ${b}, ${fill.opacity})`;
		mixBlendMode = fill.blendMode.toLowerCase();
	}

	const object = {
		'font-family': segment.fontName.family,
		'font-style': segment.fontName.style.includes('Italic') ? 'italic' : 'normal',
		'font-weight': segment.fontWeight,
		'font-size': segment.fontSize + 'px',
		'text-decoration': segment.textDecoration.toLowerCase(),
		'text-transform': segment.textCase === 'ORIGINAL' ? 'none' : segment.textCase.toLowerCase(),
		'line-height':
			segment.lineHeight.unit === 'AUTO'
				? 'normal'
				: segment.lineHeight.unit === 'PERCENT' && segment.lineHeight.value > 0
				? segment.lineHeight.value / 100
				: segment.lineHeight.value + 'px',
		'letter-spacing':
			segment.letterSpacing.unit === 'PERCENT' && segment.letterSpacing.value > 0
				? segment.letterSpacing.value / 100
				: segment.letterSpacing.value + 'px',
		color,
		'mix-blend-mode': mixBlendMode
	};

	return {
		object,
		string: Object.entries(object)
			.filter((d) => d[0] && d[1])
			.map(([key, value]) => `${key}: ${value};`)
			.join(' ')
	};
};

export default { fontList, styles };

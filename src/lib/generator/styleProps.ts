export const convert = (prop, value) => {
	if (prop === 'fontName') {
		// add font family to array for google fonts
		if (fontList.indexOf(value) < 0) fontList.push(value);

		return ` font-family: ${value.family}; font-weight: ${
			value.style === 'Bold' || value.style === 'Bold Italic'
				? 'bold'
				: 'normal'
		}; font-style: ${
			value.style === 'Italic' || value.style === 'Bold Italic'
				? 'italic'
				: 'normal'
		};`;
	}
	if (prop === 'fontSize') return ` font-size: ${value}px;`;
	if (prop === 'textDecoration')
		return ` text-decoration: ${value.toLowerCase()};`;
	if (prop === 'textCase')
		return ` text-transform: ${
			value === 'ORIGINAL' ? 'none' : value.toLowerCase()
		};`;
	if (prop === 'lineHeight')
		return ` line-height: ${
			value.unit === 'AUTO'
				? 'normal'
				: value.unit === 'PERCENT' && value.value > 0
				? value.value / 100
				: value.value + 'px'
		};`;
	if (prop === 'letterSpacing')
		return ` letter-spacing: ${
			value.unit === 'PERCENT' && value.value > 0
				? value.unit / 100
				: value.value + 'px'
		};`;
	if (prop === 'fills' && value.length > 0)
		return ` color: rgba(${value[0].color.r * 255}, ${
			value[0].color.g * 255
		}, ${value[0].color.b * 255}, ${
			value[0].opacity
		}); mix-blend-mode: ${value[0].blendMode.toLowerCase()};`;
};

export const fontList = [];

export default { convert, fontList };

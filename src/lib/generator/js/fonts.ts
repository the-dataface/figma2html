export default (fontList) => {
	if (!fontList) return;

	let weightLookup = {
		Thin: 100,
		ExtraLight: 200,
		Light: 300,
		Regular: 400,
		Medium: 500,
		SemiBold: 600,
		Bold: 700,
		ExtraBold: 800,
		Black: 900,
	};

	// group fontList array by family
	let fontFamilies = [];
	fontList.forEach((font) => {
		let family = font.family,
			weight =
				font.style === 'Italic'
					? weightLookup['Regular']
					: weightLookup[font.style.replace(' Italic', '')],
			style = font.style.includes('Italic') ? '1,' : '0,',
			styleWeight = `${style}${weight}`;

		// if fontFamilies does not include an object with the family name equal to the font family, push an object with the family name equal to the font family and an array of all the unique font values
		if (!fontFamilies.some((f) => f.family === family)) {
			fontFamilies.push({ family, weights: [styleWeight] });
		} else {
			// if fontFamilies does include an object with the family name equal to the font family, push the font value to the array of values
			fontFamilies.forEach((f) => {
				if (f.family === family) {
					if (!f.weights.includes(styleWeight))
						f.weights.push(styleWeight);
				}
			});
		}
	});

	let families = '';
	fontFamilies.forEach((f) => {
		let name = `${f.family.replace(/\s/g, '+')}:ital,wght@`;

		families += `family=${name}${f.weights.sort().join(';')}&`;
	});

	let fontScript = `
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?${families}display=swap" rel="stylesheet">
  `;

	return fontScript;
};

export default (fontList) => {
	if (!fontList || fontList.length === 0) return;

	const weightLookup = {
		Thin: 100,
		ExtraLight: 200,
		Light: 300,
		Regular: 400,
		Medium: 500,
		SemiBold: 600,
		Bold: 700,
		ExtraBold: 800,
		Black: 900
	};

	// master list
	// group fontList array by family
	const typefaces = new Map<string, Set<string>>();

	for (const { family, style } of [...fontList]) {
		const googleStyle = style.includes('Italic') ? '1,' : '0,';
		const weight =
			style === 'Italic' ? weightLookup['Regular'] : weightLookup[style.replace(' Italic', '')];
		const styleWeight = `${googleStyle}${weight}`;

		// initiate a new Map/Set if the family doesn't exist already
		!typefaces.has(family)
			? typefaces.set(family, new Set([styleWeight]))
			: typefaces.get(family).add(styleWeight);
	}

	const urls = [...typefaces]
		.map(
			([typeface, variations]) =>
				`family=${typeface.replace(/\s/g, '+')}:ital,wght@${[...variations].sort().join(';')}`
		)
		.join('&');

	// 	let families = '';
	// 	fontFamilies.forEach((f) => {
	// 		let name = `${f.family.replace(/\s/g, '+')}:ital,wght@`;
	// 		families += `family=${name}${f.weights.sort().join(';')}&`;
	// 	});
	// 	let fontScript = `
	//   <link rel="preconnect" href="https://fonts.googleapis.com">
	//   <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
	//   <link href="https://fonts.googleapis.com/css2?${families}display=swap" rel="stylesheet">
	// `;

	// write a small script to append these directly to the head of the document.
	// we don't ship a <head> natively to all for embeds to be easier. this grabs the DOM's head
	return `<script>
	  const apiLink = document.createElement('link');
		apiLink.rel = 'preconnect';
		apiLink.href = 'https://fonts.googleapis.com';

		const gstaticLink = document.createElement('link');
		gstaticLink.rel = 'preconnect';
		gstaticLink.href = 'https://fonts.gstatic.com';
		gstaticLink.crossorigin = true

		const fontLink = document.createElement('link');
		fontLink.rel = 'stylesheet';
		fontLink.href = 'https://fonts.googleapis.com/css2?${urls}&display=swap';

		document.head.appendChild(apiLink);
		document.head.appendChild(gstaticLink);
		document.head.appendChild(fontLink);
	</script>`;
};

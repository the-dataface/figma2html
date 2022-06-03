export default (effects) => {
	let css = ``;

	const dropShadows = effects.filter(
		(effect) => effect.type === 'DROP_SHADOW' && effect.visible
	);

	if (dropShadows.length > 0) {
		let textShadow = `text-shadow: `;

		dropShadows.forEach((effect, i) => {
			const x = effect.offset.x;
			const y = effect.offset.y;
			const r = effect.radius;
			const rgba = `rgba(${effect.color.r * 255}, ${
				effect.color.g * 255
			}, ${effect.color.b * 255}, ${effect.color.a})`;
			const end = i < dropShadows.length - 1 ? `, ` : `; `;
			textShadow += `${x}px ${y}px ${r}px ${rgba}${end}`;
		});

		css += textShadow;
	}

	const layerBlurs = effects.filter(
		(effect) => effect.type === 'LAYER_BLUR' && effect.visible
	);

	if (layerBlurs.length > 0) {
		const blur = `-webkit-filter: blur(${layerBlurs[0].radius}px);\nfilter: blur(${layerBlurs[0].radius}px);`;
		css += blur;
	}

	return css;
};

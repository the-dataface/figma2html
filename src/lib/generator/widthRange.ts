export default (assets) => {
	const widthRange = { min: 0, max: 0, widths: [], ranges: [] };

	assets.forEach((asset) => {
		// let width = asset.node.width;
		const width = +asset.node.name.replace('#', '').replace('px', '');
		widthRange.widths.push(width);
	});

	// sort widthRange.widths
	widthRange.widths.sort((a, b) => a - b);

	widthRange.widths.forEach((width, i) => {
		const range = [];
		if (i == 0) {
			range.push(0, widthRange.widths[1] - 1);
		} else if (i < widthRange.widths.length - 1) {
			range.push(widthRange.widths[i], widthRange.widths[i + 1] - 1);
		} else if (i == widthRange.widths.length - 1) {
			range.push(width);
		}
		widthRange.ranges.push(range);
	});

	widthRange.max = Math.max(...widthRange.widths);

	return widthRange;
};

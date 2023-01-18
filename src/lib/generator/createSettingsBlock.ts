import type { Format, Scale, Size } from '../../types';

export default (config: {
	format: Format;
	scale: Scale;
	srcSize: Size;
}): { settings: ExportSettings; destSize?: Size } => {
	const { format, scale, srcSize } = config;

	// SVGs scale natively, hence the S!
	if (scale && format !== 'SVG') {
		return {
			settings: { format: format, constraint: { type: 'SCALE', value: +scale } },
			destSize: { w: srcSize.w * +scale, h: srcSize.h * +scale }
		};
	}

	return {
		settings: { format: format },
		destSize: srcSize
	};
};

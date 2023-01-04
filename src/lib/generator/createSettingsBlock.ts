import { Extension, FileType, Scale, Size } from '../../types';

export default (config: {
	extension: Extension;
	scale: Scale;
	srcSize: Size;
}): { settings: ExportSettings; destSize?: Size } => {
	const { extension, scale, srcSize } = config;

	if (scale && extension.value !== 'SVG') {
		const value = scale.value;
		return {
			settings: {
				format: extension.value,
				constraint: { type: 'SCALE', value }
			},
			destSize: {
				width: srcSize.width * value,
				height: srcSize.height * value
			}
		};
	} else {
		return {
			settings: {
				format: extension.value
			},
			destSize: srcSize
		};
	}
};

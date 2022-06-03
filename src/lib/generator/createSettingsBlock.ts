import { Extension, Size, FileType, Scale } from '../../types';

export default (config: {
	extension: Extension;
	scale: Scale;
	srcSize: Size;
}): { settings: ExportSettings; destSize?: Size } => {
	const { extension, scale, srcSize } = config;

	if (scale && extension !== 'SVG') {
		const value = scale;
		return {
			settings: {
				format: extension,
				constraint: { type: 'SCALE', value },
			},
			destSize: {
				width: srcSize.width * value,
				height: srcSize.height * value,
			},
		};
	} else {
		return {
			settings: {
				format: extension,
			},
			destSize: srcSize,
		};
	}
};

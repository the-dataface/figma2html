import timestamp from 'lib/utils/timestamp';

import frame from './frame';
import { fontList } from '../styleProps';

import css from 'lib/generator/css/index';
import js from 'lib/generator/js/index';
import widthRange from 'lib/generator/widthRange';

export default ({ config, assets, variables }) => {
	let html = ``;
	let containerId = `${config.syntax}-box`;

	let frameCss = assets
		.map(({ node, filename }) =>
			frame({
				node,
				filename,
				widthRange: widthRange(assets),
				altText: config.altText,
				config,
				variables,
			}).css
		)
		.join('\n\n');

	if (config.fileType.value === "html") {
		html += `<!-- Generated by figma2html on ${timestamp()} -->`;

		html += `\n\n<meta charset="UTF-8">`;

		html += `\n\n<style>\n${css.page({
			containerId,
			config,
			frameCss
		})}\n</style>`;

		html += `\n\n<div id="${containerId}" class="figma2html">`;

		html += `\n\t${assets
			.map(({ node, filename }) =>
				frame({
					node,
					filename,
					widthRange: widthRange(assets),
					altText: config.altText,
					config,
					variables,
				}).html
			)
			.join('\n\n')}`;

		html += `\n</div>`;

		if (config.includeResizer) html += `\n\n${js.resizer(containerId, false)}`;

		if (config.includeGoogleFonts && !!fontList.length)
			html += `\n\n${js.fonts(fontList)}`;

		if (config.customScript) html += `\n\n${config.customScript}`;

		html += `\n\n<!-- End figma2html generated content - ${timestamp()} -->`;
	} else if (config.fileType.value === "svelte") {
		if (config.includeResizer) html += `\t\t${js.resizer(containerId, true)}\n`;

		html += `<!-- Generated by figma2html on ${timestamp()} -->`;

		html += `\n\n<div id="${containerId}" class="figma2html">`;

		html += `\n\t${assets
			.map(({ node, filename }) =>
				frame({
					node,
					filename,
					widthRange: widthRange(assets),
					altText: config.altText,
					config,
					variables,
				}).html
			)
			.join('\n\n')}`;

		html += `\n</div>`;

		html += `\n\n<!-- End figma2html generated content - ${timestamp()} -->`;

		html += `\n\n<style>\n${css.page({
			containerId,
			config,
			frameCss
		})}\n</style>`;
	}

	return html;
};

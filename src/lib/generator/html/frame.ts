import roundTo from 'lib/utils/roundTo';
import stringify from 'lib/utils/stringify';

import css from 'lib/generator/css/index';
import span from './span';

import convertTextFrames from 'lib/generator/convertTextFrames';
import { createGroupsFromFrames } from 'lib/generator/group';

export default ({ node, filename, widthRange, altText, config, variables }) => {
	let inlineStyle = '';
	let html = ``;

	const frameId = node.id;
	const frameClass = `g-${frameId}`;
	const frameWidth = +node.name.replace('#', '').replace('px', '');
	const frameHeight = node.height;
	const frameContent = { html: '', css: '', js: '' };

	const id = `frame-${frameId.replace(':', '-')}`;
	const width = +node.name.replace('#', '').replace('px', '');
	const range = widthRange.ranges[widthRange.widths.indexOf(width)];
	const height = node.height;
	const aspectRatio = width / height;
	const extension = config.extension.toLowerCase();

	// find all frame nodes within the frame
	const allNodes = node.findAll((node) => node.type === 'FRAME');

	// convert all frames to groups for positioning
	const groups: GroupNode[] = createGroupsFromFrames(allNodes);

	// find all text nodes within the frame
	const textFrames = node.findAll((child) => child.type === 'TEXT');
	const textData = convertTextFrames(textFrames, node.width, frameHeight);

	// set layout mode to none
	node.layoutMode = 'NONE';
	node.clipsContent = true;

	// TO DO: fix this
	// inlineSpacerStyle = `padding: 0 0 ${ formatCssPct(height, width) } 0; `
	// export const formatCssPct = (height, width) => {
	// 	let pct = (height / width) * 100;
	// 	return pct.toFixed(2) + '%';
	// };

	html += `\n<!-- Frame: ${filename.split('/').slice(-1)} -->\n`;
	html += `\t<div ${stringify.attrs({
		id: id,
		class: `${frameClass.replace(':', '-')} frame artboard`,
		'data-aspect-ratio': roundTo(aspectRatio, 3),
		'data-min-width': range[0],
		'data-max-width': range[1],
		style: inlineStyle,
	})}>`;

	html += `\n\t\t<div ${stringify.attrs({
		class: 'spacer',
		style: stringify.styles({
			padding: '0 0 0 0',
			'min-width': width > 0 ? `${width}px` : 'auto',
			'max-width': range[1] ? `${range[1]}px` : 'none',
		}),
	})}></div>`;

	html += `\n\t\t<picture>\n\t\t\t<source ${stringify.attrs({
		srcset: filename + '.' + extension,
		type: 'image/' + extension,
	})}>\n\t\t\t<img ${stringify.attrs({
		id: 'img-' + id,
		class: 'f2h-img',
		alt: altText,
		'data-src': filename + '.' + extension,
		src: 'data:image/gif;base64,R0lGODlhCgAKAIAAAB8fHwAAACH5BAEAAAAALAAAAAAKAAoAAAIIhI+py+0PYysAOw==',
		loading: 'lazy',
	})}/>\n\t\t</picture>`;

	if (textData) {
		textData.forEach((text) => {
			let el = ``;

			let effect = '';
			if (!!text.effect.length) effect = css.textEffect(text.effect);

			// base styles
			const style = {
				top: text.y,
				left: text.x,
				opacity: text.opacity,
				width: text.width,
			};

			if (text.rotation !== 0) {
				style['transform'] = `rotate(${text.rotation}deg)`;
				style['transform-origin'] = 'left top';
			}

			let els = [];
			text.segments.forEach((segment, i) => {
				// did the last line end with a line break?
				const prevEndsNewLine =
					text?.segments[i - 1]?.characters.endsWith('\n');

				// does this line end with a line break?
				const thisEndsNewLine = segment?.characters.endsWith('\n');

				// does this line include a line break?
				const thisIncludesNewLine = segment?.characters.includes('\n');

				const notNewElement =
					!!i &&
					!prevEndsNewLine &&
					!(thisIncludesNewLine && !thisEndsNewLine);

				if (notNewElement) {
					els[els.length - 1].segments.push(segment);
				} else {
					els.push({
						tag:
							config.applyHtags &&
								['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].includes(
									text.class
								)
								? text.class
								: 'p',
						segments: [segment],
						newElement:
							!!i &&
							(!prevEndsNewLine ||
								(thisIncludesNewLine && !thisEndsNewLine)),
					});
				}
			});

			el += `<div class="f2h-text ${text.class}" style="${stringify.styles(
				style
			)} ${effect}">`;

			els.forEach((element, i) => {
				el += `\n<${element.tag} ${stringify.attrs({
					class: text.classes ? text.classes.join(' ') : '',
					style: text.baseStyle
				})}>`;

				element.segments.forEach((segment) => {
					el += span(segment, variables);
				});
				el += `</${element.tag}>\n`;
			});

			el += `</div>\n`;

			html += el;
		});
	}

	html += `\t</div>\n`;

	// TODO: something with the frame's css
	// css.frame(frame, frameId);

	return html;
};

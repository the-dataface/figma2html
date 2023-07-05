import convertTextFrames from 'lib/generator/convertTextFrames';
import css from 'lib/generator/css/index';
import roundTo from 'lib/utils/roundTo';
import stringify from 'lib/utils/stringify';
import trim from 'lib/utils/trim';

import span from './span';

export default ({ node, filename, widthRange, alt, config, variables }) => {
	let inlineStyle = '';

	const frameContent = { html: '', css: '', js: '' };

	const width = +node.name.match('#(.*)px')[1];
	const height = node.height;
	const aspectRatio = width / height;
	const [minWidth, maxWidth] = widthRange.ranges[widthRange.widths.indexOf(width)];

	const frameWidth = node.width;
	const frameHeight = node.height;
	const frameClass = `f2h-frame`;
	const id = `f2h-frame-${width}`;
	const format = config.format.toLowerCase();

	frameContent.css += `\t${css.frame(id)}`;

	// find all text nodes within the frame
	const textFrames = node.findAllWithCriteria({ types: ['TEXT'] });
	const textData = convertTextFrames(textFrames, frameWidth, frameHeight);

	// set layout mode to none
	node.layoutMode = 'NONE';
	node.clipsContent = true;

	// TO DO: fix this
	// inlineSpacerStyle = `padding: 0 0 ${ formatCssPct(height, width) } 0; `
	// export const formatCssPct = (height, width) => {
	// 	let pct = (height / width) * 100;
	// 	return pct.toFixed(2) + '%';
	// };

	// if responsiveness is fixed, set the width to the max width
	if (!config.fluid) inlineStyle += `width: ${width}px;`;

	frameContent.html += `\n\t<!-- Frame: ${filename.split('/').slice(-1)} -->\n`;
	frameContent.html += `\t<div ${stringify.attrs({
		id: id,
		class: `${frameClass.replace(':', '-')} frame artboard`,
		'data-aspect-ratio': roundTo(aspectRatio, 3),
		'data-min-width': minWidth,
		'data-max-width': maxWidth,
		style: inlineStyle
	})}>`;

	frameContent.html += `\n\t\t<div ${stringify.attrs({
		class: 'spacer',
		style: stringify.styles({
			padding: '0 0 0 0',
			'min-width': width > 0 ? `${width}px` : 'auto',
			'max-width': maxWidth ? `${maxWidth}px` : 'none'
		})
	})}></div>`;

	frameContent.html += `\n\t\t<picture>\n\t\t\t<img ${stringify.attrs({
		id: 'img-' + id,
		class: 'f2h-img',
		alt: alt,
		'data-src': filename + '.' + format,
		src: 'data:image/gif;base64,R0lGODlhCgAKAIAAAB8fHwAAACH5BAEAAAAALAAAAAAKAAoAAAIIhI+py+0PYysAOw==',
		loading: 'lazy',
		draggable: 'false',
		decoding: 'async',
		width: width.toFixed(2),
		height: height.toFixed(2)
	})}/>\n\t\t</picture>\n`;

	if (textData) {
		// make an array of the baseStyle property of each text node
		const baseStyles = textData.map((text) => text.baseStyle);

		// get the most frequent value in baseStyles and make pStyle equal to it
		const pStyle = baseStyles
			.sort(
				(a, b) =>
					baseStyles.filter((v) => v === a).length - baseStyles.filter((v) => v === b).length
			)
			.pop();

		// add pStyle to css
		if (config.styleTextSegments)
			if (pStyle?.style)
				frameContent.css += `\n\t#${id} ${pStyle.tag} { ${pStyle.style.replaceAll(
					'undefined',
					''
				)} }`;

		textData.forEach((text) => {
			let el = ``;
			// TODO: make elClass part of elAttributes
			let elClass = 'f2h-text';
			let elAttributes = '';

			let effect = '';
			if (text.effect.length > 0) effect = css.textEffect(text.effect);

			// base styles
			const style = {
				top: text.y,
				left: text.x,
				opacity: text.opacity,
				width: text.width
			};

			// if (text.rotation !== 0) {
			style['transform'] = `translate(${text.translate}) rotate(${text.rotation}deg)`;
			style['transform-origin'] = 'left top';
			style['text-align'] = text.horizontalAlignment.toLowerCase();
			// }

			const els = [];
			text.segments.forEach((segment, i) => {
				// did the last line end with a line break?
				const prevEndsNewLine = text.segments?.[i - 1]?.characters.endsWith('\n');

				// does this line end with a line break?
				const thisEndsNewLine = segment?.characters.endsWith('\n');

				// does this line include a line break?
				const thisIncludesNewLine = segment?.characters.includes('\n');

				const notNewElement = !!i && !prevEndsNewLine && !(thisIncludesNewLine && !thisEndsNewLine);

				if (notNewElement) els[els.length - 1].segments.push(segment);
				else {
					els.push({
						tag:
							config.applyHtags && ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].includes(trim(text.class))
								? trim(text.class)
								: 'p',
						segments: [segment],
						newElement: !!i && (!prevEndsNewLine || (thisIncludesNewLine && !thisEndsNewLine))
					});
				}
			});

			// if text.customAttributes array contains an object with key 'class', add it to the class
			text.customAttributes.forEach((attr) => {
				if (attr.key === 'class') elClass += ` ${attr.value.join(' ')}`;
				else elAttributes += ` ${attr.key}="${attr.value}"`;
			});

			el += `<div class="${elClass}" ${elAttributes} style="${stringify.styles(style)} ${effect}">`;

			els.forEach((element) => {
				el += `\n\t\t\t<${element.tag} ${stringify.attrs({
					class: `${text.elId} ${text.class} ${
						text.customClasses ? text.customClasses.join(' ') : ''
					}`
				})}>`;

				element.segments.forEach((segment) => {
					el += span(segment, variables, config.styleTextSegments);
				});

				el += `</${element.tag}>\n`;

				if (config.styleTextSegments) {
					// if text.baseStyle is not the same as pStyle, append text.baseStyle to frameContent.css
					if (text.baseStyle.style !== pStyle.style)
						frameContent.css += `\n\t#${id} .${text.elId}${text.class.replaceAll(
							' ',
							'.'
						)} { ${text.baseStyle.style.replaceAll('undefined', '')} }`;
				}
			});

			el += `\t\t</div>\n`;

			frameContent.html += el;
		});
	}

	frameContent.html += `\t</div>\n`;

	return frameContent;
};

import dashify from 'lib/utils/dashify';

import styleProps from 'lib/generator/styleProps';

export default (segment, applyStyles, applyStyleNames, variables) => {
	let el = ``;
	let textStyleObject;
	let textClass = '';
	let props = [
		'fontName',
		'fontSize',
		'textDecoration',
		'textCase',
		'lineHeight',
		'letterSpacing',
		'fills',
		'textStyleId',
		'fillStyleId',
		'listOptions',
		'indentation',
		'hyperlink',
	];
	let characters = segment.characters;

	// replace variable text
	if (variables) {
		Object.keys(variables).forEach((key) => {
			// replace all instances of the variable name with the value
			characters = characters.replaceAll(`{{${key}}}`, variables[key]);
		});
	}

	let styleTag = `style="`;

	if (applyStyles) {
		props.forEach((prop) => {
			if (segment[prop])
				styleTag += styleProps.convert(prop, segment[prop]);
		});
	}

	styleTag += `"`;

	if (segment.hyperlink)
		el += `\t\t<a href="${segment.hyperlink.value}" target="_blank">`;

	if (segment.textStyleId && typeof segment.textStyleId !== 'symbol') {
		textStyleObject = figma.getStyleById(segment.textStyleId);
		textClass = textStyleObject
			? dashify(textStyleObject.name.split('/').pop())
			: null;
	}

	el += `\t\t<span class="f2hsegment ${
		applyStyleNames ? textClass : ''
	}" ${styleTag}>${characters}</span>`;

	if (segment.hyperlink) el += `\t\t</a>`;

	return el;
};

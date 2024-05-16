import textNodeVariable from '../../utils/textNodeVariable';

// TODO: type these parametrs
export default (parentNode: TextNode, segment, variables: Variable, styleTextSegments) => {
	let el = ``;
	let characters = segment.characters;

	// replace variable text
	const parentTextNodeVariable = textNodeVariable(parentNode);

	if (variables && parentTextNodeVariable) {
		const keyedVariables = Object.fromEntries(
			Object.values(variables).map((d) => [d.key, d.value])
		);

		// string indicates the entire node is a variable
		if (typeof parentTextNodeVariable === 'string') {
			const variableValue = keyedVariables?.[parentTextNodeVariable];
			if (variableValue) {
				characters = variableValue;
			}
		}
		// array indicates a partial variable, where multiple can exist
		else if (Array.isArray(parentTextNodeVariable)) {
			for (let i = 0; i < parentTextNodeVariable.length; i++) {
				const variable = parentTextNodeVariable[i];
				const variableValue = keyedVariables?.[variable];
				if (variableValue) {
					characters = characters.replaceAll(`{{${variable}}}`, variableValue);
				}
			}
		}
	}

	// if segment has a hyperlink, add an a tag
	if (segment.hyperlink) el += `<a href="${segment.hyperlink.value}" target="_blank">`;

	// if segment.isBaseStyle is false, then add a span with inline styles
	if (!segment.isBaseStyle && styleTextSegments) el += `<span style="${segment.styles.string}">`;

	// if segment.isOtherWeight is not false, then add a span with inline styles
	if (segment.isOtherWeight && styleTextSegments)
		el += `<span style="font-weight: ${segment.isOtherWeight}">`;

	// if segment isItalic is true, add an i tag
	if (segment.isItalic) el += `<i>`;

	// if segment isBold is true, add a b tag
	if (segment.isBold) el += `<b>`;

	// add characters
	el += characters;

	// if segment isBold is true, close b tag
	if (segment.isBold) el += `</b>`;

	// if segment isItalic is true, close i tag
	if (segment.isItalic) el += `</i>`;

	// if segment.isOtherWeight is not false, then close span tag
	if (segment.isOtherWeight && styleTextSegments) el += `</span>`;

	// if segment.isBaseStyle is false, close span tag
	if (!segment.isBaseStyle && styleTextSegments) el += `</span>`;

	// if segment has a hyperlink, close a tag
	if (segment.hyperlink) el += `</a>`;

	return el;
};

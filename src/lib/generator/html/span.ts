export default (segment, variables) => {
	let el = ``;
	let characters = segment.characters;

	// replace variable text
	if (variables) {
		Object.keys(variables).forEach((key) => {
			// replace all instances of the variable name with the value
			characters = characters.replaceAll(`{{${key}}}`, variables[key]);
		});
	}

	// if segment has a hyperlink, add an a tag
	if (segment.hyperlink) el += `<a href="${segment.hyperlink.value}" target="_blank">`;

	// if segment.isBaseStyle is false, then add a span with inline styles
	if (!segment.isBaseStyle) el += `<span style="${segment.styleString}">`;

	// if segment.isOtherWeight is not false, then add a span with inline styles
	if (segment.isOtherWeight) el += `<span style="font-weight: ${segment.isOtherWeight}">`;

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
	if (segment.isOtherWeight) el += `</span>`;

	// if segment.isBaseStyle is false, close span tag
	if (!segment.isBaseStyle) el += `</span>`;

	// if segment has a hyperlink, close a tag
	if (segment.hyperlink) el += `</a>`;

	return el;
};

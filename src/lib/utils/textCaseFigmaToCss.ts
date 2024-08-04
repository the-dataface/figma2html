/**
 * Converts [Figma's TextCase][figma] values to [CSS text-transform][css]
 * values.
 *
 * [figma]: https://www.figma.com/plugin-docs/api/TextCase/
 * [css]: https://developer.mozilla.org/en-US/docs/Web/CSS/text-transform
 */
export default (textCase: TextCase) => {
	const textCaseMapping = {
		ORIGINAL: 'none',
		UPPER: 'uppercase',
		LOWER: 'lowercase',
		TITLE: 'capitalize',
		SMALL_CAPS: 'uppercase',
		SMALL_CAPS_FORCED: 'uppercase'
	} as Record<TextCase, string>;
	return textCaseMapping[textCase];
};

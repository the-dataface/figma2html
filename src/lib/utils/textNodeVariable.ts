export const regex = /^{{([^\s]+)}}$/;
export const partialRegex = /{{([^\s]+)}}/g;

export default (
	node: TextNode,
	options = { whole: true, partial: true }
): undefined | string | string[] => {
	const isText = node.type === 'TEXT';
	if (!isText) return undefined;

	// is the entire text node a variable? indicated by name
	if (options.whole) {
		const wholeVariableMatch = node.name.match(regex);
		if (wholeVariableMatch?.[1]) return wholeVariableMatch[1];
	}

	if (options.partial) {
		// or is a part of text node a variable? indicated by characters
		const partialVariableMatches = node.characters.matchAll(partialRegex);
		// iterate over to create arr of keys. Set to remove duplicates since we .replaceAll
		const partialVariableMatchesArr = [
			...new Set([...partialVariableMatches].map((d) => d?.slice(1)).flat())
		];
		if (partialVariableMatchesArr?.length > 0) return partialVariableMatchesArr;
	}

	return undefined;
};

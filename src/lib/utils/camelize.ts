export default (str: string): string =>
	str
		.replace(/(?:^\w|[A-Z]|\b\w)/g, (letter, index) => {
			return index == 0 ? letter.toLowerCase() : letter.toUpperCase();
		})
		.replace(/\s+/g, '');

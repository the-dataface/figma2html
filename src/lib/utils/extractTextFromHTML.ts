import * as htmlparser2 from 'htmlparser2';

export default (htmlString: string): string => {
	let texts = [];

	const parser = new htmlparser2.Parser({
		ontext(text) {
			texts.push(text);
		}
	});
	parser.write(htmlString);
	parser.end();

	return texts.join('');
};

export default (frame, frameId) => {
	const id = `#frame-${frameId.replace(':', '-')}`;
	const css = `${id} { position: relative; overflow: hidden; display: none; }\n`;
	return css;
};

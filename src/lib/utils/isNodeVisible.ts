import isFigma2htmlFrame from './isFigma2htmlFrame';

export default (node) => {
	while (node.parent) {
		if (!node.visible) return false;
		if (isFigma2htmlFrame(node.name) || node.parent.type === 'PAGE') return true;
		node = node.parent;
	}
	return true;
};

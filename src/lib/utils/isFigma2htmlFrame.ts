export default (node: FrameNode) => node.type === 'FRAME' && /^#\d+px/.test(node.name);

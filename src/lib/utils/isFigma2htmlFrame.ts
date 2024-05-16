export const regex = /^#\d+px$/;
export default (node: FrameNode): boolean => node.type === 'FRAME' && regex.test(node.name);

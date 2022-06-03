export const createGroupFromFrame = (
	frameNode: FrameNode
): GroupNode | null => {
	if (!frameNode || !frameNode.parent) return null;
	if (!Array.isArray(frameNode.children) || !frameNode.children.length)
		return null;

	const parent: any = frameNode.parent;
	if (parent.type === 'INSTANCE') return null;

	const group: GroupNode = figma.group(frameNode.children, parent);
	if (frameNode.name) group.name = frameNode.name;

	return group;
};

export const createGroupsFromFrames = (
	items: ReadonlyArray<SceneNode> | PageNode[]
): GroupNode[] => {
	const groups: GroupNode[] = [];
	if (!items.length) return groups;

	for (const node of items) {
		if (typeof (node as any).findAll !== 'function') continue;

		const group = createGroupFromFrame(node as FrameNode);
		if (group) {
			groups.push(group);
			if (!node.children.length) node.remove();
		}
	}

	return groups;
};

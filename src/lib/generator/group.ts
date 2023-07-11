export const createGroupFromFrame = (frameNode: FrameNode): GroupNode | null => {
	if (!frameNode || !frameNode.parent) return null;
	if (!Array.isArray(frameNode.children) || !frameNode.children.length) return null;

	const parent = frameNode.parent;
	if (parent.type === 'INSTANCE') return null;

	const group: GroupNode = figma.group(frameNode.children, parent);
	if (frameNode.name) group.name = frameNode.name;

	frameNode.remove();

	return group;
};

export const createGroupFromComponent = (componentNode: ComponentNode): GroupNode | null => {
	if (!componentNode || !componentNode.parent) return null;
	if (!Array.isArray(componentNode.children) || !componentNode.children.length) return null;

	const parent = componentNode.parent;
	if (parent.type === 'INSTANCE') return null;

	const group: GroupNode = figma.group(componentNode.children, parent);
	if (componentNode.name) group.name = componentNode.name;

	componentNode.remove();

	return group;
};

export const createGroupsFromFrames = (
	items: ReadonlyArray<FrameNode> | PageNode[]
): GroupNode[] => {
	const groups: GroupNode[] = [];
	if (!items.length) return groups;

	for (const node of items) {
		if (typeof node.findAll !== 'function') continue;

		const group = createGroupFromFrame(node as FrameNode);
		if (group) {
			groups.push(group);
			if (!node.children.length) node.remove();
		}
	}

	return groups;
};

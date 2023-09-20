import slugify from 'slugify';

import createSettingsBlock from 'lib/generator/createSettingsBlock';
import { createGroupFromComponent, createGroupFromFrame } from 'lib/generator/group';
import html from 'lib/generator/html/wrapper';
import isNodeVisible from 'lib/utils/isNodeVisible';
import log from 'lib/utils/log';

/**
 * ignore invisible nodes. speeds up document traversal
 * @see {@link https://www.figma.com/plugin-docs/api/properties/figma-skipinvisibleinstancechildren/|figma.skipInvisibleInstanceChildren}
 */
figma.skipInvisibleInstanceChildren = true;

/**
 * show the UI.
 * __html__ references the string in /manifest.json.
 * @see {@link https://www.figma.com/plugin-docs/api/global-objects/#html|Global Objects}
 * */
figma.showUI(__html__, { width: 560, height: 500, themeColors: true });

/** UTILS */
const isFrameExportable = (frameName: string): boolean => !!frameName.match(/^#\d+px$/);

/**
 * DEFAULT VARIABLES
 */
const defaults = {
	config: {
		filename: slugify(figma.currentPage.name, { lower: true, strict: true }),
		scale: '1',
		format: 'PNG',
		output: 'html',
		includeResizer: true,
		testingMode: false,
		maxWidth: null,
		fluid: true,
		centered: false,
		imagePath: 'figma2html/',
		alt: null,
		applyStyleNames: true,
		styleTextSegments: true,
		includeGoogleFonts: true,
		customScript: null
	} as Config,
	size: { w: 960, h: 500 } as Size,
	variables: {} as Variables,
	panels: {
		file: false,
		images: false,
		page: false,
		text: false,
		variables: false
	} as Panels
};

/**
 * STORED DATA
 * Interface with data in clientStorage
 * @see {@link https://www.figma.com/plugin-docs/api/figma-clientStorage/|ClientStorage}
 */
class Stored {
	/**
	 * PANELS.
	 * Sections of the UI to show/hide by default
	 */
	static panels = class {
		static get = async (): Promise<Panels> => {
			const panels = await figma.clientStorage.getAsync('panels');
			return panels ?? defaults.panels;
		};
		static set = async (panels: Panels): Promise<Panels> => {
			await figma.clientStorage.setAsync('panels', panels);
			return panels;
		};
		static clear = async (): Promise<void> => {
			await figma.clientStorage.deleteAsync('panels');
			Stored.panels.set(defaults.panels);
		};
	};

	/**
	 * SIZE
	 */
	static size = class {
		static get = async () => {
			const _size = await figma.clientStorage.getAsync('size');
			return _size ?? defaults.size;
		};

		static set = async (_size: { w: number; h: number }) => {
			await figma.clientStorage.setAsync('size', _size);
			return _size;
		};

		static clear = async (): Promise<void> => {
			await figma.clientStorage.deleteAsync('size');
			Stored.size.set(defaults.size);
		};
	};

	/**
	 * VARIABLES
	 */
	static variables = class {
		static frame = (): TextNode => variablesFrame;
		static toJSON = (text: string): Config | Variables => {
			const splitLines = text.split(/\n+(?=\S+:.*)/).filter((line) => line?.trim());
			const keyValuePairs = splitLines.map((line) => {
				const split = line?.trim()?.split(/:(.*)/s);
				if (!split) return;
				const uuid = Math.random().toString(36).substring(2, 15);
				const [key, value] = split;
				return [uuid, { key: key.trim(), value: value.trim() }];
			});
			const result = Object.fromEntries(keyValuePairs);
			return result as Variables;
		};
		static toString = (obj: Variables): string => {
			console.log(obj);
			return Object.entries(obj)
				.filter((d) => !!d[1].key.trim())
				.map(([, { key, value }]) => `${key}: ${value}`)
				.join('\n');
		};
		static get = async (): Promise<Variables> => {
			const characters = Stored.variables.frame().characters;
			if (characters) {
				const variables = Stored.variables.toJSON(characters) ?? {};
				Stored.variables.write(variables as Variables);

				figma.ui.postMessage({
					type: 'variables',
					variables: variables
				});

				return variables as Variables;
			} else {
				figma.ui.postMessage({
					type: 'variables',
					variables: {}
				});

				return defaults.variables;
			}
		};
		static write = async (variables = defaults.variables): Promise<void> => {
			figma.loadFontAsync({ family: 'Inter', style: 'Regular' }).then(() => {
				Stored.variables.frame().characters = Stored.variables.toString(variables);
			});

			figma.ui.postMessage({
				type: 'variables',
				variables: variables
			});
		};
		static clear = async (): Promise<void> => {
			await figma.clientStorage.deleteAsync('variables');
			Stored.variables.write(defaults.variables);
		};
	};

	/**
	 * CONFIG
	 */
	static config = class {
		static frame = (): TextNode => settingsFrame;
		static toJSON = (text: string): Config => {
			const splitLines = text.split(/\n+(?=\S+:.*)/).filter((line) => line?.trim());
			const keyValuePairs = splitLines.map((line) => {
				const split = line?.trim()?.split(/:(.*)/s);
				if (!split) return;
				const [key, value] = split;
				return [key.trim(), value.trim()];
			});
			const result = Object.fromEntries(keyValuePairs);
			return result as Config;
		};
		static toString = (obj: Config | Variables): string => {
			return Object.entries(obj)
				.map(([key, value]) => `${key}: ${value}`)
				.join('\n');
		};
		static get = async (): Promise<Config> => {
			const _config = await figma.clientStorage.getAsync('config');
			return _config || defaults.config;
		};

		static set = async (_config: Config): Promise<Config> => {
			await figma.clientStorage.setAsync('config', _config);
			return _config;
		};

		static clear = async (): Promise<void> => {
			await figma.clientStorage.deleteAsync('config');
			Stored.config.write(defaults.config);
		};

		// write the config to a text node on the current page
		static write = async (config = defaults.config): Promise<void> => {
			figma.loadFontAsync({ family: 'Inter', style: 'Regular' }).then(() => {
				Stored.config.frame().characters = Stored.config.toString(config);
			});

			figma.ui.postMessage({
				type: 'config',
				config: config
			});
		};

		// find text node named "settings" and load
		static load = async (): Promise<void> => {
			const characters = Stored.config.frame().characters;

			if (characters) {
				const config = Stored.config.toJSON(characters) as Config;
				await Stored.config.set(config);

				figma.ui.postMessage({
					type: 'config',
					config: config
				});
			}
		};
	};
}

class TempFrame {
	frame: FrameNode | undefined;

	create = () => {
		if (this.frame) {
			this.frame.remove();
			this.frame = undefined;
		}

		this.frame = figma.createFrame();
		this.frame.name = '[figma2html]';
		this.frame.clipsContent = false;
	};

	remove = () => {
		this.frame?.remove();
		this.frame = undefined;
	};
}

interface NewConfigFrame {
	name: string;
	x?: number;
	y?: number;
	text: Config | Variables;
	// eslint-disable-next-line no-unused-vars
	parser: (obj: Config | Variables) => string;
}

const newConfigFrame = ({ name, text, parser }: NewConfigFrame) => {
	const frameNode = figma.createFrame();
	frameNode.name = name;
	frameNode.locked = true;
	frameNode.primaryAxisSizingMode = 'AUTO';
	frameNode.counterAxisSizingMode = 'AUTO';
	frameNode.layoutMode = 'VERTICAL';
	frameNode.layoutGrow = 0;
	frameNode.layoutAlign = 'STRETCH';
	frameNode.layoutPositioning = 'AUTO';
	frameNode.paddingTop = 4;
	frameNode.paddingBottom = frameNode.paddingTop;
	frameNode.paddingLeft = 6;
	frameNode.paddingRight = frameNode.paddingLeft;
	frameNode.cornerRadius = 4;
	frameNode.fills = [{ type: 'SOLID', color: { r: 0.985, g: 0.985, b: 0.985 } }];
	frameNode.strokes = [{ type: 'SOLID', color: { r: 0.8, g: 0.8, b: 0.8 } }];

	const textNode = figma.createText();
	textNode.layoutGrow = 0;
	textNode.layoutAlign = 'STRETCH';
	textNode.layoutPositioning = 'AUTO';
	figma.loadFontAsync({ family: 'Inter', style: 'Regular' }).then(() => {
		textNode.characters = parser(text);
		textNode.textAutoResize = 'WIDTH_AND_HEIGHT';
	});
	frameNode.appendChild(textNode);

	return textNode;
};

let settingsFrame: TextNode;
let variablesFrame: TextNode;

// CONFIG GROUP + FRAMES
// write the config to a text node on the current page. users should not be able to edit this text node, but we have no way of locking them. We add a note to warn users and then add the settings + variables frames.
let configGroupNode: FrameNode = figma.currentPage.findChild(
	(node) => node.type === 'FRAME' && node.name === 'figma2html'
) as FrameNode;

if (configGroupNode) {
	// find settings frame in existing group
	settingsFrame = (
		configGroupNode.findChild(
			(node) => node.type === 'FRAME' && node.name === 'f2h-settings'
		) as FrameNode
	)?.children?.[0] as TextNode;

	// create new settings frame if there isn't one nested
	if (!settingsFrame) {
		settingsFrame = newConfigFrame({
			name: 'f2h-settings',
			text: defaults.config,
			parser: Stored.config.toString
		});
		configGroupNode.appendChild(settingsFrame.parent as FrameNode);
	}

	// find variables frame in existing group
	variablesFrame = (
		configGroupNode.findChild(
			(node) => node.type === 'FRAME' && node.name === 'f2h-variables'
		) as FrameNode
	)?.children?.[0] as TextNode;

	// create new variables frame if there isn't one nested
	if (!variablesFrame) {
		variablesFrame = newConfigFrame({
			name: 'f2h-variables',
			text: defaults.variables,
			parser: Stored.variables.toString
		});
		configGroupNode.appendChild(variablesFrame.parent as FrameNode);
	}
} else {
	const frameNode = figma.createFrame();
	frameNode.x = figma.currentPage.children.reduce((min, node) => Math.min(min, node.x), 0) - 450;
	frameNode.y = figma.currentPage.children.reduce((min, node) => Math.min(min, node.y), 0);
	frameNode.name = 'figma2html';
	frameNode.layoutMode = 'VERTICAL';
	frameNode.primaryAxisSizingMode = 'AUTO';
	frameNode.counterAxisSizingMode = 'FIXED';
	frameNode.paddingTop = 6;
	frameNode.paddingBottom = frameNode.paddingTop;
	frameNode.paddingLeft = 6;
	frameNode.paddingRight = frameNode.paddingLeft;
	frameNode.cornerRadius = 4;
	frameNode.itemSpacing = 12;
	frameNode.maxWidth = 400;
	frameNode.minWidth = frameNode.maxWidth;
	frameNode.strokes = [{ type: 'SOLID', color: { r: 0.8, g: 0.8, b: 0.8 } }];

	const figma2htmlTextNode = figma.createText();
	figma2htmlTextNode.name = 'FIGMA2HTML';
	figma.loadFontAsync({ family: 'Inter', style: 'Regular' }).then(() => {
		figma2htmlTextNode.characters = 'FIGMA2HTML';
		figma2htmlTextNode.textDecoration = 'UNDERLINE';
		figma2htmlTextNode.fontSize = 14;
		figma2htmlTextNode.letterSpacing = { value: 0.5, unit: 'PERCENT' };
	});
	figma2htmlTextNode.layoutGrow = 0;
	figma2htmlTextNode.layoutAlign = 'STRETCH';
	figma2htmlTextNode.layoutPositioning = 'AUTO';

	const textWarningNode = figma.createText();
	textWarningNode.name = 'WARNING';
	figma.loadFontAsync({ family: 'Inter', style: 'Regular' }).then(() => {
		textWarningNode.characters =
			'CAUTION: Do not edit or delete anything in this frame. Figma2html settings are stored here to enable cross-device collaboration.';
		textWarningNode.fills = [{ type: 'SOLID', color: { r: 1, g: 0, b: 0 } }];
		textWarningNode.layoutGrow = 0;
		textWarningNode.layoutAlign = 'STRETCH';
		textWarningNode.layoutPositioning = 'AUTO';
		textWarningNode.fontSize = 10;
	});

	const metaGroup = figma.createFrame();
	metaGroup.name = 'f2h-meta';
	metaGroup.primaryAxisSizingMode = 'AUTO';
	metaGroup.counterAxisSizingMode = 'AUTO';
	metaGroup.layoutMode = 'VERTICAL';
	metaGroup.itemSpacing = 6;
	metaGroup.layoutGrow = 0;
	metaGroup.layoutAlign = 'STRETCH';
	metaGroup.layoutPositioning = 'AUTO';

	metaGroup.appendChild(figma2htmlTextNode);
	metaGroup.appendChild(textWarningNode);

	// create variables frame, but first check if legacy versions exist

	const legacyVariablesFrame = figma.currentPage.findChild(
		(node) => node.type === 'FRAME' && node.name === 'f2h-variables'
	) as FrameNode;

	const legacyVariables = (legacyVariablesFrame?.children?.[0] as TextNode)?.characters;

	if (legacyVariables) legacyVariablesFrame.remove();

	const initVariables = legacyVariables
		? Stored.variables.toJSON(legacyVariables)
		: defaults.variables;

	variablesFrame = newConfigFrame({
		name: 'f2h-variables',
		text: initVariables,
		parser: Stored.variables.toString
	});

	figma.ui.postMessage({
		type: 'variables',
		variables: initVariables
	});

	// create settings frame, but first check if legacy versions exist

	const legacySettingsFrame = figma.currentPage.findChild(
		(node) => node.type === 'FRAME' && node.name === 'f2h-settings'
	) as FrameNode;

	const legacySettings = (legacySettingsFrame?.children?.[0] as TextNode)?.characters;

	if (legacySettings) legacySettingsFrame.remove();

	const initSettings = legacySettings ? Stored.config.toJSON(legacySettings) : defaults.config;

	settingsFrame = newConfigFrame({
		name: 'f2h-settings',
		text: initSettings,
		parser: Stored.config.toString
	});

	figma.ui.postMessage({
		type: 'config',
		config: initSettings
	});

	frameNode.appendChild(metaGroup);
	frameNode.appendChild(variablesFrame.parent as FrameNode);
	frameNode.appendChild(settingsFrame.parent as FrameNode);

	figma.currentPage.appendChild(frameNode);

	frameNode.locked = true;
	frameNode.visible = false;

	configGroupNode = frameNode;
}

// create a temporary frame to export
const tempFrame = new TempFrame();

const getExportables = (): Exportable[] => {
	const exportables: Exportable[] = [];

	// get all frames with names starting with "#" or that are the variables block
	figma.currentPage.findAll((node) => {
		const isFrame = node.type === 'FRAME';
		const isTopLevel = node.parent === figma.currentPage;

		if (!(isFrame && isFrameExportable(node.name) && isTopLevel)) return false;

		// add frame to exportables
		exportables.push({
			id: node.id,
			parentName: node.name,
			size: { w: node.width, h: node.height }
		});

		return true;
	});

	return exportables;
};

/** Create HTML file */
const getFile = async (
	config: Config,
	assets: Asset[],
	variables: Variables
): Promise<HTMLFile> => {
	return {
		filename: config.filename,
		output: config.output,
		data: html({ config, assets, variables })
	};
};

// TODO: clean up these declarations. values are immediately overwriten, making it hard to follow
const getAssets = async (
	exportables: readonly Exportable[],
	config: Config,
	previewSettings: PreviewSettings
): Promise<Asset[]> => {
	// create a temporary frame to export
	tempFrame.create();

	const assets: Asset[] = [];

	for (const exportable of exportables) {
		const asset: Asset = {
			filename: `${config.imagePath}${
				config.imagePath.endsWith('/') ? '' : '/'
			}${exportable.parentName.substring(1)}`,
			format: config.format,
			size: undefined,
			data: new Uint8Array(),
			node: undefined
		};

		const originalNode = figma.getNodeById(exportable.id) as FrameNode;

		// Convert all frames within this frame that contain text layers to groups
		let grouplessNode = originalNode.clone();
		grouplessNode.layoutMode = 'NONE';
		grouplessNode = withModificationsForText(grouplessNode);

		// Hide all text layers.
		const modifiedNode = withModificationsForExport(grouplessNode, config);

		if (tempFrame.frame) {
			tempFrame.frame.appendChild(grouplessNode);
			tempFrame.frame.appendChild(modifiedNode);
		}

		asset.node = grouplessNode;
		// asset.node = originalNode;

		// generate image data
		const baseExportConfig = {
			format: config.format,
			scale: config.scale,
			srcSize: exportable.size
		};

		const { destSize } = createSettingsBlock(baseExportConfig);

		asset.size = destSize;

		const { settings } = createSettingsBlock(
			previewSettings.isFinal
				? baseExportConfig
				: {
						format: 'JPG',
						scale: '1',
						srcSize: previewSettings.thumbSize
				  }
		);

		try {
			/**
			 * @see {@link https://www.figma.com/plugin-docs/api/properties/nodes-exportasync/|.exportAsync()}
			 */
			asset.data = await (<ExportMixin>modifiedNode).exportAsync(settings);
		} catch (exportable) {
			log(exportable);
		}

		assets.push(asset);
	}

	// tempFrame.remove();

	return assets;
};

// TODO: can this function be folded into getAssets?
const withModificationsForText = (node: FrameNode): FrameNode => {
	// Convert all instances, components, and frames to groups. This is so positioning of text layers is absolute relative to the base frame instead of its parent, which isn't accounted for in the html.

	// find all components and component instances within the frame
	const nodesToConvert = node.findAllWithCriteria({ types: ['COMPONENT', 'INSTANCE', 'FRAME'] });

	// detach all components and component instances
	for (const nodeToConvert of nodesToConvert) {
		if (nodeToConvert.type === 'INSTANCE') createGroupFromFrame(nodeToConvert.detachInstance());
		else if (nodeToConvert.type === 'COMPONENT') createGroupFromComponent(nodeToConvert);
		else if (nodeToConvert.type === 'FRAME') {
			// if nodeToConvert has any children that are text nodes, convert it to a group
			const textNodes = nodeToConvert.findAllWithCriteria({ types: ['TEXT'] });
			if (textNodes.length > 0) createGroupFromFrame(nodeToConvert);
		}
	}

	return node;
};

const withModificationsForExport = (node: FrameNode, config: Config): FrameNode => {
	const textNodes = node.findAllWithCriteria({ types: ['TEXT'] });

	// remove all hidden text layers. if testingMode is true, fade all visible text layers. if false, hide all visible text layers.
	for (const node of textNodes) {
		if (!isNodeVisible(node)) node.remove();
		else if (config.testingMode) node.opacity = 0.2;
		else node.visible = false;
	}

	return node;
};

// Inspired by Naftali Beder https://github.com/naftalibeder/figma-frame-exporter
const thumbSize = { w: 32, h: 32 };

const refreshPreview = async (config: Config | undefined, variables: Variables | undefined) => {
	const exportables = getExportables();

	if (!config) {
		figma.ui.postMessage({
			type: 'preview',
			preview: { total: 0, assets: [], file: undefined },
			loading: false
		});
		figma.ui.postMessage({ type: 'error', message: 'No config found' });
		return;
	}

	const assets: Asset[] = await getAssets(exportables, config, { isFinal: false, thumbSize });
	const file: HTMLFile = await getFile(config, assets, variables);

	tempFrame.remove();

	figma.ui.postMessage({
		type: 'preview',
		preview: { total: exportables.length, assets, file },
		loading: false
	});
};

const generateExport = async (config: Config, variables: Variables) => {
	const exportables = getExportables();
	const assets = await getAssets(exportables, config, { isFinal: true });
	const file = await getFile(config, assets, variables);

	tempFrame.remove();

	figma.ui.postMessage({ type: 'export', assets, file });
	return;
};

// Handle various messages
figma.ui.onmessage = async (message) => {
	let config: Config;
	let variables: Variables;
	let panels: Panels;
	let size: Size;

	switch (message.type) {
		case 'init': {
			figma.ui.postMessage({ type: 'loading', loading: true });

			size = await Stored.size.get();
			figma.ui.resize(size.w, size.h);

			config = await Stored.config.get();

			variables = await Stored.variables.get();
			panels = await Stored.panels.get();

			log('Loaded stored config');
			log('Loaded stored variables');

			figma.ui.postMessage({ type: 'load', config, variables, panels });
			await refreshPreview(config, variables);
			break;
		}

		case 'panel':
			if (message.panels) panels = await Stored.panels.set(message.panels);
			break;

		case 'resize': {
			if (message.size) size = await Stored.size.set(message.size);
			figma.ui.resize(size.w, size.h);
			break;
		}

		case 'config': {
			figma.ui.postMessage({ type: 'loading', loading: true });
			config = await Stored.config.set(message.config);
			variables = await Stored.variables.get();
			if (message.panels) panels = await Stored.panels.set(message.panels);
			await refreshPreview(config, variables);
			break;
		}

		case 'export': {
			variables = await Stored.variables.get();
			await generateExport(message.config, variables);
			break;
		}

		case 'reset-settings': {
			await Stored.config.clear();
			await Stored.size.clear();
			await Stored.panels.clear();

			config = await Stored.config.get();
			variables = await Stored.variables.get();
			panels = await Stored.panels.get();
			size = await Stored.size.get();

			figma.ui.resize(size.w, size.h);

			figma.ui.postMessage({ type: 'load', config, variables, panels, size });

			await refreshPreview(config, variables);
			break;
		}

		case 'save-settings': {
			config = await Stored.config.get();
			await Stored.config.write(config);
			log('Writing stored config');
			break;
		}

		case 'load-settings': {
			await Stored.config.load();
			config = await Stored.config.get();
			variables = await Stored.variables.get();
			panels = await Stored.panels.get();
			log('Loaded stored config');
			figma.ui.postMessage({ type: 'load', config, variables, panels });
			await refreshPreview(config, variables);
			break;
		}

		case 'write-variables': {
			await Stored.variables.write(message.variables);
			log('Writing variables');
			break;
		}

		default: {
			break;
		}
	}
};

figma.on('close', () => {
	tempFrame.remove();
	if (configGroupNode) {
		configGroupNode.locked = true;
		configGroupNode.visible = false;
	}
	log('closed');
	return;
});

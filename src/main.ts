import yaml from 'js-yaml';
import slugify from 'slugify';

import createSettingsBlock from './lib/generator/createSettingsBlock';
// import { createGroupsFromFrames } from './lib/generator/group';
import html from './lib/generator/html/wrapper';
import log from './lib/utils/log';

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
		name: slugify(figma.currentPage.name, { lower: true, strict: true }),
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
		applyHtags: true,
		styleTextSegments: true,
		includeGoogleFonts: true,
		customScript: null
	},
	size: { w: 960, h: 500 },
	variables: { hed: 'figma2html' },
	panels: {
		file: false,
		images: false,
		page: false,
		text: false
	}
};

// TODO: should these frames be `locked` to prevent accidental deletion?
interface NewConfigFrame {
	name: string;
	x?: number;
	y?: number;
	text: object;
}
const newConfigFrame = ({ name, x = 0, y = 0, text }: NewConfigFrame) => {
	const frameNode = figma.createFrame();
	frameNode.name = name;
	frameNode.x = x;
	frameNode.y = y;
	frameNode.layoutMode = 'VERTICAL';
	frameNode.primaryAxisSizingMode = 'AUTO';
	frameNode.counterAxisSizingMode = 'AUTO';
	frameNode.verticalPadding = 4;
	frameNode.horizontalPadding = 6;
	frameNode.cornerRadius = 4;
	const textNode = figma.createText();
	textNode.characters = yaml.dump(text).trim();
	frameNode.appendChild(textNode);
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
		};
	};

	/**
	 * VARIABLES
	 */
	static variables = class {
		static get = async (): Promise<Variables> => {
			// get the stored variables
			const variablesFrame = figma.currentPage.findChild(
				(node) => node.type === 'FRAME' && node.name === 'f2h-variables'
			) as FrameNode;

			const variablesText = variablesFrame?.children?.[0] as TextNode;

			if (variablesText?.characters) {
				const variables = yaml.load(variablesText.characters);
				Stored.variables.write();

				figma.ui.postMessage({
					type: 'variables',
					variables: variables
				});

				return variables;
			} else {
				figma.ui.postMessage({
					type: 'variables',
					variables: null
				});

				return defaults.variables;
			}
		};

		static write = async (): Promise<void> => {
			// write an example variables array to a text node on the current page
			let variables: object = defaults.variables;
			let x = 0;
			let y = 0;

			// remove existing variables text node if found
			const existingVariablesFrame = figma.currentPage.findChild(
				(node) => node.type === 'FRAME' && node.name === 'f2h-variables'
			) as FrameNode;

			const existingVariablesText = existingVariablesFrame?.children?.[0] as TextNode;

			if (existingVariablesText?.characters) {
				// save xPos of existing variables text node if it exists
				x = existingVariablesText.x;
				const characters = existingVariablesText.characters;
				variables = yaml.load(characters);
				existingVariablesText.remove();
			}

			// load Inter for variables text node
			figma.loadFontAsync({ family: 'Inter', style: 'Regular' }).then(() => {
				const nodes = figma.currentPage.findAll(
					(node) => isFrameExportable(node.name) || node.name === 'f2h-settings'
				);
				const settingsNode = nodes.find((node) => node.name === 'f2h-settings') as FrameNode;

				// if settings exists, place beside it
				if (settingsNode) {
					x = settingsNode.x + settingsNode.width;
				} else {
					// otherwise get all top-level children and place it to the right of them
					const maxX = nodes.reduce((max, node) => Math.max(max, node.x + node.width), 0);
					x = maxX;
				}

				// a little padding
				x += 25;

				// get uppermost point
				y = nodes.reduce((min, node) => Math.min(min, node.y), 0);

				// create the node
				newConfigFrame({
					name: 'f2h-variables',
					text: variables,
					x,
					y
				});

				figma.ui.postMessage({
					type: 'variables',
					variables: variables
				});
			});
		};
	};

	/**
	 * CONFIG
	 */
	static config = class {
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
			return;
		};

		// write the config to a text node on the current page
		static write = async (config): Promise<void> => {
			let x = 0;
			let y = 0;

			// remove existing settings text node if found
			const settings = figma.currentPage.findChild(
				(node) => node.type === 'FRAME' && node.name === 'f2h-settings'
			) as TextNode;

			if (settings) {
				// save position if settings node exists
				x = settings.x;
				settings.remove();
			}

			// load Inter for settings text node
			figma.loadFontAsync({ family: 'Inter', style: 'Regular' }).then(() => {
				// get all frames with names starting with "#"
				const nodes = figma.currentPage.findChildren(({ name }) => isFrameExportable(name));

				// get furthest point to the right
				x = nodes.reduce((max, node) => Math.max(max, node.x + node.width), 0);

				x += 100;

				// get furthest point to the top
				y = nodes.reduce((min, node) => Math.min(min, node.y), 0);

				// create the node
				newConfigFrame({
					name: 'f2h-settings',
					text: config,
					x,
					y
				});
			});
		};

		// find text node named "settings" and load
		static load = async (): Promise<void> => {
			const settingsFrame = figma.currentPage.findChild(
				(node) => node.type === 'FRAME' && node.name === 'f2h-settings'
			) as FrameNode;

			const settingsNode = settingsFrame.children[0] as TextNode;

			if (settingsNode?.characters) {
				const config = yaml.load(settingsNode.characters);
				await Stored.config.set(config);
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
		filename: config.name,
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
	// TODO: @svickars - I'm not sure what this is doing. Can you explain?
	// find all frame nodes within the frame
	// const frameNodes = node.findAllWithCriteria({ types: ['FRAME'] });

	// find all frame nodes within the frame that contain text layers
	// const textNodes = frameNodes.filter((node) => {
	// 	return node.findAllWithCriteria({ types: ['TEXT'] }).length > 0;
	// });

	// // find all frame nodes within the frame with a child node of type TEXT
	// const allTextNodes = allNodes.filter((node) =>
	// 	node.children.find((child) => child.type === 'TEXT')
	// );

	// convert all frames to groups for positioning
	// const groups: GroupNode[] = createGroupsFromFrames(frameNodes);

	return node;
};

const withModificationsForExport = (node: FrameNode, config: Config): FrameNode => {
	const textNodes = node.findAllWithCriteria({ types: ['TEXT'] });

	// fade all text layers if testingMode is true
	if (config.testingMode) for (const node of textNodes) node.opacity = 0.5;
	// hide all text layers if testingMode is false
	else for (const node of textNodes) node.visible = false;

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
			Stored.config.write(config);

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
			await Stored.variables.write();
			log('Writing example variables');
			break;
		}

		default: {
			break;
		}
	}
};

figma.on('close', () => {
	tempFrame.remove();
	log('closed');
	return;
});

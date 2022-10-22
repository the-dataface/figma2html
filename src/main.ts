import yaml from 'js-yaml';

import createSettingsBlock from 'lib/generator/createSettingsBlock';
import { createGroupsFromFrames } from 'lib/generator/group';
import html from 'lib/generator/html/wrapper';
import { fontList } from 'lib/generator/styleProps';
import camelize from 'lib/utils/camelize';
import log from 'lib/utils/log';

import {
	Asset,
	Config,
	Exportable,
	HTMLFile,
	PreviewSettings,
	Variable,
	Views,
} from './types';

log(fontList);

figma.showUI(__html__, { width: 560, height: 500, themeColors: true });

const defaultVariables = {
	hed: 'This is the headline',
};

class StoredViews {
	static get = async (): Promise<Views> => {
		const _views = await figma.clientStorage.getAsync('views');

		if (!_views) {
			return {
				file: true,
				images: false,
				page: false,
				text: false,
				preview: true
			};
		} else return _views;
	};

	static set = async (_views: Views): Promise<Views> => {
		await figma.clientStorage.setAsync('views', _views);
		return _views;
	}

	static clear = async (): Promise<void> => {
		await figma.clientStorage.deleteAsync('views');
	}
}

class StoredSize {
	static get = async () => {
		const _size = await figma.clientStorage.getAsync('size');
		if (!_size) {
			return { w: 960, h: 500 };
		} else {
			return _size;
		}
	}

	static set = async (_size: { w: number, h: number }) => {
		await figma.clientStorage.setAsync('size', _size);
		return _size;
	}

	static clear = async (): Promise<void> => {
		await figma.clientStorage.deleteAsync('size');
	};
}

class StoredVariables {
	static get = async (): Promise<Variable> => {
		// get the stored variables
		const variablesNode = figma.currentPage.findOne(
			(node) => node.type === 'TEXT' && node.name === 'f2h-variables'
		);

		log('variablesNode', variablesNode);

		if (!!variablesNode?.characters) {
			const variables = yaml.load(variablesNode.characters);
			StoredVariables.writeVariables();

			figma.ui.postMessage({
				type: 'variables',
				variables: variables,
			});

			return variables;
		} else {
			figma.ui.postMessage({
				type: 'variables',
				variables: null,
			});

			return defaultVariables;
		}
	};

	static writeVariables = async (): Promise<void> => {
		// write an example variables array to a text node on the current page

		let storedVariables;
		let xPos;

		// remove existing variables text node if found
		const existingVariables = figma.currentPage.findOne(
			(node) => node.type === 'TEXT' && node.name === 'f2h-variables'
		);

		log('existingVariables', existingVariables);

		if (!!existingVariables?.characters) {
			// save xPos of existing variables text node if it exists
			xPos = existingVariables.x;

			let characters = existingVariables.characters;
			storedVariables = yaml.load(characters);

			existingVariables.remove();
		}

		// load Inter for variables text node
		figma.loadFontAsync({ family: 'Inter', style: 'Regular' }).then(() => {
			// get all frames with names including "#" or named "settings"
			const nodes = figma.currentPage.findAll(
				(node) =>
					node.name.includes('#') || node.name === 'f2h-settings'
			);

			// get furthest point to the right
			const maxRight = nodes.reduce((max, node) => {
				return Math.max(max, node.x + node.width);
			}, 0);

			// get furthest point to the top
			const minTop = nodes.reduce((min, node) => {
				return Math.min(min, node.y);
			}, 0);

			// create the node
			let textNode = figma.createText();
			textNode.characters = yaml.dump(
				storedVariables || defaultVariables
			);
			textNode.x = xPos || maxRight + 100;
			textNode.y = minTop;
			textNode.name = 'f2h-variables';

			figma.ui.postMessage({
				type: 'variables',
				variables: storedVariables || defaultVariables,
			});
		});
	};
}

class StoredConfig {
	static get = async (): Promise<Config> => {
		// get the stored config
		const _config = await figma.clientStorage.getAsync('config');

		// set up config defaults if none found
		if (!_config) {
			return {
				syntax: camelize(figma.currentPage.name),
				scale: { value: 2, label: "2x", selected: true },
				extension: { value: 'PNG', label: 'png', selected: true },
				fileType: { value: 'html', label: 'html', selected: true },
				includeResizer: true,
				testingMode: false,
				maxWidth: null,
				fluid: true,
				centerHtmlOutput: false,
				clickableLink: null,
				imagePath: 'img',
				altText: '',
				applyStyleNames: true,
				applyHtags: true,
				styleTextSegments: true,
				includeGoogleFonts: true,
			};
		} else {
			return _config;
		}
	};

	static set = async (_config: Config): Promise<Config> => {
		// set the stored config
		await figma.clientStorage.setAsync('config', _config);
		return _config;
	};

	static clear = async (): Promise<void> => {
		// clear the stored config
		await figma.clientStorage.deleteAsync('config');
	};

	static writeSettings = async (config): Promise<void> => {
		// write the config to a text node on the current page

		let xPos;

		// remove existing settings text node if found
		const settings = figma.currentPage.findOne(
			(node) => node.type === 'TEXT' && node.name === 'f2h-settings'
		);

		if (settings) {
			// save xPos if settings node exists
			xPos = settings.x;

			settings.remove();
		}

		// load Inter for settings text node
		figma.loadFontAsync({ family: 'Inter', style: 'Regular' }).then(() => {
			// get all frames with names including "#"
			const nodes = figma.currentPage.findAll(
				(node) =>
					node.name.includes('#') || node.name === 'f2h-variables'
			);

			// get furthest point to the right
			const maxRight = nodes.reduce((max, node) => {
				return Math.max(max, node.x + node.width);
			}, 0);

			// get furthest point to the top
			const minTop = nodes.reduce((min, node) => {
				return Math.min(min, node.y);
			}, 0);

			// create the node
			let textNode = figma.createText();
			textNode.characters = yaml.dump(formatConfig(config));
			textNode.x = xPos || maxRight + 100;
			textNode.y = minTop;
			textNode.name = 'f2h-settings';
		});
	};

	static loadSettings = async (): Promise<void> => {
		// find text node named "settings" and load
		const settingsNode = figma.currentPage.findOne(
			(node) => node.name === 'f2h-settings' && node.type === 'TEXT'
		);

		log('settingsNode', settingsNode);

		if (!!settingsNode?.characters) {
			const config = parseConfig(yaml.load(settingsNode.characters));
			await StoredConfig.set(config);
		}
	};
}

const formatConfig = (__config) => {
	__config.extension = __config.extension.value;
	__config.fileType = __config.fileType.value;
	__config.scale = __config.scale.value;

	return __config;
}

const parseConfig = (__config) => {
	__config.extension = { value: __config.extension, label: __config.extension.toLowerCase(), selected: true };
	__config.fileType = { value: __config.fileType, label: __config.fileType, selected: true };
	__config.scale = { value: __config.scale, label: `${__config.scale}x`, selected: true };

	return __config;
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
		this.frame = this.frame;
	};

	remove = () => {
		this.frame?.remove();
		this.frame = undefined;
	};
}
const tempFrame = new TempFrame();

const getExportables = (): Exportable[] => {
	const nodes = figma.currentPage.findAll(
		(node) =>
			node.name.match(/^#\d+px$/) &&
			node.type === 'FRAME' &&
			node.parent === figma.currentPage
	);

	return nodes.map(({ id, name, width, height }) => {
		return {
			id,
			parentName: name,
			size: { width, height },
		};
	});
};

// create html file
const getFile = async (
	config: Config,
	assets,
	variables: Variable
): Promise<HTMLFile> => {
	return {
		filename: config.syntax,
		extension: config.fileType,
		data: html({ config, assets, variables }),
	};
};

const getAssets = async (
	exportables: readonly Exportable[],
	config: Config,
	previewSettings: PreviewSettings
): Promise<Asset[]> => {
	tempFrame.create();

	let assets: Asset[] = [];

	for (let exportable of exportables) {
		let asset: Asset = {
			filename: '',
			extension: config.extension,
			size: undefined,
			data: new Uint8Array(),
			node: undefined,
		};

		let originalNode = figma.getNodeById(exportable.id) as FrameNode;

		// Convert all frames within this frame that contain text layers to groups
		let grouplessNode = originalNode.clone();
		grouplessNode = withModificationsForText(grouplessNode);

		// Hide all text layers.
		let modifiedNode = originalNode.clone();
		modifiedNode = withModificationsForExport(modifiedNode, config);

		if (tempFrame.frame) {
			tempFrame.frame.appendChild(grouplessNode);
			tempFrame.frame.appendChild(modifiedNode);
		}

		asset.node = grouplessNode;
		// asset.node = originalNode;

		const filename = `${config.imagePath}/${exportable.parentName.replace(
			'#',
			''
		)}`;
		asset.filename = filename;

		// generate image data
		const baseExportConfig = {
			extension: config.extension,
			scale: config.scale,
			srcSize: exportable.size,
		};

		const { destSize } = createSettingsBlock(baseExportConfig);

		asset.size = destSize;

		const { settings } = createSettingsBlock(
			previewSettings.isFinal
				? baseExportConfig
				: {
					extension: { value: 'JPG', label: 'jpg', selected: false },
					scale: { value: 1, label: '1x', selected: false },
					srcSize: previewSettings.thumbSize,
				}
		);

		try {
			asset.data = await (<ExportMixin>modifiedNode).exportAsync(
				settings
			);
		} catch (exportable) {
			log(exportable);
		}

		assets.push(asset);
	}

	// tempFrame.remove();

	return assets;
};

const withModificationsForText = (node: FrameNode): FrameNode => {
	// find all frame nodes within the frame
	const allNodes = node.findAll((node) => node.type === 'FRAME');

	// find all frame nodes within the frame with a child node of type TEXT
	const allTextNodes = allNodes.filter((node) =>
		node.children.find((child) => child.type === 'TEXT')
	);

	// convert all frames to groups for positioning
	const groups: GroupNode[] = createGroupsFromFrames(allTextNodes);

	return node;
};

const withModificationsForExport = (
	node: FrameNode,
	config: Config
): FrameNode => {
	const textNodes = node.findAll((c) => c.type === 'TEXT');

	if (!config.testingMode) {
		// hide all text layers if testingMode is false
		textNodes.forEach((node) => (node.visible = false));
	} else {
		// fade all text layers if testingMode is true
		textNodes.forEach((node) => (node.opacity = 0.5));
	}

	return node;
};

// Inspired by Naftali Beder https://github.com/naftalibeder/figma-frame-exporter
const refreshPreview = async (
	config: Config | undefined,
	variables: Variable | undefined
) => {
	const exportables = getExportables();

	let exampleAssets: Asset[] = [];
	let exampleFile: HTMLFile;

	if (config) {
		exampleAssets = await getAssets(exportables, config, {
			isFinal: false,
			thumbSize: { width: 32, height: 32 },
		});
		exampleFile = await getFile(config, exampleAssets, variables);
	}

	tempFrame.remove();

	figma.ui.postMessage({
		type: 'preview',
		preview: {
			nodeCount: exportables.length,
			exampleAssets,
			exampleFile,
			loading: false,
		},
	});
};

const generateExport = async (config: Config, variables: Variable) => {
	const exportables = getExportables();

	const assets = await getAssets(exportables, config, { isFinal: true });

	const file = await getFile(config, assets, variables);

	log('assets + file', { assets, file });

	tempFrame.remove();

	figma.ui.postMessage({
		type: 'export',
		assets,
		file,
	});
};

figma.ui.onmessage = async (message) => {
	const { type } = message;
	log('Message:', type);

	let storedConfig, storedVariables, storedViews, storedSize;

	switch (type) {
		case 'init':
			figma.ui.postMessage({
				type: 'loading',
				loading: true
			});

			storedSize = await StoredSize.get();
			figma.ui.resize(storedSize.w, storedSize.h);

			storedConfig = await StoredConfig.get();
			storedVariables = await StoredVariables.get();
			storedViews = await StoredViews.get();

			log('Loaded stored config:', storedConfig);
			log('Loaded stored variables:', storedVariables);

			figma.ui.postMessage({
				type: 'load',
				config: storedConfig,
				variables: storedVariables,
				views: storedViews,
			});

			await refreshPreview(storedConfig, storedVariables);
			break;
		case 'view':
			if (message.views) storedViews = await StoredViews.set(message.views);

			break;
		case 'resize':
			if (message.size) storedSize = await StoredSize.set(message.size);
			figma.ui.resize(storedSize.w, storedSize.h);
			break;
		case 'config':
			figma.ui.postMessage({
				type: 'loading',
				loading: true
			});

			storedConfig = await StoredConfig.set(message.config);
			storedVariables = await StoredVariables.get();

			if (message.views) storedViews = await StoredViews.set(message.views);

			await refreshPreview(storedConfig, storedVariables);
			break;
		case 'export':
			storedVariables = await StoredVariables.get();
			await generateExport(message.config, storedVariables);
			break;
		case 'reset':
			await StoredConfig.clear();
			await StoredSize.clear();
			await StoredViews.clear();

			storedConfig = await StoredConfig.get();
			storedVariables = await StoredVariables.get();
			storedViews = await StoredViews.get();
			storedSize = await StoredSize.get();

			console.log(storedViews);

			figma.ui.resize(storedSize.w, storedSize.h);

			figma.ui.postMessage({
				type: 'load',
				config: storedConfig,
				variables: storedVariables,
				views: storedViews,
				size: storedSize,
			});

			await refreshPreview(storedConfig, storedVariables);
			break;
		case 'saveSettings':
			storedConfig = await StoredConfig.get();
			await StoredConfig.writeSettings(storedConfig);
			log('Writing stored config:', storedConfig);
			break;
		case 'loadSettings':
			await StoredConfig.loadSettings();
			storedConfig = await StoredConfig.get();
			storedVariables = await StoredVariables.get();
			storedViews = await StoredViews.get();
			log('Loaded stored config:', storedConfig);
			figma.ui.postMessage({
				type: 'load',
				config: storedConfig,
				variables: storedVariables,
				views: storedViews,
			});
			await refreshPreview(storedConfig, storedVariables);
			break;
		case 'writeVariables':
			await StoredVariables.writeVariables();
			log('Writing example variables:', defaultVariables);
			break;
	}
};

// figma.on("selectionchange", async () => {
//   const storedConfig = await StoredConfig.get();
//   await refreshPreview(storedConfig);
// });

figma.on('close', () => {
	tempFrame.remove();
	log('closed');
});

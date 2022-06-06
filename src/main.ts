import {
	Asset,
	Config,
	Exportable,
	HTMLFile,
	PreviewSettings,
	Variable,
} from './types';

import yaml from 'js-yaml';

import camelize from 'lib/utils/camelize';
import log from 'lib/utils/log';

import createSettingsBlock from 'lib/generator/createSettingsBlock';
import { fontList } from 'lib/generator/styleProps';
import html from 'lib/generator/html/wrapper';

log(fontList);

figma.showUI(__html__, { width: 560, height: 500 });

const defaultVariables = {
	hed: 'This is the headline',
};

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
				variables: variables
			});

			return variables;
		} else {
			figma.ui.postMessage({
				type: 'variables',
				variables: null
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
				variables: storedVariables || defaultVariables
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
				scale: 2,
				extension: 'PNG',
				fileType: 'HTML',
				includeResizer: true,
				maxWidth: null,
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
			textNode.characters = yaml.dump(config);
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
			const config = yaml.load(settingsNode.characters);
			await StoredConfig.set(config);
		}
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
		asset.node = originalNode;

		// Hide all text layers.
		let modifiedNode = originalNode.clone();
		modifiedNode = withModificationsForExport(modifiedNode);

		if (tempFrame.frame) {
			tempFrame.frame.appendChild(modifiedNode);
		}

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
					extension: 'JPG',
					scale: 1,
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

	tempFrame.remove();

	return assets;
};

const withModificationsForExport = (node: FrameNode): FrameNode => {
	// hide all text layers
	const nodesToHide = node.findAll((c) => c.type === 'TEXT');

	nodesToHide.forEach((node) => (node.visible = false));

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

	figma.ui.postMessage({
		type: 'preview',
		preview: {
			nodeCount: exportables.length,
			exampleAssets,
			exampleFile,
		},
	});
};

const generateExport = async (config: Config, variables: Variable) => {
	const exportables = getExportables();

	const assets = await getAssets(exportables, config, { isFinal: true });

	const file = await getFile(config, assets, variables);

	log('assets + file', { assets, file });

	figma.ui.postMessage({
		type: 'export',
		assets,
		file,
	});
};

figma.ui.onmessage = async (message) => {
	const type = message.type;
	log('Message:', type);

	let storedConfig;
	let storedVariables;

	switch (type) {
		case 'init':
			storedConfig = await StoredConfig.get();
			storedVariables = await StoredVariables.get();
			log('Loaded stored config:', storedConfig);
			log('Loaded stored variables:', storedVariables);
			figma.ui.postMessage({
				type: 'load',
				config: storedConfig,
				variables: storedVariables,
			});
			await refreshPreview(storedConfig, storedVariables);
			break;
		case 'config':
			storedConfig = await StoredConfig.set(message.config);
			storedVariables = await StoredVariables.get();
			await refreshPreview(storedConfig, storedVariables);
			break;
		case 'export':
			storedVariables = await StoredVariables.get();
			await generateExport(message.config, storedVariables);
			break;
		case 'reset':
			await StoredConfig.clear();
			storedConfig = await StoredConfig.get();
			storedVariables = await StoredVariables.get();
			log('Loaded stored config:', storedConfig);
			log('Loaded stored variables:', storedVariables);
			figma.ui.postMessage({
				type: 'load',
				config: storedConfig,
				variables: storedVariables,
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
			log('Loaded stored config:', storedConfig);
			figma.ui.postMessage({
				type: 'load',
				config: storedConfig,
				variables: storedVariables,
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

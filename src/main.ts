import yaml from 'js-yaml';
import {
	Asset,
	Config,
	Exportable,
	HTMLFile,
	PreviewSettings,
	Variable,
} from './types';
import {
	buildExportSettings,
	camelize,
	generateOutputHtml,
	generateOutputSvelte,
	log,
} from './utils';

figma.showUI(__html__, { width: 560, height: 500 });

const defaultVariables = {
	hed: 'This is the headline',
};

class StoredVariables {
	static get = async (): Promise<Variable> => {
		// get the stored variables
		let variablesNode = figma.currentPage.findOne(
			(node) => node.type === 'TEXT' && node.name === 'f2h-variables'
		);

		if (!!variablesNode?.characters) {
			let variables = yaml.load(variablesNode.characters);
			StoredVariables.writeVariables();
			return variables;
		} else return defaultVariables;
	};

	static writeVariables = async (): Promise<void> => {
		// write an example variables array to a text node on the current page

		let storedVariables;
		// remove existing variables text node if found
		const existingVariables = figma.currentPage.findOne(
			(node) => node.type === 'TEXT' && node.name === 'f2h-variables'
		);

		if (!!existingVariables?.characters) {
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
			textNode.x = maxRight + 100;
			textNode.y = minTop;
			textNode.name = 'f2h-variables';
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
				imagePath: '/img',
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

		// remove existing settings text node if found
		const settings = figma.currentPage.findOne(
			(node) => node.type === 'TEXT' && node.name === 'f2h-settings'
		);

		if (settings) settings.remove();

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
			textNode.x = maxRight + 100;
			textNode.y = minTop;
			textNode.name = 'f2h-settings';
		});
	};

	static loadSettings = async (): Promise<void> => {
		// find text node named "settings" and load
		const textNode = figma.currentPage.findOne(
			(node) => node.name === 'f2h-settings' && node.type === 'TEXT'
		);

		if (!!textNode?.characters) {
			const config = yaml.load(textNode.characters);
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
	const exportables: Exportable[] = [];

	nodes.forEach((node) => {
		exportables.push({
			id: node.id,
			parentName: node.name,
			size: { width: node.width, height: node.height },
		});
	});

	return exportables;
};

const getFile = async (
	config: Config,
	assets,
	variables: Variable
): Promise<HTMLFile> => {
	const { syntax, fileType, includeResizer, centerHtmlOutput, maxWidth } =
		config;

	// create html file
	const file = {
		filename: `${syntax}`,
		extension: fileType,
		data:
			fileType === 'HTML'
				? generateOutputHtml(config, assets, variables)
				: generateOutputSvelte(config, assets, variables),
	};

	return file;
};

const getAssets = async (
	exportables: readonly Exportable[],
	config: Config,
	previewSettings: PreviewSettings
): Promise<Asset[]> => {
	const { syntax, extension, scale, imagePath, altText } = config;

	tempFrame.create();

	let assets: Asset[] = [];

	exportables.forEach((exportable) => {
		let asset: Asset = {
			filename: '',
			extension,
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

		const filename = `${imagePath}/${exportable.parentName.replace(
			'#',
			''
		)}`;
		asset.filename = filename;

		// generate image data
		const baseExportConfig = {
			extension,
			scale,
			srcSize: e.size,
		};

		const { destSize } = buildExportSettings(baseExportConfig);

		asset.size = destSize;

		const { settings } = buildExportSettings(
			previewSettings.isFinal
				? baseExportConfig
				: {
						extension: 'JPG',
						scale: 1,
						srcSize: previewSettings.thumbSize,
				  }
		);

		try {
			asset.data = await(<ExportMixin>modifiedNode).exportAsync(settings);
		} catch (exportable) {
			log(exportable);
			continue;
		}

		assets.push(asset);
	});

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

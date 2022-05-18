import { Exportable, Config, Asset, HTMLFile, PreviewSettings } from "./types";
import { camelize, buildExportSettings, generateOutputHtml, log, generateOutputSvelte } from "./utils";

figma.showUI(__html__, { width: 560, height: 900 });

class StoredConfig {
  static get = async (): Promise<Config> => {
    let _config = await figma.clientStorage.getAsync('config');
    if (!_config) {
      return {
        syntax: camelize(figma.currentPage.name),
        sizeConstraint: '2x',
        extension: 'PNG',
        fileType: 'HTML',
        includeResizer: true,
        maxWidth: null,
        centerHtmlOutput: false,
        clickableLink: '',
        imagePath: "img",
        altText: '',
        applyStyleNames: true,
        applyHtags: true
      }
    } else {
      return _config;
    }
  };

  static set = async (_config: Config): Promise<Config> => {
    await figma.clientStorage.setAsync('config', _config);
    return _config;
  };

  static clear = async (): Promise<void> => {
    await figma.clientStorage.deleteAsync('config');
  }

  static writeSettings = async (config): Promise<void> => {
    // remove text nodes named "settings"
    const settings = figma.currentPage.findOne(node => node.name === "settings");
    if (settings) settings.remove();

    figma.loadFontAsync({ family: "Inter", style: "Regular" })
      .then(() => {
        // get all frames with names including "#"
        const nodes = figma.currentPage.findAll(node => node.name.includes("#"));

        // get furthest point to the right
        const maxRight = nodes.reduce((max, node) => {
          return Math.max(max, node.x + node.width);
        }, 0);

        // get furthest point to the top
        const minTop = nodes.reduce((min, node) => {
          return Math.min(min, node.y);
        }, 0);

        let textNode = figma.createText();
        textNode.characters = JSON.stringify(config, null, 2).replace(/,/g, ",\r");
        textNode.x = maxRight + 100;
        textNode.y = minTop;
        textNode.name = "settings";
      });
  }

  static loadSettings = async (): Promise<void> => {
    // find text node named "settings"
    const textNode = figma.currentPage.findOne(node => node.name === "settings" && node.type === "TEXT");
    if (textNode) {
      const config = JSON.parse(textNode.characters.replace(/\r/g, ""));
      await StoredConfig.set(config);
    }
  }
}

class TempFrame {
  frame: FrameNode | undefined;

  create = () => {
    if (this.frame) {
      this.frame.remove();
      this.frame = undefined;
    }

    this.frame = figma.createFrame();
    this.frame.name = "[figma2html]";
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
  const nodes = figma.currentPage.findAll(node => node.name.includes("#"));
  const exportables: Exportable[] = [];

  for (const node of nodes) {
    exportables.push({
      id: node.id,
      parentName: node.name,
      size: { width: node.width, height: node.height },
    });
  }

  return exportables;
};

const getFile = async (
  config: Config,
  assets
): Promise<HTMLFile> => {
  const { syntax, fileType, includeResizer, centerHtmlOutput, maxWidth } = config;

  // create html file
  const file = {
    filename: `${syntax}`,
    extension: fileType,
    data: fileType === "HTML" ? generateOutputHtml(config, assets) : generateOutputSvelte()
  }

  return file;
}

const getAssets = async (
  exportables: readonly Exportable[],
  config: Config,
  previewSettings: PreviewSettings,
): Promise<Asset[]> => {
  const { syntax, extension, sizeConstraint, imagePath, altText } = config;

  tempFrame.create();

  let assets: Asset[] = [];

  for (const e of exportables) {
    let asset: Asset = {
      filename: '',
      extension,
      size: undefined,
      data: new Uint8Array,
      node: undefined
    };

    let originalNode = figma.getNodeById(e.id) as FrameNode;
    asset.node = originalNode;

    // Hide all text layers.
    let modifiedNode = originalNode.clone();
    modifiedNode = withModificationsForExport(modifiedNode);

    if (tempFrame.frame) {
      tempFrame.frame.appendChild(modifiedNode);
    }

    const filename = `${imagePath}/${e.parentName.replace("#", "")}`;
    asset.filename = filename;

    // generate image data
    const baseExportConfig = {
      extension,
      constraint: sizeConstraint,
      srcSize: e.size,
    };

    const { destSize } = buildExportSettings(baseExportConfig);

    asset.size = destSize;

    const { settings } = buildExportSettings(previewSettings.isFinal ? baseExportConfig : {
      extension: 'JPG',
      constraint: '',
      srcSize: previewSettings.thumbSize,
    });

    try {
      asset.data = await (<ExportMixin>modifiedNode).exportAsync(settings);
    } catch (e) {
      log(e);
      continue;
    }

    assets.push(asset);
  }

  tempFrame.remove();

  return assets;
};

const withModificationsForExport = (node: FrameNode): FrameNode => {
  // hide all text layers
  const nodesToHide = node.findAll(c => c.type === 'TEXT');

  for (const n of nodesToHide) {
    n.visible = false;
  }

  return node;
}

const refreshPreview = async (config: Config | undefined) => {
  const exportables = getExportables();

  let exampleAssets: Asset[] = [];
  let exampleFile: HTMLFile;

  if (config) {
    exampleAssets = await getAssets(
      exportables,
      config,
      {
        isFinal: false, thumbSize: { width: 32, height: 32 }
      });
    exampleFile = await getFile(config, exampleAssets);
  }

  figma.ui.postMessage({
    type: "preview",
    preview: {
      nodeCount: exportables.length,
      exampleAssets,
      exampleFile
    }
  });
};

const generateExport = async (config: Config) => {
  const exportables = getExportables();

  const assets = await getAssets(
    exportables,
    config,
    { isFinal: true },
  );

  const file = await getFile(config, assets);

  figma.ui.postMessage({
    type: "export",
    assets,
    file
  });
};

figma.ui.onmessage = async (message) => {
  const type = message.type;
  log('Message:', type);

  if (type === "init") {
    const storedConfig = await StoredConfig.get();
    log("Loaded stored config:", storedConfig);
    figma.ui.postMessage({ type: "load", config: storedConfig });
    await refreshPreview(storedConfig);
  } else if (type === "config") {
    const storedConfig = await StoredConfig.set(message.config);
    await refreshPreview(storedConfig);
  } else if (type === "export") {
    await generateExport(message.config);
  } else if (type === "reset") {
    await StoredConfig.clear();
    const storedConfig = await StoredConfig.get();
    log("Loaded stored config:", storedConfig);
    figma.ui.postMessage({ type: "load", config: storedConfig });
    await refreshPreview(storedConfig);
  } else if (type === "saveSettings") {
    const storedConfig = await StoredConfig.get();
    await StoredConfig.writeSettings(storedConfig);
    log("Writing stored config:", storedConfig);
  } else if (type === "loadSettings") {
    await StoredConfig.loadSettings();
    const storedConfig = await StoredConfig.get();
    log("Loaded stored config:", storedConfig);
    figma.ui.postMessage({ type: "load", config: storedConfig });
    await refreshPreview(storedConfig);
  }
};

figma.on("selectionchange", async () => {
  const storedConfig = await StoredConfig.get();
  await refreshPreview(storedConfig);
});

figma.on('close', () => {
  tempFrame.remove();
  log('closed');
});
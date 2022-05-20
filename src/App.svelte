<script lang="ts" type="module">
  import { onMount } from "svelte";
  import JSZip from "../node_modules/jszip/dist/jszip.min.js";
  import { Asset, HTMLFile, Config, Extension, Size, FileType } from "./types";
  import {
    Button,
    Section,
    SelectMenu,
    Switch,
    Icon,
    IconDraft,
    IconImage,
    IconAdjust,
    IconVisible,
    IconSpinner,
    IconLibrary,
  } from "figma-plugin-ds-svelte";

  let loading = false;

  interface FileTypeOption {
    value: FileType;
    label: string;
    group: string | null;
    selected: boolean;
  }

  let fileType: FileType | undefined = undefined;
  let fileTypeOptions: FileTypeOption[] = [
    // { value: "SVELTE", label: "SVELTE", group: null, selected: false }, // TO DO
    { value: "HTML", label: "HTML", group: null, selected: false },
  ];

  $: {
    fileTypeOptions.forEach((o, i) => {
      fileTypeOptions[i].selected = o.value === fileType;
    });
  }

  interface ExtensionOption {
    value: Extension;
    label: string;
    group: string | null;
    selected: boolean;
  }

  let extension: Extension | undefined = undefined;
  let extensionOptions: ExtensionOption[] = [
    { value: "PNG", label: "PNG", group: null, selected: false },
    { value: "JPG", label: "JPG", group: null, selected: false },
  ];

  $: {
    extensionOptions.forEach((o, i) => {
      extensionOptions[i].selected = o.value === extension;
    });
  }

  let syntax: string | undefined = undefined;
  let sizeConstraint: string | undefined = undefined;
  let includeResizer = true;
  let centerHtmlOutput = false;
  let applyStyleNames = false;
  let applyHtags = false;
  let styleTextSegments = true;
  let clickableLink: string | undefined = undefined;
  let maxWidth: number | undefined = undefined;
  let imagePath: string | undefined = undefined;
  let altText: string | undefined = undefined;

  let nodeCount = 0;
  let exampleAssets: Asset[] = [];
  let exampleFile: HTMLFile;

  const displaySize = (size: Size): string => {
    const rounded: Size = {
      width: Math.round(size.width),
      height: Math.round(size.height),
    };
    return `${rounded.width}x${rounded.height}`;
  };

  const buildConfig = (): Config => {
    return {
      syntax,
      sizeConstraint,
      extension,
      fileType,
      includeResizer,
      maxWidth,
      centerHtmlOutput,
      clickableLink,
      imagePath,
      altText,
      applyStyleNames,
      applyHtags,
      styleTextSegments,
    };
  };

  window.onmessage = async (event: MessageEvent) => {
    const message = event.data.pluginMessage;
    const type = message.type;

    if (type === "load") {
      const config = message.config as Config;

      syntax = config.syntax;
      sizeConstraint = config.sizeConstraint;
      extension = config.extension;
      fileType = config.fileType;
      includeResizer = config.includeResizer;
      maxWidth = config.maxWidth;
      centerHtmlOutput = config.centerHtmlOutput;
      clickableLink = config.clickableLink;
      imagePath = config.imagePath;
      altText = config.altText;
      applyStyleNames = config.applyStyleNames;
      applyHtags = config.applyHtags;
      styleTextSegments = config.styleTextSegments;
    } else if (type === "preview") {
      const preview = message.preview;
      nodeCount = preview.nodeCount;
      exampleAssets = preview.exampleAssets;
      exampleFile = preview.exampleFile;
      exampleAssets = await buildPreviewImages(exampleAssets);
    } else if (type === "export") {
      const url = await buildZipArchive(message.assets, message.file);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${syntax}.zip`;
      link.click();

      setTimeout(() => {
        loading = false;
      }, 1500);
    }
  };

  onMount(() => {
    parent.postMessage(
      {
        pluginMessage: {
          type: "init",
        },
      },
      "*"
    );
  });

  const onChangeConfig = () => {
    parent.postMessage(
      {
        pluginMessage: {
          type: "config",
          config: buildConfig(),
        },
      },
      "*"
    );
  };

  const onSelectExport = () => {
    loading = true;
    parent.postMessage(
      {
        pluginMessage: {
          type: "export",
          config: buildConfig(),
        },
      },
      "*"
    );
  };

  const onReset = () => {
    parent.postMessage(
      {
        pluginMessage: {
          type: "reset",
        },
      },
      "*"
    );
  };

  const onSaveSettings = () => {
    parent.postMessage(
      {
        pluginMessage: {
          type: "saveSettings",
        },
      },
      "*"
    );
  };

  const onLoadSettings = () => {
    parent.postMessage(
      {
        pluginMessage: {
          type: "loadSettings",
        },
      },
      "*"
    );
  };

  const buildPreviewImages = async (assets: Asset[]): Promise<Asset[]> => {
    assets.forEach((asset) => {
      let blob = new Blob([asset.data], { type: `image/png` });
      const url = window.URL.createObjectURL(blob);
      asset.url = url;
    });

    return assets;
  };

  const buildZipArchive = async (assets: Asset[], file: HTMLFile): Promise<string> => {
    let zip = new JSZip();

    assets.forEach((asset) => {
      const extensionLower = asset.extension.toLowerCase();
      let blob = new Blob([asset.data], { type: `image/${extensionLower}` });
      zip.file(`${asset.filename}.${extensionLower}`, blob, { base64: true });
    });

    let fileBlob = new Blob([file.data], { type: `string` });
    zip.file(`${file.filename}.${file.extension.toLowerCase()}`, fileBlob, { base64: true });

    const blob = await zip.generateAsync({ type: "blob" });
    const url = window.URL.createObjectURL(blob);

    return url;
  };
</script>

{#if loading}
  <div class="overlay">
    <div class="spinner">
      <Icon iconName={IconSpinner} color="black" spin />
    </div>
  </div>
{/if}

<div class="content">
  <div class="group">
    <div class="header">
      <Icon iconName={IconDraft} color="black" />
      <h3>File Output</h3>
    </div>

    <div class="row">
      <div class="setting">
        <Section>Filename</Section>
        <input type="text" placeholder={syntax} bind:value={syntax} on:input={onChangeConfig} />
      </div>
      <div class="setting">
        <Section>Filetype</Section>
        <SelectMenu
          bind:menuItems={fileTypeOptions}
          on:change={(e) => {
            fileType = e.detail.value;
            onChangeConfig();
          }}
        />
      </div>
    </div>
  </div>

  <div class="group">
    <div class="header">
      <Icon iconName={IconImage} color="black" />
      <h3>Image Settings</h3>
    </div>

    <div class="row">
      <div class="setting">
        <Section>Image Size</Section>
        <input
          type="text"
          placeholder="E.g. 2x, 64w, 200h"
          disabled={!extension}
          bind:value={sizeConstraint}
          on:input={onChangeConfig}
        />
      </div>
      <div class="section">
        <Section>Format</Section>
        <SelectMenu
          bind:menuItems={extensionOptions}
          on:change={(e) => {
            extension = e.detail.value;
            onChangeConfig();
          }}
        />
      </div>
    </div>
    <div class="row">
      <div class="setting">
        <Section>Path</Section>
        <input type="text" placeholder="Image path" bind:value={imagePath} on:change={onChangeConfig} />
      </div>
      <div class="setting">
        <Section>Alt Text</Section>
        <input type="text" placeholder="Alt text" bind:value={altText} on:change={onChangeConfig} />
      </div>
    </div>
  </div>

  <div class="group">
    <div class="header">
      <Icon iconName={IconAdjust} color="black" />
      <h3>Page Settings</h3>
    </div>

    <div class="row">
      <div class="setting">
        <Section>Include Resize Script</Section>
        <Switch value={includeResizer} bind:checked={includeResizer} on:change={onChangeConfig} />
      </div>
      <div class="setting">
        <Section>Center HTML Output</Section>
        <Switch value={centerHtmlOutput} bind:checked={centerHtmlOutput} on:change={onChangeConfig} />
      </div>
    </div>
    <div class="row">
      <div class="setting">
        <Section>Max Width (px)</Section>
        <input type="number" placeholder="1920" bind:value={maxWidth} on:input={onChangeConfig} />
      </div>
      <div class="setting">
        <Section>Clickable Link</Section>
        <input type="text" placeholder="Link image?" bind:value={clickableLink} on:change={onChangeConfig} />
      </div>
    </div>
  </div>

  <div class="group">
    <div class="header">
      <Icon iconName={IconLibrary} color="black" />
      <h3>Text Settings</h3>
    </div>

    <div class="row">
      <div class="setting">
        <Section>Style Text Segments</Section>
        <Switch value={styleTextSegments} bind:checked={styleTextSegments} on:change={onChangeConfig} />
      </div>
      <div class="setting">
        <Section>Include Figma Styles as Classes</Section>
        <Switch value={applyStyleNames} bind:checked={applyStyleNames} on:change={onChangeConfig} />
      </div>
      <div class="setting">
        <Section>Convert Header Styles to H Tags</Section>
        <Switch value={applyHtags} bind:checked={applyHtags} on:change={onChangeConfig} />
      </div>
    </div>
  </div>

  <div>
    <div class="header">
      <Icon iconName={IconVisible} color="black" />
      <h3>Output Preview</h3>
    </div>

    <div class="output-preview">
      {#if exampleAssets.length > 0}
        {#each exampleAssets as exampleAsset, index}
          {#if index > 0}
            <hr />
          {/if}
          <div class="output-row">
            <img class="output-thumb" src={exampleAsset.url} alt="asset thumbnail" />
            <span class="output-filename">
              {exampleAsset.filename}.{exampleAsset.extension.toLowerCase()}
            </span>
            {#if exampleAsset.size}
              <span>
                {displaySize(exampleAsset.size)}
              </span>
            {/if}
          </div>
        {/each}
        {#if exampleFile}
          <hr />
          <div class="output-row">
            <img
              class="output-thumb"
              src={exampleFile.extension === "SVELTE"
                ? "https://img.icons8.com/doodle/344/svetle.png"
                : "https://img.icons8.com/ios/344/html.png"}
              alt="asset icon"
            />
            <span class="output-filename">
              {exampleFile.filename}.{exampleFile.extension.toLowerCase()}
            </span>
          </div>
        {/if}
      {:else}
        <div class="output-placeholder">Add a frame named #[size]px.</div>
      {/if}
    </div>
  </div>

  <div class="button-row">
    <Button on:click={onSelectExport} disabled={nodeCount === 0}>Export {nodeCount} images</Button>
    <Button variant="secondary" on:click={onReset}>Reset to Defaults</Button>
    <p class="link" on:click={onSaveSettings}>Save Settings</p>
    <p class="link" on:click={onLoadSettings}>Load Settings</p>
  </div>
</div>

<style>
  .overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(255, 255, 255, 0.9);
    z-index: 999;
  }

  .overlay .spinner {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }

  h3 {
    margin: 0;
  }

  p.link {
    text-decoration: underline;
    margin: 0;
  }

  .content {
    display: flex;
    flex: 1;
    flex-direction: column;
    gap: 8px;
    padding: 8px;
    font-size: small;
  }

  .header {
    display: flex;
    align-items: center;
  }

  .row {
    display: flex;
    flex: 1;
    flex-direction: row;
    gap: 8px;
  }

  .group {
    /* border-bottom: 1px solid lightgray; */
    margin-bottom: 16px;
    padding-bottom: 24px;
  }

  .setting {
    display: flex;
    flex: 1;
    flex-direction: column;
  }

  .button-row {
    margin-top: 8px;
    display: flex;
    gap: 8px;
    align-items: center;
  }

  .output-preview {
    font-size: 12px;
    display: flex;
    flex-direction: column;
    overflow-y: scroll;
    height: 166px;
    padding: 8px;
    border: 1px solid lightgray;
    border-radius: 4px;
  }

  .output-row {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    gap: 4px;
  }

  .output-thumb {
    width: 24px;
    height: 24px;
  }

  .output-filename {
    display: flex;
    flex: 1;
    white-space: nowrap;
    overflow-x: scroll;
  }

  .output-placeholder {
    color: #999;
  }

  input {
    font-size: 12px;
    height: 32px;
    padding: 8px;
    border: 1px solid lightgray;
    border-radius: 4px;
  }

  input:hover {
    border-color: #000;
  }
</style>

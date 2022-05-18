<script lang="ts" type="module">
  import { onMount } from "svelte";
  import { Button, Section, SelectMenu, Switch, Icon, IconDraft, IconImage, IconAdjust, IconVisible, IconSpinner, IconLibrary } from "figma-plugin-ds-svelte";
  import JSZip from "../node_modules/jszip/dist/jszip.min.js";
  import { Asset, HTMLFile, Config, Extension, Size, FileType } from "./types";

  interface ExtensionOption {
    value: Extension;
    label: string;
    group: string | null;
    selected: boolean;
  }

  interface FileTypeOption {
    value: FileType;
    label: string;
    group: string | null;
    selected: boolean;
  }

  let syntax: string | undefined = undefined;

  let sizeConstraint: string | undefined = undefined;

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

  let fileType: FileType | undefined = undefined;
  let fileTypeOptions: FileTypeOption[] = [
    { value: "SVELTE", label: "SVELTE", group: null, selected: false },
    { value: "HTML", label: "HTML", group: null, selected: false },
  ];

  $: {
    fileTypeOptions.forEach((o, i) => {
      fileTypeOptions[i].selected = o.value === fileType;
    });
  }

  let includeResizer = true;
  let centerHtmlOutput = false;
  let applyStyleNames = false;
  let applyHtags = false;
  let clickableLink: string | undefined = undefined;
  let maxWidth: number | undefined = undefined;
  let imagePath: string | undefined = undefined;
  let altText: string | undefined = undefined;

  let nodeCount = 0;
  let exampleAssets: Asset[] = [];
  let exampleFile: HTMLFile;

  let loading = false;

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
      applyHtags
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
      <Icon iconName={IconSpinner} color="black" spin/>
    </div>
  </div>
{/if}

<div class="wrap">
  <div class="group">
    <div class="header">
      <Icon iconName={IconDraft} color="black"/>
      <h3>File Output</h3>
    </div>
    <div class="row">
      <div class="section">
        <Section>Filename</Section>
        <input type="text" placeholder={syntax} bind:value={syntax} on:input={onChangeConfig} />
      </div>
      <div class="section">
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
      <Icon iconName={IconImage} color="black"/>
      <h3>Image Settings</h3>
    </div>

    <div class="row">
      <div class="section">
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
      <div class="section">
        <Section>Path</Section>
        <input type="text" placeholder="Image path" bind:value={imagePath} on:change={onChangeConfig} />
      </div>
      <div class="section">
        <Section>Alt Text</Section>
        <input type="text" placeholder="Alt text" bind:value={altText} on:change={onChangeConfig} />
      </div>
    </div>
  </div>

  <div class="group">
    <div class="header">
      <Icon iconName={IconAdjust} color="black"/>
      <h3>Page Settings</h3>
    </div>
    <div class="row">
      <div class="section">
        <Section>Include Resize Script</Section>
        <Switch value={includeResizer} bind:checked={includeResizer} on:change={onChangeConfig} />
      </div>
      <div class="section">
        <Section>Center HTML Output</Section>
        <Switch value={centerHtmlOutput} bind:checked={centerHtmlOutput} on:change={onChangeConfig} />
      </div>
    </div>
    <div class="row">    
      <div class="section">
        <Section>Max Width (px)</Section>
        <input
        type="number"
        placeholder="1920"
        bind:value={maxWidth}
        on:input={onChangeConfig}
        />
      </div>
      <div class="section">
        <Section>Clickable Link</Section>
        <input type="text" placeholder="Link image?" bind:value={clickableLink} on:change={onChangeConfig} />
      </div>
    </div>
  </div>

  <div class="group">
    <div class="header">
      <Icon iconName={IconLibrary} color="black"/>
      <h3>Text Settings</h3>
    </div>
    <div class="row">
      <div class="section">
        <Section>Include Figma Styles as Classes</Section>
        <Switch value={applyStyleNames} bind:checked={applyStyleNames} on:change={onChangeConfig} />
      </div>
      <div class="section">
        <Section>Convert Header Styles to H Tags</Section>
        <Switch value={applyHtags} bind:checked={applyHtags} on:change={onChangeConfig} />
      </div>
    </div>
  </div>

  <div>
    <div class="header">
      <Icon iconName={IconVisible} color="black"/>
      <h3>Output</h3>
    </div>

    <div class="example">
      {#if exampleAssets.length > 0}
        {#each exampleAssets as exampleAsset, index}
          {#if index > 0}
            <hr />
          {/if}
          <div class="example-row">
            <img class="example-row-thumb" src={exampleAsset.url} alt="asset thumbnail" />
            <span class="example-row-filename">
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
          <div class="example-row">
            <img
              class="example-row-thumb"
              src={exampleFile.extension === "SVELTE"
                ? "https://img.icons8.com/doodle/344/svetle.png"
                : "https://img.icons8.com/ios/344/html.png"}
              alt="asset icon"
            />
            <span class="example-row-filename">
              {exampleFile.filename}.{exampleFile.extension.toLowerCase()}
            </span>
          </div>
        {/if}
      {:else}
        <div class="example-text-placeholder">Add a frame named #[size]px.</div>
      {/if}
    </div>
  </div>

  <div class="button-holder">
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
    z-index: 100;
  }
  .spinner {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
  .header {
    display: flex;
    align-items: center;
  }
  h3 {
    margin: 0;
  }
  p.link {
    text-decoration: underline;
    margin: 0;
  }
  .wrap {
    display: flex;
    flex: 1;
    flex-direction: column;
    gap: 8px;
    padding: 8px;
    font-size: small;
  }
  .row {
    display: flex;
    flex: 1;
    flex-direction: row;
    gap: 8px;
  }
  .group {
    border-bottom: 1px solid lightgray;
    margin-bottom: 16px;
    padding-bottom: 24px;
  }
  .section {
    display: flex;
    flex: 1;
    flex-direction: column;
  }
  .button-holder {
    margin-top: 8px;
    display: flex;
    gap: 8px;
    align-items: center;
  }
  .button {
    margin-right: 8px !important;
  }
  .example {
    display: flex;
    flex-direction: column;
    overflow-y: scroll;
    height: 166px;
    padding: 8px;
    font-size: smaller;
    border-color: rgb(235, 235, 235);
    border-width: 1px;
    border-style: solid;
    border-radius: 4px;
  }
  .example-row {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    gap: 4px;
  }
  .example-row-thumb {
    width: 24px;
    height: 24px;
  }
  .example-row-filename {
    display: flex;
    flex: 1;
    white-space: nowrap;
    overflow-x: scroll;
  }
  .example-row-filename::-webkit-scrollbar {
    display: none;
  }
  .example-text-placeholder {
    color: rgb(138, 138, 138);
  }
  input {
    font-size: smaller;
    height: 32px;
    padding-left: 8px;
    border-color: rgb(235, 235, 235);
    border-width: 1px;
    border-style: solid;
    border-radius: 4px;
  }
  input:hover {
    border-color: rgb(219, 219, 219);
  }
  input:disabled {
    color: rgb(173, 173, 173);
  }
  ::-webkit-scrollbar {
    width: 0px;
    background: transparent;
  }
  hr {
    width: 100%;
    margin-top: 2px;
    margin-bottom: 2px;
    border-top: 1px rgb(235, 235, 235);
    border-left: 0px;
    border-right: 0px;
  }
</style>

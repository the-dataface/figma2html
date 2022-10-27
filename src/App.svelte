<script lang="ts" type="module">
  import "./app.css";

  import { onMount } from "svelte";
  import JSZip from "../node_modules/jszip/dist/jszip.min.js";
  import { Asset, Config, Extension, FileType, HTMLFile, Loading, Scale, Size, Views } from "./types";

  import Panel from "./lib/components/Layout/Panel.svelte";

  import ErrorMessage from "./lib/components/ErrorMessage.svelte";
  import Footer from "./lib/components/Footer.svelte";

  import File from "./lib/components/Controls/File.svelte";
  import Images from "./lib/components/Controls/Images.svelte";
  import Page from "./lib/components/Controls/Page.svelte";
  import Preview from "./lib/components/Controls/Preview.svelte";
  import Text from "./lib/components/Controls/Text.svelte";

  let errorMessage,
    errorTimeout,
    loading = false;

  let views = {};

  interface FileTypeOption {
    value: FileType;
    label: string;
    group: string | null;
    selected: boolean;
  }

  let fileType: FileType | undefined = undefined;
  let fileTypeOptions: FileTypeOption[] = [
    { value: "html", label: "html", group: null, selected: false },
    // { value: "svelte", label: "svelte", group: null, selected: false }, // TO DO
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
    { value: "PNG", label: "png", group: null, selected: false },
    { value: "JPG", label: "jpg", group: null, selected: false },
    { value: "SVG", label: "svg", group: null, selected: false },
  ];

  $: {
    extensionOptions.forEach((o, i) => {
      extensionOptions[i].selected = o.value === extension;
    });
  }

  interface ScaleOption {
    value: Scale;
    label: string;
    selected: boolean;
  }

  let scale: Scale | undefined = undefined;
  let scaleOptions: ScaleOption[] = [
    { value: 1, label: "1x", selected: false },
    { value: 2, label: "2x", selected: false },
    { value: 4, label: "4x", selected: false },
  ];

  $: {
    scaleOptions.forEach((o, i) => {
      scaleOptions[i].selected = o.value === scale;
    });
  }

  let syntax: string | undefined = undefined;
  let includeResizer = true;
  let fluid = true;
  let testingMode = false;
  let centerHtmlOutput = false;
  let applyStyleNames = false;
  let applyHtags = false;
  let styleTextSegments = true;
  let includeGoogleFonts = true;
  let clickableLink: string | undefined = undefined;
  let maxWidth: number | undefined = undefined;
  let imagePath: string | undefined = undefined;
  let altText: string | undefined = undefined;
  let customScript: string | undefined = undefined;

  let nodeCount = 0;
  let exampleAssets: Asset[] = [];
  let exampleFile: HTMLFile;

  $: showLoader = false;

  let showVariablesButton = false;

  const buildConfig = (): Config => {
    return {
      syntax,
      scale,
      extension,
      fileType,
      includeResizer,
      testingMode,
      maxWidth,
      fluid,
      centerHtmlOutput,
      clickableLink,
      imagePath,
      altText,
      applyStyleNames,
      applyHtags,
      styleTextSegments,
      includeGoogleFonts,
      customScript,
    };
  };

  window.onmessage = async (event: MessageEvent) => {
    const message = event.data.pluginMessage;
    const type = message.type;

    if (type === "load") {
      const config = message.config as Config;
      views = message.views as Views;

      syntax = config.syntax;
      extension = config.extension;
      scale = config.scale;
      fileType = config.fileType;
      includeResizer = config.includeResizer;
      testingMode = config.testingMode;
      maxWidth = config.maxWidth;
      fluid = config.fluid;
      centerHtmlOutput = config.centerHtmlOutput;
      clickableLink = config.clickableLink;
      imagePath = config.imagePath;
      altText = config.altText;
      applyStyleNames = config.applyStyleNames;
      applyHtags = config.applyHtags;
      styleTextSegments = config.styleTextSegments;
      includeGoogleFonts = config.includeGoogleFonts;
      customScript = config.customScript;
    } else if (type === "preview") {
      const preview = message.preview;
      nodeCount = preview.nodeCount;
      exampleAssets = preview.exampleAssets;
      exampleFile = preview.exampleFile;
      exampleAssets = await buildPreviewImages(exampleAssets);
      loading = message.loading as Loading;
    } else if (type === "loading") {
      loading = message.loading as Loading;
    } else if (type === "export") {
      const url = await buildZipArchive(message.assets, message.file);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${syntax}.zip`;
      link.click();

      setTimeout(() => {
        loading = false;
      }, 1500);
    } else if (type === "variables") {
      showVariablesButton = message.variables === null;
    } else if (type === "error") {
      setErrorMessage(message.message);
    }
  };

  interface PostMessage {
    type: "init" | "load" | "config" | "export" | "reset" | "saveSettings" | "loadSettings" | "writeVariables";
    config?: Config | null;
  }

  const postMessage = (message: PostMessage) => parent.postMessage({ pluginMessage: message }, "*");

  onMount(() => postMessage({ type: "init" }));

  const onChangeConfig = () => postMessage({ type: "config", config: buildConfig() });
  const onSelectExport = () => {
    loading = true;
    postMessage({ type: "export", config: buildConfig() });
  };
  const onReset = () => postMessage({ type: "reset" });

  const onChangeView = () => {
    parent.postMessage(
      {
        pluginMessage: {
          type: "view",
          views: views,
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

  const setErrorMessage = (message: string) => {
    clearTimeout(errorTimeout);
    errorMessage = message;

    // clear error message after 5 seconds
    errorTimeout = setTimeout(() => {
      errorMessage = undefined;
    }, 3000);
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

  const onWriteVariables = () => {
    parent.postMessage(
      {
        pluginMessage: {
          type: "writeVariables",
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
      const extensionLower = asset.extension.value.toLowerCase();
      let blob = new Blob([asset.data], {
        type: `image/${extensionLower}`,
      });
      zip.file(`${asset.filename}.${extensionLower}`, blob, {
        base64: true,
      });
    });

    let fileBlob = new Blob([file.data], { type: `string` });
    zip.file(`${file.filename}.${file.extension.value.toLowerCase()}`, fileBlob, {
      base64: true,
    });

    const blob = await zip.generateAsync({ type: "blob" });
    const url = window.URL.createObjectURL(blob);

    return url;
  };

  let resizing = false;

  const resizeWindow = (e) => {
    if (!resizing) return;

    const size = {
      w: Math.max(50, Math.floor(e.clientX + 5)),
      h: Math.max(50, Math.floor(e.clientY + 5)),
    };

    parent.postMessage({ pluginMessage: { type: "resize", size: size } }, "*");
  };

  const resizeDown = (e) => {
    resizing = true;
    // e.preventDefault();
    window.addEventListener("mousemove", resizeWindow, true);
    window.addEventListener("mouseup", resizeUp, true);
  };

  const resizeUp = () => {
    resizing = false;
    window.removeEventListener("mousemove", resizeWindow, true);
    window.removeEventListener("mouseup", null);
  };
</script>

<div
  id="corner"
  class="fixed bottom-0 right-0 cursor-se-resize w-4 h-4 z-[999] overflow-hidden"
  on:mousedown={resizeDown}
  on:mouseup={resizeUp}
>
  <i
    class="ml-0.5 absolute text-xs text-gray-300 -rotate-45 -translate-x-1/4 -translate-y-1/4 fa-sharp fa-solid fa-grip-dots top-1/2 left-1/2"
  />
</div>

<div class="flex w-full overflow-hidden content">
  <div class="flex flex-col w-1/3 min-h-full pb-12 control-panel">
    {#if views}
      <Panel title="File settings" bind:expanded={views.file} on:changeView={onChangeView}>
        <File
          bind:fileType
          bind:testingMode
          bind:menuItems={fileTypeOptions}
          bind:syntax
          on:changeConfig={onChangeConfig}
        />
      </Panel>
      <Panel title="Image settings" bind:expanded={views.images} on:changeView={onChangeView}>
        <Images
          bind:scaleOptions
          bind:scale
          bind:extensionOptions
          bind:extension
          bind:imagePath
          bind:altText
          on:changeConfig={onChangeConfig}
        />
      </Panel>
      <Panel title="Page settings" bind:expanded={views.page} on:changeView={onChangeView}>
        <Page
          bind:includeResizer
          bind:centerHtmlOutput
          bind:fluid
          bind:maxWidth
          bind:customScript
          bind:clickableLink
          on:changeConfig={onChangeConfig}
        />
      </Panel>
      <Panel title="Text settings" bind:expanded={views.text} on:changeView={onChangeView}>
        <Text
          bind:showVariablesButton
          bind:styleTextSegments
          bind:applyStyleNames
          bind:applyHtags
          bind:includeGoogleFonts
          on:changeConfig={onChangeConfig}
          on:writeVariables={onWriteVariables}
        />
      </Panel>
    {/if}
  </div>
  <div class="sticky w-2/3 h-full pb-12">
    <Panel title="Output" bind:expanded={views.preview} on:changeView={onChangeView}>
      <Preview bind:exampleAssets bind:exampleFile bind:scale bind:showLoader />
    </Panel>
  </div>
</div>

{#if errorMessage}
  <ErrorMessage {errorMessage} />
{/if}

<Footer
  on:reset={onReset}
  on:export={onSelectExport}
  on:save={onSaveSettings}
  on:load={onLoadSettings}
  bind:nodeCount
/>

<style>
  .content {
    color: var(--figma-color-text);
    min-height: calc(100% + 48px);
  }

  .control-panel {
    border-right: 1px solid var(--figma-color-border);
  }

  .svg-wrapper {
    display: none;
  }

  :global(.setting div) {
    color: var(--figma-color-text) !important;
  }

  :global(input, textarea, .setting button) {
    /* border: 1px solid var(--figma-color-border) !important; */
    border: none !important;
    background-color: var(--figma-color-bg-secondary) !important;
    border-radius: 4px !important;
    color: var(--figma-color-text) !important;
  }

  :global(.setting button) {
    height: 36px !important;
  }

  :global(.input input, .setting button) {
    height: 36px !important;
  }

  :global(svg) {
    fill: var(--figma-color-text) !important;
  }

  :global(button svg) {
    fill: var(--figma-color-text-secondary) !important;
  }

  :global(.content button) {
    background-color: var(--figma-color-bg-secondary) !important;
    border-radius: 4px !important;
    height: 40px !important;
    margin-top: 8px !important;
  }

  :global(.content button:hover) {
    background-color: var(--figma-color-bg-tertiary) !important;
  }

  :global(.content button:focus) {
    outline: 1px solid var(--figma-color-border-selected);
  }

  :global(.content button .label, .content button .placeholder) {
    color: var(--figma-color-text) !important;
    margin-top: 0 !important;
  }

  :global(.content button .caret svg path) {
    fill: var(--figma-color-text-secondary) !important;
  }

  :global(.content button:hover .caret svg path) {
    fill: var(--figma-color-text) !important;
  }

  :global(.content ul li .label) {
    color: var(--figma-color-bg) !important;
  }

  :global(.figma-dark .content ul li .label) {
    color: var(--figma-color-text) !important;
  }
</style>

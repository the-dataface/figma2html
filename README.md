![Cover Art](/src/img/coverArt.png)
# figma2html

Export Figma frames to responsive HTML and CSS. A Figma version of [ai2html](http://ai2html.org), with some extra features.

## Development

### Requirements

- [Node and NPM](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm) - The runtime and package manager
- [Figma Desktop](https://www.figma.com/downloads/) - Required for running plug-ins in development

### Steps 

#### Clone this repo

```bash
git clone https://github.com/the-dataface/figma2html.git
```

#### Build plugin

In a terminal, run `npm run build` to create a build of the project, which is required to run a plugin in development. There should be a `build` folder with three files: `bundle.js`, `index.html`, `main.js`

#### Import plugin

1. From Figma's top menu bar: `Plugins` > `Development` > `Import plugin from manifest`. Select the `manifest.json` file in the cloned `figma2html` directory.

#### Run plugin

From the quick actions bar:

1. `cmd + /` to open the quick actions bar
2. Type `figma2html` and hit enter on the plugin

From menu: 

1. From Figma's top menu: `Plugins` > `Development` > `figma2html`

From resources:

1. `shift + I` top open the resources panel
2. Click `Plugins`
3. Search for `figma2html` and click run

## Instructions

1. Create your artwork
    - Size your frames based on the breakpoints you need for your website (note that breakpoints will be based on the width of your frames and height doesn’t matter).
    - Name the frames your want to export in this format: `#[width]px` (i.e. `#640px`).
    - If you're using a Google Font that's built in to Figma, you'll have the option to automatically include the appropriate Google Fonts tag in your exported HTML. Otherwise, you can add your webfonts to your project yourself or include a custom script or link any custom CSS in the `Page settings` panel.'
2. Run the plugin and configure your settings
    - In the plugin dialog, you can you load your preconfigured settings from a YAML text node named `f2h-settings` on the current page in your Figma doc, or you can write your current settings to a YAML text node.
3. Click Export and voila, you can save your exported images and HTML file as a zipped folder.


## How it Works

- The plugin grabs all frames named `#[width]px` on your current page, unframes all children (turns frames into groups to get positions relative to the parent frame), hides all text layers, and exports as a `PNG`, `JPG`, or `SVG`, at a specified scale.
- All text elements are added via absolutely positioned divs.
- Text is rendered as `<p>` (or header) elements. A style is applied based on the most frequently used style within that frame, with inline styles applied to text that differs. This should match what you see in Figma.
- Text frames with auto widths are rendered with `width=auto`, while text frames with set widths include that width as inline css.
- Text is rendered with any visible drop shadows and layer blurs as inline css.
- The plugin supports rotated text, as well as left/right/center-aligned text.
- If `Include Resizer Script` is turned on, the outputted HTML will include JS to show and hide the correct image at the appropriate size, based on the named width of the frame.

## Options + Features

### File settings

- The inputted Filename will be the name of the outputted zipped folder and HTML file. You can customize this, but will default to the current page name in Figma. This field is required to export.
- Filetype option so far is just `html`. `svelte` is coming soon!
- Turn on `Testing Mode` to keep text visible on exported images. Useful for comparing layouts in the exported HTML vs the designs in Figma.

### Image settings

- Input an `Image scale` to export images at a specified scale.
- `Image format` options include `PNG`, `JPG`, and `SVG`.
- The `Path` field allows you to specify an image path, which will be referenced in the image paths in the outputted HTML. Useful if you will be dropping your outputted files into a larger codebase.
- `Alt text` allows you to add an alt text tag to images in your outputted HTML. This field is required to export.

### Page settings

- Turn on `Include resizer script` to include JS in your outputted file which will show and hide the appropriate image at the appropriate size.
- Turn on `Center HTML output` to center your page content in the outputted HTML.
- Turn on `Fluid` to have the f2h containers fill the width of the screen. If off, f2h containers will maintain the widths at which they were designed in Figma.
- Input a `Max width` in pixels to apply a max width to your page content.
- Include `Custom scripts`, like Typekit tags, to your outputted HTML.

### Text settings

- Turn on `Style text elements` to include inline styles to match the text styles you see in Figma.
- Turn on `Include figma styles` as Classes to include any named styles in Figma as classes on your text elements. Ex. `Desktop/Utility Sans` will be included as `class="utility-sans"`.
- Turn on `Convert Header Styles to H tags` to render text elements containing a header class in Figma (`h1`, `h2`, `h3`, etc.) with the appropriate H tag in the outputted HTML, instead of as a `<p>` element.
- Turn on `Include Google Fonts` to include a Google Fonts tag for included Google Fonts in the outputted HTML.
- **Including custom attributes:** you can include custom attributes on a text layer by naming the layer `[f2h]` followed by a list of attributes in YAML format. For example, a text layer named `[f2h]class:text-sm,font-sans;id:my-text-layer` will render as `<p class="font-sans text-sm" id="my-text-layer">`). Very useful for including Tailwind classes. Note that naming your layers like this will not turn off `Style text elements` for that node, and will still include inline styling for child spans. To rely purely on class names for styling, turn off the `Style text elements` option. (should we change this?)

### Variable Text

You can include variable text within your exportable frames. To do so, you need a text node on the current page named `f2h-variables`. Click the button in the plugin dialog to generate an example node. The text node should be written in YAML with key/value pairs like this:

```yaml
hed: This is a headline
```

Based on the above example, the plugin will ok for any strings in your exportable frames that match the key, wrapped in curly brackets (i.e. `{{hed}}`), and replace it with `This is a headline`. 

Note that it does not replace the text in your artwork, just in the exported html. Running the plugin will reformat the variables text node.


## Support + Feedback

We hope you find this plugin as useful as we do. We're always open to feedback, bug reports and feature suggestions. Feel free to comment on the Figma plugin community page, [open an issue](https://github.com/the-dataface/figma2html/issues) on this repo, or shoot us an email at [sam@thedataface.com](mailto:sam@thedataface.com?subject=FIGMA2HTML").

## Thanks

Many thanks to the [ai2html](http://ai2html.org) team at _The New York Times_, both for inspiration and the code on which this plugin is based. Contributors from the DataFace team include [Sam Vickars](https://twitter.com/samvickars), [Sawyer Click](https://twitter.com/sawyerdabear), and [Michael Hester](https://twitter.com/immichaelhester). The plugin uses some input elements from Thomas Lowry's [Figma Plugin DS Svelte](https://github.com/thomas-lowry/figma-plugin-ds-svelte) library.

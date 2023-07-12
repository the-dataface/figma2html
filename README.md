![figma2html in action](/src/img/coverArt.png)

# [figma2html](https://www.figma.com/community/plugin/1109185297790825980/figma2html)

Export Figma frames to responsive HTML and CSS. A Figma version of [ai2html](http://ai2html.org), with additional features. Created by [The DataFace](https://www.thedataface.com).

[Install the plugin](https://www.figma.com/community/plugin/1109185297790825980/figma2html) on Figma.

## Table of Contents

- [figma2html](#figma2html)
  - [Table of Contents](#table-of-contents)
  - [Instructions](#instructions)
  - [How it Works](#how-it-works)
  - [Options + Features](#options--features)
    - [File settings](#file-settings)
    - [Image settings](#image-settings)
    - [Page settings](#page-settings)
    - [Text settings](#text-settings)
    - [Variable Text](#variable-text)
  - [Contributing + Feedback](#contributing--feedback)
  - [Acknowledgements](#acknowledgements)
  - [License](#license)

## Instructions

1. Create your artwork
   - Size frames according to the desired breakpoints. (note: breakpoints are based on width and not height).
   - Name frames using the following format: `#[width]px` (e.g. `#640px`).
   - If you're using a Google Font that's built in to Figma, you'll have the option to automatically include the appropriate Google Fonts tag in your exported HTML. Otherwise, you can add your webfonts to your project yourself or include a custom script or link any custom CSS in the `Page settings` panel.'
2. Run the plugin and configure your settings
   - In the plugin dialog, you can you load your preconfigured settings from a YAML text node named `f2h-settings` on the current page in your Figma doc, or you can write your current settings to a YAML text node.
3. Click Export and voila, you can save your exported images and HTML file as a zipped folder.

Check out [this demo Figma file](https://www.figma.com/file/THVkWmLhe7TJD16hj0IDIR/figma2html-Demo?node-id=0%3A1) if you need a reference to get started!

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
- Turn on `Include Google Fonts` to include a Google Fonts tag for included Google Fonts in the outputted HTML.
- **Including custom attributes:** you can include custom attributes on a text layer by naming the layer `[f2h]` followed by a list of attributes in HTMl attribute format. For example, a text layer named `[f2h]class="text-sm font-sans" id="my-text-layer"` will render as `<p class="font-sans text-sm" id="my-text-layer">`. This can be useful for including Tailwind and other utility classes. You also can use a reserved `tag` attribute to change the default `<p>` tag to one of your choosing (ex: `[f2h] tag="h1" id="hed" class="text-xl font-bold"` will render `<h1 id="hed" class="text-xl font-bold">`). Note that naming your layers like this will not turn off `Style text elements` for that node, and will still include inline styling for child spans. To rely purely on class names for styling, turn off the `Style text elements` option.

### Variable Text

Variable text is supported for exportable frames (frames prefixed with `#`). To use variables, add a top-level text node on the target page named `f2h-variables`. The plugin's UI offers a button to generate an example variables text node. The text node should be written in [YAML](https://yaml.org/) with key/value pairs:

```yaml
hed: figma2html
dek: Export Figma frames to responsive HTML and CSS. A Figma version of ai2html, with some extra features.
```

To use a variable, wrap a key (e.g. `hed`) in double curly brackets (e.g. `{{hed}}`) in a _visible_ text node. The exported files with replace the key with the appropriate value (e.g. `{{hed}}` -> `figma2html`).

This replacement occurs on the exported files and not on Figma itself, leaving Figma files untouched with `{{key}}` variables and simplifying future edits. Running the plugin will format the variables text node.

## Contributing + Feedback

We welcome feedback, bug reports and feature requests in the form of [Issues](https://github.com/the-dataface/figma2html/issues) or [PRs](https://www.github.com/the-dataface/figma2html/pulls). Alternatively, comments can be left on the Figma plugin community page.

Further information on contributing can be found in [CONTRIBUTING.md](https://www.github.com/the-dataface/figma2html/blob/main/CONTRIBUTING.md).

## Acknowledgements

Figma2html is not possible without [ai2html](https://www.ai2html.org), created by [Archie Tse](https://twitter.com/archietse) at _The New York Times_. Figma2html sprung from the same codebase, modified in time to add additional features specific to the Figma API. The plugin was inspired by [Thomas Lowry](https://www.github.com/thomas-lowry)'s [Figma Plugin DS Svelte](https://www.github.com/thomas-lowry/figma-plugin-ds-svelte) library.

The core team from The DataFace features [Sam Vickars](https://www.twitter.com/samvickars), [Sawyer Click](https://www.sawyer.codes), and [Michael Hester](https://www.twitter.com/immichaelhester).

## License

[MIT](https://www.github.com/the-dataface/figma2html/blob/main/LICENSE)

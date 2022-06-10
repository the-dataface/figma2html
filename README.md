## figma2html

Export Figma frames as responsive images with text elements rendered as HTML. A Figma version of [ai2html](http://ai2html.org), with some extra features. Uses [Figma Plugin DS Svelte](https://github.com/thomas-lowry/figma-plugin-ds-svelte).

### Instructions

1. Create your artwork
    - Size your frames based on the breakpoints you need for your website (note that height breakpoints will be based on the width of your frames and height doesn’t matter).
    - Name the frames your want to export in this format: `#[width]px`.
    - If you're using a Google Font that's built in to Figma, you'll have the option to automatically include the appropriate Google Fonts tag in your exported HTML. Otherwise, make sure you have any necessary webfonts set up in your project and they're named the same as they appear in Figma.
2. Run the plugin and configure your settings
    - In the plugin dialog, you can you load your preconfigured settings from a YAML text node named `f2h-settings` on the current page in your Figma doc, or you can write your current settings to a YAML text node.
3. Click Export and voila, you can save your exported images and HTML file as a zipped folder.


### How it Works
- The plugin grabs all frames named `#[width]px` on your current page, unframes all children (turns frames into groups to get positions relative to the parent frame), hides all text layers, and exports as a `PNG`, `JPG`, or `SVG`, at a specified scale.
- All text elements are added via absolutely positioned divs.
- Text is rendered as `<p>` (or header) elements. A style is applied based on the most frequently used style within that frame, with inline styles applied to text that differs. This should match what you see in Figma.
- Text frames with auto widths are rendered with `width=auto`, while text frames with set widths include that width as inline css.
- Text is rendered with any visible drop shadows and layer blurs as inline css.
- The plugin supports rotated text, as well as left/right/center-aligned text.
- If `Include Resizer Script` is turned on, the outputted HTML will include JS to show and hide the correct image at the appropriate size, based on the named width of the frame.

### Options + Features
**File Output**
- The inputted Filename will be the name of the outputted zipped folder and HTML file. You can customize this, but will default to the current page name in Figma.
- Filetype options include `HTML` and `SVELTE`, but note that the SVELTE option hasn't been fully tested.

**Image Settings**
- Input an `Image Scale` to export images at a specified scale.
- `Image Format` options include `PNG`, `JPG`, and `SVG`.
- The `Path` field allows you to specify an image path, which will be referenced in the image paths in the outputted HTML. Useful if you will be dropping your outputted files into a larger codebase.
- `Alt Text` allows you to add an alt text tag to images in your outputted HTML.

**Page Settings**
- Turn on `Include Resizer Script` to include JS in your outputted file which will show and hide the appropriate image at the appropriate size.
- Turn on `Center HTML Output` to center your page content in the outputted HTML.
- The `Responsiveness` dropdown has two options: `DYNAMIC` means that f2h containers will fill the width of the screen, while `FIXED` forces f2h containers to maintain the widths at which they were designed in Figma.
- Turn on `Testing Mode` to keep text visible on exported images. Useful for comparing layouts in the exported HTML vs the designs in Figma.
- Input a `Max Width` in pixels to apply a max width to your page content.
- Include a `Clickable Link` to wrap your output in an `<a>` tag.

**Text Styles**
- Turn on `Style Text Elements` to include inline styles to match the text styles you see in Figma.
- Turn on `Include Figma Styles` as Classes to include any named styles in Figma as classes on your text elements. Ex. `Desktop/Utility Sans` will be included as `class="utility-sans"`.
- Turn on `Convert Header Styles to H tags` to render text elements containing a header class in Figma (`h1`, `h2`, `h3`, etc.) with the appropriate H tag in the outputted HTML, instead of as a `<p>` element.
- Turn on `Include Google Fonts` to include a Google Fonts tag for included Google Fonts in the outputted HTML.
- **Including custom attributes:** you can include custom attributes on a text layer by naming the layer `[f2h]` followed by a list of attributes in YAML format. For example, a text layer named `[f2h]class:text-sm,font-sans;id:my-text-layer` will render as `<p class="font-sans text-sm" id="my-text-layer">`). Very useful for including Tailwind classes. Note that naming your layers like this will not turn off `Style Text Elements` for that node, and will still include inline styling for child spans. To rely purely on class names for styling, turn off the `Style Text Elements` option. (should we change this?)

**Variable Text**
You can include variable text within your exportable frames. To do so, you need a text node on the current page named `f2h-variables`. Click the button in the plugin dialog to generate an example node. The text node should be written in YAML with key/value pairs like this:
```
hed: This is a headline
```
Based on the above example, the plugin will ok for any strings in your exportable frames that match the key, wrapped in curly brackets (i.e. `{{hed}}`), and replace it with `This is a headline`. 

Note that it does not replace the text in your artwork, just in the exported html. Running the plugin will reformat the variables text node.


### Support + Feedback
We really hope you find this plugin as useful as we do and we're always open to feedback, bug reports, and feature suggestions. Feel free to comment on the Figma plugin community page, add an issue to this repo, or shoot us an email at sam@thedataface.com.

### Thanks
Many thanks to the [ai2html](http://ai2html.org) team at the New York Times, both for inspiration and the code on which this plugin is based. Contributors from the DataFace team include Sam Vickars and Sawyer Click.



## To do

- [x] Export to Svelte file
- [ ] ~~Allow lists within text nodes~~
- [x] Use variables within text nodes
- [x] Allow hyperlinks within text nodes
- [ ] Tailwind classes?
- [ ] CSS vs inline
- [x] Account for linebreaks within text frames
- [x] Option to include Google Fonts tags
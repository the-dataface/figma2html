## figma2html

WORK IN PROGRESS

Export Figma frames as images with text elements rendered as HTML. A Figma version of [ai2html](http://ai2html.org), using [Figma Plugin DS Svelte](https://github.com/thomas-lowry/figma-plugin-ds-svelte).

## Installation

Pull down this repo. Run `npm install`, `npm run dev`, and then `npm run build`. In Figma, go to `Plugins -> Development -> Import plugin from manifest`, navigate to this directory and hit `manifest.json`. Done.

## Instructions

- Lay your artwork out on frames with widths based on your breakpoints.
- Name your frames like `#[width]px` (ie. `#640px`). You can have other frames -- the plugin will only grab frames with that naming convention.
- Run the plugin.
- Check your settings.
- Hit `Save settings` to save as a text layer in you document or `Load settings` to load from a text layer in your document.
- Click export. Your files will be saved as a zipped folder.

## Features
- Grabs all correctly named frames on the active page (ie. `#[width]px`)
- Hides text and exports as JPG or PNG images at specified scale
- Lazy loads images in HTML file
- Adds text elements via HTML and CSS
    - Text is rendered as `<p>` elements, with styles added as css.
    - Option to add Figma style name as a class (ie. `Desktop/Utility Sans` is added as `class="utility-sans"`). When this is turned on, only positioning styles are applied (ie. no `font-family`, `line-height`, `color`, `opacity`, etc.).
    - Option to render text nodes with `<h1>`, `<h2>`, etc. style names as `<h>` elements
    - Option to include Google Fonts tag for included font families
- Option to include the resizer script
- Specify image paths
- Option to apply a max width to the page container
- Option to wrap content in an `<a>` tag
- Option to centre the HTML output
- Save current settings as a JSON text frame or load settings from an existing JSON text frame if present
- Variable text
    - To use, make a text node named `variables` on your current page, or click the button to generate an example.
    - The text node should contain an array of json objects like
    ```
    [
      {
        "key": "hed",
        "value": "This is a headline"
      }
    ]
    ```
    - Based on the above example, figma2html will look for any strings in your exportable frames that match the `key`, wrapped in curly brackets (i.e. `{{hed}}`) and replace with the `value`.
    - Note that it does not replace the text in your artwork, just in the exported html.


## To do

- [x] Export to Svelte file
- [ ] ~~Allow lists within text nodes~~
- [x] Use variables within text nodes
- [x] Allow hyperlinks within text nodes
- [ ] Tailwind classes?
- [ ] CSS vs inline
- [x] Account for linebreaks within text frames
- [x] Option to include Google Fonts tags
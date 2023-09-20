# figma2html

## 1.0.2

### Patch Changes

- Notify users of malformatted YAML ([#101](https://github.com/the-dataface/figma2html/pull/101))

- Remove duplicate variables frame + fix placement ([#101](https://github.com/the-dataface/figma2html/pull/101))

## 1.0.2-beta

### Patch Changes

- Fix text node visibility issue by recursively checking parent visibility. See [Figma's visible docs](https://www.figma.com/plugin-docs/api/properties/nodes-visible/#remarks) for more info. Added a isNodeVisible utils to perform recursion and isFigma2htmlFrame to check if passed node is a valid figma2html frame. ([#98](https://github.com/the-dataface/figma2html/pull/98))

## 1.0.1-beta

### Patch Changes

- Fix text styling #92. Text styles were broken during a prior refactor, causing `font-family` and `font-size` and other critical styles to not be assigned in the resulting files. ([#94](https://github.com/the-dataface/figma2html/pull/94))

- - Frames that were acting as shapes (ie with fills and strokes) were being converted to groups and thus losing their styling. That’s addressed. ([#96](https://github.com/the-dataface/figma2html/pull/96))
  - Missing font family names and missing segments were causing an error in a specific debugging file. I defaulted those cases to ‘Inter Normal’; should be fixed.
  - `Apply header tags` feature has been removed in favor of a more robust attribute application. Now you can set custom attributes via a typical `key="value"` syntax, with `tag="TAGNAME"` reserved for changing the tag from `p` to the desired entry.
  - Fluid width was stretching images (#86). Fixed in #87 and reflected here, by setting image height to `null` when `Fluid container width` is turned on.
  - Text in components and component instances was not being recognized as text and instead was exporting as part of the image. I’ve made it so the `tempFrame` converts frames (that have text children), auto layouts, and components to groups and detaches instances, which means text nodes are have correct positioning, relative to the base frame.
  - We were still seeing invisible text nodes in the final export. I’ve updated `withModificationsForExport` to just remove those nodes from the `tempFrame`.
  - Text positioning was way off. Converting frames with text children to groups helped with part of that and correcting the artboard height and width fixed the rest... I hope?

## 1.0.1-beta

### Patch Changes

- - Ignore empty text nodes. Previously would error when trying to access textNode.styles, which is false. I could not find a way for the Figma plugin API to ignore empty nodes by default so included safeguards in convertTextFrames.ts. ([#88](https://github.com/the-dataface/figma2html/pull/88))
  - Ensure textNode.textStyleId is not a symbol. Text nodes with mixed styles get a symbol as their style id. I added a conditional to ignore that ID and proceed as if none were found.

## 1.0.0-beta

### Major changes

- Initial beta release ([#84](https://github.com/the-dataface/figma2html/pull/84))

---
'figma2html': patch
---

- Frames that were acting as shapes (ie with fills and strokes) were being converted to groups and thus losing their styling. That’s addressed.
- Missing font family names and missing segments were causing an error in a specific debugging file. I defaulted those cases to ‘Inter Normal’; should be fixed.
- `Apply header tags` feature has been removed in favor of a more robust attribute application. Now you can set custom attributes via a typical `key="value"` syntax, with `tag="TAGNAME"` reserved for changing the tag from `p` to the desired entry.
- Fluid width was stretching images (#86). Fixed in #87 and reflected here, by setting image height to `null` when `Fluid container width` is turned on.
- Text in components and component instances was not being recognized as text and instead was exporting as part of the image. I’ve made it so the `tempFrame` converts frames (that have text children), auto layouts, and components to groups and detaches instances, which means text nodes are have correct positioning, relative to the base frame.
- We were still seeing invisible text nodes in the final export. I’ve updated `withModificationsForExport` to just remove those nodes from the `tempFrame`.
- Text positioning was way off. Converting frames with text children to groups helped with part of that and correcting the artboard height and width fixed the rest... I hope?

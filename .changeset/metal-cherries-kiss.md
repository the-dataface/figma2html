---
'figma2html': patch
---

Fix text node visibility issue by recursively checking parent visibility. See [Figma's visible docs](https://www.figma.com/plugin-docs/api/properties/nodes-visible/#remarks) for more info. Added a isNodeVisible utils to perform recursion and isFigma2htmlFrame to check if passed node is a valid figma2html frame.

---
'figma2html': patch
---

- Ignore empty text nodes. Previously would error when trying to access textNode.styles, which is false. I could not find a way for the Figma plugin API to ignore empty nodes by default so included safeguards in convertTextFrames.ts.
- Ensure textNode.textStyleId is not a symbol. Text nodes with mixed styles get a symbol as their style id. I added a conditional to ignore that ID and proceed as if none were found.

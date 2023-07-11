---
'figma2html': patch
---

Fix text styling #92. Text styles were broken during a prior refactor, causing `font-family` and `font-size` and other critical styles to not be assigned in the resulting files.

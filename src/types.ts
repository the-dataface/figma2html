export type Extension = "PNG" | "JPG";
export type FileType = "SVELTE" | "HTML";
export type ConstraintType = "SCALE" | "WIDTH" | "HEIGHT";

export interface Config {
  syntax: string;
  sizeConstraint: string;
  extension: Extension;
  fileType: FileType;
  includeResizer: boolean;
  maxWidth: number;
  centerHtmlOutput: boolean;
  clickableLink: string;
  imagePath: string;
  altText: string;
  applyStyleNames: boolean;
  applyHtags: boolean;
}

export interface Size {
  width: number;
  height: number;
}

export interface Exportable {
  id: string;
  parentName: string;
  size: Size;
}

export interface Asset {
  filename: string;
  extension: Extension;
  size?: Size;
  data: Uint8Array;
  url?: string;
  node: FrameNode;
}

export interface HTMLFile {
  filename: string;
  extension: FileType,
  data: string,
  url?: string
}

export interface PreviewSettings {
  isFinal: boolean;
  thumbSize?: Size;
}

export default {};

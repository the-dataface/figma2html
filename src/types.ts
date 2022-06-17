export type Extension = 'PNG' | 'JPG' | 'SVG';
export type FileType = 'svelte' | 'html';
export type Scale = 1 | 2 | 4;

export interface Config {
	syntax: string;
	scale: Scale;
	extension: Extension;
	fileType: FileType;
	includeResizer: boolean;
	testingMode: boolean;
	fluid: boolean;
	maxWidth: number;
	centerHtmlOutput: boolean;
	clickableLink: string;
	imagePath: string;
	altText: string;
	applyStyleNames: boolean;
	applyHtags: boolean;
	styleTextSegments: boolean;
	includeGoogleFonts: boolean;
}

export interface Variable {
	[key: string]: string;
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
	extension: FileType;
	data: string;
	url?: string;
}

export interface PreviewSettings {
	isFinal: boolean;
	thumbSize?: Size;
}

export default {};

export type Extension = { value: 'PNG', label: 'png', selected: false } | { value: 'JPG', label: 'jpg', selected: false } | { value: 'SVG', label: 'svg', selected: false };
export type FileType = { value: 'html', label: 'html', selected: false } | { value: 'svelte', label: 'svelte', selected: false };
export type Scale = { value: 1, label: "1x", selected: false } | { value: 2, label: "2x", selected: false } | { value: 4, label: "4x", selected: false };
export type Loading = boolean;

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
	customScript: string;
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

export interface Views {
	file: boolean;
	images: boolean;
	page: boolean;
	text: boolean;
	preview: boolean;
}

export default {};

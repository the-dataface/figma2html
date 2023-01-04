export type Extension =
	| { value: 'PNG'; label: 'png'; selected: boolean }
	| { value: 'JPG'; label: 'jpg'; selected: boolean }
	| { value: 'SVG'; label: 'svg'; selected: boolean };
export type FileType =
	| { value: 'html'; label: 'html'; selected: boolean }
	| { value: 'svelte'; label: 'svelte'; selected: boolean };
export type Scale =
	| { value: 1; label: '1x'; selected: boolean }
	| { value: 2; label: '2x'; selected: boolean }
	| { value: 4; label: '4x'; selected: boolean };

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

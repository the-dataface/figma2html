export interface Config {
	name: string;
	scale: Scale;
	format: Format;
	output: Output;
	includeResizer: boolean;
	testingMode: boolean;
	fluid: boolean;
	maxWidth: number;
	centered: boolean;
	imagePath: string;
	alt: string;
	applyStyleNames: boolean;
	applyHtags: boolean;
	styleTextSegments: boolean;
	includeGoogleFonts: boolean;
	customScript: string;
}

export type Loading = boolean;

export type Scale = '1' | '2' | '4';

export type Format = 'JPG' | 'PNG' | 'SVG';

export type Output = 'html' | 'svelte';

export interface Variables {
	[key: string]: string;
}

export interface Size {
	w: number;
	h: number;
}

export interface Panels {
	file: boolean;
	images: boolean;
	page: boolean;
	text: boolean;
	preview: boolean;
}

export interface Exportable {
	id: string;
	parentName: string;
	size: Size;
}

export interface Asset {
	filename: string;
	format: Format;
	size?: Size;
	data: Uint8Array;
	url?: string;
	node: FrameNode;
}

export interface HTMLFile {
	filename: string;
	output: Output;
	data: string;
	url?: string;
}

export interface PreviewSettings {
	isFinal: boolean;
	thumbSize?: Size;
}

export interface PostMessage {
	type:
		| 'init'
		| 'load'
		| 'config'
		| 'export'
		| 'reset-settings'
		| 'save-settings'
		| 'load-settings'
		| 'write-variables';
	config?: Config | null;
}

export default {};

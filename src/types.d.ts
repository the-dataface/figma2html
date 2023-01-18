declare global {
	interface Config {
		filename: string;
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

	type Loading = boolean;

	type Scale = '1' | '2' | '4';

	type Format = 'JPG' | 'PNG' | 'SVG';

	type Output = 'html' | 'svelte';

	interface Variables {
		[key: string]: string;
	}

	interface Size {
		w: number;
		h: number;
	}

	interface Panels {
		file: boolean;
		images: boolean;
		page: boolean;
		text: boolean;
		preview: boolean;
	}

	interface Exportable {
		id: string;
		parentName: string;
		size: Size;
	}

	interface Asset {
		filename: string;
		format: Format;
		size?: Size;
		data: Uint8Array;
		url?: string;
		node: FrameNode;
	}

	interface HTMLFile {
		filename: string;
		output: Output;
		data: string;
		url?: string;
	}

	interface PreviewSettings {
		isFinal: boolean;
		thumbSize?: Size;
	}

	interface PostMessage {
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
}

export {};

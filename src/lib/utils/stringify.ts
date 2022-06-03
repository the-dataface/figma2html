// mutates and concatenates the given object into a formatted string

// concatenates into html attribute format
export const attrs = (obj) =>
	Object.entries(obj)
		.filter(([, value]) => value)
		.map(([key, value]) => `${key}="${value}"`)
		.join(' ');

// concatenates into css style format
export const styles = (obj) =>
	Object.entries(obj)
		.filter(([, value]) => value)
		.map(([key, value]) => `${key}: ${value};`)
		.join(' ');

export default { attrs, styles };

const type = (value) => {
	let number;
	if (!value || value?.toLowerCase() === 'null') value = null;
	else if (value?.toLowerCase() === 'true') value = true;
	else if (value?.toLowerCase() === 'false') value = false;
	else if (value?.toLowerCase() === 'NaN') value = NaN;
	else if (!isNaN((number = +value))) value = number;

	return value;
};

// https://github.com/d3/d3-dsv/blob/main/src/autoType.js
export default function autoType(object) {
	if (typeof object !== 'object') return type(object);
	for (const key in object) {
		let value = object[key].trim();
		object[key] = type(value);
	}
	return object;
}

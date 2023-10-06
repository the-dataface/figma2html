const type = (value) => {
	let number;
	if (!value || value?.toLowerCase() === 'null') value = null;
	else if (value?.toLowerCase() === 'true') value = true;
	else if (value?.toLowerCase() === 'false') value = false;
	else if (value?.toLowerCase() === 'NaN') value = NaN;
	else if (!isNaN((number = +value))) value = number;
	else return value;
};

// https://github.com/d3/d3-dsv/blob/main/src/autoType.js
export default function autoType(object) {
	if (typeof object !== 'object') return type(object);
	for (var key in object) {
		let value = object[key].trim();
		value = type(value);
		object[key] = value;
	}
	return object;
}

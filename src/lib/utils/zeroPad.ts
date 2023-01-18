export default (val, digits) => {
	let str = String(val);
	while (str.length < digits) str = '0' + str;
	return str;
};

export default (val, digits) => {
	var str = String(val);
	while (str.length < digits) str = '0' + str;
	return str;
};

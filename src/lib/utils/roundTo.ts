export default (num, precision) =>
	Math.round(num * Math.pow(10, precision)) / Math.pow(10, precision);

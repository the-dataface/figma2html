import zeroPad from './zeroPad';

export default () => {
	var d = new Date();
	var year = d.getFullYear();
	var date = zeroPad(d.getDate(), 2);
	var month = zeroPad(d.getMonth() + 1, 2);
	var hour = zeroPad(d.getHours(), 2);
	var min = zeroPad(d.getMinutes(), 2);
	return year + '-' + month + '-' + date + ' ' + hour + ':' + min;
};

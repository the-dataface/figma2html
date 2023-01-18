// eslint-disable-next-line no-control-regex
export default (s) => s.replace(/^[\s\uFEFF\xA0\x03]+|[\s\uFEFF\xA0\x03]+$/g, '');

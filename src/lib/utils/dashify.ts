export default (str: string): string => str.replace(/[^\w\s]/gi, '').replace(/\s+/g, '-').toLowerCase();

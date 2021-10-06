/**
 * Array.from(new Set()) -- Create an array from a set.
 * Set cannot have dupliate values, and ignores duplicates by default.
 * Map array of unique properties back to array of objects.
 */
const uniqueByProp = prop => arr => {
	return Array.from(new Set(arr.map(obj => obj[prop]))).map(p =>
		arr.find(obj => obj[prop] === p)
	);
};

export default uniqueByProp;

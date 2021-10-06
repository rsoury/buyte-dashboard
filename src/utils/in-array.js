/*
	Determines if a single value or array of values are in an array.
 */

const inArraySingle = (haystack, needle) =>
	typeof haystack.find(element => element === needle) !== "undefined";

export default (haystack = [], needle) => {
	if (Array.isArray(needle)) {
		const needles = [...needle];
		let allNeedlesExist = true;
		needles.forEach(n => {
			if (!inArraySingle(haystack, n)) {
				allNeedlesExist = false;
			}
		});
		return allNeedlesExist;
	}
	return inArraySingle(haystack, needle);
};

export const inArrayOfObjects = (haystack, key, needle) =>
	typeof haystack.find(element => element[key] === needle) !== "undefined";

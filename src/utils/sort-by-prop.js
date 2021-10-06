/**
 * Sort array of objects by property
 * Only works for properties with string values for now.
 */

const sortByProp = prop => arr => {
	const sorted = [...arr];
	if (typeof prop === "string") {
		sorted.sort((a, b) => {
			const textA = a[prop].toUpperCase();
			const textB = b[prop].toUpperCase();
			if (textA < textB) {
				return -1;
			}
			if (textA > textB) {
				return 1;
			}
			return 0;
		});
	}
	return sorted;
};

export default sortByProp;

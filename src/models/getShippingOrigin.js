import List from "./List";

/* For now, while there is only one origin to set, use List to get the first. */
export default async () => {
	const { items = [] } = await List.shippingOrigins();
	if (items.length) {
		const origin = items[0];
		if (items.length > 1) {
			// Log this to somewhere.
			console.error("Multiple origins for this account.");
			console.error(items);
		}
		return origin;
	}
	return null;
};

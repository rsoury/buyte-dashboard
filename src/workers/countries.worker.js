/*
    This file will be run in a Worker.
    This will alleviate some render lag.
*/

import memoize from "fast-memoize";
import getCountriesInfo from "get-countries-info";
import zeroDecimalCurrencies from "./zero-decimal-currencies.json";

export default memoize(() => {
	const inArray = (haystack, needle) =>
		typeof haystack.find(element => element === needle) !== "undefined";

	const data = getCountriesInfo({});
	const countries = data.map(
		({
			name,
			ISO,
			region,
			subregion,
			currencies,
			languages,
			population,
			provinces
		}) => {
			const isImportant = population >= 15000000;
			const result = {
				name,
				ISO,
				region: region || "Other",
				subregion,
				currency: currencies[0],
				zeroDecimalCurrency: inArray(zeroDecimalCurrencies, currencies[0]),
				language: languages[0]
			};
			if (isImportant) {
				result.provinces = provinces;
			}
			return result;
		}
	);

	countries.sort((a, b) => {
		const textA = a.name.toUpperCase();
		const textB = b.name.toUpperCase();
		if (textA < textB) {
			return -1;
		}
		if (textA > textB) {
			return 1;
		}
		return 0;
	});

	return countries;
});

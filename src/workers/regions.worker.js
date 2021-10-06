import memoize from "fast-memoize";
import getCountries from "./countries.worker";

export default memoize(() => {
	const result = getCountries().reduce((accumulator, currentValue) => {
		const { region, name, ISO } = currentValue;
		const iso = ISO.alpha2;
		const index = accumulator.findIndex(area => area.region === region);
		const country = {
			name,
			iso
		};
		if (index < 0) {
			accumulator.push({
				region,
				countries: [country]
			});
		} else {
			accumulator[index].countries.push(country);
		}
		return accumulator;
	}, []);
	result.forEach(area => {
		area.countries.sort((a, b) => {
			if (a.name < b.name) {
				return -1;
			}
			if (a.name > b.name) {
				return 1;
			}
			return 0;
		});
	});

	return result;
});

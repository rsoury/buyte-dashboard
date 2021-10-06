import memoize from "fast-memoize";
import getCountries from "./countries.worker";

export default memoize(() =>
	getCountries().map(({ name, ISO, currency, zeroDecimalCurrency }) => ({
		name,
		iso: ISO.alpha2,
		currency,
		zeroDecimalCurrency
	}))
);

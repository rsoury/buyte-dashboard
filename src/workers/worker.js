/* eslint-disable prettier/prettier, import/newline-after-import, no-var, vars-on-top, no-restricted-globals */

/*
    This file will be run in a Worker.
*/

import * as MessageTypes from "./workerMessageTypes";
import getCountries from "./countries.worker";
import getRegions from "./regions.worker";
import getCurrencies from "./currencies.worker";

addEventListener("message", event => {
	const { data: messageType } = event;
	switch (messageType) {
		case MessageTypes.COUNTRIES: {
			const countries = getCountries();
			postMessage(countries);
			break;
		}
		case MessageTypes.REGIONS: {
			const regions = getRegions();
			postMessage(regions);
			break;
		}
		case MessageTypes.CURRENCIES: {
			const currencies = getCurrencies();
			postMessage(currencies);
			break;
		}
		default: {
			postMessage(null);
			break;
		}
	}
});

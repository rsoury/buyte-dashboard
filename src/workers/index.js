import * as MessageTypes from "./workerMessageTypes";

const worker = new Worker("./worker.js", {
	type: "module"
});

const getData = type =>
	new Promise(resolve => {
		worker.onmessage = event => {
			resolve(event.data);
		};
		worker.postMessage(type);
	});

export const getCountries = () => getData(MessageTypes.COUNTRIES);
export const getRegions = () => getData(MessageTypes.REGIONS);
export const getCurrencies = () => getData(MessageTypes.CURRENCIES);

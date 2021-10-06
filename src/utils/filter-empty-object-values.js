/* eslint-disable no-unused-vars */

import isEmpty from "is-empty";

export default obj => {
	return Object.entries(obj)
		.filter(([key, value]) => !isEmpty(value))
		.reduce((accumulator, [key, value]) => {
			accumulator[key] = value;
			return accumulator;
		}, {});
};

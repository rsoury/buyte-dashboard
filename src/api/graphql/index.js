import _get from "lodash.get";

import Error from "@/utils/Error";
import * as mutations from "@/api/graphql/mutations";
import * as queries from "@/api/graphql/queries";

import execute from "./execute";

const graphql = {};

const addToApi = (type, object) => {
	graphql[type] = {};
	Object.entries(object).forEach(([key, value]) => {
		// If the function is already defined, use it, otherwise, it's a string.
		if (typeof value === "function") {
			graphql[type][key] = value;
		} else {
			graphql[type][key] = variables =>
				execute(value, variables).then(results => {
					const data = _get(results, `data.${key}`);
					if (typeof data === "undefined") {
						throw new Error(`Cannot get ${type} Data from ${key}`, results);
					}
					return data;
				});
		}
	});
};

addToApi("mutations", mutations);
addToApi("queries", queries);

export default graphql;

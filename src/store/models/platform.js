/* eslint-disable import/prefer-default-export */

import API from "@/api/graphql";

export const platform = {
	state: {
		paymentProviders: [],
		mobileWebPayments: []
	},
	reducers: {
		set(state, payload) {
			return payload;
		}
	},
	effects: dispatch => ({
		async load() {
			const data = await API.queries.getPlatformData();
			dispatch.platform.set(data);
		}
	})
};

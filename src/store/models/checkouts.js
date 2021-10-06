/* eslint-disable import/prefer-default-export */

import List from "@/models/List";
import Checkout from "@/models/Checkout";

export const checkouts = {
	state: null,
	reducers: {
		set(state, payload) {
			return payload;
		},
		add(state, payload) {
			if (Array.isArray(state)) {
				state.unshift(payload);
			}
			return state;
		},
		remove(state, payload) {
			return state.filter(({ id }) => id !== payload);
		}
	},
	effects: dispatch => ({
		async loadCheckouts() {
			// API request.
			const { items } = await List.checkouts();
			dispatch.checkouts.set(items);
		},
		async removeCheckout(payload, rootState) {
			const checkout = rootState.checkouts.find(({ id }) => id === payload);
			await checkout.delete();
			dispatch.checkouts.remove(payload);
		},
		async createCheckout(payload) {
			const checkout = new Checkout();
			await checkout.create(payload);
			dispatch.checkouts.add(checkout);
			return checkout;
		}
	})
};

export const showingCheckoutInformation = {
	state: "",
	reducers: {
		set(state, payload) {
			return payload;
		},
		remove() {
			return "";
		}
	}
};

/* eslint-disable import/prefer-default-export */

import isEmpty from "is-empty";
import _get from "lodash.get";

import getUserAttr from "@/utils/get-user-attr";
import * as userAttributeTypes from "@/constants/user-attribute-types";
import API from "@/api/graphql";
import Functions from "@/api/functions";
import * as eventTypes from "@/constants/event-tracking-types";
import { track } from "@/utils/tracking";
import { isConnect } from "@/utils/user-support";

export const payments = {
	state: {
		balance: {},
		transactions: [],
		payoutsFormUrl: ""
	},
	reducers: {
		setBalance(state, payload) {
			return {
				...state,
				balance: payload
			};
		},
		setTransactions(state, payload) {
			return {
				...state,
				transactions: payload
			};
		},
		setPayoutsFormUrl(state, payload) {
			return {
				...state,
				payoutsFormUrl: payload
			};
		}
	},
	effects: dispatch => ({
		async getAccountBalance(payload, rootState) {
			const getAttr = getUserAttr(rootState.user);
			const region = getAttr(userAttributeTypes.COUNTRY);
			if (isConnect(region)) {
				const id = getAttr(userAttributeTypes.STRIPE_CONNECT_ID);
				if (isEmpty(id)) {
					return {};
				}

				const result = await Functions.getStripeConnectAccountBalance(id);
				const availableBalance = _get(result, "available[0]", {});
				const pendingBalance = _get(result, "pending[0]", {});
				const balance = {
					amount: availableBalance.amount + pendingBalance.amount,
					currency: availableBalance.currency
				};
				dispatch.payments.setBalance(balance);
				track(eventTypes.GET_ACCOUNT_BALANCE, balance);
				return balance;
			}

			const balance = {
				amount: parseInt(getAttr(userAttributeTypes.ACCOUNT_BALANCE) || 0, 10),
				currency: getAttr(userAttributeTypes.CURRENCY)
			};
			track(eventTypes.GET_ACCOUNT_BALANCE, balance);
			dispatch.payments.setBalance(balance);
			return balance;
		},

		async getTransactions() {
			const { items: charges } = await API.queries.listCharges();

			const transactions = charges.map(
				({ feeAmount, createdAt, source, ...charge }) => {
					const fee = isEmpty(feeAmount) ? 0 : feeAmount;
					return {
						type: "payment",
						timestamp: new Date(createdAt).getTime(),
						net: charge.amount - fee,
						fee,
						method: source.paymentMethod,
						...charge
					};
				}
			);

			// Sort by timestamps
			transactions.sort((a, b) => {
				return b.timestamp - a.timestamp;
			});

			dispatch.payments.setTransactions(transactions);

			return transactions;
		},

		async getPayoutsFormUrl(payload, rootState) {
			const { result } = await Functions.getPaymentRailsFormWidgetUrl(
				rootState.user.attributes
			);
			dispatch.payments.setPayoutsFormUrl(result);

			return result;
		}
	})
};

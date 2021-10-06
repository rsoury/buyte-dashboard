/* eslint-disable import/prefer-default-export, no-unused-vars */

import { Auth } from "aws-amplify";
import isEmpty from "is-empty";
import _get from "lodash.get";

import getUserAttr from "@/utils/get-user-attr";
import Functions from "@/api/functions";
import * as userAttributeTypes from "@/constants/user-attribute-types";
import { track, handleException } from "@/utils/tracking";
import * as Chat from "@/utils/chat";
import * as eventTypes from "@/constants/event-tracking-types";

const loadChatSession = user => {
	// Load chat session
	if (isEmpty(user.attributes)) {
		return null;
	}
	return Chat.loadSession({
		email: _get(user, "attributes.email"),
		phone: _get(user, "attributes.phone"),
		name: [
			_get(user, "attributes.given_name"),
			_get(user, "attributes.family_name")
		]
			.filter(name => !isEmpty(name))
			.join(" "),
		company: _get(user, ["attributes", [userAttributeTypes.COMPANY]])
	});
};

const getUserAttributes = userData =>
	Auth.userAttributes(userData).then(a => {
		if (Array.isArray(a)) {
			return a.reduce((attributes, { Name: key, Value: value }) => {
				const attr = attributes;
				attr[key] = value;
				return attr;
			}, {});
		}
		return a;
	});

export const user = {
	state: {},
	reducers: {
		set(state, payload) {
			return payload;
		}
	},
	effects: dispatch => ({
		// Receives Cognito user. If Empty gets current authenticated user.
		async loadUser(_userData) {
			try {
				let userData = _userData;
				if (isEmpty(userData)) {
					userData = await Auth.currentAuthenticatedUser();
				}
				const userAttributes = await getUserAttributes(userData);
				const loadedUser = Object.assign({}, userData, {
					attributes: {
						...userData.attributes,
						...userAttributes
					}
				});

				// loadChatSession(loadedUser);
				dispatch.user.set(loadedUser);
			} catch (e) {
				handleException(e);
				dispatch.user.set(null);
			}
		},
		async unloadUser() {
			try {
				await Auth.signOut();
			} catch (e) {
				handleException(e);
			}
			dispatch.user.set({});
		},
		/**
		 * User attribute update with a fallback in case phone number throws error on Cognito validation.
		 */
		async updateUserAttributes({
			phoneNumber,
			storeName,
			website,
			currency,
			country
		}) {
			const attributes = {
				[userAttributeTypes.LOCALE]: "en-AU",
				[userAttributeTypes.STORE_NAME]: storeName,
				[userAttributeTypes.WEBSITE]: website,
				[userAttributeTypes.CURRENCY]: currency,
				[userAttributeTypes.COUNTRY]: country
			};
			const update = async submittedAttributes => {
				const currentUser = await Auth.currentAuthenticatedUser();
				const result = await Auth.updateUserAttributes(
					currentUser,
					submittedAttributes
				);
				const { attributes: userAttributes } = currentUser;
				const newUser = Object.assign({}, currentUser, {
					attributes: {
						...userAttributes,
						...submittedAttributes
					}
				});
				dispatch.user.set(newUser);

				track(eventTypes.SIGN_UP, newUser.attributes);

				// Ping Slack that a new user has been created.
				Functions.notify({
					text: "New Account Created!",
					fields: newUser.attributes
				});

				return result;
			};

			try {
				await update({
					[userAttributeTypes.PHONE_NUMBER]: phoneNumber,
					[userAttributeTypes.CUSTOM_PHONE_NUMBER]: phoneNumber,
					...attributes
				});
			} catch (e) {
				handleException(new Error("Invalid phone number in use", phoneNumber));
				if (
					e.message.includes("phone") &&
					e.code === "InvalidParameterException"
				) {
					try {
						const result = await update({
							[userAttributeTypes.CUSTOM_PHONE_NUMBER]: phoneNumber,
							...attributes
						});
						if (result !== "SUCCESS") {
							handleException(
								new Error(
									"Something went wrong updating user attributes",
									result
								)
							);
						}
					} catch (subErr) {
						handleException(subErr);
					}
				} else {
					handleException(e);
				}
			}
		}
	})
};

// User Accounts
export const accounts = {
	state: {
		stripeConnect: {},
		bank: {}
	},
	reducers: {
		setStripeConnect(state, payload) {
			return {
				...state,
				stripeConnect: payload
			};
		},
		setBank(state, payload) {
			return {
				...state,
				bank: payload
			};
		}
	},
	effects: dispatch => ({
		async getStripeConnectAccount(payload, rootState) {
			const id = _get(rootState.user, [
				"attributes",
				userAttributeTypes.STRIPE_CONNECT_ID
			]);

			let account = {};
			if (isEmpty(id)) {
				// create account.
				account = await Functions.createStripeConnectAccount(
					_get(rootState.user, "attributes")
				);
				// Update user attribute
				const currentUser = await Auth.currentAuthenticatedUser();
				const userAttributes = await getUserAttributes(currentUser);
				const newAttributes = {
					[userAttributeTypes.STRIPE_CONNECT_ID]: account.id
				};
				await Auth.updateUserAttributes(currentUser, newAttributes);
				// Update user in state after attribute update.
				const newUser = Object.assign({}, currentUser, {
					attributes: {
						...userAttributes,
						...newAttributes
					}
				});
				dispatch.user.set(newUser);
				track(eventTypes.CREATE_STRIPE_CONNECT_ACCOUNT, {
					id: account.id,
					user: newUser.attributes.sub
				});
			} else {
				// retrieve account data.
				account = await Functions.getStripeConnectAccount(id);
				track(eventTypes.GET_STRIPE_CONNECT_ACCOUNT, {
					id: account.id,
					user: getUserAttr(rootState.user)(userAttributeTypes.ID)
				});
			}

			dispatch.accounts.setStripeConnect(account);
			const bank = _get(account, "external_accounts.data[0]");
			if (!isEmpty(bank)) {
				dispatch.accounts.setBank(bank);
			}
			return account;
		},

		async createBankAccount(payload, rootState) {
			let id = _get(rootState.user, [
				"attributes",
				userAttributeTypes.STRIPE_CONNECT_ID
			]);

			// If id doesn't exist, create one.
			if (isEmpty(id)) {
				const account = await dispatch.accounts.getStripeConnectAccount();
				const { id: _id } = account;
				id = _id;
			}

			// Retrieves whole account because the process of attaching a bank account changes the whole account.
			const account = await Functions.createStripeBankAccount(id, payload);
			const bankAccount = _get(account, "external_accounts.data[0]");
			dispatch.accounts.setStripeConnect(account);
			dispatch.accounts.setBank(bankAccount);
			track(eventTypes.SETUP_BANK_ACCOUNT, {
				id: account.id,
				user: getUserAttr(rootState.user)(userAttributeTypes.ID)
			});
			return bankAccount;
		},

		async getBankAccount(payload, rootState) {
			const { bank, stripeConnect } = rootState.accounts;
			const getBankAccountTrack = id =>
				track(eventTypes.GET_BANK_ACCOUNT, {
					id,
					user: getUserAttr(rootState.user)(userAttributeTypes.ID)
				});

			if (!isEmpty(bank)) {
				getBankAccountTrack(stripeConnect.id);
				return bank;
			}

			if (!isEmpty(stripeConnect)) {
				const bankAccount = _get(stripeConnect, "external_accounts.data[0]");
				dispatch.accounts.setBank(bankAccount);
				getBankAccountTrack(stripeConnect.id);
				return bankAccount;
			}

			// retrieve account data.
			const id = getUserAttr(rootState.user)(
				userAttributeTypes.STRIPE_CONNECT_ID
			);
			if (!isEmpty(id)) {
				const account = await Functions.getStripeConnectAccount(id);
				dispatch.accounts.setStripeConnect(account);
				const retrievedBankAccount = _get(account, "external_accounts.data[0]");
				dispatch.accounts.setBank(retrievedBankAccount);
				getBankAccountTrack(account.id);
				return retrievedBankAccount;
			}

			return {};
		}
	})
};

import axios from "axios";
import isEmpty from "is-empty";
import {
	STRIPE_CONNECT_ID,
	STRIPE_TEST_CONNECT_ID,
	FUNCTIONS_URL,
	IS_PROD as isProd
} from "@/constants/env";

const request = axios.create({
	baseURL: FUNCTIONS_URL
});

class Functions {
	static getPaymentRailsFormWidgetUrl(user) {
		return request
			.get(`/pr/widget`, {
				params: user
			})
			.then(({ data }) => data);
	}

	static getStripeConnectUrl(isExpress = false, _isTest = false) {
		const isTest = _isTest || !isProd;
		return `https://connect.stripe.com${
			isExpress ? `/express` : ``
		}/oauth/authorize?response_type=code&client_id=${
			isTest ? STRIPE_TEST_CONNECT_ID : STRIPE_CONNECT_ID
		}&scope=read_write&redirect_uri=${this.getStripeConnectRedirectUrl(
			isTest
		)}`;
	}

	static getStripeStandardConnectUrl(isTest = false) {
		return this.getStripeConnectUrl(false, isTest);
	}

	static getStripeExpressConnectUrl(prefills = {}, isTest = false) {
		return (
			this.getStripeConnectUrl(true, isTest) +
			Object.entries(prefills)
				.filter(keyVal => !isEmpty(keyVal[1]))
				.reduce((accumulator, [key, value]) => {
					let a = accumulator;
					a += `&${key}=${value}`;
					return a;
				}, "")
		);
	}

	static getStripeConnectRedirectUrl(isTest = false) {
		return `${FUNCTIONS_URL}/stripe/${isTest ? "test-" : ""}connect`;
	}

	static getStripeExpressAccountLink(id, params, options = {}) {
		const isTest = options.isTest || !isProd;
		return request
			.get(`/stripe/accounts/${id}/link/${isTest ? "test/" : ""}`, {
				params: {
					redirectUrl: this.getStripeConnectRedirectUrl(isTest),
					...params
				}
			})
			.then(({ data }) => data);
	}

	static createStripeConnectAccount(params, options = {}) {
		const isTest = options.isTest || !isProd;
		return request
			.post(`/stripe/accounts/${isTest ? "test/" : ""}`, params)
			.then(({ data }) => data);
	}

	static getStripeConnectAccount(id, options = {}) {
		const isTest = options.isTest || !isProd;
		return request
			.get(`/stripe/accounts/${id}/${isTest ? "test/" : ""}`)
			.then(({ data }) => data);
	}

	static getStripeConnectAccountBalance(id, options = {}) {
		const isTest = options.isTest || !isProd;
		return request
			.get(`/stripe/accounts/${id}/balance/${isTest ? "test/" : ""}`)
			.then(({ data }) => data);
	}

	static getStripeConnectAccountTransactions(id, options = {}) {
		const isTest = options.isTest || !isProd;
		return request
			.get(`/stripe/accounts/${id}/transactions/${isTest ? "test/" : ""}`)
			.then(({ data }) => data);
	}

	static createStripeBankAccount(id, params, options = {}) {
		const isTest = options.isTest || !isProd;
		return request
			.post(`/stripe/accounts/${id}/bank/${isTest ? "test/" : ""}`, params)
			.then(({ data }) => data);
	}

	static connectToAdyen(params) {
		return request.post("/adyen/connect", params).then(({ data }) => data);
	}

	static getAdyenGenTime() {
		return request.get("/adyen/generation-time").then(({ data }) => data);
	}

	static getPublicKey(params) {
		return request
			.get("/keys/public", { params })
			.then(({ data }) => data)
			.then(({ key }) => key);
	}

	static getSecretKey(params) {
		return request
			.get("/keys/secret", {
				params
			})
			.then(({ data }) => data)
			.then(({ key }) => key);
	}

	static notify(params) {
		return request.post("/notify/", params).then(({ data }) => data);
	}
}

export default Functions;

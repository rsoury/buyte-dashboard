const axiosRetry = require("axios-retry");
const uuid = require("uuid/v4");
const axios = require("axios");
const initStripe = require("stripe");
const Sentry = require("@sentry/node");
const {
	STRIPE_API_LIVE_SECRET,
	STRIPE_API_TEST_SECRET
} = require("../constants/env");

const Stripe = (isTest = false) =>
	initStripe(isTest ? STRIPE_API_TEST_SECRET : STRIPE_API_LIVE_SECRET);

const request = axios.create();
axiosRetry(request, { retries: 3 });

const connect = (isTest = false) => async (req, res) => {
	const { code: accessToken, error } = req.query;
	// If route hit without code or error...
	if (!accessToken && !error) {
		return res.status(200).render("stripe", {
			message: "Redirecting your back to Buyte.",
			connected: false,
			data: ""
		});
	}
	// if route hit with error.
	if (!accessToken && !!error) {
		return res
			.status(400)
			.send(`Could not connect Buyte to ${isTest ? "[Test] " : ""}Stripe`);
	}
	// if route successfully hit post stripe oauth
	try {
		const idempotencyKey = uuid();
		const result = await request
			.post(
				"https://connect.stripe.com/oauth/token",
				{
					client_secret: !isTest
						? STRIPE_API_LIVE_SECRET
						: STRIPE_API_TEST_SECRET,
					grant_type: "authorization_code",
					code: accessToken
				},
				{
					headers: {
						"Idempotency-Key": idempotencyKey
					}
				}
			)
			.then(({ data }) => data);

		return res.status(200).render("stripe", {
			message: "Thank you for connecting with Buyte!",
			connected: true,
			data: JSON.stringify(result)
		});
	} catch (e) {
		// Log Exception.
		req.log.error(e);
		return res
			.status(400)
			.send(`Error connecting Buyte to ${isTest ? "[Test] " : ""}Stripe`);
	}
};

const createAccount = (isTest = false) => async (req, res, next) => {
	const userAttributes = req.body;
	const stripe = Stripe(isTest);
	const params = {
		type: "custom",
		country: userAttributes["custom:country"],
		email: userAttributes.email,
		default_currency: userAttributes["custom:currency"]
	};
	if (params.country === "US") {
		params.requested_capabilities = ["card_payments", "transfers"];
	}

	try {
		const account = await stripe.accounts.create(params);

		req.log.info(`${account.id} : Stripe account created!`);

		return res.status(200).send(account);
	} catch (e) {
		return next(e);
	}
};

const getAccount = (isTest = false) => async (req, res, next) => {
	const { id } = req.params;
	const stripe = Stripe(isTest);

	try {
		const account = await stripe.accounts.retrieve(id);
		if (account.business_type === "company") {
			account.persons = await stripe.accounts.listPersons(account.id, {
				relationship: { account_opener: true, owner: true },
				limit: 100
			});
		}

		return res.status(200).send(account);
	} catch (e) {
		return next(e);
	}
};

const getBalance = (isTest = false) => async (req, res, next) => {
	const { id } = req.params;
	const stripe = Stripe(isTest);
	try {
		const balance = await stripe.balance.retrieve({ stripe_account: id });
		return res.send(balance);
	} catch (e) {
		return next(e);
	}
};

const getTransactions = (isTest = false) => async (req, res, next) => {
	const { id } = req.params;
	const stripe = Stripe(isTest);
	try {
		const transactions = await stripe.balanceTransactions.list({
			limit: 100,
			stripe_account: id
		});
		return res.send(transactions);
	} catch (e) {
		return next(e);
	}
};

const createBankAccount = (isTest = false) => async (req, res, next) => {
	const { id: accountId } = req.params;
	const { person, bank } = req.body;
	const stripe = Stripe(isTest);
	try {
		// External Account / Bank Account
		const externalAccountParams = {
			object: "bank_account",
			country: person["custom:country"],
			currency: person["custom:currency"],
			account_number: bank.accountNumber
		};
		if (bank.routingNumber) {
			externalAccountParams.routing_number = bank.routingNumber;
		}

		// Update account creating person/relationship
		const result = await stripe.accounts.update(accountId, {
			external_account: externalAccountParams
		});

		req.log.info(`${result.id} : Account Updated!`);

		return res.status(200).send(result);
	} catch (e) {
		// If this fails, send the bank account details to a store instead of throwing a failure.
		// This way we can investigate and work with a manual Payouts platform instead.
		Sentry.captureException(e);
		return next(e);
	}
};

const getAccountLink = (isTest = false) => async (req, res, next) => {
	const { id: accountId } = req.params;
	const { successUrl, failureUrl, redirectUrl } = req.query;
	const stripe = Stripe(isTest);
	let { isUpdate } = req.query;
	if (typeof isUpdate === "string") {
		isUpdate = isUpdate === "true";
	}

	try {
		const params = {
			account: accountId,
			success_url: successUrl || redirectUrl,
			failure_url: failureUrl || redirectUrl
		};
		if (typeof isUpdate === "boolean") {
			params.type = isUpdate
				? "custom_account_update"
				: "custom_account_verification";
		}
		const link = await stripe.accountLinks.create(params);

		return res.status(200).send(link);
	} catch (e) {
		return next(e);
	}
};
const expressAccountSuccess = () => async (req, res) => {
	return res.status(200).render("stripe-express-success", {
		connected: true,
		data: { hello: "world" }
	});
};
const expressAccountFailure = () => async (req, res) => {
	return res.status(200).render("stripe-express-success", {
		connected: true,
		data: { hello: "world" }
	});
};

module.exports = {
	connect,
	createAccount,
	createBankAccount,
	getAccount,
	getBalance,
	getTransactions,
	getAccountLink,
	expressAccountSuccess,
	expressAccountFailure
};

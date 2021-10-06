const axios = require("axios");
const axiosRetry = require("axios-retry");
const uuid = require("uuid/v4");
const { IS_PROD } = require("../constants/env");

const connect = () => async (req, res, next) => {
	const {
		isTest = false,
		merchantAccount,
		username,
		password,
		liveUrlPrefix,
		adyenEncryptedData
	} = req.body;

	const authKey = Buffer.from(`${username}:${password}`).toString("base64");
	const idempotencyKey = uuid();
	const request = axios.create({
		baseURL: `https://${
			!isTest
				? `${liveUrlPrefix}-pal-live.adyenpayments.com`
				: "pal-test.adyen.com"
		}/`,
		headers: {
			"Content-Type": "application/json",
			Authorization: `Basic ${authKey}`,
			"Idempotency-Key": idempotencyKey
		}
	});
	axiosRetry(request, { retries: 3 });

	try {
		const result = await request
			.post(`/pal/servlet/Payment/v40/authorise`, {
				additionalData: {
					"card.encrypted.json": adyenEncryptedData
				},
				amount: {
					value: 10,
					currency: "AUD"
				},
				reference: `Buyte: Connect Test - ${uuid()}`,
				merchantAccount
			})
			.then(({ data }) => data);

		return res.status(200).send({
			...(IS_PROD
				? {
						result
				  }
				: {}),
			connected: true
		});
	} catch (e) {
		req.log.error(e);
		return next(e);
	}
};

const generationTime = () => (req, res) =>
	res.status(200).send({
		generationTime: new Date().toISOString()
	});

module.exports = { connect, generationTime };

const crypto = require("crypto");
const url = require("url");
// const paymentrails = require("paymentrails");

const {
	// IS_PROD,
	PAYMENT_RAILS_ACCESS_KEY,
	PAYMENT_RAILS_SECRET_KEY
} = require("../constants/env");

// const client = paymentrails.connect({
// 	key: PAYMENT_RAILS_ACCESS_KEY,
// 	secret: PAYMENT_RAILS_SECRET_KEY,
// 	environment: IS_PROD ? "production" : "development"
// });

const getWidget = () => async (req, res) => {
	const {
		given_name: firstName,
		family_name: lastName,
		"custom:country": country,
		email,
		sub: referenceId
	} = req.query;

	const widgetBaseUrl = new url.URL("https://widget.paymentrails.com");
	const querystring = new url.URLSearchParams({
		ts: Math.floor(new Date().getTime() / 1000),
		key: PAYMENT_RAILS_ACCESS_KEY,
		email,
		refid: referenceId,
		hideEmail: "false", // optional parameter: if 'true', hides the email field
		roEmail: "true", // optional parameter: if 'true', renders the email field as Read Only
		payoutMethods: "bank-transfer,paypal", // optional parameter: filters the possible payout methods shown on the widget
		locale: "en", // optional parameter: ISO 639-1 language code, changes the language of the widget,
		"addr.firstName": firstName,
		"addr.lastName": lastName,
		"addr.country": country
	}).toString();

	const hmac = crypto.createHmac("sha256", PAYMENT_RAILS_SECRET_KEY);
	hmac.update(querystring);
	const signature = hmac.digest("hex");
	widgetBaseUrl.search = `${querystring}&sign=${signature}`;

	// you can send the link to your view engine
	const widgetLink = widgetBaseUrl.toString();

	res.send({ result: widgetLink });
};

module.exports = { getWidget };

const adyen = require("./adyen");
const stripe = require("./stripe");
const keys = require("./keys");
const notify = require("./notify");
const paymentRails = require("./payment-rails");

const routes = app => {
	app.prefix("/adyen", route => {
		route.post("/connect", adyen.connect());
		route.get("/generation-time", adyen.generationTime());
	});

	app.prefix("/stripe", route => {
		route.get("/connect", stripe.connect());
		route.get("/test-connect", stripe.connect(true));

		route.prefix("/accounts", accountsRoute => {
			accountsRoute.get("/:id/", stripe.getAccount());
			accountsRoute.get("/:id/test/", stripe.getAccount(true));
			accountsRoute.post("/", stripe.createAccount());
			accountsRoute.post("/test/", stripe.createAccount(true));

			accountsRoute.get("/:id/balance/", stripe.getBalance());
			accountsRoute.get("/:id/balance/test/", stripe.getBalance(true));
			accountsRoute.get("/:id/transactions/", stripe.getTransactions());
			accountsRoute.get(
				"/:id/transactions/test/",
				stripe.getTransactions(true)
			);

			accountsRoute.post("/:id/bank/", stripe.createBankAccount());
			accountsRoute.post("/:id/bank/test/", stripe.createBankAccount(true));

			accountsRoute.get("/:id/link/", stripe.getAccountLink());
			accountsRoute.get("/:id/link/test/", stripe.getAccountLink(true));
		});

		route.get("/express/success", stripe.expressAccountSuccess());
		route.get("/express/failure", stripe.expressAccountFailure());
	});

	app.prefix("/keys", route => {
		route.get("/public", keys.public());
		route.get("/secret", keys.secret());
	});

	app.prefix("/notify", route => {
		route.post("/", notify.newNotificaton());
	});

	app.prefix("/pr", route => {
		route.get("/widget", paymentRails.getWidget());
	});
};

module.exports = routes;

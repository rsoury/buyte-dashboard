const env = {
	IS_PROD: process.env.NODE_ENV === "production"
};
[
	"STRIPE_API_LIVE_SECRET",
	"STRIPE_API_TEST_SECRET",
	"DASHBOARD_URL",
	"SLACK_WEBHOOK_URL",
	"SENTRY_DSN",
	"PAYMENT_RAILS_ACCESS_KEY",
	"PAYMENT_RAILS_SECRET_KEY"
].forEach(envVar => {
	env[envVar] = process.env[envVar];
});

module.exports = env;

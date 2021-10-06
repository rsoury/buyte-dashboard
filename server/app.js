/* eslint-disable no-multi-assign */

const express = require("express");
const cors = require("cors");
const pino = require("pino")();
const pinoExpress = require("pino-express");
const favicon = require("serve-favicon");
const path = require("path");
const Sentry = require("@sentry/node");
const env = require("./constants/env");
const routes = require("./routes");

const isProd = env.IS_PROD;

// Add prefix route grouping
express.application.prefix = express.Router.prefix = function groupByPrefix(
	routePath,
	configure
) {
	const router = express.Router();
	this.use(routePath, router);
	configure(router);
	return router;
};

const app = express();

// Error tracking middleware.
if (isProd) {
	Sentry.init({ dsn: env.SENTRY_DSN });
	// The request handler must be the first middleware on the app
	app.use(Sentry.Handlers.requestHandler());
	// The error handler must be before any other error middleware
	app.use(Sentry.Handlers.errorHandler());
}

// add middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());
app.use(pinoExpress(pino));
app.use(favicon(path.resolve(__dirname, "public/favicon.ico")));

// set the view engine to ejs
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));

// Production middlware / config
if (isProd) {
	app.disable("x-powered-by");
}

routes(app);

// catch 404 and forward to error handler
app.use((req, res, next) => {
	const err = new Error("Not Found");
	err.status = 404;
	next(err);
});

// production error handler
// no stacktraces leaked to user
app.use((err, req, res) => {
	req.log.error(err);
	res.status(err.status || 500);
	res.json(
		isProd
			? {
					object: "error",
					type: err.status,
					message: err.message
			  }
			: {
					object: "error",
					type: err.status,
					message: err.message,
					trace: err
			  }
	);
});

module.exports = app;

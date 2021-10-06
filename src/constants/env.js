let prod = process.env.NODE_ENV === "production";
const force = process.env.REACT_APP_FORCE_ENV;
if (force) {
	prod = force === "production";
}
export const IS_PROD = prod;
export const AUTH_DOMAIN = process.env.REACT_APP_AUTH_DOMAIN;
export const PUBLIC_URL = process.env.REACT_APP_PUBLIC_URL;
export const STRIPE_CONNECT_ID = process.env.REACT_APP_STRIPE_CONNECT_ID;
export const STRIPE_TEST_CONNECT_ID =
	process.env.REACT_APP_STRIPE_TEST_CONNECT_ID;
export const AWS_CONFIG = process.env.AWS_CONFIG || {};
export const FUNCTIONS_URL = process.env.REACT_APP_FUNCTIONS_URL;
export const EVENT_TRACKING = process.env.REACT_APP_EVENT_TRACKING === "true";
export const AMPLITUDE_API_KEY = process.env.REACT_APP_AMPLITUDE_API_KEY;
export const SENTRY_DSN = process.env.REACT_APP_SENTRY_DSN;
export const LOGROCKET_KEY = process.env.REACT_APP_LOGROCKET_KEY;

// Dev env vars
export const REDUX_LOGGER = process.env.REACT_APP_REDUX_LOGGER !== "false";

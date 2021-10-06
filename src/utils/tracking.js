/* eslint-disable no-console */
// A single config and functions concerning error, user, session, etc. Tracking

import amplitude from "amplitude-js";
import LogRocket from "logrocket";
import * as Sentry from "@sentry/browser";
import ono from "ono";
import setupLogRocketReact from "logrocket-react";
import {
	IS_PROD,
	EVENT_TRACKING,
	AMPLITUDE_API_KEY,
	SENTRY_DSN,
	LOGROCKET_KEY
} from "@/constants/env";

// Initialise tools.
export const initTracking = () => {
	if (IS_PROD) {
		if (EVENT_TRACKING) {
			amplitude.getInstance().init(AMPLITUDE_API_KEY);
		}
		const sentryConfig = {
			dsn: SENTRY_DSN,
			environment: IS_PROD ? "production" : "development"
		};
		Sentry.init(sentryConfig);
		if (LOGROCKET_KEY) {
			LogRocket.init(LOGROCKET_KEY);
			setupLogRocketReact(LogRocket);
			LogRocket.getSessionURL(sessionURL => {
				Sentry.configureScope(scope => {
					scope.setExtra("sessionURL", sessionURL);
				});
			});
		}
	}
};

// Function that accepts error and some message for error tracking.
export const handleException = (e, properties, message) => {
	if (e) {
		if (IS_PROD) {
			const err = ono(e, properties, message);
			Sentry.captureException(err);
		} else {
			console.error(e, properties, message);
		}
	}
};

// Identify user for tracking purposes.
export const identifyUser = (id, traits = {}) => {
	if (!id) {
		return;
	}
	if (IS_PROD) {
		if (EVENT_TRACKING) {
			amplitude.getInstance().setUserId(id);
			amplitude.getInstance().setUserProperties(traits);
			LogRocket.identify(id, traits);
		}
		Sentry.configureScope(scope => {
			scope.setUser({ id });
		});
	} else {
		console.log(`Indetified user:`, id, traits);
	}
};

// Track events.
export const track = (eventType, eventProperties) => {
	if (IS_PROD && EVENT_TRACKING) {
		amplitude.getInstance().logEvent(eventType, eventProperties);
	} else {
		console.log(`Track:`, eventType, ":", eventProperties);
	}
};

// Get background tracking info
export const getBackgroundInfo = () => {
	return amplitude.getInstance().options;
};

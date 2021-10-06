import { init } from "@rematch/core";
import createLoadingPlugin from "@rematch/loading";
import * as models from "./models";
import { IS_PROD, REDUX_LOGGER } from "@/constants/env";

export default async function createStore() {
	const middlewares = [];
	if (!IS_PROD) {
		if (REDUX_LOGGER) {
			const { createLogger } = await import("redux-logger");
			middlewares.push(createLogger({ collapsed: true }));
		}
	}

	// Rematch middleware to prevent effects from running if they're already in loading state.
	const preventLoadingEffects = {
		middleware: store => next => action => {
			const [name, actionName] = action.type.split("/");
			const model = store.getState().loading.effects[name];
			if (typeof model !== "undefined" && typeof actionName !== "undefined") {
				if (model[actionName]) {
					return null;
				}
			}

			return next(action);
		}
	};

	const store = init({
		models,
		plugins: [createLoadingPlugin({}), preventLoadingEffects],
		redux: {
			middlewares,
			devtoolOptions: {
				disabled: IS_PROD
			}
		}
	});
	return store;
}

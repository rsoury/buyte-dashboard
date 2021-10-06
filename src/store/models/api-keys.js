/* eslint-disable import/prefer-default-export */

import Functions from "@/api/functions";

export const apiKeys = {
	state: {
		public: "",
		secret: ""
	},
	reducers: {
		set(state, payload) {
			return {
				...state,
				...payload
			};
		}
	},
	effects: dispatch => ({
		async loadPublicKey(payload, { user }) {
			const publicKey = await Functions.getPublicKey({
				username: user.username,
				userPoolId: user.pool.userPoolId
			});
			dispatch.apiKeys.set({ public: publicKey });
		},
		async loadSecretKey(payload, { user }) {
			const secretKey = await Functions.getSecretKey({
				username: user.username,
				userPoolId: user.pool.userPoolId
			});
			dispatch.apiKeys.set({ secret: secretKey });
		}
	})
};

/*
    This is a Test Setup File used in beforeAll/beforeEach to setup the API before testing with GraphQL related files.
 */

import "colors";
import isEmpty from "is-empty";
import Amplify, { Auth } from "aws-amplify";

const logger = require("tracer").console();

export default async () => {
	const username = process.env.USERNAME;
	const password = process.env.PASSWORD;
	if (!username || !password) {
		logger.error(
			"Please provide Username and Password as Test Environment Variables (.env.test.local) to run this Test."
				.red
		);
		return () => {};
	}
	console.log("Starting Test Setup...".grey);
	try {
		const env = process.env.REACT_APP_FORCE_ENV || process.env.NODE_ENV;
		let awsConfigImport = {};
		const awsConfigEnv =
			process.env.AWS_AMPLIFY_ENV || (env === "production" ? "prod" : "dev");
		try {
			awsConfigImport = await import(`./aws-exports.${awsConfigEnv}.js`);
		} catch (e) {
			logger.debug(e);
		}
		try {
			awsConfigImport = await import(`./aws-exports.js`);
		} catch (e) {
			logger.debug(e);
		}
		const awsConfig = isEmpty(awsConfigImport.default)
			? awsConfigImport
			: awsConfigImport.default;
		if (isEmpty(awsConfig)) {
			throw new Error(
				"Cannot find AWS Config. Please copy/symlink your 'aws-exports.js' from Amplify Environment/Directory into this project's root directory, or add AWS Environment variables."
			);
		}
		Amplify.configure(awsConfig);
		await Auth.signIn({ username, password });
		console.log("User Authenticated!".green);
		return () =>
			Auth.signOut().then(() => {
				console.log("User Signed Out!".green);
			});
	} catch (e) {
		logger.error(e);
	}
	return () => {};
};

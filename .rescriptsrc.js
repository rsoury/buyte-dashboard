const path = require("path");
const {
	appendWebpackPlugin,
	editWebpackPlugin
} = require("@rescripts/utilities");
const WorkerPlugin = require("worker-plugin");
const set = require("lodash.set");
const get = require("lodash.get");
const fs = require("fs");
const isEmpty = require("is-empty");
const requireES6 = require("esm")(module);

const { alias, jestModuleNameMapper } = require("./shared-config");

const mw = fn => Object.assign(fn, { isMiddleware: true });

const addAlias = mw(config => {
	const existingAlias = get(config, "resolve.alias", {});
	config = set(
		config,
		"resolve.alias",
		Object.assign({}, existingAlias, alias)
	);
	return config;
});

const addWorkerPlugin = mw(config =>
	appendWebpackPlugin(new WorkerPlugin(), config)
);

const addAWSConfig = mw(config => {
	const env = process.env.REACT_APP_FORCE_ENV || process.env.NODE_ENV;
	// Check if aws-exports.js exists, otherwise, aws-exports.dev.js or aws-exports.prod.js
	let awsConfigImport = {};
	const awsConfigEnv =
		process.env.AWS_AMPLIFY_ENV || (env === "production" ? "prod" : "dev");
	if (
		fs.existsSync(path.resolve(__dirname, `./aws-exports.${awsConfigEnv}.js`))
	) {
		awsConfigImport = requireES6(`./aws-exports.${awsConfigEnv}.js`);
	} else if (fs.existsSync(path.resolve(__dirname, "./aws-exports.js"))) {
		awsConfigImport = requireES6(`./aws-exports.js`);
	}
	const awsConfig = isEmpty(awsConfigImport.default)
		? awsConfigImport
		: awsConfigImport.default;
	if (isEmpty(awsConfig)) {
		throw new Error(
			"Cannot find AWS Config. Please copy/symlink your 'aws-exports.js' from Amplify Environment/Directory into this project's root directory, or add AWS Environment variables."
		);
	}
	config = editWebpackPlugin(
		p => {
			p.definitions["process.env"].AWS_CONFIG = JSON.stringify(awsConfig);
			return p;
		},
		"DefinePlugin",
		config
	);
	return config;
});

module.exports = [
	["use-babel-config", ".babelrc.js"],
	["use-eslint-config", ".eslintrc.js"],
	{
		jest: config => {
			config.moduleNameMapper = {
				...config.moduleNameMapper,
				...jestModuleNameMapper
			};
			config.transform["^.+\\.(js|jsx|ts|tsx)$"] = path.resolve(
				__dirname,
				"./jest.transform.js"
			);
			return config;
		}
	},
	addAlias,
	addWorkerPlugin,
	addAWSConfig
];

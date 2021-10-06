const { alias } = require("./shared-config");

module.exports = {
	extends: [
		"airbnb",
		"plugin:prettier/recommended",
		"prettier/react",
		"plugin:flowtype/recommended"
	],
	parser: "babel-eslint",
	plugins: ["babel", "react", "flowtype"],
	env: {
		browser: true,
		jest: true
	},
	settings: {
		"import/resolver": {
			alias: {
				map: Object.entries(alias),
				extensions: [".js", ".jsx", ".json"]
			}
		},
		react: {
			pragma: "React",
			version: "detect"
		}
	},
	rules: {
		// See: https://github.com/benmosher/eslint-plugin-import/issues/496
		"import/no-extraneous-dependencies": 0,
		"react/forbid-prop-types": 0,
		"no-console": 0,
		"no-param-reassign": 0
	}
};

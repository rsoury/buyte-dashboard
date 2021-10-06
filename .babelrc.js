let prod = process.env.NODE_ENV === "production";
const force = process.env.REACT_APP_FORCE_ENV;
if (force) {
	prod = force === "production";
}
const isProd = prod;

module.exports = {
	presets: [["react-app", { flow: true, typescript: false }]],
	plugins: ["babel-plugin-styled-components"]
};

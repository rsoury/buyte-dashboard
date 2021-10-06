import _get from "lodash.get";

const getUserAttr = user => (attr, defaultVal) =>
	_get(
		user,
		["attributes"].concat(Array.isArray(attr) ? attr : [attr]),
		defaultVal
	);

export default getUserAttr;

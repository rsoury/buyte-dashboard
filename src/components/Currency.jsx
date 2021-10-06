/* eslint-disable react/style-prop-object */

import React from "react";
import PropTypes from "prop-types";
import Dinero from "dinero.js";
import { Text } from "evergreen-ui";

const Currency = ({ value, currency, zeroDecimal, ...props }) => {
	const result = Dinero({
		amount: value,
		currency,
		precision: zeroDecimal ? 0 : 2
	}).toFormat();

	return <Text {...props}>{result}</Text>;
};

Currency.propTypes = {
	value: PropTypes.number.isRequired,
	currency: PropTypes.string,
	zeroDecimal: PropTypes.bool
};
Currency.defaultProps = {
	currency: "AUD",
	zeroDecimal: false
};

export default Currency;

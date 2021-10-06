import React from "react";
import PropTypes from "prop-types";
import { TextInput } from "evergreen-ui";

import InputField from "./InputField";

// Props automatically provided to children.

const TextInputField = ({ isPassword, ...props }) => {
	const inputProps = {};
	if (isPassword) {
		inputProps.type = "password";
	}
	return (
		<InputField {...props}>
			<TextInput height={40} {...inputProps} />
		</InputField>
	);
};

TextInputField.propTypes = {
	isPassword: PropTypes.bool
};

TextInputField.defaultProps = {
	isPassword: false
};

export default TextInputField;

import React from "react";
import PropTypes from "prop-types";
import { TextInput } from "evergreen-ui";
import Cleave from "cleave.js/react";

import InputField from "./InputField";

// Props automatically provided to children.

const DobInputField = ({ isPassword, isEditable, ...props }) => {
	const inputProps = {};
	if (isPassword) {
		inputProps.type = "password";
	}

	return (
		<InputField {...props}>
			{isEditable ? (
				<Cleave
					placeholder="Enter your date of birth"
					options={{
						date: true,
						delimter: "/",
						datePattern: ["d", "m", "Y"]
					}}
					height={40}
					{...inputProps}
					InputComponent={TextInput}
				/>
			) : (
				<TextInput height={40} {...inputProps} />
			)}
		</InputField>
	);
};

DobInputField.propTypes = {
	isPassword: PropTypes.bool,
	isEditable: PropTypes.bool
};

DobInputField.defaultProps = {
	isPassword: false,
	isEditable: true
};

export default DobInputField;

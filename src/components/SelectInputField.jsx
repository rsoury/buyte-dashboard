import React from "react";
import PropTypes from "prop-types";
import { Select, TextInput } from "evergreen-ui";

import InputField from "./InputField";

const SelectInputField = ({ options, isEditable, ...props }) => (
	<InputField {...props} isEditable={isEditable}>
		{isEditable ? (
			<Select height={40}>
				{options.map(option => (
					<option key={option.value} {...option}>
						{option.name || option.value}
					</option>
				))}
			</Select>
		) : (
			<TextInput height={40} />
		)}
	</InputField>
);

SelectInputField.propTypes = {
	options: PropTypes.arrayOf(PropTypes.object),
	isEditable: PropTypes.bool
};

SelectInputField.defaultProps = {
	options: [],
	isEditable: true
};

export default SelectInputField;

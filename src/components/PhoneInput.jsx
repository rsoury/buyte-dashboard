/* eslint-disable react/prop-types */

import React, { useState } from "react";
import PropTypes from "prop-types";
import { withTheme } from "evergreen-ui";
import styled from "styled-components";
import IntlTelInput from "react-intl-tel-input";
import isEmpty from "is-empty";
import { parsePhoneNumberFromString } from "libphonenumber-js";
import "react-intl-tel-input/dist/main.css";

import { connectRegions } from "@/utils/user-support";

const Container = styled.div`
	position: relative;
	width: 100%;

	& input {
		width: 100%;
		border: none !important;
		border-radius: 3px !important;
		height: 100% !important;
		line-height: 20px !important;
		font-size: 14px;
		padding-right: 13px !important;
		letter-spacing: -0.05px;
	}

	& .selected-dial-code {
		font-size: 14px;
	}

	& .country-list {
		border-radius: 0 0 4px 4px;
		font-size: 14px;
		width: 100%;
	}

	& .selected-flag {
		outline: 0;
		pointer-events: ${props => (props.disabled ? "none" : "auto")};
	}
`;

const PhoneInput = ({
	theme,
	country,
	isInvalid,
	id,
	name,
	onBlur,
	onChange,
	height,
	width,
	readOnly,
	value,
	...props
}) => {
	let defaultValue = value;
	if (defaultValue) {
		const phoneNumber = parsePhoneNumberFromString(value);
		if (!isEmpty(phoneNumber)) {
			defaultValue = phoneNumber.nationalNumber;
		}
	}
	const className = theme.getTextInputClassName();
	const [displayValue, setDisplayValue] = useState(defaultValue);
	const format = number =>
		number
			.split(" ")
			.join("")
			.split("-")
			.join("");
	const editProps = readOnly
		? {}
		: {
				onPhoneNumberChange(isValid, newNumber, countryData, fullNumber) {
					setDisplayValue(newNumber);
					onChange(format(fullNumber));
				},
				onPhoneNumberBlur(isValid, newNumber, countryData, fullNumber, ext, e) {
					onBlur(e);
				},
				onSelectFlag(number, countryData, fullNumber) {
					onChange(format(fullNumber));
				}
		  };

	return (
		<Container disabled={readOnly}>
			<IntlTelInput
				fieldId={id}
				fieldName={name}
				inputClassName={className}
				autoHideDialCode={false}
				separateDialCode
				nationalMode={false}
				defaultCountry={country.toLowerCase()}
				telInputProps={{
					invalid: isInvalid ? "true" : "false",
					readOnly: readOnly ? "true" : "false"
				}}
				style={{
					width: width || "100%",
					height
				}}
				preferredCountries={connectRegions.map(({ iso }) => iso)}
				value={displayValue}
				{...editProps}
				{...props}
			/>
		</Container>
	);
};

PhoneInput.propTypes = {
	theme: PropTypes.object.isRequired,
	country: PropTypes.string,
	disabled: PropTypes.bool,
	isInvalid: PropTypes.bool
};

PhoneInput.defaultProps = {
	country: "AU",
	disabled: false,
	isInvalid: false
};

export default withTheme(PhoneInput);

/* eslint-disable no-nested-ternary */

import React, { Component } from "react";
import PropTypes from "prop-types";
import { Pane, Text, TextInput } from "evergreen-ui";
import { injectIntl, intlShape } from "react-intl";
import getSymbolFromCurrency from "currency-symbol-map";
import CurrencyInput from "react-currency-input";

import InputField from "./InputField";
import * as colors from "@/constants/colors";

const CurrencyTextInput = ({
	prefix,
	suffix,
	isEmpty,
	isNullable,
	value,
	...props
}) => (
	<Pane display="flex" flexDirection="row" alignItems="center">
		{prefix && (
			<Text
				size={prefix.length > 1 ? 400 : 600}
				color={colors.SECONDARY}
				marginRight={8}
				opacity={isEmpty ? 0.5 : 1}
			>
				{prefix}
			</Text>
		)}
		<TextInput
			is={CurrencyInput}
			flex={1}
			height={40}
			value={isNullable ? value || null : value}
			{...props}
		/>
		{suffix && (
			<Text
				size={suffix.length > 1 ? 400 : 600}
				color={colors.SECONDARY}
				marginLeft={8}
				opacity={isEmpty ? 0.5 : 1}
			>
				{suffix}
			</Text>
		)}
	</Pane>
);

CurrencyTextInput.propTypes = {
	prefix: PropTypes.string,
	suffix: PropTypes.string,
	isEmpty: PropTypes.bool,
	isNullable: PropTypes.bool,
	value: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
};
CurrencyTextInput.defaultProps = {
	prefix: "",
	suffix: "",
	isEmpty: false,
	isNullable: false,
	value: ""
};

/* Keep the value as a Number/Integer. onChange unformat and set. onRender format. */
class CurrencyInputField extends Component {
	static propTypes = {
		intl: intlShape.isRequired,
		value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
		currency: PropTypes.string,
		zeroDecimal: PropTypes.bool,
		isNullable: PropTypes.bool,
		onChange: PropTypes.func,
		inputProps: PropTypes.object
	};

	static defaultProps = {
		value: null,
		currency: "AUD",
		zeroDecimal: false,
		isNullable: PropTypes.bool,
		onChange: PropTypes.func,
		inputProps: {}
	};

	constructor(props) {
		super(props);

		const { value, currency } = this.props;

		this.state = {
			value: typeof value === "number" ? this.format(value) : null
		};

		this.symbol = getSymbolFromCurrency(currency);
	}

	// Don't format the value for render. Only test to check if valid value
	onChange = (value, maskedvalue) => {
		const { isNullable, zeroDecimal, onChange } = this.props;
		// console.log({ isNullable, value, maskedvalue });
		let number = Math.round(zeroDecimal ? maskedvalue : maskedvalue * 100);
		if (isNullable) {
			if (typeof value === "string") {
				if (!value) {
					number = null;
				}
			}
		}
		this.setState({ value });
		onChange(number);
	};

	getSeparators() {
		const { zeroDecimal } = this.props;

		// Get the seperator by replace everything but the separator in a 4 digit number with nothing
		let formatted = this.format("1111");
		const decimalSeparator = formatted.charAt(formatted.length - 3); // Gets the decimal character.
		if (!zeroDecimal) {
			formatted = formatted.substr(0, formatted.length - 3);
		}
		// Be sure to remove the last 3 characters, which should be to decimal seperator and 2 decimal places ONLY if NOT zeroDecimal
		const thousandSeparator = formatted.replace(/1/g, "");

		return {
			decimalSeparator,
			thousandSeparator
		};
	}

	format(_value) {
		const { intl, zeroDecimal, currency } = this.props;
		let value = _value;
		if (value) {
			if (!zeroDecimal) {
				// is value a number?
				const isNumber = typeof value === "number";
				// convert value to a float
				value = parseFloat(value);
				// If value was initially a number
				if (isNumber) {
					value /= 100;
				}
			}
		}
		return intl
			.formatNumber(value, {
				style: "currency",
				currency,
				currencyDisplay: "code",
				maximumFractionDigits: 2
			})
			.replace(currency.toUpperCase(), "")
			.replace(currency.toLowerCase(), "")
			.trim();
	}

	// This method might be obsolete...
	unformat(value) {
		if (!value) {
			return 0;
		}
		const { zeroDecimal } = this.props;
		const { thousandSeparator: separator } = this.getSeparators();

		// Sometimes there might not be a separator?
		const unformatted = separator
			? value.replace(new RegExp(`\\${separator}`, "g"), "")
			: value;
		const float = parseFloat(unformatted).toFixed(2);
		const number = parseInt(zeroDecimal ? float : float * 100, 10);
		return number;
	}

	render() {
		const {
			intl,
			currency,
			zeroDecimal,
			value: propsValue,
			onChange,
			isNullable,
			inputProps,
			...props
		} = this.props;
		const { value } = this.state;
		const separators = this.getSeparators();
		return (
			<InputField
				value={value}
				onChange={this.onChange}
				inputProps={{
					maxLength: 12,
					precision: zeroDecimal ? 0 : 2,
					...separators,
					...inputProps
				}}
				{...props}
			>
				<CurrencyTextInput
					allowEmpty={!!isNullable}
					prefix={this.symbol || currency}
					isEmpty={!this.unformat(value)}
					isNullable={isNullable}
				/>
			</InputField>
		);
	}
}

export default injectIntl(CurrencyInputField);

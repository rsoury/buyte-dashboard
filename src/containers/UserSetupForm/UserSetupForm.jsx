/* eslint-disable no-alert */

import React, { Component } from "react";
import PropTypes from "prop-types";
import { Pane, Button, Spinner } from "evergreen-ui";
import { Formik, Form, Field } from "formik";
import { parsePhoneNumberFromString } from "libphonenumber-js";

import { getCountries } from "@/workers";
import { UserProps } from "@/constants/common-prop-types";
import * as userAttributeTypes from "@/constants/user-attribute-types";
import PhoneInputField from "@/components/PhoneInputField";
import TextInputField from "@/components/TextInputField";
import SelectInputField from "@/components/SelectInputField";
import uniqueByProp from "@/utils/unique-by-prop";
import sortByProp from "@/utils/sort-by-prop";
import getUserAttr from "@/utils/get-user-attr";
import isUrl from "@/utils/is-url";

class UserSetupForm extends Component {
	static propTypes = {
		user: UserProps,
		submit: PropTypes.func.isRequired,
		isEditable: PropTypes.bool
	};

	static defaultProps = {
		user: {},
		isEditable: true
	};

	constructor(props) {
		super(props);

		this.countries = [];
		this.currencies = [];
		this.state = {
			isCountryDataLoaded: false
		};
	}

	componentDidMount() {
		this.loadCountryData();
	}

	getUserAttr = (...args) => {
		const { user } = this.props;
		return getUserAttr(user)(...args);
	};

	async loadCountryData() {
		this.countries = await getCountries();
		if (this.countries.length) {
			this.currencies = sortByProp("currency")(
				uniqueByProp("currency")(this.countries)
			);
			this.setState({ isCountryDataLoaded: true });
		}
	}

	render() {
		const { isCountryDataLoaded } = this.state;
		const { submit, isEditable } = this.props;

		if (!isCountryDataLoaded) {
			return (
				<Pane
					height={300}
					display="flex"
					alignItems="center"
					justifyContent="center"
				>
					<Spinner size={28} />
				</Pane>
			);
		}

		const fields = [
			{
				id: "storeName",
				title: "Store Name",
				placeholder: "My TShirt Store"
			},
			{
				id: "website",
				title: "Website",
				placeholder: "https://tshirtstore.com"
			},
			{
				id: "phoneNumber",
				type: "phone",
				title: "Contact Phone Number",
				placeholder: "400 200 300"
			},
			{
				id: "country",
				type: "select",
				title: "Country",
				options: this.countries.map(({ name, ISO: { alpha2: iso } }) => ({
					name,
					value: iso
				}))
			},
			{
				id: "currency",
				type: "select",
				title: "Currency",
				options: this.currencies.map(({ currency }) => ({
					value: currency
				}))
			}
		];

		return (
			<Formik
				initialValues={{
					phoneNumber: this.getUserAttr(
						userAttributeTypes.PHONE_NUMBER,
						this.getUserAttr(userAttributeTypes.CUSTOM_PHONE_NUMBER)
					),
					storeName: this.getUserAttr(userAttributeTypes.STORE_NAME),
					website: this.getUserAttr(userAttributeTypes.WEBSITE),
					currency: this.getUserAttr(userAttributeTypes.CURRENCY, "AUD"),
					country: this.getUserAttr(userAttributeTypes.COUNTRY, "AU")
				}}
				validate={values => {
					const errors = {};

					if (!values.phoneNumber) {
						errors.phoneNumber = "Required";
					} else {
						const phoneNumber = parsePhoneNumberFromString(values.phoneNumber);
						if (!phoneNumber.isValid()) {
							errors.phoneNumber = "Please provide a valid phone number";
						}
					}

					if (!values.storeName) {
						errors.storeName = "Required";
					}

					if (!values.website) {
						errors.website = "Required";
					} else if (!isUrl(values.website)) {
						errors.website = "Please provide a valid website";
					}

					return errors;
				}}
				onSubmit={async (values, { setSubmitting }) => {
					await submit(values);
					setSubmitting(false);
				}}
			>
				{({ isSubmitting }) => (
					<Form>
						{fields.map(({ type: _type, ...field }) => {
							let InputField = TextInputField;
							const type = _type || "text";
							if (type === "select") {
								InputField = SelectInputField;
							}
							if (type === "phone") {
								InputField = PhoneInputField;
							}

							return (
								<Field
									key={field.id}
									name={field.id}
									type={type}
									render={({
										field: { name, value, onChange, onBlur },
										form: { touched, errors, setFieldValue }
									}) => {
										const wrapOnChange = event => {
											if (event instanceof Event ? true : !event.nativeEvent) {
												setFieldValue(name, event);
											} else {
												onChange(event);
											}
										};
										return (
											<InputField
												key={field.id}
												paddingBottom={10}
												onChange={wrapOnChange}
												value={value || ""}
												inputProps={{
													name,
													onBlur
												}}
												isEditable={isEditable}
												error={isEditable && touched[name] ? errors[name] : ""}
												isFullWidth
												{...field}
												isSmall
												textAlign="left"
											/>
										);
									}}
								/>
							);
						})}
						{isEditable && (
							<>
								<Button
									width="100%"
									height={44}
									appearance="primary"
									intent="success"
									isLoading={isSubmitting}
									type="submit"
									textAlign="center"
									iconAfter="arrow-right"
									marginTop={10}
									display="flex"
									alignItems="center"
									justifyContent="center"
								>
									Go to Dashboard
								</Button>
								<Pane
									fontSize={12}
									padding={10}
									textAlign="center"
									opacity="0.5"
								>
									<i>
										By submitting your information you agree to{" "}
										<a
											href="http://bit.ly/buyte-msa"
											target="_blank"
											rel="noopener noreferrer"
										>
											Buyte&rsquo;s Terms of Service
										</a>
										.
									</i>
								</Pane>
							</>
						)}
					</Form>
				)}
			</Formik>
		);
	}
}

export default UserSetupForm;

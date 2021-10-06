/* eslint-disable no-alert */

import React from "react";
import PropTypes from "prop-types";
import { Pane, Paragraph, Dialog } from "evergreen-ui";
import { Formik, Form } from "formik";
import isEmpty from "is-empty";
import _set from "lodash.set";

import { UserProps } from "@/constants/common-prop-types";
import FormFields from "@/components/FormFields";
import { getRegion, getCountryBankAccountFields } from "@/utils/user-support";

const BankAccountDialog = ({ user, submit, isShown, isEditable, onClose }) => {
	const region = getRegion(user);
	const sanitizeFields = fields =>
		fields.map(({ initialValue, validate, ...field }) => field);

	// Field ids using _ in place of . notation to be Formik friendly, but all values get reduced into an object.

	// Bank Fields
	const fields = getCountryBankAccountFields(region) || [
		{
			id: "bank_accountNumber",
			title: "Account Number",
			placeholder: "12345678",
			isRequired: true,
			autoComplete: "false"
		},
		{
			id: "bank_routingNumber",
			title: "Routing Number",
			description:
				"The routing number, sort code, or other country-appropriate institution number for the bank account. For US bank accounts, this is required and should be the ACH routing number, not the wire routing number. For AU bank accounts, this refers to your BSB number. For BR bank accounts this is a combination of your bank code and branch code, ie. 123-4567. If you're providing an IBAN number as an account number, ignore this field.",
			placeholder: "110000",
			autoComplete: "false"
		}
	];

	const initialValues = fields.reduce((_accumulator, field) => {
		let accumulator = _accumulator;
		if (field.initialValue) {
			accumulator = _set(accumulator, field.id, field.initialValue);
		}
		return accumulator;
	}, {});

	return (
		<Formik
			initialValues={initialValues}
			validate={values => {
				const errors = {};

				fields.forEach(field => {
					if (field.isRequired) {
						if (isEmpty(values[field.id])) {
							errors[field.id] = "Required";
							return null;
						}
					}
					if (typeof field.validate === "function") {
						const errMessage = field.validate(values[field.id]);
						if (errMessage) {
							errors[field.id] = errMessage;
						}
					}
					return null;
				});

				return errors;
			}}
			onSubmit={async (values, { setSubmitting }) => {
				console.log(values);
				const payload = {
					person: user.attributes,
					...Object.entries(values).reduce(
						(accumulator, [key, value]) =>
							_set(accumulator, key.split("_").join("."), value),
						{}
					)
				};
				await submit(payload);
				setSubmitting(false);
			}}
		>
			{({ isSubmitting, submitForm }) => (
				<Dialog
					isShown={isShown}
					intent="none"
					title={`Connect your ${region} Bank Account`}
					onCloseComplete={() => onClose()}
					onConfirm={() => submitForm()}
					isConfirmLoading={isSubmitting}
					confirmLabel="Submit"
				>
					<Form>
						<Pane maxWidth={600} marginX="auto">
							<FormFields
								fields={sanitizeFields(fields)}
								isEditable={isEditable}
							/>
							<Paragraph>
								By submitting your information, you are authorising payouts as
								the account opener and business owner/director.
							</Paragraph>
						</Pane>
					</Form>
				</Dialog>
			)}
		</Formik>
	);
};

BankAccountDialog.propTypes = {
	user: UserProps.isRequired,
	submit: PropTypes.func.isRequired,
	isEditable: PropTypes.bool,
	onClose: PropTypes.func,
	isShown: PropTypes.bool
};

BankAccountDialog.defaultProps = {
	isShown: false,
	isEditable: true,
	onClose() {}
};

export default BankAccountDialog;

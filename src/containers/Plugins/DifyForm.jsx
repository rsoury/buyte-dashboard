/* eslint-disable no-alert */

import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Pane, Button } from "evergreen-ui";
import { Formik, Form, Field } from "formik";

import Functions from "@/api/functions";
import { UserProps } from "@/constants/common-prop-types";
import TextInputField from "@/components/TextInputField";
import TextAreaInputField from "@/components/TextAreaInputField";

const fields = [
	{
		id: "adminUrl",
		title: "Website Admin URL",
		placeholder: "https://yourwebsite.com/wp-admin"
	},
	{
		id: "username",
		title: "Website Admin Username",
		placeholder: "admin"
	},
	{
		id: "password",
		title: "Website Admin Password",
		placeholder: "123456789",
		isPassword: true
	},
	{
		id: "additional",
		title: "Additional Credentials and Notes",
		placeholder: "Please create a new account, and delete it once you're done.",
		isTextArea: true
	}
];

const DifyForm = ({ user, onSubmit }) => {
	return (
		<Formik
			validate={values => {
				const errors = {};

				if (!values.adminUrl) {
					errors.adminUrl = "Required";
				}

				if (!values.username) {
					errors.username = "Required";
				}

				if (!values.password) {
					errors.password = "Required";
				}

				return errors;
			}}
			onSubmit={async (values, { setSubmitting }) => {
				await Functions.notify({
					text: "New Have-Us-Do-It-For-You Request!",
					fields: {
						id: user.attributes.sub,
						email: user.attributes.email,
						website: user.attributes.website,
						name: `${user.attributes.given_name} ${user.attributes.family_name}`,
						...values
					}
				});
				setSubmitting(false);
				onSubmit();
			}}
		>
			{({ isSubmitting }) => (
				<Form>
					{fields.map(({ isTextArea, ...field }) => {
						let InputField = TextInputField;
						if (isTextArea) {
							InputField = TextAreaInputField;
						}
						const type = field.type || "text";

						return (
							<Field
								key={field.id}
								name={field.id}
								type={type}
								render={({
									field: { name, value, onChange, onBlur },
									form: { touched, errors }
								}) => (
									<InputField
										key={field.id}
										paddingBottom={10}
										onChange={onChange}
										value={value || ""}
										inputProps={{
											name,
											onBlur
										}}
										error={touched[name] ? errors[name] : ""}
										isFullWidth
										{...field}
										isSmall
										textAlign="left"
									/>
								)}
							/>
						);
					})}
					<>
						<Button
							height={44}
							appearance="primary"
							intent="none"
							isLoading={isSubmitting}
							type="submit"
							textAlign="center"
							marginTop={10}
						>
							Submit Request
						</Button>
						<Pane fontSize={12} paddingY={10} marginTop={10} opacity="0.5">
							We take your security very seriously. No sensitive will be stored
							and/or reused once integration has been complete. If you have any
							enquiries about our security practices, please contact{" "}
							<a href="mailto:support@buytecheckout.com">Support</a>
						</Pane>
					</>
				</Form>
			)}
		</Formik>
	);
};

DifyForm.propTypes = {
	user: UserProps,
	onSubmit: PropTypes.func
};

DifyForm.defaultProps = {
	user: {},
	onSubmit() {}
};

export default connect(function mapStateToProps({ user }) {
	return {
		user
	};
})(DifyForm);

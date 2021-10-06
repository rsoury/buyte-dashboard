import React from "react";
import PropTypes from "prop-types";
import { Pane, Card, Strong } from "evergreen-ui";
import { Field } from "formik";

import TextInputField from "@/components/TextInputField";
import SelectInputField from "@/components/SelectInputField";
import DobInputField from "@/components/DobInputField";

const FormFields = ({ title, fields, isEditable, props, containerProps }) => (
	<Pane {...containerProps}>
		{title && (
			<Pane marginBottom={10}>
				<Strong>{title}</Strong>
			</Pane>
		)}
		<Card
			{...props}
			elevation={0}
			paddingX={15}
			paddingBottom={0}
			paddingTop={10}
			marginBottom={20}
			display="flex"
			flexDirection="row"
			flexWrap="wrap"
			borderTop
			borderBottom
			borderLeft
			borderRight
		>
			{fields.map(field => {
				let InputField = TextInputField;
				const type = field.type || "text";
				if (field.type === "select") {
					InputField = SelectInputField;
				} else if (field.type === "dob") {
					InputField = DobInputField;
				}
				let width = "100%";
				if (typeof field.size !== "undefined") {
					width = `${field.size * 100}%`;
				}

				return (
					<Pane
						key={field.id}
						width={width}
						paddingX={5}
						display="flex"
						alignItems="flex-end"
					>
						<Field
							name={field.id}
							type={type}
							render={({
								field: { name, value, onChange, onBlur },
								form: { touched, errors }
							}) => (
								<InputField
									key={field.id}
									paddingBottom={20}
									onChange={onChange}
									value={value || ""}
									inputProps={{
										name,
										onBlur
									}}
									isEditable={field.isEditable || isEditable}
									error={isEditable && touched[name] ? errors[name] : ""}
									isFullWidth
									{...field}
									isSmall
									textAlign="left"
									width="100%"
									flex={1}
								/>
							)}
						/>
					</Pane>
				);
			})}
		</Card>
	</Pane>
);

FormFields.propTypes = {
	fields: PropTypes.arrayOf(PropTypes.object).isRequired,
	title: PropTypes.string,
	isEditable: PropTypes.bool,
	props: PropTypes.object,
	containerProps: PropTypes.object
};

FormFields.defaultProps = {
	isEditable: true,
	title: "",
	props: {},
	containerProps: {}
};

export default FormFields;

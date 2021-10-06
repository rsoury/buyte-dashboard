import React from "react";
import PropTypes from "prop-types";
import { Pane, Strong, Paragraph } from "evergreen-ui";

import ErrorText from "./ErrorText";

const InputField = ({
	id,
	title,
	description,
	Description,
	placeholder,
	error,
	onChange,
	value,
	isFullWidth,
	children,
	isSmall,
	isEditable,
	isRequired,
	disabled,
	inputProps,
	...props
}) => {
	const inputPropsSetup = {
		placeholder,
		spellCheck: false,
		required: isRequired,
		id,
		value,
		onChange,
		width: isFullWidth ? "100%" : 280,
		disabled,
		readOnly: !isEditable,
		...inputProps
	};
	if (error) {
		inputPropsSetup.isInvalid = true;
	}
	return (
		<Pane {...props}>
			<Pane is="label" htmlFor={id}>
				<Pane marginBottom={isSmall ? 5 : 10}>
					{isRequired && isEditable && (
						<Paragraph
							fontWeight={900}
							opacity="0.5"
							textTransform="uppercase"
							fontSize={10}
							letterSpacing={1}
						>
							Required
						</Paragraph>
					)}
					<Strong size={isSmall ? 400 : 500}>{title}</Strong>
				</Pane>
				{description && <Paragraph marginBottom={10}>{description}</Paragraph>}
				{Description && (
					<Pane marginBottom={10}>
						<Description />
					</Pane>
				)}
			</Pane>
			{React.Children.map(children, child =>
				React.cloneElement(child, { ...inputPropsSetup })
			)}
			{!!error && <ErrorText isSmall={isSmall} text={error} />}
		</Pane>
	);
};

InputField.propTypes = {
	id: PropTypes.string.isRequired,
	title: PropTypes.string,
	description: PropTypes.string,
	Description: PropTypes.oneOfType([
		PropTypes.element,
		PropTypes.node,
		PropTypes.func
	]),
	placeholder: PropTypes.string,
	error: PropTypes.string,
	onChange: PropTypes.func,
	value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
	isFullWidth: PropTypes.bool,
	children: PropTypes.oneOfType([
		PropTypes.string,
		PropTypes.arrayOf(PropTypes.node),
		PropTypes.node
	]),
	isSmall: PropTypes.bool,
	isEditable: PropTypes.bool,
	isRequired: PropTypes.bool,
	disabled: PropTypes.bool,
	inputProps: PropTypes.object
};

InputField.defaultProps = {
	title: "",
	description: "",
	Description: undefined,
	placeholder: "",
	error: "",
	onChange: () => {},
	value: null,
	isFullWidth: false,
	children: undefined,
	isSmall: false,
	isEditable: true,
	isRequired: false,
	disabled: false,
	inputProps: {}
};

export default InputField;

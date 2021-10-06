import React from "react";
import PropTypes from "prop-types";
import { Button } from "evergreen-ui";
import styled from "styled-components";

const StyledButton = styled(Button)`
	& > div[delay]:nth-child(1) {
		max-width: 25px;
		max-height: 25px;
	}

	& > svg:nth-child(1),
	& > svg:nth-child(2) {
		height: 40px;
		width: 40px;
		padding: 8px;
		background-color: rgba(16, 101, 195, 0.1);
		border-radius: 4px;
	}

	& > svg:nth-child(3),
	& > svg:nth-child(4) {
		position: absolute;
		right: 40px;
	}
`;

const LargeButton = ({ children, ...props }) => (
	<StyledButton
		position="relative"
		height={100}
		width="100%"
		margin={10}
		appearance="minimal"
		intent="none"
		border="3px solid rgb(240, 240, 240)"
		borderRadius={4}
		{...props}
	>
		{children}
	</StyledButton>
);

LargeButton.propTypes = {
	children: PropTypes.oneOfType([
		PropTypes.string,
		PropTypes.arrayOf(PropTypes.node),
		PropTypes.node
	]).isRequired
};

export default LargeButton;

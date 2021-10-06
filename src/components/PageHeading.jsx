import React from "react";
import PropTypes from "prop-types";
import { Heading } from "evergreen-ui";

const PageHeading = ({ children }) => (
	<Heading padding={10} borderRadius={4} backgroundColor="rgb(248, 248, 248)">
		{children}
	</Heading>
);

PageHeading.propTypes = {
	children: PropTypes.oneOfType([
		PropTypes.string,
		PropTypes.arrayOf(PropTypes.node),
		PropTypes.node
	]).isRequired
};

export default PageHeading;

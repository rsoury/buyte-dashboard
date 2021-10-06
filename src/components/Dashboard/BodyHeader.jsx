/*
	Just a small component to make it simpler to add a header to a dashboard item
 */

import React from "react";
import PropTypes from "prop-types";
import { Pane, Heading } from "evergreen-ui";

const DashboardBodyHeader = ({ title, children }) => (
	<Pane
		display="flex"
		paddingTop={children ? 0 : 4}
		paddingBottom={10}
		marginBottom={20}
		alignItems="center"
		justifyContent="space-between"
		borderBottom="1px solid rgb(240, 240, 240)"
		overflow="visible"
		width={children ? "auto" : "100%"}
	>
		<Heading size={700}>{title}</Heading>
		{!!children && <Pane>{children}</Pane>}
	</Pane>
);

DashboardBodyHeader.propTypes = {
	title: PropTypes.string,
	children: PropTypes.oneOfType([
		PropTypes.string,
		PropTypes.arrayOf(PropTypes.node),
		PropTypes.node
	])
};

DashboardBodyHeader.defaultProps = {
	title: "",
	children: undefined
};

export default DashboardBodyHeader;

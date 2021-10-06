/*
	Just a small component to make it simpler to add a header to a dashboard item
 */

import React from "react";
import PropTypes from "prop-types";
import { Pane } from "evergreen-ui";

import Header from "./BodyHeader";

const DashboardBody = ({
	title,
	headerActions: HeaderActions,
	children,
	style
}) => (
	<Pane
		display="flex"
		width="100%"
		height="100%"
		alignItems="center"
		justifyContent="flex-start"
		flexDirection="column"
		paddingX={20}
		paddingY={10}
		overflow="auto"
		{...style}
	>
		<Pane display="flex" flexDirection="column" width="100%" flex={1}>
			<Header title={title}>{HeaderActions && <HeaderActions />}</Header>
			{children}
		</Pane>
	</Pane>
);

DashboardBody.propTypes = {
	children: PropTypes.oneOfType([
		PropTypes.string,
		PropTypes.arrayOf(PropTypes.node),
		PropTypes.node
	]).isRequired,
	headerActions: PropTypes.oneOfType([
		PropTypes.arrayOf(PropTypes.node),
		PropTypes.node,
		PropTypes.func
	]),
	style: PropTypes.object, // eslint-disable-line react/require-default-props
	title: PropTypes.string.isRequired
};

DashboardBody.defaultProps = {
	headerActions: undefined,
	style: {}
};

export default DashboardBody;

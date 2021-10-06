import React from "react";
import { Pane, Spinner } from "evergreen-ui";

const LoaderPane = props => (
	<Pane
		height="100%"
		width="100%"
		flex={1}
		display="flex"
		alignItems="center"
		justifyContent="center"
		{...props}
	>
		<Spinner size={26} />
	</Pane>
);

export default LoaderPane;

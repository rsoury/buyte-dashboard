import React from "react";
import { Pane, Spinner, Image } from "evergreen-ui";

import Logo from "@/assets/logo/logo-mono@300.png";

const LoadingScreen = () => (
	<Pane
		display="flex"
		alignItems="center"
		justifyContent="center"
		flexDirection="column"
		height="100vh"
	>
		<Pane>
			<Image
				src={Logo}
				alt="Buyte Logo Black"
				title="Buyte Logo Black"
				width="125px"
				opacity="0.5"
				margin="20px"
				position="relative"
			/>
		</Pane>
		<Spinner size={34} />
	</Pane>
);

export default LoadingScreen;

import React from "react";
import { Pane, Card } from "evergreen-ui";

import PageHeading from "@/components/PageHeading";
import { Body } from "@/components/Dashboard";
import UserSetupForm from "@/containers/UserSetupForm";

const Settings = () => (
	<Body title="Account Settings">
		<PageHeading>Review your account details</PageHeading>
		<Pane paddingY={20}>
			<Card
				marginY={0}
				marginX="auto"
				padding={20}
				elevation={0}
				width="100%"
				maxWidth={500}
				display="block"
				borderTop
				borderBottom
				borderLeft
				borderRight
			>
				<UserSetupForm isEditable={false} />
			</Card>
		</Pane>
	</Body>
);

export default Settings;

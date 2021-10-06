import React from "react";
import { Pane, Card, Image, Heading, Paragraph } from "evergreen-ui";

import Logo from "@/assets/logo/logo-dark@300.png";

import UserSetupForm from "@/containers/UserSetupForm";

const UserSetupScreen = () => (
	<Pane
		display="flex"
		alignItems="center"
		justifyContent="flex-start"
		flexDirection="column"
		height="100vh"
		width="100%"
		background="tint1"
		padding={20}
		overflow="auto"
	>
		<Pane maxWidth={500} marginX="auto" textAlign="center" width="100%">
			<Heading size={700} marginBottom={20}>
				Welcome to the Buyte Merchant Dashboard!
			</Heading>
			<Pane marginBottom={20}>
				<Paragraph marginBottom={5}>
					Here you can create your checkout widgets and get the keys needed to
					activate digital wallets on your online store.
				</Paragraph>
				<Paragraph>Let&rsquo;s start by getting your account setup.</Paragraph>
			</Pane>
			<Card elevation={1} padding={20} backgroundColor="white">
				<UserSetupForm />
			</Card>
			<Pane paddingTop={20}>
				<Image src={Logo} opacity="0.1" maxWidth={80} />
			</Pane>
		</Pane>
	</Pane>
);

export default UserSetupScreen;

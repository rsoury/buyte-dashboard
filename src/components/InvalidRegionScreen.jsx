import React from "react";
import { Pane, Heading, Paragraph, Image, Icon } from "evergreen-ui";

import SadKoala from "@/assets/sad-koala.png";

const InvalidRegionScreen = () => (
	<Pane
		display="flex"
		alignItems="center"
		justifyContent="flex-start"
		flexDirection="column"
		height="100vh"
		width="100%"
		padding={20}
		overflow="auto"
	>
		<Pane maxWidth={500} marginX="auto" textAlign="center" width="100%">
			<Heading size={700} marginBottom={20}>
				Thanks for creating an account! Unfortunately we do not support your
				region yet.
			</Heading>
			<Pane marginBottom={20}>
				<Paragraph marginBottom={5}>
					We are constantly releasing new features and updates. Once we are
					confident we have the infrastructure to support your region we will
					notify you by email.
				</Paragraph>
				<Paragraph>
					If you would like to leave us message, use the chat bubble or email{" "}
					<a href="mailto:support@buytecheckout.com">
						support@buytecheckout.com
					</a>
				</Paragraph>
			</Pane>
			<Pane marginBotton={20}>
				<Image src={SadKoala} width={250} marginY={50} />
			</Pane>
			<Paragraph>
				With <Icon icon="heart" /> from Australia
			</Paragraph>
		</Pane>
	</Pane>
);

export default InvalidRegionScreen;

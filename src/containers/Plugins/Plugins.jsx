/* eslint-disable no-alert */

import React, { useState } from "react";
import PropTypes from "prop-types";
import {
	Pane,
	Alert,
	Link,
	Paragraph,
	Button,
	SideSheet,
	Heading
} from "evergreen-ui";

import { Body } from "@/components/Dashboard";
import Selectable from "@/components/Selectable";
import * as eventTypes from "@/constants/event-tracking-types";
import { track } from "@/utils/tracking";

import wordpressImage from "@/assets/ecommerce-platforms/wordpress.png";
import DifyForm from "./DifyForm";

const list = [
	{
		name: "Wordpress",
		image: wordpressImage,
		link: "https://wordpress.org/plugins/buyte/"
	}
];

const Plugins = ({ email }) => {
	const formUrl = `https://airtable.com/shrZ3pyqwc0bSpyXp?prefill_Email=${email}`;
	const [showDify, setShowDify] = useState(false);

	const onSubmit = () => {
		alert("Your request has been received!");
		setShowDify(false);
	};

	return (
		<Body title="ECommerce Plugins and Integrations">
			<Pane
				height="100%"
				flex={1}
				display="flex"
				alignItems="center"
				justifyContent="center"
				position="relative"
			>
				<Pane
					height="100%"
					width="100%"
					overflow="auto"
					display="flex"
					alignItems="flex-start"
					justifyContent="flex-start"
					paddingY={5}
					marginX={-5}
				>
					{list.map(({ name, image, link }) => (
						<Selectable
							key={name}
							name={name}
							image={image}
							onClick={() => {
								track(eventTypes.ECOMMERCE_PLUGIN_CLICK, {
									name,
									link
								});
								window.open(link);
							}}
						/>
					))}
				</Pane>
			</Pane>

			<Pane marginBottom={20}>
				<Alert
					intent="none"
					title="Can't find your eCommerce platform?"
					borderRadius={4}
				>
					<Link
						href={formUrl}
						target="_blank"
						rel="noopener noreferrer"
						onClick={() => track(eventTypes.OPEN_ECOMMERCE_PLATFORM_SUBMIT)}
					>
						Click here to submit your eCommerce platform
					</Link>
				</Alert>
			</Pane>

			<Pane marginBottom={20}>
				<Alert
					intent="success"
					title="Too busy to set us up? We'll do it for you!"
					borderRadius={4}
				>
					<Paragraph>
						No matter what eCommerce platform or codebase, we&rsquo;re offering
						our software expertise to get you up and running with our digital
						wallets. <br /> Just submit the necessary information we need using
						the link below to get started.
					</Paragraph>
					<Button
						onClick={() => setShowDify(true)}
						height={36}
						iconBefore="thumbs-up"
						appearance="primary"
						intent="success"
						marginTop={15}
					>
						Have us do it for you
					</Button>
				</Alert>
			</Pane>
			<SideSheet
				isShown={showDify}
				onCloseComplete={() => setShowDify(false)}
				containerProps={{
					display: "flex",
					flex: "1",
					flexDirection: "column"
				}}
			>
				<Pane
					position="relative"
					zIndex={1}
					flexShrink={0}
					elevation={0}
					backgroundColor="white"
				>
					<Pane padding={16}>
						<Pane
							display="flex"
							width="100%"
							alignItems="center"
							textAlign="left"
							marginBottom={10}
						>
							<Heading size={500}>Have us do it for you</Heading>
						</Pane>
						<Heading size={900}>Request Form</Heading>
					</Pane>
				</Pane>
				<Pane
					flex="1"
					position="relative"
					overflowY="auto"
					padding={16}
					paddingBottom={64}
					background="tint1"
				>
					<DifyForm onSubmit={onSubmit} />
				</Pane>
			</SideSheet>
		</Body>
	);
};

Plugins.propTypes = {
	email: PropTypes.string
};

Plugins.defaultProps = {
	email: ""
};

export default Plugins;

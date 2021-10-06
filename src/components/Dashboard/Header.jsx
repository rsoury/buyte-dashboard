import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import {
	Pane,
	Image,
	Avatar,
	Popover,
	Menu,
	Position,
	Heading,
	Text
} from "evergreen-ui";
import styled from "styled-components";

import { UserProps } from "@/constants/common-prop-types";
import * as colors from "@/constants/colors";
import * as routes from "@/constants/routes";
import Logo from "@/assets/logo/logo@300.png";

const LogoLink = styled(Link)`
	position: relative;
	&:after {
		content: "Beta";
		position: absolute;
		right: -30px;
		top: -2.5px;
		font-size: 12px;
		font-weight: 900;
		color: ${colors.SECONDARY};
	}
`;

const DashboardHeader = ({
	user: { email, family_name: familyName, given_name: givenName },
	style
}) => (
	<Pane is="header" display="flex" {...style}>
		<Pane flex={1} alignItems="center" display="flex">
			<LogoLink to="/">
				<Image
					src={Logo}
					alt="Buyte Logo"
					title="Buyte Logo"
					width={100}
					marginTop={2.5}
				/>
			</LogoLink>
		</Pane>
		<Pane display="flex" alignItems="center">
			<Popover
				position={Position.BOTTOM_RIGHT}
				content={
					<Menu>
						<Menu.Group>
							<Pane paddingX={15} paddingY={10} width={275}>
								<Heading size={600}>{email}</Heading>
								<Text>Administrator</Text>
							</Pane>
						</Menu.Group>
						<Menu.Divider />
						<Menu.Group>
							<Menu.Item
								is={Link}
								to={routes.SETTINGS_ACCOUNT}
								icon="cog"
								intent="none"
								textDecoration="none"
							>
								<Text>Account Settings</Text>
							</Menu.Item>
							<Menu.Item
								is={Link}
								to={routes.SIGN_OUT}
								icon="log-out"
								intent="danger"
								textDecoration="none"
							>
								Sign Out
							</Menu.Item>
						</Menu.Group>
					</Menu>
				}
			>
				<Avatar
					isSolid
					name={`${givenName} ${familyName}`}
					size={40}
					cursor="pointer"
				/>
			</Popover>
		</Pane>
	</Pane>
);

DashboardHeader.propTypes = {
	user: UserProps,
	style: PropTypes.object
};

DashboardHeader.defaultProps = {
	user: {
		email: "",
		family_name: "",
		given_name: ""
	},
	style: {}
};

export default DashboardHeader;

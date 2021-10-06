import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { Pane, Menu, Text, Strong, withTheme } from "evergreen-ui";
import * as colors from "@/constants/colors";

const DashboardMenu = ({ items, theme }) => {
	const activeStyle = {
		borderLeft: `4px solid ${colors.SECONDARY_LIGHT}`,
		backgroundColor: theme.colors.background.purpleTint
	};
	const activeSubMenuStyle = {
		fontWeight: 900,
		background: theme.colors.background.purpleTint
	};

	return (
		<Menu>
			<Menu.Group>
				{items.map(({ text, icon, to, submenu = [], isActive, breakAfter }) => (
					<Pane key={text}>
						<Menu.Item
							is={Link}
							icon={icon}
							to={to}
							textDecoration="none !important"
							borderTopRightRadius={4}
							borderBottomRightRadius={4}
							position="relative"
							zIndex={5}
							{...(isActive ? activeStyle : {})}
						>
							<Strong size={400}>{text}</Strong>
						</Menu.Item>
						{!!submenu.length && (
							<Pane paddingLeft={27.5}>
								<Menu>
									<Pane marginTop={-7}>
										<Menu.Group>
											{submenu.map(
												({
													text: submenuText,
													to: submenuTo,
													isActive: isSubmenuItemActive
												}) => (
													<Menu.Item
														key={submenuText}
														is={Link}
														to={`${submenuTo}`}
														textDecoration="none !important"
														borderTopRightRadius={4}
														borderBottomRightRadius={4}
														{...(isSubmenuItemActive ? activeSubMenuStyle : {})}
													>
														<Text>{submenuText}</Text>
													</Menu.Item>
												)
											)}
										</Menu.Group>
									</Pane>
								</Menu>
							</Pane>
						)}
						{breakAfter && (
							<Pane marginY={10}>
								<Menu.Divider />
							</Pane>
						)}
					</Pane>
				))}
			</Menu.Group>
		</Menu>
	);
};

DashboardMenu.propTypes = {
	items: PropTypes.arrayOf(
		PropTypes.shape({
			text: PropTypes.string,
			icon: PropTypes.string,
			to: PropTypes.string,
			isActive: PropTypes.bool,
			submenu: PropTypes.arrayOf(
				PropTypes.shape({
					text: PropTypes.string,
					to: PropTypes.string,
					isActive: PropTypes.bool
				})
			),
			breakAfter: PropTypes.bool
		})
	).isRequired,
	theme: PropTypes.object.isRequired
};

export default withTheme(DashboardMenu);

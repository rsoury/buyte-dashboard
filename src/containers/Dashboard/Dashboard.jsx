import React, { Component } from "react";
import PropTypes from "prop-types";
import ReactRouterPropTypes from "react-router-prop-types";
import {
	Redirect,
	Route,
	Switch,
	withRouter,
	matchPath
} from "react-router-dom";
import { Pane } from "evergreen-ui";
import isEmpty from "is-empty";

import { UserProps } from "@/constants/common-prop-types";
import { isConnectForUser } from "@/utils/user-support";
import * as colors from "@/constants/colors";
import * as routes from "@/constants/routes";
import { Header, Menu } from "@/components/Dashboard";
import Checkouts from "@/containers/Checkouts";
import Developers from "@/containers/Developers";
import NewCheckout from "@/containers/NewCheckout";
import { Account, Settings } from "@/containers/Settings";
import Plugins from "@/containers/Plugins";
import Payments from "@/containers/Payments";

const screens = [
	{
		text: "Checkouts",
		icon: "shopping-cart",
		to: routes.CHECKOUTS,
		Component: Checkouts,
		inMenu: true
	},
	{
		text: "Developers",
		icon: "code",
		to: routes.DEVELOPERS,
		Component: Developers,
		inMenu: true
	},
	{
		text: "ECommerce Plugins",
		icon: "intersection",
		to: routes.PLUGINS,
		Component: Plugins,
		inMenu: true
	},
	{
		text: "Settings",
		icon: "cog",
		to: routes.SETTINGS,
		Component: Settings,
		submenu: [
			{
				text: "Account",
				to: routes.SETTINGS_ACCOUNT,
				Component: Account
			}
		],
		inMenu: true
	},
	{
		text: "New Checkout",
		to: routes.NEW_CHECKOUT,
		Component: NewCheckout,
		inMenu: false
	}
];

const paymentScreens = [
	{
		text: "Payments",
		icon: "dollar",
		to: routes.PAYMENTS,
		Component: Payments,
		inMenu: true,
		breakAfter: true,
		connectOnly: true
	}
];

const menuItems = screens.filter(({ inMenu }) => !!inMenu);

class Dashboard extends Component {
	static propTypes = {
		user: UserProps.isRequired,
		load: PropTypes.func.isRequired,
		showPayments: PropTypes.bool.isRequired,
		location: ReactRouterPropTypes.location.isRequired
	};

	state = {
		isPaymentsSetup: false
	};

	componentDidMount() {
		const { load } = this.props;
		load();
	}

	static getDerivedStateFromProps({ showPayments }) {
		return {
			isPaymentsSetup: showPayments // TODO: Change to depend on whether or not payment rails id exists.
		};
	}

	isMenuItemActive = path => {
		const { location } = this.props;
		if (
			matchPath(location.pathname, {
				path,
				exact: false
			})
		) {
			return true;
		}
		return false;
	};

	render() {
		const { isPaymentsSetup } = this.state;
		const { user } = this.props;

		let displayMenuItems = menuItems;
		if (isPaymentsSetup) {
			displayMenuItems = [...paymentScreens, ...menuItems];
		}
		// Filter connect menu items.
		displayMenuItems = displayMenuItems.filter(item =>
			item.connectOnly ? isConnectForUser(user) : true
		);
		// Filter connect sub menu items
		displayMenuItems = displayMenuItems.map(item => {
			const i = { ...item };
			if (!isEmpty(i.submenu)) {
				i.submenu = i.submenu.filter(subMenuItem =>
					subMenuItem.connectOnly ? isConnectForUser(user) : true
				);
			}
			return i;
		});

		return (
			<Pane
				display="flex"
				flexDirection="column"
				width="100%"
				maxWidth={1350}
				marginX="auto"
				height="100vh"
				position="relative"
			>
				{/* Header */}
				<Pane
					position="absolute"
					top={0}
					left={0}
					right={0}
					height={65}
					paddingX={10}
					borderBottom={`3px solid ${colors.BLACK}`}
				>
					<Header
						user={user.attributes}
						style={{
							height: "100%"
						}}
					/>
				</Pane>

				{/* SideBar */}
				<Pane
					width={240}
					paddingRight={10}
					borderRight={`3px solid ${colors.BLACK}`}
					overflow="auto"
					position="absolute"
					left={0}
					top={65}
					bottom={0}
				>
					<Menu
						items={displayMenuItems.map(item => {
							const i = { ...item };
							if (!isEmpty(i.submenu)) {
								i.submenu = i.submenu.map(subItem => ({
									...subItem,
									isActive: this.isMenuItemActive(subItem.to)
								}));
							}
							return {
								...i,
								isActive: this.isMenuItemActive(item.to)
							};
						})}
					/>
				</Pane>

				{/* Body */}
				<Pane position="absolute" right={0} top={65} bottom={0} left={240}>
					<Switch>
						{[...paymentScreens, ...screens]
							.reduce((_accumulator, screen) => {
								// Flatton all screens
								const accumulator = _accumulator;
								accumulator.push(screen);
								if (!isEmpty(screen.submenu)) {
									screen.submenu.forEach(subScreen => {
										accumulator.push(subScreen);
									});
								}
								return accumulator;
							}, [])
							.map(
								({ to, Component: ItemComponent }) =>
									ItemComponent && (
										<Route
											path={to}
											render={props => <ItemComponent {...props} />}
											key={to}
											exact
										/>
									)
							)}
						<Route
							render={props => (
								<Redirect to={displayMenuItems[0].to} {...props} />
							)}
						/>
					</Switch>
				</Pane>
			</Pane>
		);
	}
}

export default withRouter(Dashboard);

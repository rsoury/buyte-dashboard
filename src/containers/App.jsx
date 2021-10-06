/* eslint-disable no-console */

import React, { Component } from "react";
import PropTypes from "prop-types";
import ReactRouterPropTypes from "react-router-prop-types";
import { connect } from "react-redux";
import Amplify from "aws-amplify";
import { Route, Switch, withRouter, matchPath } from "react-router-dom";
import { IntlProvider } from "react-intl";
import _get from "lodash.get";
import isEmpty from "is-empty";

import { PUBLIC_URL, AUTH_DOMAIN, AWS_CONFIG } from "@/constants/env";
import * as authStates from "@/constants/auth";
import { SignIn, SignOut, SignUp } from "@/components/Auth";
import LoadingScreen from "@/components/LoadingScreen";
import UserSetupScreen from "@/components/UserSetupScreen";
import * as userAttributeTypes from "@/constants/user-attribute-types";
import * as routes from "@/constants/routes";
import { initTracking, identifyUser, track } from "@/utils/tracking";
import * as eventTypes from "@/constants/event-tracking-types";
import { UserProps } from "@/constants/common-prop-types";
import Dashboard from "@/containers/Dashboard";

const { oauth, ...awsConfig } = AWS_CONFIG;
awsConfig.oauth = Object.assign({}, oauth, {
	domain: AUTH_DOMAIN,
	scope: [
		"phone",
		"email",
		"openid",
		"profile",
		"aws.cognito.signin.user.admin"
	],
	// Callback URL
	redirectSignIn: `${PUBLIC_URL}/signin/`,
	// Sign out URL
	redirectSignOut: `${PUBLIC_URL}/signout/`,
	responseType: "code"
});
Amplify.configure(awsConfig);

class App extends Component {
	static propTypes = {
		location: ReactRouterPropTypes.location.isRequired,
		history: ReactRouterPropTypes.history.isRequired,
		loadUser: PropTypes.func.isRequired,
		unloadUser: PropTypes.func.isRequired,
		user: UserProps
	};

	static defaultProps = {
		user: {}
	};

	state = {
		authState: authStates.LOADING
	};

	componentDidMount() {
		const { history } = this.props;
		initTracking({ sessionTracking: true });
		history.listen(({ hash, pathname, search }) => {
			track(eventTypes.SCREEN_CHANGE, { hash, pathname, search });
		});
		this.loadUser();
	}

	componentDidUpdate(prevProps, prevState) {
		const { authState } = this.state;
		if (prevState.authState !== authState) {
			// Auth State has changed...
			if (authState === authStates.SIGN_IN) {
				this.accessRequired();
			} else if (authState === authStates.SIGNED_IN) {
				this.grantAccess();
			}
		}
	}

	static getDerivedStateFromProps({ user }) {
		if (user === null) {
			return {
				authState: authStates.SIGN_IN
			};
		}
		if (!isEmpty(user)) {
			return { authState: authStates.SIGNED_IN };
		}
		return {
			authState: authStates.LOADING
		};
	}

	loadUser = (...args) => {
		const { loadUser } = this.props;
		loadUser(...args);
	};

	unloadUser = () => {
		const { unloadUser } = this.props;
		unloadUser();
	};

	grantAccess = () => {
		const { location, history, user } = this.props;
		identifyUser(user.username, user.attributes);
		// Redirect home if access granted and some on auth route..
		setTimeout(() => {
			const match = [routes.SIGN_IN, routes.SIGN_OUT, routes.SIGN_UP]
				.map(route =>
					matchPath(location.pathname, {
						path: route,
						exact: true
					})
				)
				.reduce((flag, current) => {
					if (current) {
						return current;
					}
					return flag;
				}, false);
			if (match) {
				history.push("/");
			}
		}, 250);
	};

	accessRequired = () => {
		// Redirect to local /signin/ IF it doesn't already match it.
		const path = routes.SIGN_IN;
		const { location, history } = this.props;
		setTimeout(() => {
			// Redirect home if access granted..
			const match = matchPath(location.pathname, {
				path,
				exact: true
			});
			if (!match) {
				history.push(path);
			}
		}, 250);
	};

	isUserInstantiated = () => {
		const { user } = this.props;
		if (!isEmpty(user)) {
			return !!_get(user, ["attributes", userAttributeTypes.STORE_NAME]);
		}
		return false;
	};

	render() {
		const { authState } = this.state;
		const { user } = this.props;
		const locale = _get(user, "attributes.locale", "en-AU");
		const isUserSetup = this.isUserInstantiated(user);

		return (
			<IntlProvider locale={locale}>
				<div id="App" className="App">
					<Switch>
						<Route
							exact
							path={routes.SIGN_OUT}
							render={props => (
								<SignOut {...props} user={user} signOut={this.unloadUser} />
							)}
						/>
						<Route
							exact
							path={routes.SIGN_IN}
							render={props => (
								<SignIn
									{...props}
									user={user}
									onSignIn={this.loadUser}
									onSignInFailure={this.accessRequired}
								/>
							)}
						/>
						<Route
							exact
							path={routes.SIGN_UP}
							render={props => (
								<SignUp
									{...props}
									user={user}
									onSignIn={this.loadUser}
									onSignInFailure={this.accessRequired}
								/>
							)}
						/>
						<Route
							path="/"
							render={props => {
								if (
									authState === authStates.LOADING ||
									authState === authStates.SIGN_IN
								) {
									return <LoadingScreen {...props} />;
								}

								if (authState === authStates.SIGNED_IN) {
									if (isUserSetup) {
										return <Dashboard {...props} />;
									}

									return <UserSetupScreen {...props} />;
								}

								return null;
							}}
						/>
					</Switch>
				</div>
			</IntlProvider>
		);
	}
}

export default withRouter(
	connect(
		function mapStateToProps({ user }) {
			return {
				user
			};
		},
		function mapDispatchToProps(dispatch) {
			return {
				loadUser(...args) {
					return dispatch.user.loadUser(...args);
				},
				unloadUser() {
					return dispatch.user.unloadUser();
				}
			};
		}
	)(App)
);

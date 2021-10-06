import React, { Component } from "react";
import ReactRouterPropTypes from "react-router-prop-types";
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";
import { Auth, Hub } from "aws-amplify";
import isEmpty from "is-empty";

import { UserProps } from "@/constants/common-prop-types";
import * as eventTypes from "@/constants/event-tracking-types";
import { track } from "@/utils/tracking";
import LoadingScreen from "@/components/LoadingScreen";

class SignIn extends Component {
	static propTypes = {
		location: ReactRouterPropTypes.location.isRequired,
		onSignIn: PropTypes.func.isRequired,
		onSignInFailure: PropTypes.func.isRequired,
		signUp: PropTypes.bool,
		user: UserProps
	};

	static defaultProps = {
		signUp: false,
		user: {}
	};

	// Checks to see if user is authenticated or not on mount. If not, redirect.
	componentDidMount() {
		const { user } = this.props;
		if (user === null) {
			// user === null means unauthenticated
			this.unauthAction();
		}
	}

	componentDidUpdate(prevProps) {
		const { user } = this.props;
		if (typeof prevProps.user === "object" && user === null) {
			// If user is not authenticated.
			this.unauthAction();
		} else if (!isEmpty(user)) {
			if (!isEmpty(user.attributes)) {
				track(eventTypes.SIGN_IN);
			}
		}
	}

	unauthAction = () => {
		const { location, onSignIn, onSignInFailure } = this.props;
		if (location.search.indexOf("code=") < 0) {
			this.redirectToLogin();
		} else {
			Hub.listen("auth", ({ payload: { event, data } }) => {
				switch (event) {
					case "signIn":
						onSignIn(data);
						break;
					case "signIn_failure":
						onSignInFailure();
						break;
					default:
						break;
				}
			});
		}
	};

	redirectToLogin() {
		const { signUp } = this.props;
		const config = Auth.configure();
		const {
			domain,
			redirectSignIn,
			// redirectSignOut,
			responseType
		} = config.oauth;

		const clientId = config.userPoolWebClientId;

		// The url of the Cognito Hosted UI
		const url = `https://${domain}/${
			signUp ? `signup` : `login`
		}?redirect_uri=${redirectSignIn}&response_type=${responseType}&client_id=${clientId}`;

		// Launch hosted UI
		window.location.assign(url);
	}

	render() {
		return <LoadingScreen />;
	}
}

export default withRouter(SignIn);

/* eslint-disable no-console */

import React, { Component } from "react";
import PropTypes from "prop-types";
import isEmpty from "is-empty";
import LoadingScreen from "@/components/LoadingScreen";
import * as eventTypes from "@/constants/event-tracking-types";
import { track } from "@/utils/tracking";
import { UserProps } from "@/constants/common-prop-types";

class SignOut extends Component {
	static propTypes = {
		signOut: PropTypes.func.isRequired,
		user: UserProps
	};

	static defaultProps = {
		user: {}
	};

	// This checks whether user exists as it mounts.
	// User must exist to trigger a clean sign out.
	// If user doesn't exist, the parent App component will automatically redirect to signin page.
	componentDidMount() {
		const { user } = this.props;
		if (!isEmpty(user)) {
			this.signout();
		}
	}

	// This will only trigger if user state changes while this mounted.
	componentDidUpdate(prevProps) {
		const { user } = this.props;
		// Wait for user to load before signing out...
		if (isEmpty(prevProps.user) && !isEmpty(user)) {
			this.signout();
		}
	}

	signout = () => {
		const { signOut } = this.props;
		track(eventTypes.SIGN_OUT);
		signOut();
	};

	render() {
		return <LoadingScreen />;
	}
}

export default SignOut;

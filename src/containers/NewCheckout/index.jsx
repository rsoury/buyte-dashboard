import { connect } from "react-redux";

import NewCheckout from "./NewCheckout";

function mapStateToProps({ platform, user }) {
	return {
		platform,
		user
	};
}

function mapDispatchToProps(dispatch) {
	return {
		createCheckout(...args) {
			return dispatch.checkouts.createCheckout(...args);
		},
		loadPlatformData() {
			return dispatch.platform.load();
		},
		getStripeConnectAccount() {
			return dispatch.accounts.getStripeConnectAccount();
		}
	};
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(NewCheckout);

import { connect } from "react-redux";

import Settings from "./Settings";
import PayoutSettings from "./Payouts";

export { default as Account } from "./Account";
export { default as Settings } from "./Settings";

// Connect user state here because mapDispatchToProps in component needs user as ownProps.
export const Payouts = connect(function mapStateToProps({ user }) {
	return {
		user
	};
})(PayoutSettings);

export default Settings;

import isEmpty from "is-empty";
import { connect } from "react-redux";

import isBankPayoutCheckout from "@/utils/is-bank-payout-checkout";

import Dashboard from "./Dashboard";

function mapStateToProps({ user, checkouts }) {
	let showPayments = false;
	if (!isEmpty(checkouts)) {
		showPayments =
			checkouts.filter(checkout => isBankPayoutCheckout(checkout)).length > 0;
	}
	return {
		user,
		showPayments
	};
}

function mapDispatchToProps(dispatch) {
	return {
		load() {
			return dispatch.checkouts.loadCheckouts();
		}
	};
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(Dashboard);

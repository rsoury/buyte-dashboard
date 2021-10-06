import { connect } from "react-redux";

import Checkouts from "./Checkouts";

function mapStateToProps({ checkouts, showingCheckoutInformation }) {
	return {
		checkouts,
		showingCheckoutInformation
	};
}

function mapDispatchToProps(dispatch) {
	return {
		removeCheckout(checkout) {
			return dispatch.checkouts.removeCheckout(checkout.id);
		},
		showCheckoutInformation(checkoutId) {
			return dispatch.showingCheckoutInformation.set(checkoutId);
		},
		removeCheckoutInformation() {
			return dispatch.showingCheckoutInformation.remove();
		}
	};
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(Checkouts);

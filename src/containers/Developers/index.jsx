import { connect } from "react-redux";

import Developers from "./Developers";

function mapStateToProps({ user, apiKeys }) {
	return {
		user,
		apiKeys
	};
}

function mapDispatchToProps(dispatch) {
	return {
		loadPublicKey() {
			return dispatch.apiKeys.loadPublicKey();
		},
		loadSecretKey() {
			return dispatch.apiKeys.loadSecretKey();
		}
	};
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(Developers);

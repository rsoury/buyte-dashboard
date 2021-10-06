import { connect } from "react-redux";
import UserSetupForm from "./UserSetupForm";

function mapStateTopProps({ user }) {
	return {
		user
	};
}

function mapDispatchToProps(dispatch) {
	return {
		submit(payload) {
			return dispatch.user.updateUserAttributes(payload);
		}
	};
}

export default connect(
	mapStateTopProps,
	mapDispatchToProps
)(UserSetupForm);
